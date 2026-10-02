import { existsSync, readFileSync } from 'node:fs';

const NOINDEX_META = /name="robots" content="[^"]*noindex/;

export function isNoindexHtml(html: string): boolean {
  return NOINDEX_META.test(html);
}

// reads the built page, so it only answers once astro has written dist
export function noindexPages(distDir: URL): (pageUrl: string) => boolean {
  return (pageUrl) => {
    const route = new URL(pageUrl).pathname.replace(/^\/|\/$/g, '');
    const file = new URL(`${route ? `${route}/` : ''}index.html`, distDir);
    if (!existsSync(file)) throw new Error(`noindex: no built page at ${file.pathname} for ${pageUrl}`);
    return isNoindexHtml(readFileSync(file, 'utf8'));
  };
}
