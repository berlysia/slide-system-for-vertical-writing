import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import slidesPlugin from './src/vite-plugin-slides'

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [
    react(),
    // You can configure the slides plugin with options:
    // slidesPlugin({
    //   slidesDir: 'slides',          // Directory containing slides
    //   collection: 'my-presentation' // Name of the slides collection
    // })
    await slidesPlugin()
  ],
  optimizeDeps: {
    // Add virtual module to optimization
    include: ['virtual:slides']
  }
}))
