// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sonurastudio.com',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  build: {
    format: 'directory'
  },
  // Permanent redirects for retired /use-cases/ pages (all return 404 in prod).
  // GitHub Pages can't emit true 301 status codes, so Astro generates a
  // meta-refresh + rel=canonical page at each source URL; Google treats this
  // as a permanent redirect for SEO consolidation.
  // NOTE: the parallel /samples/* URLs were intentionally NOT redirected —
  // they are live (HTTP 200) pages, not broken. Verified 2026-07-18.
  redirects: {
    '/use-cases/beat-producers': '/use-cases/type-beats/',
    '/use-cases/ai-vocals-producers': '/features/ai-vocals/',
    '/use-cases/electronic-producers': '/genre/edm/',
    '/use-cases/content-creators': '/use-cases/video-editors/',
    '/use-cases/hip-hop-producers': '/genre/hip-hop/',
    // Riffusion became ProducerAI, Google acquired it in Feb 2026, and it is
    // now Flow Music running Lyria 3.5 — so the live comparison is the Lyria
    // one. Verified 2026-08-19 via riffusion.com -> producer.ai -> flowmusic.app.
    '/compare/riffusion-vs-suno': '/compare/lyria-vs-suno/',
    // Promoted from a blog post to a tool page: same content, the page type the
    // SERP actually ranks. Every result above us for "acapella extractor" is a
    // tool page, including sites at DR 3, 13 and 16. Verified 2026-09-14.
    '/blog/acapella-extractor': '/tools/acapella-extractor/',
  },
  integrations: [
    sitemap({
      // /v2/ is an internal landing experiment: noindex, and kept out of the sitemap.
      filter: (page) => !page.includes('/v2/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
