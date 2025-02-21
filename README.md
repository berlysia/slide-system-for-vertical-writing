# Slides Application

A React-based slides application built with Vite that supports markdown-based presentations with hot module reloading.

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
      slidesDir: 'presentations',    // Custom slides directory
      collection: 'my-presentation'  // Custom presentation name
    })
  ]
})
```

## Project Structure

```
├── src/               # Source code
├── [slidesDir]/       # Slides directory (default: 'slides')
│   └── [collection]/  # Presentation collection (default: 'css-from-vertical-world')
│       ├── index.md   # Main presentation file
│       └── images     # Image files
```

Each presentation should be placed in its own directory under the slides directory. The `index.md` file is the entry point for the presentation, and it can import other markdown files using the `@import` syntax.
