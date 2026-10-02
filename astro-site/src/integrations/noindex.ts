import { readFileSync } from 'node:fs';

const NOINDEX_META = /name="robots" content="[^"]*noindex/;

export function isNoindexHtml(html: string): boolean {
  return NOINDEX_META.test(html);
}

// reads the built page, so it only answers once astro has written dist
export function noindexPages(distDir: URL): (pageUrl: string) => boolean {
  return (pageUrl) => {
    const route = new URL(pageUrl).pathname.replace(/^\/|\/$/g, '');
    try {
      return isNoindexHtml(readFileSync(new URL(`${route ? `${route}/` : ''}index.html`, distDir), 'utf8'));
    } catch {
      return false;
    }
  };
}
