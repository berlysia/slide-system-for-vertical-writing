import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";

interface RemarkSlideImagesOptions {
  base: string;
}

const remarkSlideImages: Plugin<[RemarkSlideImagesOptions], Root> = (
  options,
) => {
  const { base } = options;

  return (tree) => {
    visit(tree, (node: any) => {
      // Handle Markdown image syntax
      if (node.type === "image" && typeof node.url === "string") {
        if (node.url.startsWith("@slide/")) {
          node.url = `${base}slide-assets/images/${node.url.slice(7)}`;
        }
      }

      // Handle MDX JSX img elements
      if (node.type === "mdxJsxFlowElement" && node.name === "img") {
        const src = node.attributes?.find(
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
        const value = node.value as string;
        if (value.startsWith("<img")) {
          node.value = value.replace(
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
