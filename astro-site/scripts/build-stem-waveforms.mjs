#!/usr/bin/env node
/**
 * Turn six separated stems into the audio + waveform data behind the
 * "The split" console on /tools/stem-separator/.
 *
 * Usage:
 *   node scripts/build-stem-waveforms.mjs --in ~/Downloads/stems [--slug demo] [--start 0] [--dur 24]
 *
 * The input directory needs one file per stem whose name contains the stem
 * name: vocals, drums, bass, guitar, piano, other (wav, mp3, flac, or m4a).
 * That is exactly what a six stem download gives you.
 *
 * Writes:
 *   public/music/demo/stems/<slug>/<stem>.mp3   trimmed, 128 kbps excerpts
 *   src/data/stem-demo.json                     peak envelopes + duration
 *
 * The page picks both up automatically on the next build. Until they exist it
 * renders the generated illustration instead. Requires ffmpeg on PATH.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STEMS = ['vocals', 'drums', 'bass', 'guitar', 'piano', 'other'];
const BARS = 128;
const SAMPLE_RATE = 8000; /* plenty for a peak envelope */

function arg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
}

const inputDir = arg('in');
const slug = arg('slug', 'demo');
const start = Number(arg('start', '0'));
const seconds = Number(arg('dur', '24'));

if (!inputDir) {
  console.error('missing --in <directory of separated stems>');
  process.exit(1);
}

try {
  execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
} catch {
  console.error('ffmpeg not found on PATH. brew install ffmpeg');
  process.exit(1);
}

const files = fs.readdirSync(inputDir).filter((name) => /\.(wav|mp3|flac|m4a|aiff?)$/i.test(name));

const matched = STEMS.map((stem) => {
  const file = files.find((name) => name.toLowerCase().includes(stem));
  if (!file) {
    console.error(`no file for "${stem}" in ${inputDir}. found: ${files.join(', ') || '(nothing)'}`);
    process.exit(1);
  }
  return { stem, file: path.join(inputDir, file) };
});

const outDir = path.join(ROOT, 'public', 'music', 'demo', 'stems', slug);
fs.mkdirSync(outDir, { recursive: true });

/** peak envelope of one file, as BARS values in 0..1 (unnormalised) */
function envelope(file) {
  const pcm = execFileSync(
    'ffmpeg',
    ['-v', 'error', '-ss', String(start), '-t', String(seconds), '-i', file,
     '-ac', '1', '-ar', String(SAMPLE_RATE), '-f', 'f32le', '-'],
    { maxBuffer: 1 << 28 },
  );
  const samples = new Float32Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.length / 4));
  const perBar = Math.floor(samples.length / BARS);
  return Array.from({ length: BARS }, (_, bar) => {
    let peak = 0;
    for (let i = bar * perBar; i < (bar + 1) * perBar; i += 1) {
      const value = Math.abs(samples[i]);
      if (value > peak) peak = value;
    }
    return peak;
  });
}

const raw = {};
for (const { stem, file } of matched) {
  execFileSync('ffmpeg', [
    '-v', 'error', '-y',
    '-ss', String(start), '-t', String(seconds), '-i', file,
    '-b:a', '128k', '-ac', '2',
    path.join(outDir, `${stem}.mp3`),
  ]);
  raw[stem] = envelope(file);
  console.log(`captured ${stem}`);
}

/* One shared scale across all six stems, so a quiet stem still looks quiet
   next to a loud one. The 0.7 curve lifts low-level detail enough to read at
   34px tall without flattening the peaks. */
const loudest = Math.max(...Object.values(raw).flat(), 0.0001);
const waves = Object.fromEntries(
  Object.entries(raw).map(([stem, values]) => [
    stem,
    values.map((value) => Number(Math.min(1, (value / loudest) ** 0.7).toFixed(3))),
  ]),
);

const dataPath = path.join(ROOT, 'src', 'data', 'stem-demo.json');
fs.writeFileSync(
  dataPath,
  `${JSON.stringify({ slug, bars: BARS, duration: seconds, waves }, null, 2)}\n`,
);

console.log(`\nwrote ${path.relative(ROOT, dataPath)}`);
console.log(`wrote ${matched.length} mp3 excerpts to ${path.relative(ROOT, outDir)}`);
console.log('run `npm run build` and the console switches from illustration to audio.');
