import type { ListedAlternative, SpecColumn } from './alternatives';

export const SPLICE_VERIFIED = '1 October 2026';

export const SAMPLE_COLUMNS: SpecColumn[] = [
  { key: 'source', label: 'What you get', inCard: true, inTable: true },
  { key: 'licence', label: 'Licence', inCard: true, inTable: true },
  { key: 'free', label: 'Free option', inCard: true, inTable: true },
  { key: 'formats', label: 'Formats', inCard: false, inTable: true },
];

export const SPLICE_CRITERIA = [
  'Whether you can release what you make without clearing anything',
  'How many other producers have the exact same sound',
  'What it costs to start, and whether there is a free way in',
];

type Entry = Omit<ListedAlternative, 'rank'>;

const entries: Entry[] = [
  {
    name: 'Sonura',
    short: 'Sonura',
    href: '/',
    isSonura: true,
    verdict: 'The only one here that creates a new sound for your prompt instead of licensing you a copy from a shared library.',
    bestFor: 'producers who want one-shots, loops and vocal chops nobody else has, in the browser or inside the DAW through the free Sonura Flow plugin.',
    skipIf: 'You want to browse thousands of finished, human-made packs. Sonura creates sounds to order. It is not a catalogue.',
    pricing: 'free to start with no card. free output is CC0, and paid plans carry exclusive rights with no royalty splits.',
    specs: {
      source: 'Created on demand from a text prompt',
      licence: 'Royalty-free. Exclusively yours on paid plans, public domain (CC0) on free',
      free: 'Yes, a free plan with daily credits',
      formats: 'WAV, MP3, stems',
    },
  },
  {
    name: 'Output Arcade',
    short: 'Arcade',
    href: 'https://output.com/products/arcade',
    verdict: 'The library that does most to make a shared sound your own: every loop is a playable instrument you can reshape.',
    bestFor: 'producers who want to bend loops until they stop sounding stock, and who are fine paying monthly.',
    skipIf: 'You want to own a library outright. Access is by subscription, though music you make while subscribed stays yours.',
    pricing: 'subscription, with a 7-day trial for new customers.',
    specs: {
      source: 'Pre-made library of playable loops and instruments',
      licence: 'Royalty-free, non-exclusive',
      free: '7-day trial for new customers',
      formats: 'Playable samplers and instruments, and it chops your own samples',
    },
  },
  {
    name: 'LANDR Samples',
    short: 'LANDR',
    href: 'https://samples.landr.com/',
    verdict: 'A deep royalty-free catalogue, with a licence LANDR describes as guaranteed.',
    bestFor: 'producers already using LANDR for mastering or distribution, and anyone after a free pack every week.',
    skipIf: 'You want to see exact prices before you sign up. LANDR did not list its sample tiers when we checked.',
    pricing: 'subscription with credits and a free trial. check their current pricing.',
    specs: {
      source: 'Pre-made library',
      licence: 'Royalty-free, non-exclusive',
      free: 'Free trial and a weekly free pack',
      formats: 'Samples, plus the Chromatic plugin',
    },
  },
  {
    name: 'Loopcloud',
    short: 'Loopcloud',
    href: 'https://www.loopcloud.com/',
    verdict: 'The cheapest listed paid way into a large royalty-free library.',
    bestFor: 'producers who want a Splice-style library for less, and who can live with a fixed number of downloads a month.',
    skipIf: 'You want unlimited downloads. Every plan gives a set number of points a month.',
    pricing: 'subscription with points and a 14-day trial. what you download is yours to keep.',
    specs: {
      source: 'Pre-made library',
      licence: 'Royalty-free, non-exclusive',
      free: '14-day trial',
      formats: 'Samples, MIDI, presets',
    },
  },
  {
    name: 'BandLab Sounds',
    short: 'BandLab',
    href: 'https://www.bandlab.com/sounds/home',
    verdict: 'The free library with the biggest reach, built into BandLab\'s own browser studio.',
    bestFor: 'starting at $0, especially if you already make music in BandLab Studio.',
    skipIf: 'Originality matters, or you want whole packs. It reaches a huge free user base, and full-pack downloads need a Membership.',
    pricing: 'free account, with a paid Membership for full packs.',
    specs: {
      source: 'Pre-made library',
      licence: 'Royalty-free, non-exclusive',
      free: 'Yes, free samples with a free account',
      formats: 'Loops and one-shots',
    },
  },
  {
    name: 'Noiiz',
    short: 'Noiiz',
    href: 'https://www.noiiz.com/',
    verdict: 'The library for heavy downloaders: its top plan has no download cap.',
    bestFor: 'producers who download a lot and will pay for the Pro plan.',
    skipIf: 'You are on a lower plan. Light and Regular cap downloads by megabytes each month.',
    pricing: 'monthly subscription, capped by megabytes below Pro.',
    specs: {
      source: 'Pre-made library',
      licence: 'Royalty-free, non-exclusive',
      free: 'Free sign-up. Check what it includes',
      formats: 'Loops, presets, instruments, MIDI',
    },
  },
  {
    name: 'ADSR Sounds',
    short: 'ADSR',
    href: 'https://www.adsrsounds.com/',
    verdict: 'The pay-once option: buy a single pack outright instead of renting a library.',
    bestFor: 'producers who know which pack they want and do not want another subscription.',
    skipIf: 'You want everything for one monthly price. Packs are bought one at a time.',
    pricing: 'pay per pack, with a credits option.',
    specs: {
      source: 'Pre-made packs, bought one at a time',
      licence: 'Royalty-free for commercial use',
      free: 'A free packs section',
      formats: 'WAV, MIDI, REX2, AIFF, stems, presets',
    },
  },
];

export const SPLICE_ALTERNATIVES: ListedAlternative[] = entries.map((entry, i) => ({ ...entry, rank: i + 1 }));
