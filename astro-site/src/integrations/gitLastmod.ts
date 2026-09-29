import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

function pageCommitDates(): Map<string, string> {
  const dates = new Map<string, string>();
  let log = '';
  try {
    log = execSync('git log --format=@%cI --name-only -- src/pages', { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return dates;
  }
  let current = '';
  for (const line of log.split('\n')) {
    if (line.startsWith('@')) current = line.slice(1);
    else if (line && !dates.has(line)) dates.set(line, current);
  }
  return dates;
}

export function gitLastmod(site: string): (url: string) => string | undefined {
  const dates = pageCommitDates();
  const repoPrefix = path.relative(execSafe('git rev-parse --show-toplevel'), ROOT).split(path.sep).join('/');
  return (url) => {
    const route = new URL(url, site).pathname.replace(/^\/|\/$/g, '');
    const candidates = route ? [`src/pages/${route}/index.astro`, `src/pages/${route}.astro`] : ['src/pages/index.astro'];
    for (const file of candidates) {
      if (!existsSync(path.join(ROOT, file))) continue;
      const key = repoPrefix ? `${repoPrefix}/${file}` : file;
      return dates.get(key);
    }
    return undefined;
  };
}

function execSafe(command: string): string {
  try {
    return execSync(command, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return ROOT;
  }
}
