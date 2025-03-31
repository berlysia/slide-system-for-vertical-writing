#!/usr/bin/env node

import { execSync } from "child_process";
import { parseArgs } from "node:util";

async function runDev() {
  try {
    execSync("npx vite", { stdio: "inherit" });
  } catch (error) {
    console.error("Error during build:", error);
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
      root: import.meta.dirname,
      configFile: "vite.config.ts",
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
