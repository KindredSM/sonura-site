// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://sonurastudio.com',
  // For GitHub Pages with custom domain
  trailingSlash: 'always',
  build: {
    format: 'directory'
  }
});
