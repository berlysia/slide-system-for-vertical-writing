import { Plugin, ViteDevServer } from 'vite';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

export default function slidesPlugin(): Plugin {
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
        const currentFilePath = url.fileURLToPath(import.meta.url);
        const currentDir = path.dirname(currentFilePath);
        const slidePath = path.resolve(currentDir, '../src/slides.md');

        if (fs.existsSync(slidePath)) {
          const content = fs.readFileSync(slidePath, 'utf-8');
          return `export default ${JSON.stringify(content)}`;
        }
        return 'export default ""';
      }
    },
    configureServer(server: ViteDevServer) {
      server.watcher.add('**/slides.md');
      server.watcher.on('change', (path: string) => {
        if (path.endsWith('slides.md')) {
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
