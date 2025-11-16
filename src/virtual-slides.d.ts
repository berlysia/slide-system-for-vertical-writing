/// <reference types="vite/client" />

declare module "virtual:slides.js" {
  import type { ParsedScript } from "./script-manager";
  import type { SlideMetadata } from "./types/slide-metadata";

  type SlideContent = string | (() => JSX.Element) | React.ComponentType;
  const content: SlideContent[];
  export default content;

  export const slideScripts: ParsedScript;
  export const slideMetadata: SlideMetadata;
}
