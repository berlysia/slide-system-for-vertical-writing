declare module "gray-matter" {
  interface GrayMatterFile {
    data: any;
    content: string;
    excerpt?: string;
    orig: string | Buffer;
    language: string;
    matter: string;
    stringify(lang?: string): string;
  }

  function matter(input: string | Buffer): GrayMatterFile;
  export = matter;
}
