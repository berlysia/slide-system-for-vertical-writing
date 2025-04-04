import type { Plugin, ViteDevServer, ResolvedConfig } from "vite";
import * as fs from "node:fs";
import * as path from "node:path";
import { mkdirSync, copyFileSync, readdirSync } from "node:fs";
import prompts from "prompts";
import { compile } from "@mdx-js/mdx";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkSlideImages from "./remark-slide-images";

async function processMarkdown(markdown: string, base: string) {
  return await unified()
    .use(remarkParse)
    .use(remarkSlideImages, { base })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
}

export interface SlidesPluginOptions {
  /** Directory containing the slides (absolute path) */
  slidesDir?: string;
  /** Name of the slides collection */
  collection?: string;
}

/**
 * Logger for slides functionality
 */
const logger = {
  info: (message: string) => console.log(`[Slides] ${message}`),
  error: (message: string, error?: Error) => {
    console.error(`[Slides] ${message}`);
    if (error) {
      console.error(error);
    }
  },
  warn: (message: string) => console.warn(`[Slides] ${message}`),
};

/**
 * Validates slides directory
 * @throws {Error} If directory is invalid or inaccessible
 */
function validateSlidesDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    throw new Error(`External slides directory not found: ${dir}`);
  }
  try {
    fs.accessSync(dir, fs.constants.R_OK);
  } catch (err) {
    throw new Error(`No read permission for external slides directory: ${dir}`);
  }
}

/**
 * Sets up file watcher for slides directory
 */
function watchSlidesDir(dir: string, server: ViteDevServer): () => void {
  logger.info(`Watching slides directory: ${dir}`);

  const watcher = fs.watch(dir, { recursive: true }, (_eventType, filename) => {
    if (filename) {
      server.ws.send({
        type: "full-reload",
        path: "*",
      });
      logger.info(`File changed: ${filename}`);
    }
  });

  watcher.on("error", (error) => {
    logger.error(`Watch error:`, error);
  });

  return () => {
    watcher.close();
    logger.info("Stopped watching slides directory");
  };
}

const defaultOptions: Required<SlidesPluginOptions> = {
  slidesDir: path.resolve(process.cwd(), "slides"),
  collection: "",
};

async function selectSlideCollection(slidesDir: string): Promise<string> {
  const slidesPath = path.resolve(slidesDir);

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
  const config = { ...defaultOptions, ...options };

  // Validate slides directory
  try {
    validateSlidesDir(config.slidesDir);
    logger.info(`Using slides directory: ${config.slidesDir}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Failed to validate slides directory", error);
    }
    throw error;
  }

  if (config.collection) {
    logger.info(`Using slide: ${config.collection}`);
  } else {
    logger.info("No slide collection specified, prompting for selection");
    config.collection = await selectSlideCollection(config.slidesDir);
  }

  let base: string;
  let compiledSlides: string[] = [];
  return {
    name: "vite-plugin-slides",
    configResolved(config: ResolvedConfig) {
      base = config.base;
    },
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
        // Look for slides in the configured directory
        const mdxPath = path.resolve(
          config.slidesDir,
          config.collection,
          "index.mdx",
        );
        const mdPath = path.resolve(
          config.slidesDir,
          config.collection,
          "index.md",
        );

        let filePath: string | undefined;
        let isMdx = false;

        if (fs.existsSync(mdxPath)) {
          filePath = mdxPath;
          isMdx = true;
          logger.info("Using MDX slides");
        } else if (fs.existsSync(mdPath)) {
          filePath = mdPath;
          logger.info("Using MD slides");
        } else {
          logger.warn("No slide files found");
          return "export default []";
        }

        const content = fs.readFileSync(filePath, "utf-8");

        if (!isMdx) {
          const slides = content.split(/^\s*(?:---|\*\*\*|___)\s*$/m);
          const processedSlides = await Promise.all(
            slides.map((slide) => processMarkdown(slide, base)),
          );
          return `export default ${JSON.stringify(processedSlides.map((p) => p.value))}`;
        }

        const slides = content.split(/^\s*(?:---|\*\*\*|___)\s*$/m);

        const processedSlides = await Promise.all(
          slides.map(async (slideContent) => {
            const result = await compile(slideContent, {
              outputFormat: "program",
              development: false,
              remarkPlugins: [[remarkSlideImages, { base }]],
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
      const targetImagesDir = path.resolve(
        process.cwd(),
        "public/slide-assets/images",
      );
      const sourceImagesDir = path.resolve(
        config.slidesDir,
        config.collection,
        "images",
      );

      // Copy images from slides directory
      if (fs.existsSync(sourceImagesDir)) {
        try {
          // Create target directory if it doesn't exist
          mkdirSync(targetImagesDir, { recursive: true });

          // Copy all files from source to target
          const imageFiles = readdirSync(sourceImagesDir);
          for (const file of imageFiles) {
            const sourcePath = path.join(sourceImagesDir, file);
            const targetPath = path.join(targetImagesDir, file);
            copyFileSync(sourcePath, targetPath);
          }
          logger.info("Copied slide images successfully");
        } catch (error) {
          if (error instanceof Error) {
            logger.error("Failed to copy slide images", error);
          }
          throw error;
        }
      }
    },

    configureServer(server: ViteDevServer) {
      // Watch slides directory
      const watcher = watchSlidesDir(config.slidesDir, server);

      const reloadModule = () => {
        const mod = server.moduleGraph.getModuleById("\0" + virtualFileId);
        const pageMods = compiledSlides.map((_, i) =>
          server.moduleGraph.getModuleById(virtualFilePageId(i)),
        );
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
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
      };

      server.watcher.on("change", (path: string) => {
        if (path.includes(config.slidesDir) && /\.(?:md|mdx)$/.test(path)) {
          logger.info(`Slide file changed: ${path}`);
          reloadModule();
        }
      });

      // Cleanup on server shutdown
      return () => {
        watcher();
      };
    },
  };
}
