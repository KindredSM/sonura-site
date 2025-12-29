// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://sonurastudio.com',
  trailingSlash: 'ignore',
  build: {
    format: 'directory'
  }
});
