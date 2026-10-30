import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // This tells Sass to treat the node_modules folder as a search path
        // allowing imports like @import "bootstrap/..." without the tilde (~)
        includePaths: [path.resolve(__dirname, 'node_modules')],
      },
    },
  },
});