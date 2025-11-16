import { existsSync } from "fs";
import {
  mkdir,
  readdir,
  stat,
  cp,
  writeFile,
  mkdtemp,
  rm,
  readFile,
} from "fs/promises";
import { join, resolve } from "path";
import { build } from "vite";
import matter from "gray-matter";
import type { SlideMetadata } from "../src/types/slide-metadata";

const defaultSlidesDir = resolve(import.meta.dirname, "..", "slides");
const pagesDir = "pages";

// Ensure pages directory exists
await rm(pagesDir, { recursive: true, force: true });
await mkdir(pagesDir, { recursive: true });

async function buildSlide(slideName: string) {
  console.log(`Building ${slideName}...`);
  process.env.SLIDE_NAME = slideName;
  const tmpDir = await mkdtemp("/tmp/vertical-slide-");
  await build({
    root: resolve(import.meta.dirname, ".."),
    build: {
      outDir: tmpDir,
    },
  });

  const slideOutputDir = join(pagesDir, slideName);
  await mkdir(slideOutputDir, { recursive: true });
  await cp(tmpDir, slideOutputDir, { recursive: true });
  await rm(tmpDir, { recursive: true });
}

/**
 * スライドコレクションからメタデータを取得
 */
async function getSlideMetadata(
  slidesDir: string,
  slideName: string,
): Promise<SlideMetadata> {
  const mdxPath = join(slidesDir, slideName, "index.mdx");
  const mdPath = join(slidesDir, slideName, "index.md");

  let filePath: string | undefined;

  if (existsSync(mdxPath)) {
    filePath = mdxPath;
  } else if (existsSync(mdPath)) {
    filePath = mdPath;
  }

  if (!filePath) {
    return { title: slideName };
  }

  try {
    const content = await readFile(filePath, "utf-8");
    const parsed = matter(content);
    return {
      title: slideName,
      ...parsed.data,
    };
  } catch (error) {
    console.warn(`Failed to parse frontmatter for ${slideName}: ${error}`);
    return { title: slideName };
  }
}

async function createIndexPage(slideNames: string[], slidesDir: string) {
  // 各スライドのメタデータを取得
  const slideMetadataList = await Promise.all(
    slideNames.map(async (name) => ({
      name,
      metadata: await getSlideMetadata(slidesDir, name),
    })),
  );

  const slides = slideMetadataList
    .map(({ name, metadata }) => {
      const displayTitle = metadata.title || name;
      const description = metadata.description
        ? ` - ${metadata.description}`
        : "";
      return `    <li><a href="${name}/">${displayTitle}</a>${description}</li>`;
    })
    .join("\n");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Slides Index</title>
</head>
<body>
  <h1>Available Slides</h1>
  <ul>
${slides}
  </ul>
</body>
</html>`;

  await writeFile(join(pagesDir, "index.html"), html);
}

export async function buildPages(options: { slidesDir?: string } = {}) {
  const resolvedSlidesDir = options.slidesDir ?? defaultSlidesDir;
  // Build all slides
  if (!existsSync(resolvedSlidesDir)) {
    throw new Error(`Slides directory not found (tried: ${resolvedSlidesDir})`);
  }
  const slideNames = await readdir(resolvedSlidesDir);
  const slideStats = await Promise.all(
    slideNames.map((item) => stat(join(resolvedSlidesDir, item))),
  );
  const slides = slideNames.filter((_, index) =>
    slideStats[index].isDirectory(),
  );

  if (slides.length === 0) {
    throw new Error("No slides found");
  }

  for (const slide of slides) {
    await buildSlide(slide);
  }
  await createIndexPage(slides, resolvedSlidesDir);
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  buildPages({ slidesDir: process.env.SLIDES_DIR }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
