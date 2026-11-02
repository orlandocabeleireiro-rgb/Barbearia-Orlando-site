import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // caminhos relativos: funciona em barbeariaorlando.pt e em *.github.io/<repo>/
  base: './',
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    // o chunk do 3D (three.js) é grande mas é carregado só a pedido
    chunkSizeWarningLimit: 1000,
  },
})
