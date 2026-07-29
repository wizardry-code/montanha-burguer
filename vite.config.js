import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    visualizer({ open: true, gzipSize: true, brotliSize: true, filename: 'stats.html' }),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  base: '/montanha-burguer/',
  build: {
    rollupOptions: {
      output: {
        // Separa as grandes dependências em arquivos isolados para otimizar o carregamento
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
        }
      }
    }
  }
})