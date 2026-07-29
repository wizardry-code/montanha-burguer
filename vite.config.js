import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
        visualizer({ open: true, gzipSize: true, brotliSize: true, filename: 'stats.html' })
,
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  base: '/montanha-burguer/',
})
