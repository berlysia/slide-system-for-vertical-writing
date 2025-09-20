#!/usr/bin/env node
// @ts-check

import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { build, createServer } from "vite";

async function runDev() {
  try {
    const libPath = import.meta.dirname;
    const projectPath = process.cwd();

    // Set environment variables for external project
    if (!process.env.SLIDES_DIR) {
      process.env.SLIDES_DIR = resolve(projectPath, "./slides");
    }

    const server = await createServer({
      root: libPath, // Use library as root to serve its index.html
      configFile: resolve(libPath, "vite.config.ts"),
      server: {
        fs: {
          allow: [
            // Allow serving files from the library directory
            libPath,
            // Allow serving files from the current working directory
            projectPath,
            // Allow serving public assets from project directory
            resolve(projectPath, "public"),
          ],
        },
      },
      publicDir: resolve(projectPath, "public"), // Set public directory to project path
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
    const projectPath = process.cwd();

    // Set environment variables for external project
    if (!process.env.SLIDES_DIR) {
      process.env.SLIDES_DIR = resolve(projectPath, "./slides");
    }

    await build({
      root: import.meta.dirname, // Use library as root like dev mode
      configFile: resolve(import.meta.dirname, "vite.config.ts"),
      build: {
        outDir: resolve(process.cwd(), "pages"),
        rollupOptions: {
          input: resolve(import.meta.dirname, "index.html"),
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
