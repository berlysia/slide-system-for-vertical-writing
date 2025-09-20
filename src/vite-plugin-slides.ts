import type { Plugin, ViteDevServer, ResolvedConfig } from "vite";
import * as fs from "node:fs";
import * as path from "node:path";
import { mkdirSync, readdirSync } from "node:fs";
import { copyFile } from "node:fs/promises";
import prompts from "prompts";
import { compile } from "@mdx-js/mdx";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkSlideImages from "./remark-slide-images";
import { ScriptManager, type ParsedScript } from "./script-manager";
import { visit } from "unist-util-visit";
import type { Node } from "unist";
import type { Element, Text, ElementContent } from "hast";

/**
 * CSS抽出用のrehypeプラグイン
 * HTMLからstyleタグを抽出し、外部で管理
 */
function rehypeExtractStyles(extractedStyles: string[]) {
  return () => {
    return (tree: Node) => {
      visit(tree, "element", (node: Element) => {
        if (node.tagName === "style" && node.children) {
          // styleタグの内容を抽出
          const textContent = node.children
            .filter(
              (child: ElementContent): child is Text => child.type === "text",
            )
            .map((child: Text) => child.value)
            .join("");
          if (textContent.trim()) {
            extractedStyles.push(textContent);
          }
          // styleタグをHTMLから削除
          node.children = [];
          node.tagName = "div";
          node.properties = { style: "display: none;" };
        }
      });
    };
  };
}

async function processMarkdown(
  markdown: string,
  base: string,
  extractedStyles: string[],
  extractedScripts: ParsedScript,
) {
  const parsedScripts = ScriptManager.parseScripts(markdown);
  extractedScripts.external.push(...parsedScripts.external);
  extractedScripts.inline.push(...parsedScripts.inline);

  const cleanedMarkdown = ScriptManager.removeScriptsFromContent(markdown);

  return await unified()
    .use(remarkParse)
    .use(remarkSlideImages, { base })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeExtractStyles(extractedStyles))
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(cleanedMarkdown);
}

/**
 * 隣接CSSファイルを検索して読み込み
 */
function loadAdjacentCSS(slidesDir: string, collection: string): string[] {
  const collectionDir = path.resolve(slidesDir, collection);
  const cssPath = path.resolve(collectionDir, "style.css");

  if (fs.existsSync(cssPath)) {
    try {
      const cssContent = fs.readFileSync(cssPath, "utf-8");
      if (cssContent.trim()) {
        logger.info("Loaded adjacent CSS file: style.css");
        return [cssContent];
      }
    } catch {
      logger.warn("Failed to read CSS file: style.css");
    }
  }

  return [];
}

/**
 * 隣接スクリプト設定ファイルを検索して読み込み
 */
function loadAdjacentScripts(
  slidesDir: string,
  collection: string,
): ParsedScript {
  const collectionDir = path.resolve(slidesDir, collection);
  const scriptsPath = path.resolve(collectionDir, "scripts.json");

  const result: ParsedScript = { external: [], inline: [] };

  if (fs.existsSync(scriptsPath)) {
    try {
      const scriptsConfig = JSON.parse(fs.readFileSync(scriptsPath, "utf-8"));

      if (scriptsConfig.external && Array.isArray(scriptsConfig.external)) {
        result.external.push(...scriptsConfig.external);
        logger.info(
          `Loaded ${scriptsConfig.external.length} external scripts from scripts.json`,
        );
      }

      if (scriptsConfig.inline && Array.isArray(scriptsConfig.inline)) {
        result.inline.push(...scriptsConfig.inline);
        logger.info(
          `Loaded ${scriptsConfig.inline.length} inline scripts from scripts.json`,
        );
      }
    } catch (error) {
      logger.warn(`Failed to parse scripts.json: ${error}`);
    }
  }

  return result;
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
  } catch {
    throw new Error(`No read permission for external slides directory: ${dir}`);
  }
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
  let resolvedConfig: ResolvedConfig;
  let slideStyles: string[] = [];
  let slideScripts: ParsedScript = { external: [], inline: [] };
  return {
    name: "vite-plugin-slides",
    configResolved(config: ResolvedConfig) {
      base = config.base;
      resolvedConfig = config;
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
          code: `import * as React from 'react';\n${code}`,
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

        // 隣接CSSファイルを読み込み
        const adjacentStyles = loadAdjacentCSS(
          config.slidesDir,
          config.collection,
        );
        slideStyles = [...adjacentStyles];

        // 隣接スクリプト設定ファイルを読み込み
        const adjacentScripts = loadAdjacentScripts(
          config.slidesDir,
          config.collection,
        );
        slideScripts = {
          external: [...adjacentScripts.external],
          inline: [...adjacentScripts.inline],
        };

        if (!isMdx) {
          const slides = content.split(/^\s*(?:---|\*\*\*|___)\s*$/m);
          const extractedStyles: string[] = [];
          const extractedScripts: ParsedScript = { external: [], inline: [] };
          const processedSlides = await Promise.all(
            slides.map((slide) =>
              processMarkdown(slide, base, extractedStyles, extractedScripts),
            ),
          );

          // 抽出されたスタイル・スクリプトを追加
          slideStyles = [...slideStyles, ...extractedStyles];
          slideScripts.external.push(...extractedScripts.external);
          slideScripts.inline.push(...extractedScripts.inline);

          // スライド固有のスクリプトを文字列として生成
          const slideScriptsString = JSON.stringify(slideScripts);

          // スライド固有のCSSを文字列として生成
          const slideStylesString =
            slideStyles.length > 0
              ? JSON.stringify(slideStyles.join("\n\n"))
              : "null";

          return `
            // スライド固有のCSSを注入
            const slideStyles = ${slideStylesString};
            if (slideStyles && typeof document !== 'undefined') {
              const existingStyleElement = document.getElementById('slide-custom-styles');
              if (existingStyleElement) {
                existingStyleElement.textContent = slideStyles;
              } else {
                const styleElement = document.createElement('style');
                styleElement.id = 'slide-custom-styles';
                styleElement.textContent = slideStyles;
                document.head.appendChild(styleElement);
              }
            }

            export default ${JSON.stringify(processedSlides.map((p) => p.value))};
            export const slideScripts = ${slideScriptsString};
          `;
        }

        const slides = content.split(/^\s*(?:---|\*\*\*|___)\s*$/m);

        // MDXにもCSS・スクリプト抽出を適用
        const extractedStyles: string[] = [];
        const extractedScripts: ParsedScript = { external: [], inline: [] };
        const processedSlides = await Promise.all(
          slides.map(async (slideContent) => {
            // MDX内のstyleタグを手動で抽出（簡易実装）
            const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
            let match;
            while ((match = styleRegex.exec(slideContent)) !== null) {
              if (match[1].trim()) {
                extractedStyles.push(match[1].trim());
              }
            }

            // MDX内のscriptタグを抽出
            const parsedScripts = ScriptManager.parseScripts(slideContent);
            extractedScripts.external.push(...parsedScripts.external);
            extractedScripts.inline.push(...parsedScripts.inline);

            // style・scriptタグを削除したコンテンツでMDXコンパイル
            let cleanedContent = slideContent.replace(styleRegex, "");
            cleanedContent =
              ScriptManager.removeScriptsFromContent(cleanedContent);

            const result = await compile(cleanedContent, {
              outputFormat: "program",
              development: false,
              jsxImportSource: "react",
              jsxRuntime: "automatic",
              remarkPlugins: [[remarkSlideImages, { base }]],
            });
            return result.value as string;
          }),
        );

        // 抽出されたスタイル・スクリプトを追加
        slideStyles = [...slideStyles, ...extractedStyles];
        slideScripts.external.push(...extractedScripts.external);
        slideScripts.inline.push(...extractedScripts.inline);

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

        // スライド固有のCSSを文字列として生成
        const slideStylesString =
          slideStyles.length > 0
            ? JSON.stringify(slideStyles.join("\n\n"))
            : "null";

        // スライド固有のスクリプトを文字列として生成
        const slideScriptsString = JSON.stringify(slideScripts);

        // Return as a module with CSS injection
        return `
            ${slideComponentsFilenames.map((filename) => `import * as ${filenameToComponentName(filename)} from '${slideComponentsDir}/${filename}';`).join("\n")}

            const SlideComponents = {${slideComponentsFilenames.map((filename) => `...${filenameToComponentName(filename)}`).join(", ")}};

            ${compiledSlides.map((_, index) => `import Slide${formatSlideIndex(index)} from '${virtualFilePageId(index)}';`).join("\n")}

            // スライド固有のCSSを注入
            const slideStyles = ${slideStylesString};
            if (slideStyles && typeof document !== 'undefined') {
              const existingStyleElement = document.getElementById('slide-custom-styles');
              if (existingStyleElement) {
                existingStyleElement.textContent = slideStyles;
              } else {
                const styleElement = document.createElement('style');
                styleElement.id = 'slide-custom-styles';
                styleElement.textContent = slideStyles;
                document.head.appendChild(styleElement);
              }
            }

            // スライド固有のスクリプトを外部から利用可能にする
            export const slideScripts = ${slideScriptsString};

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
      // Handle images during dev mode
      if (resolvedConfig.command === "serve") {
        // CLIモードでは適切なパスを使用
        const isExternalCLI = process.cwd() !== resolvedConfig.root;
        const targetImagesDir = isExternalCLI
          ? path.resolve(process.cwd(), "public/slide-assets/images")
          : path.resolve(resolvedConfig.root, "public/slide-assets/images");

        const sourceImagesDir = path.resolve(
          config.slidesDir,
          config.collection,
          "images",
        );

        logger.info(`Checking for images in: ${sourceImagesDir}`);
        logger.info(`Target images directory: ${targetImagesDir}`);

        // Copy images from slides directory
        if (fs.existsSync(sourceImagesDir)) {
          try {
            // Create target directory if it doesn't exist
            mkdirSync(targetImagesDir, { recursive: true });

            // Copy all files from source to target using async operations
            const imageFiles = readdirSync(sourceImagesDir);
            logger.info(`Found ${imageFiles.length} image files to copy`);

            if (imageFiles.length > 0) {
              const copyPromises = imageFiles.map(async (file) => {
                const sourcePath = path.join(sourceImagesDir, file);
                const targetPath = path.join(targetImagesDir, file);
                await copyFile(sourcePath, targetPath);
                logger.info(`Copied image: ${file}`);
                return file;
              });

              // すべての画像コピーが完了するまで待機
              const copiedFiles = await Promise.all(copyPromises);
              logger.info(
                `Successfully copied ${copiedFiles.length} slide images`,
              );
            } else {
              logger.info("No image files found to copy");
            }
          } catch (error) {
            if (error instanceof Error) {
              logger.error("Failed to copy slide images", error);
            }
            throw error;
          }
        } else {
          logger.info(`No images directory found at: ${sourceImagesDir}`);
        }
      }
    },

    generateBundle(_options, bundle) {
      // Generate HTML file if none exists in consumer project
      const consumerIndexHtml = path.resolve(resolvedConfig.root, "index.html");

      if (!fs.existsSync(consumerIndexHtml)) {
        // Find the main JS and CSS files in the bundle
        const mainJsFile = Object.keys(bundle).find(
          (fileName) =>
            fileName.startsWith("assets/") &&
            fileName.includes("main-") &&
            fileName.endsWith(".js"),
        );
        const mainCssFile = Object.keys(bundle).find(
          (fileName) =>
            fileName.startsWith("assets/") && fileName.endsWith(".css"),
        );

        if (!mainJsFile) {
          logger.error("Could not find main JS file in bundle");
          return;
        }

        const cssLink = mainCssFile
          ? `<link rel="stylesheet" href="./${mainCssFile}">`
          : "<!-- CSS is included in the JS bundle -->";

        const virtualIndexHtml = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vertical Writing Slides</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&family=Noto+Sans+Mono:wght@100..900&display=swap" rel="stylesheet">
    ${cssLink}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./${mainJsFile}"></script>
  </body>
</html>`;

        // Emit HTML file as part of the build output
        this.emitFile({
          type: "asset",
          fileName: "index.html",
          source: virtualIndexHtml,
        });

        logger.info("Generated index.html for build output");
      }

      // Handle images during build mode
      if (resolvedConfig.command === "build") {
        const sourceImagesDir = path.resolve(
          config.slidesDir,
          config.collection,
          "images",
        );

        if (fs.existsSync(sourceImagesDir)) {
          try {
            const imageFiles = readdirSync(sourceImagesDir);
            logger.info(
              `Processing ${imageFiles.length} image files from ${sourceImagesDir}`,
            );

            let processedCount = 0;
            for (const file of imageFiles) {
              const sourcePath = path.join(sourceImagesDir, file);
              try {
                const imageContent = fs.readFileSync(sourcePath);

                // Add image files to the bundle
                this.emitFile({
                  type: "asset",
                  fileName: `slide-assets/images/${file}`,
                  source: imageContent,
                });
                processedCount++;
                logger.info(`Added image to bundle: ${file}`);
              } catch (fileError) {
                logger.error(
                  `Failed to process image file: ${file}`,
                  fileError instanceof Error
                    ? fileError
                    : new Error(String(fileError)),
                );
                // Continue processing other files instead of failing completely
              }
            }
            logger.info(
              `Successfully added ${processedCount}/${imageFiles.length} slide images to bundle`,
            );
          } catch (error) {
            if (error instanceof Error) {
              logger.error("Failed to read slide images directory", error);
            }
            throw error;
          }
        } else {
          logger.warn(`No images directory found at: ${sourceImagesDir}`);
        }
      }
    },

    configureServer(server: ViteDevServer) {
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

      // Explicitly add external slides directory to watcher
      const absoluteSlidesDir = path.resolve(config.slidesDir);
      if (fs.existsSync(absoluteSlidesDir)) {
        server.watcher.add(absoluteSlidesDir);
        logger.info(`Added slides directory to watcher: ${absoluteSlidesDir}`);
      }

      // Use Vite's built-in watcher for better compatibility
      server.watcher.on("change", (filePath: string) => {
        // filePath is already absolute when coming from watcher
        const absolutePath = path.resolve(filePath);
        const absoluteSlidesDir = path.resolve(config.slidesDir);

        if (
          absolutePath.includes(absoluteSlidesDir) &&
          /\.(?:md|mdx|css)$/.test(absolutePath)
        ) {
          logger.info(`Slide file changed: ${absolutePath}`);
          reloadModule();
        }
      });

      // Also watch for new files
      server.watcher.on("add", (filePath: string) => {
        // filePath is already absolute when coming from watcher
        const absolutePath = path.resolve(filePath);
        const absoluteSlidesDir = path.resolve(config.slidesDir);

        if (
          absolutePath.includes(absoluteSlidesDir) &&
          /\.(?:md|mdx|css)$/.test(absolutePath)
        ) {
          logger.info(`Slide file added: ${absolutePath}`);
          reloadModule();
        }
      });

      // Watch for deleted files
      server.watcher.on("unlink", (filePath: string) => {
        // filePath is already absolute when coming from watcher
        const absolutePath = path.resolve(filePath);
        const absoluteSlidesDir = path.resolve(config.slidesDir);

        if (
          absolutePath.includes(absoluteSlidesDir) &&
          /\.(?:md|mdx|css)$/.test(absolutePath)
        ) {
          logger.info(`Slide file deleted: ${absolutePath}`);
          reloadModule();
        }
      });

      // Cleanup function (no additional watchers to clean up now)
      return () => {
        // No additional cleanup needed since we're using Vite's built-in watcher
      };
    },
  };
}
