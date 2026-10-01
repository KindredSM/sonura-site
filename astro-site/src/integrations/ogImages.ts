import type { AstroIntegration } from 'astro';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { ogImageFile } from '../data/og';

/*
 * Per-route Open Graph images.
 *
 * Every shared link used to show the same generic card. This renders one
 * 1200x630 PNG per built page from the page's own <title> and description,
 * so a link to /genre/lofi/ previews as the lofi page, not the homepage.
 *
 * Runs after the build so it sees exactly what shipped. BaseLayout points
 * og:image at /og/<route>.png using the same slug rule as ogImageFile() below,
 * and any page can still override with its own ogImage prop.
 */

const FONTS_DIR = fileURLToPath(new URL('../assets/fonts/', import.meta.url));
const ICON = fileURLToPath(new URL('../../public/icon.svg', import.meta.url));

const WIDTH = 1200;
const HEIGHT = 630;

/* Section kicker shown above the headline. */
const KICKERS: Record<string, string> = {
  '': 'Sonura',
  plugin: 'Sonura Flow plugin',
  features: 'Feature',
  tools: 'Free tool',
  genre: 'Genre',
  'use-cases': 'Use case',
  samples: 'Samples',
  alternatives: 'Alternatives',
  compare: 'Comparison',
  blog: 'Blog',
  pricing: 'Pricing',
  about: 'About',
  partners: 'Partner program',
};

function decode(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function cleanTitle(title: string): string {
  return decode(title)
    .replace(/\s*[|\-–]\s*Sonura( Studio)?$/, '')
    .replace(/^Sonura:\s*/, '')
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const head = text.slice(0, max);
  /* Prefer ending on a full sentence when one fits. */
  const sentence = head.lastIndexOf('. ');
  if (sentence >= 70) return head.slice(0, sentence + 1);
  return `${head.replace(/\s+\S*$/, '')}…`;
}

/* "Free Lofi Beat Maker | AI Lofi Music Generator" reads as a SERP title, not a
   headline. The card shows the part before the separator, like the page's H1. */
function headline(title: string): string {
  return title.split(/\s+\|\s+/)[0].trim();
}

/* Long headlines step down so they still fit in three lines. */
function headlineSize(text: string): number {
  if (text.length <= 28) return 104;
  if (text.length <= 44) return 88;
  if (text.length <= 60) return 72;
  return 60;
}

async function htmlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((e) => e.isFile() && e.name === 'index.html')
    .map((e) => path.join(e.parentPath, e.name));
}

interface Card {
  route: string;
  kicker: string;
  title: string;
  description: string;
}

async function readCard(dist: string, file: string): Promise<Card | null> {
  const html = await readFile(file, 'utf8');
  if (/http-equiv="refresh"/.test(html)) return null;
  const route = path.relative(dist, path.dirname(file)).split(path.sep).join('/');
  const section = route.split('/')[0];
  const title = cleanTitle(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? route);
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  return {
    route,
    kicker: KICKERS[route.includes('/') ? section : route] ?? KICKERS[section] ?? 'Sonura',
    title: truncate(headline(title), 76),
    description: truncate(description, 150),
  };
}

function card(c: Card, icon: string) {
  /* Satori takes React-style element objects; no JSX runtime needed. */
  const el = (type: string, props: Record<string, unknown>, ...children: unknown[]) => ({
    type,
    props: { ...props, children: children.length === 1 ? children[0] : children },
  });

  return el(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        backgroundColor: '#0a0a0a',
        backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(124, 58, 237, 0.35) 0%, rgba(10, 10, 10, 0) 55%)',
        color: '#f5f5f5',
        fontFamily: 'Archivo',
      },
    },
    el(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
      el('img', { src: icon, width: 46, height: 33 }),
      el(
        'div',
        { style: { display: 'flex', fontSize: 26, letterSpacing: '0.14em', textTransform: 'uppercase' } },
        'sonura',
      ),
      c.kicker !== 'Sonura'
        ? el(
            'div',
            {
              style: {
                display: 'flex',
                marginLeft: '18px',
                paddingLeft: '18px',
                borderLeft: '2px solid rgba(255,255,255,0.25)',
                fontSize: 24,
                color: 'rgba(255,255,255,0.6)',
              },
            },
            c.kicker,
          )
        : el('div', { style: { display: 'flex' } }),
    ),
    el(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '26px' } },
      el(
        'div',
        {
          style: {
            display: 'flex',
            fontFamily: 'Anton',
            fontSize: headlineSize(c.title),
            lineHeight: 1.02,
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
          },
        },
        c.title,
      ),
      c.description
        ? el(
            'div',
            { style: { display: 'flex', fontSize: 28, lineHeight: 1.35, color: 'rgba(255,255,255,0.72)', maxWidth: '980px' } },
            c.description,
          )
        : el('div', { style: { display: 'flex' } }),
    ),
    el(
      'div',
      { style: { display: 'flex', justifyContent: 'space-between', fontSize: 24, color: 'rgba(255,255,255,0.55)' } },
      el('div', { style: { display: 'flex' } }, 'sonurastudio.com'),
      el('div', { style: { display: 'flex' } }, 'Royalty-free beats, loops, vocals and stems'),
    ),
  );
}

export default function ogImages(): AstroIntegration {
  return {
    name: 'og-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const outDir = path.join(dist, 'og');
        await mkdir(outDir, { recursive: true });

        const [anton, archivo, iconSvg] = await Promise.all([
          readFile(path.join(FONTS_DIR, 'Anton-Regular.ttf')),
          readFile(path.join(FONTS_DIR, 'Archivo-Medium.ttf')),
          readFile(ICON, 'utf8'),
        ]);
        const icon = `data:image/svg+xml;base64,${Buffer.from(iconSvg).toString('base64')}`;
        const fonts = [
          { name: 'Anton', data: anton, weight: 400 as const, style: 'normal' as const },
          { name: 'Archivo', data: archivo, weight: 500 as const, style: 'normal' as const },
        ];

        const cards = (await Promise.all((await htmlFiles(dist)).map((f) => readCard(dist, f)))).filter(
          (c): c is Card => c !== null,
        );

        let written = 0;
        for (const c of cards) {
          const svg = await satori(card(c, icon) as any, { width: WIDTH, height: HEIGHT, fonts });
          const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();
          await writeFile(path.join(outDir, ogImageFile(c.route)), png);
          written++;
        }
        logger.info(`${written} Open Graph images written to /og/`);
      },
    },
  };
}
