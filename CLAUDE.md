# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based slide presentation system built with Vite that specializes in vertical writing modes (縦書き) for Japanese content. The system supports both MDX and Markdown slides with hot module reloading and comprehensive browser compatibility testing.

## Package Manager

This project uses **pnpm** as the package manager. All commands should be run with pnpm.

## Development Commands

### Core Development

- `pnpm dev` - Start development server (runs Vite)
- `pnpm build` - Build the application (TypeScript compilation + Vite build)
- `pnpm preview` - Preview the built application

### CLI Tool Usage

The project provides a CLI tool for slide management:

```bash
# Start development server for specific slides directory
./cli.js dev --dir ./slides

# Build all presentations from slides directory
./cli.js buildAll --dir ./slides

# Build single presentation
./cli.js build --dir ./slides --name presentation-name
```

### Testing

- `pnpm test:vrt` - Run visual regression tests with Playwright
- `pnpm test:vrt:update` - Update visual regression test snapshots
- `pnpm test:vrt:clear` - Clear all visual regression snapshots
- `pnpm ai:test:vrt` - Run VRT with AI=1 environment variable
- `pnpm ai:test:vrt:update` - Update VRT snapshots with AI=1

### Build Tools

- `pnpm build:cli` - Build CLI TypeScript files
- `pnpm build:pages` - Build all slide pages using build-pages script
- `pnpm lint` - Run ESLint

## Architecture

### Core Components

**Vite Plugin System**: The heart of the application is `src/vite-plugin-slides.ts`, which:

- Dynamically loads slide collections from specified directories
- Compiles MDX/Markdown content into React components
- Handles virtual module resolution for slides
- Manages slide assets (images) copying
- Provides hot reloading for slide content

**CLI Interface**: `cli.js` provides command-line access with three main commands:

- `dev`: Development server
- `build`: Single page build
- `buildAll`: Multi-page build using `scripts/build-pages.js`

**Slide Processing**:

- MDX files are compiled using `@mdx-js/mdx` with custom remark plugins
- Markdown files are processed with unified/remark pipeline
- Images are handled via `src/remark-slide-images.ts` plugin
- Slide boundaries are defined by `---`, `***`, or `___` separators

### Directory Structure

```
src/
├── slide-components/       # React components available in slides
├── vite-plugin-slides.ts  # Core Vite plugin for slide processing
├── remark-slide-images.ts # Image processing plugin
├── App.tsx                # Main React application
├── screen.css             # Screen display styles
└── print.css              # Print mode styles

slides/                     # Default slides directory
└── [collection]/          # Each presentation in own directory
    ├── index.mdx          # Main presentation file (or index.md)
    └── images/            # Optional image assets

tests/                     # Playwright tests
├── browser-compatibility.spec.ts
├── print-mode.spec.ts
└── visual-regression.spec.ts
```

### Virtual Module System

The plugin creates virtual modules:

- `virtual:slides.js` - Main slides module
- `virtual:slides-page-N.js` - Individual slide pages

### Environment Variables

- `SLIDES_DIR` - Custom slides directory path
- `SLIDE_NAME` - Specific slide collection name
- `isAI` - Enables AI-specific test mode

## Script Embedding Support

The system supports embedding external scripts and inline scripts in slides:

### Script Tags in MDX/Markdown

Scripts can be embedded directly in slide content:

```mdx
<script
  src="https://cdn.jsdelivr.net/npm/baseline-status@1/baseline-status.min.js"
  type="module"
></script>

<script>console.log('Inline script executed');</script>
```

### Configuration File (`scripts.json`)

External scripts can also be configured per slide collection via `scripts.json`:

```json
{
  "external": [
    {
      "src": "https://cdn.jsdelivr.net/npm/baseline-status@1/baseline-status.min.js",
      "type": "module"
    }
  ],
  "inline": [
    {
      "content": "console.log('Script from configuration');"
    }
  ]
}
```

### Security Features

- **Domain Whitelist**: Only trusted CDNs (jsdelivr, unpkg, cdnjs, etc.) are allowed
- **Script Validation**: Basic validation of script attributes and content
- **Duplicate Prevention**: Scripts are loaded only once per session

### Architecture

- **ScriptManager** (`src/script-manager.ts`): Handles script parsing, validation, and injection
- **Vite Plugin Integration**: Scripts are extracted during build/dev processing
- **React Integration**: Scripts are loaded when the App component mounts

## Writing Modes Support

The application supports both vertical (縦書き) and horizontal writing modes, with special CSS handling in `screen.css` and `print.css`. Browser compatibility is tested across Chrome, Firefox, and Safari.

## Testing Strategy

Comprehensive browser testing using Playwright:

- Visual regression testing across browsers
- Print mode validation
- Browser compatibility verification
- Cross-platform rendering consistency

## TypeScript Configuration

Multiple TypeScript configs for different contexts:

- `tsconfig.json` - Main config
- `tsconfig.app.json` - Application code
- `tsconfig.cli.json` - CLI tool
- `tsconfig.node.json` - Node.js scripts

## Key Dependencies

- **Vite** - Build tool and dev server
- **React 19** - UI framework
- **@mdx-js/mdx** - MDX compilation
- **unified/remark** - Markdown processing
- **Playwright** - Browser testing
- **@emotion/react** - CSS-in-JS styling

## Development Notes

- Slides are hot-reloaded during development via file watching
- Image assets are automatically handled in both dev and build modes:
  - Dev mode: Images copied to `public/slide-assets/images/`
  - Build mode: Images added to bundle via Vite's `emitFile` API
- The system prompts for slide collection selection if not specified
- Build output goes to `pages/` directory for multi-page builds
- For external projects without `index.html`, one is automatically generated

## External Project Usage

When used from external projects (via npm/pnpm):

- CLI uses `process.cwd()` as root (consumer project) but loads Vite config from library
- Missing `index.html` files are automatically generated pointing to library sources
- Image processing works correctly via bundle emission
- All slide assets are preserved with proper paths
