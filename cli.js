#!/usr/bin/env node
// @ts-check

import { writeFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { build, createServer } from "vite";

async function ensureIndexHtml() {
  const indexHtmlPath = resolve(process.cwd(), "index.html");
  try {
    await access(indexHtmlPath);
    // index.html already exists
    return;
  } catch {
    // index.html doesn't exist, create it
    // Use absolute paths from the library location for external projects
    const libPath = import.meta.dirname;
    const libSrcPath = resolve(libPath, "src");

    // Convert to relative paths from project root that Vite can resolve
    const relativeSrcPath = `/@fs${libSrcPath}`;

    const indexHtmlContent = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vertical Writing Slides</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&family=Noto+Sans+Mono:wght@100..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${relativeSrcPath}/index.css" />
    <link rel="stylesheet" media="screen" href="${relativeSrcPath}/screen.css" />
    <link rel="stylesheet" media="print" href="${relativeSrcPath}/print.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${relativeSrcPath}/main.tsx"></script>
  </body>
</html>`;

    await writeFile(indexHtmlPath, indexHtmlContent);
    console.log("Generated index.html for external project");
  }
}

async function runDev() {
  try {
    const libPath = import.meta.dirname;
    const projectPath = process.cwd();

    // Ensure index.html exists for external projects
    await ensureIndexHtml();

    const server = await createServer({
      root: projectPath, // Use project as root for proper file watching
      configFile: resolve(libPath, "vite.config.ts"),
      server: {
        fs: {
          allow: [
            // Allow serving files from the library directory
            libPath,
            // Allow serving files from the current working directory
            projectPath,
          ],
        },
      },
    });

    await server.listen();
    server.printUrls();
    console.log("Development server started. Press Ctrl+C to stop.");

    // Keep the process running
    process.on("SIGINT", async () => {
      console.log("\nShutting down development server...");
      await server.close();
      process.exit(0);
    });
  } catch (error) {
    console.error("Error during development server startup:", error);
    process.exit(1);
  }
}

async function runBuildAll() {
  const { buildPages } = await import("./scripts/build-pages.js");
  try {
    await buildPages({ slidesDir: process.env.SLIDES_DIR });
    console.log("Build completed successfully");
  } catch (error) {
    console.error("Error during build:", error);
    process.exit(1);
  }
}

async function runBuild() {
  try {
    await build({
      root: process.cwd(),
      configFile: resolve(import.meta.dirname, "vite.config.ts"),
      build: {
        outDir: resolve(process.cwd(), "pages"),
        rollupOptions: {
          input: resolve(import.meta.dirname, "src/main.tsx"),
          output: {
            assetFileNames: "assets/[name]-[hash][extname]",
          },
        },
        cssCodeSplit: true,
        assetsInlineLimit: 0,
      },
    });
  } catch (error) {
    console.error("Error during build:", error);
    process.exit(1);
  }
  console.log("Build completed successfully");
}

const commands = {
  dev: runDev,
  buildAll: runBuildAll,
  build: runBuild,
};

function printUsage() {
  console.error("Usage: vertical-slides <command> [options]");
  console.error("Commands:");
  console.error("  dev         - Start development server");
  console.error("  buildAll    - Build all pages");
  console.error("  build       - Build current page");
  console.error("");
  console.error("Options:");
  console.error(
    "  --dir, -d <path>   - Specify custom slides directory (required unless --debug)",
  );
  console.error(
    "  --name, -n <name>  - Specify custom slide name in directory",
  );
  console.error("  --debug            - Enable debug mode");
}

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      dir: {
        type: "string",
        short: "d",
      },
      name: {
        type: "string",
        short: "n",
      },
      debug: {
        type: "boolean",
        default: false,
      },
    },
    allowPositionals: true,
  });

  const [command] = positionals;

  if (!command || !commands[command]) {
    if (!command) {
      console.error("Error: Command is required");
    } else if (!commands[command]) {
      console.error(`Error: Unknown command "${command}"`);
    }
    printUsage();
    process.exit(1);
  }

  if (!values.dir && !values.debug) {
    console.error("Error: --dir option is required (unless --debug is used)");
    printUsage();
    process.exit(1);
  }

  if (values.dir) {
    process.env.SLIDES_DIR = values.dir;
  }
  if (values.name) {
    process.env.SLIDE_NAME = values.name;
  }

  try {
    await commands[command]();
  } catch (error) {
    console.error(`Error during ${command}:`, error);
    process.exit(1);
  }
}

main();
