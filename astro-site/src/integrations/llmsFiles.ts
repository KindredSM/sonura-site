import type { AstroIntegration } from 'astro';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PLANS, planAllowance, SITE_URL } from '../data/facts';

const TEMPLATES = fileURLToPath(new URL('../data/llms/', import.meta.url));

const SECTIONS: [string, string][] = [
  ['', 'Main'],
  ['plugin', 'Plugin'],
  ['features', 'Features'],
  ['tools', 'Tools'],
  ['genre', 'Genres'],
  ['use-cases', 'Use Cases'],
  ['samples', 'Samples'],
  ['alternatives', 'Alternatives'],
  ['compare', 'Model Comparisons'],
  ['blog', 'Blog'],
];

const SKIP = new Set(['privacy', 'terms', 'partner-terms', 'v2', '404']);

interface Page {
  url: string;
  section: string;
  title: string;
  description: string;
}

function decode(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

async function htmlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((e) => e.isFile() && e.name === 'index.html')
    .map((e) => path.join(e.parentPath, e.name));
}

async function readPage(dist: string, file: string): Promise<Page | null> {
  const html = await readFile(file, 'utf8');
  if (/http-equiv="refresh"/.test(html) || /name="robots" content="[^"]*noindex/.test(html)) return null;
  const route = path.relative(dist, path.dirname(file)).split(path.sep).join('/');
  const section = route.split('/')[0];
  if (SKIP.has(section)) return null;
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? route;
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  return {
    url: `${SITE_URL}/${route ? `${route}/` : ''}`,
    section: route.includes('/') ? section : '',
    title: decode(title).replace(/\s*[|\-–]\s*Sonura( Studio)?$/, ''),
    description: decode(description),
  };
}

function pagesMarkdown(pages: Page[]): string {
  const known = new Set(SECTIONS.map(([key]) => key));
  const groups = [...SECTIONS, ...[...new Set(pages.map((p) => p.section))].filter((s) => !known.has(s)).map((s) => [s, s] as [string, string])];
  return groups
    .map(([key, label]) => {
      const rows = pages
        .filter((p) => p.section === key)
        .sort((a, b) => a.url.localeCompare(b.url))
        .map((p) => `- [${p.title}](${p.url})${p.description ? `: ${p.description}` : ''}`);
      return rows.length ? `### ${label}\n\n${rows.join('\n')}` : '';
    })
    .filter(Boolean)
    .join('\n\n');
}

function pricingMarkdown(): string {
  const annual = PLANS.filter((p) => p.monthlyPrice > 0)
    .map((p) => `${p.name} $${p.annualMonthlyPrice}/month`)
    .join(', ');
  const rows = PLANS.map((p) => `- **${p.name}**: $${p.monthlyPrice}${p.monthlyPrice ? '/month' : ''}. ${planAllowance(p)}. ${p.perks}`);
  return `Monthly prices below. Annual billing: ${annual}.\n\n${rows.join('\n')}`;
}

export default function llmsFiles(): AstroIntegration {
  return {
    name: 'llms-files',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const pages = (await Promise.all((await htmlFiles(dist)).map((f) => readPage(dist, f)))).filter((p): p is Page => p !== null);
        const values: Record<string, string> = {
          updated: new Date().toISOString().slice(0, 10),
          pricing: pricingMarkdown(),
          pages: pagesMarkdown(pages),
        };
        for (const name of ['llms', 'llms-full']) {
          const template = await readFile(path.join(TEMPLATES, `${name}.md`), 'utf8');
          const output = template.replace(/\{\{(\w+)\}\}/g, (match, key) => values[key] ?? match);
          await writeFile(path.join(dist, `${name}.txt`), output);
        }
        logger.info(`llms.txt and llms-full.txt written with ${pages.length} pages`);
      },
    },
  };
}
