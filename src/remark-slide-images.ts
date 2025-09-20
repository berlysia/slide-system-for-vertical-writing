import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { Root, Image } from "mdast";

interface RemarkSlideImagesOptions {
  base: string;
}

const remarkSlideImages: Plugin<[RemarkSlideImagesOptions], Root> = (
  options,
) => {
  const { base } = options;

  return (tree) => {
    visit(tree, (node) => {
      // Handle Markdown image syntax
      if (node.type === "image") {
        const imageNode = node as Image;
        if (imageNode.url.startsWith("@slide/")) {
          imageNode.url = `${base}slide-assets/images/${imageNode.url.slice(7)}`;
        }
      }

      // Handle MDX JSX img elements
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (node.type === "mdxJsxFlowElement" && (node as any).name === "img") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mdxNode = node as any;
        const src = mdxNode.attributes?.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (attr: any) => attr.type === "mdxJsxAttribute" && attr.name === "src",
        );
        if (
          src &&
          typeof src.value === "string" &&
          src.value.startsWith("@slide/")
        ) {
          src.value = `${base}slide-assets/images/${src.value.slice(7)}`;
        }
      }

      // Handle HTML img tags in Markdown
      if (node.type === "html") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const htmlNode = node as any;
        const value = htmlNode.value as string;
        if (value.includes("<img")) {
          htmlNode.value = value.replace(
            /<img\s+([^>]*src="(@slide\/[^"]+)"[^>]*)>/g,
            (_, attributes, src) => {
              return `<img ${attributes.replace(
                src,
                `${base}slide-assets/images/${src.slice(7)}`,
              )}>`;
            },
          );
        }
      }
    });
  };
};

export default remarkSlideImages;
