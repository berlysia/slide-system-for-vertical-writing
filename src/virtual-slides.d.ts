/// <reference types="vite/client" />

declare module "virtual:slides.js" {
  type SlideContent = string | (() => JSX.Element) | React.ComponentType;
  const content: SlideContent[];
  export default content;
}
