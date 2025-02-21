import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import slidesPlugin from './src/vite-plugin-slides'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), slidesPlugin()],
  optimizeDeps: {
    // Add virtual module to optimization
    include: ['virtual:slides']
  }
})
