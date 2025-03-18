# Development Guide

## Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

## Development Workflow

### Development Server

```bash
npm run dev
# or
pnpm dev
```

### Building

```bash
npm run build
# or
pnpm build
```

### Testing

```bash
npm run test
# or
pnpm test
```

Tests cover:

- Browser compatibility across Chrome, Firefox, and Safari
- Print mode functionality
- Visual regression testing
- Layout modes (vertical/horizontal)
- Responsive design

## Configuration

### Slides Plugin Options

The slides plugin can be configured in `vite.config.ts` with the following options:

```typescript
interface SlidesPluginOptions {
  /** Directory containing the slides, relative to project root (default: 'slides') */
  slidesDir?: string;
  /** Name of the slides collection (default: 'css-from-vertical-world') */
  collection?: string;
}
```

Example configuration:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    slidesPlugin({
      slidesDir: "presentations", // Custom slides directory
      collection: "my-presentation", // Custom presentation name
    }),
  ],
});
```

## Project Structure

```
├── src/                    # Source code
│   ├── slide-components/   # React components for slides
│   ├── App.tsx            # Main application component
│   ├── screen.css         # Screen display styles
│   └── print.css          # Print mode styles
├── slides/                 # Slides directory
│   └── [collection]/      # Presentation collection
│       ├── index.mdx      # Main presentation file
│       └── images/        # Image assets
├── tests/                 # Test files
│   ├── browser-compatibility.spec.ts
│   ├── print-mode.spec.ts
│   └── visual-regression.spec.ts
└── pdf/                   # Browser compatibility reports
```

Each presentation should be placed in its own directory under the slides directory. The `index.mdx` file is the entry point for the presentation.
