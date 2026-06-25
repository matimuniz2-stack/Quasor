import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: 'lightningcss',
    rollupOptions: {
      input: {
        main: 'index.html',
        privacidad: 'legal/privacidad.html',
        terminos: 'legal/terminos.html',
        eliminar: 'legal/eliminar-datos.html',
        privacy_en: 'legal/en/privacy.html',
        terms_en: 'legal/en/terms.html',
        data_deletion_en: 'legal/en/data-deletion.html',
      },
    },
  },
  server: {
    open: false,
  },
});
