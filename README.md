# Slides Application

A React-based slides application built with Vite that supports markdown-based presentations with vertical and horizontal writing modes. Features hot module reloading and comprehensive browser compatibility testing.

## Features

- Support for both vertical and horizontal writing modes (縦書き・横書き)
- MDX-based slide creation
- Print mode support
- Browser compatibility across Chrome, Firefox, and Safari

## Usage

```bash
vertical-slides <command> [options]
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
vertical-slides dev --dir ./my-slides

# Build all slides from specified directory
vertical-slides buildAll --dir ./my-slides

# Build specific slides with custom name
vertical-slides build --dir ./my-slides --name custom-presentation
```

For development documentation, see [DEVELOPMENT.md](DEVELOPMENT.md).

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
