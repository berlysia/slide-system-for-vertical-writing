import { Plugin, ViteDevServer } from 'vite';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import { mkdirSync, copyFileSync, readdirSync } from 'node:fs';

export interface SlidesPluginOptions {
  /** Directory containing the slides, relative to project root */
  slidesDir?: string;
  /** Name of the slides collection */
  collection?: string;
}

const defaultOptions: Required<SlidesPluginOptions> = {
  slidesDir: 'slides',
  collection: 'css-from-vertical-world'
};

export default function slidesPlugin(options: SlidesPluginOptions = {}): Plugin {
  const config = { ...defaultOptions, ...options };
  return {
    name: 'vite-plugin-slides',
    resolveId(id: string) {
      if (id === 'virtual:slides') {
        return '\0virtual:slides';
      }
      return undefined;
    },
    load(id: string) {
      if (id === '\0virtual:slides') {
        const currentFilePath = import.meta.filename;
        const currentDir = path.dirname(currentFilePath);
        const slidePath = path.resolve(currentDir, `../${config.slidesDir}/${config.collection}/index.md`);
        
        if (fs.existsSync(slidePath)) {
          const content = fs.readFileSync(slidePath, 'utf-8');
          const replaced = content.replace(/<img\s+([^>]*src="(@slide\/[^"]+)"[^>]*)>/g, (_, attributes, src) => {
            return `<img ${attributes.replace(src, `/${config.slidesDir}/${config.collection}/images/${src.slice(7)}`)}>`;
          });
          return `export default ${JSON.stringify(replaced)}`;
        }
        return 'export default ""';
      }
    },
    async buildStart() {
      const currentFilePath = import.meta.filename;
      const currentDir = path.dirname(currentFilePath);
      const sourceImagesDir = path.resolve(currentDir, `../${config.slidesDir}/${config.collection}/images`);
      const targetImagesDir = path.resolve(currentDir, `../public/slides/${config.collection}/images`);

      if (fs.existsSync(sourceImagesDir)) {
        // Create target directory if it doesn't exist
        mkdirSync(targetImagesDir, { recursive: true });

        // Copy all files from source to target
        const imageFiles = readdirSync(sourceImagesDir);
        for (const file of imageFiles) {
          const sourcePath = path.join(sourceImagesDir, file);
          const targetPath = path.join(targetImagesDir, file);
          copyFileSync(sourcePath, targetPath);
        }
      }
    },

    configureServer(server: ViteDevServer) {
      server.watcher.add(`**/${config.slidesDir}/${config.collection}/**/*.md`);
      server.watcher.on('change', (path: string) => {
        if (path.match(new RegExp(`\\/${config.slidesDir}\\/${config.collection}\\/.+\\.md$`))) {
          // Invalidate the module to trigger HMR
          const mod = server.moduleGraph.getModuleById('\0virtual:slides');
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
            server.ws.send({
              type: 'full-reload',
              path: '*'
            });
          }
        }
      });
    }
  };
}
