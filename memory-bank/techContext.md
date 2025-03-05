# Technical Context

## Development Environment

### Core Technologies

- Node.js environment
- Vite build system
- TypeScript for type safety
- React for UI components
- MDX for content creation

### Build Tools

- pnpm for package management
- ESLint for code linting
- Prettier for code formatting
- TypeScript compiler
- Vite dev server and build system

## Dependencies

### Key Development Dependencies

```json
{
  "vite": "Development server and build tool",
  "typescript": "Type system and compiler",
  "react": "UI library",
  "@mdx-js/react": "MDX support",
  "eslint": "Code linting",
  "prettier": "Code formatting"
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
└── mdx-sample/              # Examples
```

## Development Practices

### Code Standards

- TypeScript for all source files
- ESLint + Prettier for formatting
- Component-based architecture
- CSS modules for styling

### Building and Running

- `pnpm dev`: Development server
- `pnpm build`: Production build
- `pnpm preview`: Preview build
- `pnpm lint`: Code linting

### Version Control

- Git for source control
- `.gitignore` configured for Node.js
