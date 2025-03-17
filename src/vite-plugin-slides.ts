import { Plugin, ViteDevServer } from "vite";
import * as fs from "node:fs";
import * as path from "node:path";
import { mkdirSync, copyFileSync, readdirSync } from "node:fs";
import prompts from "prompts";
import { compile } from "@mdx-js/mdx";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

async function processMarkdown(markdown: string) {
  return await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
}

export interface SlidesPluginOptions {
  /** Directory containing the slides, relative to project root */
  slidesDir?: string;
  /** Name of the slides collection */
  collection?: string;
}

const defaultOptions: Required<SlidesPluginOptions> = {
  slidesDir: "slides",
  collection: "",
};

async function selectSlideCollection(slidesDir: string): Promise<string> {
  const currentFilePath = import.meta.filename;
  const currentDir = path.dirname(currentFilePath);
  const slidesPath = path.resolve(currentDir, `../${slidesDir}`);

  if (!fs.existsSync(slidesPath)) {
    throw new Error(`Slides directory not found: ${slidesPath}`);
  }

  const collections = readdirSync(slidesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  if (collections.length === 0) {
    throw new Error(`No slide collections found in ${slidesPath}`);
  }

  const response = await prompts({
    type: "select",
    name: "collection",
    message: "Select a slide collection:",
    choices: collections.map((name) => ({ title: name, value: name })),
  });

  if (!response.collection) {
    throw new Error("No slide collection selected");
  }

  return response.collection;
}

const virtualFileId = "virtual:slides.js";

function virtualFilePageId(index: number) {
  return `virtual:slides-page-${index}.js`;
}
const virtualFilePageIdPattern = /^virtual:slides-page-(\d+)\.js$/;
const nullPrefixedVirtualFilePageIdPattern =
  /^\0virtual:slides-page-(\d+)\.js$/;

export default async function slidesPlugin(
  options: SlidesPluginOptions = {},
): Promise<Plugin> {
  const mergedOptions = { ...defaultOptions, ...options };
  const config = {
    ...mergedOptions,
    collection:
      mergedOptions.collection ||
      (await selectSlideCollection(mergedOptions.slidesDir)),
  };
  let compiledSlides: string[] = [];
  return {
    name: "vite-plugin-slides",
    enforce: "pre",
    resolveId(id: string) {
      if (id === virtualFileId) {
        return "\0" + virtualFileId;
      }
      if (virtualFilePageIdPattern.test(id)) {
        return "\0" + id;
      }
    },
    transform(code, id) {
      if (
        id === "\0" + virtualFileId ||
        nullPrefixedVirtualFilePageIdPattern.test(id)
      ) {
        return {
          code: `import React from 'react';\n${code}`,
          map: null,
        };
      }
    },
    async load(id: string) {
      if (id === "\0" + virtualFileId) {
        const currentFilePath = import.meta.filename;
        const currentDir = path.dirname(currentFilePath);

        // Try MDX first, then fallback to MD
        const mdxPath = path.resolve(
          currentDir,
          `../${config.slidesDir}/${config.collection}/index.mdx`,
        );
        const mdPath = path.resolve(
          currentDir,
          `../${config.slidesDir}/${config.collection}/index.md`,
        );

        let filePath: string | undefined;
        let isMdx = false;

        if (fs.existsSync(mdxPath)) {
          filePath = mdxPath;
          isMdx = true;
        } else if (fs.existsSync(mdPath)) {
          filePath = mdPath;
        }

        if (!filePath) {
          return "export default []";
        }

        const content = fs.readFileSync(filePath, "utf-8");

        if (!isMdx) {
          const replaced = content.replace(
            /<img\s+([^>]*src="(@slide\/[^"]+)"[^>]*)>/g,
            (_, attributes, src) => {
              return `<img ${attributes.replace(src, `/${config.slidesDir}/${config.collection}/images/${src.slice(7)}`)}>`;
            },
          );
          const slides = replaced.split(/^\s*(?:---|\*\*\*|___)\s*$/m);
          const processedSlides = await Promise.all(
            slides.map((slide) => processMarkdown(slide)),
          );
          return `export default ${JSON.stringify(processedSlides.map((p) => p.value))}`;
        }

        const slides = content.split(/^\s*(?:---|\*\*\*|___)\s*$/m);

        const processedSlides = await Promise.all(
          slides.map(async (slideContent) => {
            const result = await compile(slideContent, {
              outputFormat: "program",
              development: false,
            });
            return result.value as string;
          }),
        );

        compiledSlides = processedSlides;

        const numberOfSlides = slides.length;
        function formatSlideIndex(index: number) {
          return index
            .toString()
            .padStart(numberOfSlides.toString(10).length, "0");
        }

        // read src/slide-components directory
        const slideComponentsDir = path.resolve(
          import.meta.dirname,
          `slide-components`,
        );
        const slideComponentsFilenames = fs.existsSync(slideComponentsDir)
          ? readdirSync(slideComponentsDir)
          : [];
        function filenameToComponentName(filename: string) {
          return filename.replace(/\.[jt]sx?$/, "");
        }

        // Return as a module
        return `
            ${slideComponentsFilenames.map((filename) => `import * as ${filenameToComponentName(filename)} from '@components/${filename}';`).join("\n")}

            const SlideComponents = {${slideComponentsFilenames.map((filename) => `...${filenameToComponentName(filename)}`).join(", ")}};

            ${compiledSlides.map((_, index) => `import Slide${formatSlideIndex(index)} from '${virtualFilePageId(index)}';`).join("\n")}

            // provide slide components to each slide
            // Wrap SlideN components to provide SlideComponents
            ${compiledSlides
              .map(
                (_, index) => `
              const Slide${formatSlideIndex(index)}WithComponents = (props) => {
                return React.createElement(Slide${formatSlideIndex(index)}, {
                  ...props,
                  components: SlideComponents
                });
              };
            `,
              )
              .join("\n")}
            export default [${compiledSlides.map((_, i) => `Slide${formatSlideIndex(i)}WithComponents`).join(", ")}];
          `;
      }

      if (nullPrefixedVirtualFilePageIdPattern.test(id)) {
        const match = id.match(nullPrefixedVirtualFilePageIdPattern);
        if (match) {
          const index = parseInt(match[1], 10);
          return compiledSlides[index];
        }
      }
    },
    async buildStart() {
      const currentFilePath = import.meta.filename;
      const currentDir = path.dirname(currentFilePath);
      const sourceImagesDir = path.resolve(
        currentDir,
        `../${config.slidesDir}/${config.collection}/images`,
      );
      const targetImagesDir = path.resolve(
        currentDir,
        `../public/${config.slidesDir}/${config.collection}/images`,
      );

      if (fs.existsSync(sourceImagesDir)) {
        // Create target directory if it doesn't exist
        mkdirSync(targetImagesDir, { recursive: true });

        // Copy all files from source to target
        const imageFiles = readdirSync(sourceImagesDir);
        for (const file of imageFiles) {
          const sourcePath = path.join(sourceImagesDir, file);
          const targetPath = path.join(targetImagesDir, file);
          copyFileSync(sourcePath, targetPath);
        }
      }
    },

    configureServer(server: ViteDevServer) {
      server.watcher.add(
        `**/${config.slidesDir}/${config.collection}/**/*.{md,mdx}`,
      );
      server.watcher.on("change", (path: string) => {
        if (
          path.match(
            new RegExp(
              `\\/${config.slidesDir}\\/${config.collection}\\/.+\\.(?:md|mdx)$`,
            ),
          )
        ) {
          // Invalidate the module to trigger HMR
          const mod = server.moduleGraph.getModuleById("\0" + virtualFileId);
          const pageMods = compiledSlides.map((_, i) =>
            server.moduleGraph.getModuleById(virtualFilePageId(i)),
          );
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
            server.ws.send({
              type: "full-reload",
              path: "*",
            });
          }
          for (const pageMod of pageMods) {
            if (pageMod) {
              server.moduleGraph.invalidateModule(pageMod);
            }
          }
          server.ws.send({
            type: "full-reload",
            path: "*",
          });
        }
      });
    },
  };
}
