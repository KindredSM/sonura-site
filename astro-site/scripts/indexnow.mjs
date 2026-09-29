// usage: node scripts/indexnow.mjs <base-sha> <head-sha>
import { execSync } from 'node:child_process';

const HOST = 'sonurastudio.com';
const KEY = 'sdv51t28u31tnjpp8qtupzbyku99xp9t';
const SITE = `https://${HOST}`;
const [base, head = 'HEAD'] = process.argv.slice(2);

const git = (command) => execSync(command, { encoding: 'utf8' }).trim();

function changedFiles() {
  if (!base || /^0+$/.test(base)) return [];
  return git(`git diff --name-only ${base} ${head} -- .`).split('\n').filter(Boolean);
}

async function sitemapUrls() {
  const index = await (await fetch(`${SITE}/sitemap-index.xml`)).text();
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const pages = await Promise.all(maps.map(async (url) => (await fetch(url)).text()));
  return pages.flatMap((xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
}

function pageUrl(file) {
  const match = file.match(/src\/pages\/(.*?)(?:\/index)?\.astro$/);
  if (!match) return null;
  const route = match[1] === 'index' ? '' : match[1];
  return `${SITE}/${route ? `${route}/` : ''}`;
}

const files = changedFiles();
const sharedChange = files.some((f) => /src\/(layouts|components|data|styles|integrations)\//.test(f));
const urls = new Set(sharedChange ? await sitemapUrls() : files.map(pageUrl).filter(Boolean));
if (files.length) {
  urls.add(`${SITE}/llms.txt`);
  urls.add(`${SITE}/llms-full.txt`);
}

if (!urls.size) {
  console.log('indexnow: no page changes');
  process.exit(0);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: [...urls].slice(0, 10000) }),
});
console.log(`indexnow: ${urls.size} urls, status ${response.status}`);
if (response.status >= 400) process.exit(1);
