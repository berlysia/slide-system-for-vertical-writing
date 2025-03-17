# Active Context

## Current Focus

Development and testing of a slide presentation system with vertical writing support, focusing on:

- Visual regression testing across browsers
- Print media optimization
- Writing mode transitions
- Cross-browser compatibility

## Recent Changes

- Writing mode toggle implementation with CSS custom properties
- Keyboard and wheel-based slide navigation
- Print media optimization with @page rules
- MDX-based slide system with layout components
- Visual Regression Testing implementation with Playwright
  - Writing mode toggle testing
  - Responsive layout testing
  - GitHub Actions integration

## Active Decisions

### Architecture

1. Using Vite for development and building
2. Component-based slide system
3. MDX for content authoring
4. Custom plugin for slide processing
5. Playwright for Visual Regression Testing

### Implementation Strategy

1. Core slide components first
   - Layout component
   - Slide container
   - Navigation system
2. CSS demonstrations
   - Logical properties
   - Writing mode examples
   - Font behavior
3. Content development
   - MDX slides
   - Visual examples
   - Interactive demonstrations
4. Testing strategy
   - Visual regression tests
   - Multiple viewport sizes
   - Writing mode state verification

## Current Considerations

### Technical

- Container query implementations for responsive layouts
- CSS custom properties for writing mode state management
- Visual regression testing strategy:
  - Multiple browser engines (Chromium, Firefox, WebKit)
  - Various viewport sizes and orientations
  - Writing mode state verification
  - Print mode layout verification
- Print media optimization:
  - Cross-browser behavior differences in print mode
  - Specific issues with empty pages in Chrome
  - Safari's page size inconsistencies
  - Firefox's rendering range issues
  - Size and margin control using @page rules
  - Writing mode considerations in print layout
- Scroll snap for slide navigation
- IntersectionObserver for slide position tracking
- Visual regression testing:
  - Importance of visual verification
  - Danger of updating snapshots without inspection
  - Browser-specific layout differences
  - Image diff analysis for layout changes
  - Test strategy for print media layouts
- CI/CD pipeline with GitHub Actions

### Content

- Progressive learning approach
- Clear visual examples
- Interactive demonstrations
- Practical use cases
- Test coverage for visual changes

## Next Steps

### Short Term

1. Enhance keyboard shortcuts for writing mode toggle
2. Add more layout components for complex slides
3. Improve print layout handling
4. Create comprehensive CSS examples
5. Expand VRT coverage for new components

### Medium Term

1. Enhance interactivity
2. Add more complex examples
3. Improve transitions
4. Polish visual design
5. Automate visual testing in CI pipeline

### Long Term

1. Add more advanced CSS concepts
2. Create comprehensive documentation
3. Optimize performance
4. Consider additional features
5. Enhance testing infrastructure

## Open Questions

- Best approach for handling font rotations
- Optimal navigation UX for presentation
- Performance considerations for complex demos
- Browser compatibility concerns
- Visual testing strategy for dynamic content
