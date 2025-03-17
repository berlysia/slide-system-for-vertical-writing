# Technical Context

## Development Environment

### Core Technologies

- Node.js environment
- Vite build system
- TypeScript for type safety
- React for UI components
- MDX for content creation
- Playwright for Visual Regression Testing

### Build Tools

- pnpm for package management
- ESLint for code linting
- Prettier for code formatting
- TypeScript compiler
- Vite dev server and build system
- Playwright Test Runner

## Dependencies

### Key Development Dependencies

```json
{
  "vite": "Development server and build tool",
  "typescript": "Type system and compiler",
  "react": "UI library",
  "@mdx-js/react": "MDX support",
  "eslint": "Code linting",
  "prettier": "Code formatting",
  "@playwright/test": "Visual Regression Testing",
  "playwright-core": "Browser automation"
}
```

## Configuration Files

### TypeScript Configuration

- `tsconfig.json`: Base TypeScript configuration
- `tsconfig.app.json`: Application-specific config
- `tsconfig.node.json`: Node environment config

### Build and Lint Configuration

- `vite.config.ts`: Vite build configuration
- `eslint.config.js`: ESLint rules
- `.prettierrc`: Code formatting rules
- `playwright.config.ts`: Visual Regression Testing configuration

## Type Definitions

- `src/global.d.ts`: Global type declarations
- `src/vite-env.d.ts`: Vite environment types
- `src/virtual-slides.d.ts`: Slide system types

## Project Structure

### Source Organization

```
src/
├── slide-components/  # Presentation components
├── App.tsx           # Main application
├── main.tsx         # Entry point
└── *.css            # Stylesheets
```

### Content Organization

```
slides/
├── css-from-vertical-world/  # Main presentation
├── mdx-sample/              # Examples
└── vrt-test/               # Visual regression test slides
```

### Test Organization

```
tests/
├── visual-regression.spec.ts  # Visual regression tests
└── __snapshots__/            # Test snapshots
```

## Development Practices

### Code Standards

- TypeScript for all source files
- ESLint + Prettier for formatting
- Component-based architecture
- CSS modules for styling
- Visual regression testing for UI changes

### Building and Running

- `pnpm dev`: Development server
- `pnpm build`: Production build
- `pnpm preview`: Preview build
- `pnpm lint`: Code linting
- `pnpm test:vrt`: Run visual regression tests
- `pnpm test:vrt:update`: Update test snapshots

### Version Control

- Git for source control
- `.gitignore` configured for Node.js
- Snapshot files tracked in version control

### Testing Strategy

#### Visual Regression Testing

- Base principles:

  - Always verify screenshot content visually
  - Never blindly update snapshots
  - Document expected visual differences
  - Consider browser-specific behaviors
  - Responsive design verification
  - Print media layout testing

- Test environment setup:

  - Chromium, Firefox, and WebKit engines
  - Standard viewport size (1920x1080)
  - Writing mode state tracking
  - Print media emulation
  - Automated CI/CD pipeline

- Test coverage:

  - Layout changes in different modes
  - Standard viewport size testing (1920x1080)
  - Writing mode state verification
  - Print media layout verification
  - Responsive design behavior

- Test implementation:
  - Use `fullPage: true` for complete capture
  - `scale: "css"` for accurate rendering
  - Proper element visibility verification
  - Consistent screenshot timing
  - Explicit style application waiting

#### Print Mode Testing

- Browser-specific considerations:

  - Chrome: Empty pages issue with `page-break-after`
  - Safari:
    - Inconsistent page size handling
    - Font rotation quirks
    - Container query behavior differences
  - Firefox:
    - Viewport rendering differences
    - Writing mode transition handling
    - Print layout edge cases

- Print media emulation:

  - Use `@page` rules for size control
  - Explicit size units (px, mm)
  - Proper overflow handling
  - Writing mode preservation
  - Break control (`page-break-*`, `break-*`)

- Layout verification:
  - Page size consistency
  - Content positioning
  - Writing mode application
  - Break behavior
  - Margin and padding handling

### CI/CD Pipeline

- GitHub Actions for automated testing
- Snapshot comparison in pull requests
- Test artifacts preservation
- Line reporter for test results
