#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync } from "fs";
import { mkdir, readdir, stat, cp, writeFile } from "fs/promises";
import { join, resolve } from "path";

const defaultSlidesDir = resolve(import.meta.dirname, "..", "slides");
const slidesDir = process.env.SLIDES_DIR;
const pagesDir = "pages";

// Ensure pages directory exists
await mkdir(pagesDir, { recursive: true });

async function buildSlide(slideName: string) {
  console.log(`Building ${slideName}...`);
  process.env.SLIDE_NAME = slideName;
  execSync("pnpm run build", { stdio: "inherit" });

  const slideOutputDir = join(pagesDir, slideName);
  await mkdir(slideOutputDir, { recursive: true });
  await cp("dist", slideOutputDir, { recursive: true });
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

async function main() {
  const resolvedSlidesDir = slidesDir ?? defaultSlidesDir;
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

await main();
