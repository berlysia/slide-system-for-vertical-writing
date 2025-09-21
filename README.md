# Slides Application

A React-based slides application built with Vite that supports markdown-based presentations with vertical and horizontal writing modes. Features hot module reloading and comprehensive browser compatibility testing.

## Features

- Support for both vertical and horizontal writing modes (縦書き・横書き)
- MDX-based slide creation
- External script embedding with security validation
- Print mode support
- Browser compatibility across Chrome, Firefox, and Safari

## Usage

```bash
npx @berlysia/vertical-writing-slide-system <command> [options]
```

### Commands

- `dev` - Start development server
- `buildAll` - Build all pages
- `build` - Build current page

### Options

- `--dir, -d <path>` - Specify custom slides directory (required unless --debug)
- `--name, -n <name>` - Specify custom slide name in directory
- `--debug` - Enable debug mode

### Examples

```bash
# Start development server for slides in './my-slides' directory
npx @berlysia/vertical-writing-slide-system dev --dir ./my-slides

# Build all slides from specified directory
npx @berlysia/vertical-writing-slide-system buildAll --dir ./my-slides

# Build specific slides with custom name
npx @berlysia/vertical-writing-slide-system build --dir ./my-slides --name custom-presentation
```

## Slides Directory Structure

Your slides directory should follow this structure:

```
slides/
  ├── presentation-name/     # Directory for each presentation
  │   ├── index.mdx         # Main presentation content
  │   └── images/           # (Optional) Images used in the presentation
  │       └── example.png
  └── another-presentation/
      ├── index.mdx
      └── images/
          └── slide-image.png
```

Each presentation should be in its own directory containing:

- `index.mdx`: The main presentation file with your MDX content. \*.md is also fine
- `images/`: (Optional) Directory containing images used in the presentation
- `scripts.json`: (Optional) Configuration file for external scripts
- `style.css`: (Optional) Custom CSS styles for the presentation

## Script Embedding

You can embed external scripts in your slides for enhanced functionality:

### Method 1: Direct Script Tags in MDX

```mdx
<script
  src="https://cdn.jsdelivr.net/npm/baseline-status@1/baseline-status.min.js"
  type="module"
></script>

<script>console.log('Inline script executed');</script>

<Center>
  <h1>External Script Example</h1>
  <baseline-status feature="css-grid"></baseline-status>
</Center>
```

### Method 2: Configuration File

Create a `scripts.json` file in your slide directory:

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

- Only trusted CDNs are allowed (jsdelivr, unpkg, cdnjs, etc.)
- Scripts are loaded only once per session
- Basic validation of script attributes and content

For development documentation, see [DEVELOPMENT.md](DEVELOPMENT.md).

## Example Usage

For example slides and presentations, see [berlysia/slides-for-vertical-writing](https://github.com/berlysia/slides-for-vertical-writing) repository.

## Writing Modes

The application supports both vertical and horizontal writing modes:

- Vertical (日本語縦書き): Traditional Japanese vertical writing mode
- Horizontal: Standard left-to-right horizontal writing mode

Writing modes can be switched dynamically during presentation.

## Browser Compatibility

The application is tested and supported across:

- Chrome/Chromium
- Firefox
- Safari

Visual regression tests ensure consistent rendering across browsers, with special attention to writing mode implementations.

## Known Limitations

### Print Mode

Print behavior may be unstable across different browsers and scenarios. Users should test print output in their target browser before final use.

### Browser-Specific Issues

- Firefox: Container Style Queries are not yet supported, which may affect some layout features
  - https://webstatus.dev/features/container-style-queries
