import { existsSync } from "fs";
import {
  mkdir,
  readdir,
  stat,
  cp,
  writeFile,
  mkdtemp,
  rmdir,
} from "fs/promises";
import { join, resolve } from "path";
import { build } from "vite";

const defaultSlidesDir = resolve(import.meta.dirname, "..", "slides");
const pagesDir = "pages";

// Ensure pages directory exists
await rmdir(pagesDir, { recursive: true });
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
  await rmdir(tmpDir, { recursive: true });
}

async function createIndexPage(slideNames: string[]) {
  const slides = slideNames
    .map((name) => `    <li><a href="${name}/">${name}</a></li>`)
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
  await createIndexPage(slides);
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  buildPages({ slidesDir: process.env.SLIDES_DIR }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
