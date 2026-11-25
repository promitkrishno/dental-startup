import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const page = (name) => fileURLToPath(new URL(`./${name}.html`, import.meta.url));

export default defineConfig({
  build: {
    target: 'es2020',
    cssMinify: true,
    assetsInlineLimit: 2048,
    rollupOptions: {
      input: {
        home: page('index'),
        impressum: page('impressum'),
        privacy: page('privacy'),
        terms: page('terms'),
      },
    },
  },
});
