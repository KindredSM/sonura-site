/**
 * Canonical spec sheet for the music models compared under /compare/.
 *
 * ONE source of truth: every comparison page renders its spec table from these
 * records, so a model update lands on every comparison page at once. Keep every value
 * verifiable from a public source, and keep the voice rules from
 * DESIGN-SYSTEM.md §5 (prose is sentence case, no em dashes, no "AI" in headings).
 *
 * Last verified against public sources: 19 August 2026.
 */

export interface ModelSpecs {
  /** longest single generation */
  length: string;
  vocals: string;
  stems: string;
  /** whether you can pick this model inside Sonura songs mode */
  sonura: string;
  download: string;
  training: string;
  commercial: string;
  weights: string;
  access: string;
}

export interface MusicModel {
  /** url-safe key, also used in page slugs */
  slug: string;
  /** display name of the model itself */
  name: string;
  /** short label for table headers and winner pills */
  short: string;
  /** company behind it */
  maker: string;
  /** current version string as of the verified date */
  version: string;
  /** when that version shipped */
  released: string;
  /** one sentence, used on the hub and in ledes */
  oneLiner: string;
  /** true when the model is selectable in Sonura songs mode */
  inSonura: boolean;
  specs: ModelSpecs;
}

export const MODELS: Record<string, MusicModel> = {
  suno: {
    slug: 'suno',
    name: 'Suno',
    short: 'Suno',
    maker: 'Suno',
    version: 'V5.5',
    released: '26 March 2026',
    oneLiner: 'The market leader, and the one most released tracks actually come from.',
    inSonura: false,
    specs: {
      length: 'Full songs, extendable in the app',
      vocals: 'Yes, plus Voices for a reusable voice and custom models trained on your own catalogue',
      stems: 'Up to 12 stems, but only inside Suno Studio on the top plan',
      sonura: 'No, it only runs inside Suno',
      download: 'WAV, per-clip WAV, and MIDI out of Studio',
      training: 'A licensing deal with Warner Music, with other label litigation still unresolved',
      commercial: 'Paid plans only',
      weights: 'Closed',
      access: 'Web and mobile app',
    },
  },

  udio: {
    slug: 'udio',
    name: 'Udio',
    short: 'Udio',
    maker: 'Udio',
    version: 'Post-settlement platform, in transition',
    released: 'UMG settlement October 2025, relaunch still pending',
    oneLiner: 'The cleanest licensing story in the space, on a platform you currently cannot export from.',
    inSonura: false,
    specs: {
      length: 'Full songs',
      vocals: 'Yes',
      stems: 'Stem download is switched off during the transition',
      sonura: 'No, it only runs inside Udio',
      download: 'Switched off: audio, stems, and video export are all disabled',
      training: 'Licensed through Universal Music Group, Warner Music, Merlin, and Kobalt, opt-in for the artists and songwriters at each',
      commercial: 'Paid plans, and only inside the platform',
      weights: 'Closed',
      access: 'Web, as a closed platform you create and keep tracks inside',
    },
  },

  minimax: {
    slug: 'minimax',
    name: 'MiniMax Music 3.0',
    short: 'MiniMax',
    maker: 'MiniMax',
    version: 'Music 3.0 (MiniMax-Music3)',
    released: '13 August 2026',
    oneLiner: 'The newest open-weights song model, and the first you can run on your own hardware end to end.',
    inSonura: false,
    specs: {
      length: 'Up to five minutes in a single pass',
      vocals: 'Yes, with an instrumental-only mode and named instrument and technique control',
      stems: 'No stem export, it returns a finished mix',
      sonura: 'No, run it through the hosted api or on your own gpu',
      download: '32 kHz 16-bit stereo wav',
      training: 'Not disclosed',
      commercial: 'Governed by a custom community licence, so read it against your use',
      weights: 'Open, published on hugging face',
      access: 'Hosted API, or your own gpu',
    },
  },

  'stable-audio': {
    slug: 'stable-audio',
    name: 'Stable Audio 3',
    short: 'Stable Audio',
    maker: 'Stability AI',
    version: 'Stable Audio 3, in Small SFX, Small, Medium, and Large sizes',
    released: '20 May 2026',
    oneLiner: 'A sound-design toolkit first and a song model second, trained only on data it is allowed to use.',
    inSonura: true,
    specs: {
      length: 'Six minutes twenty on the medium and large models',
      vocals: 'Thin: this family is built for instrumentals, textures, and sound effects',
      stems: 'No stem export, but it edits and inpaints regions of an existing file',
      sonura: 'Yes, pick it in songs mode',
      download: 'WAV, from the API or straight off your own machine',
      training: 'Fully licensed data plus creative commons material',
      commercial: 'Yes, with an enterprise licence and legal indemnification above $1m revenue',
      weights: 'Open for the small and medium sizes',
      access: 'API, a laptop, or even a phone for the small model',
    },
  },

  elevenlabs: {
    slug: 'elevenlabs',
    name: 'ElevenLabs Music v2',
    short: 'ElevenLabs',
    maker: 'ElevenLabs',
    version: 'Music v2',
    released: 'May 2026',
    oneLiner: 'The licensing-first model, with a rights story built before the product shipped.',
    inSonura: true,
    specs: {
      length: 'Full songs',
      vocals: 'Yes',
      stems: 'No stem export, but you can inpaint a section or transition between genres',
      sonura: 'Yes, pick it in songs mode',
      download: 'Yes',
      training: 'Licensed through Merlin and Kobalt on a 50/50 royalty split',
      commercial: 'Yes, though self-serve plans carve out film, TV, and Studio Games',
      weights: 'Closed',
      access: 'Web app and api',
    },
  },

  lyria: {
    slug: 'lyria',
    name: 'Google Lyria 3.5',
    short: 'Lyria',
    maker: 'Google DeepMind',
    version: 'Lyria 3.5 in Flow Music, with Lyria 3 and Lyria 3 Pro on Vertex AI',
    released: '29 July 2026',
    oneLiner: 'The cloud-native option: strong structural control, wrapped in Google Cloud terms and a watermark.',
    inSonura: true,
    specs: {
      length: 'Three minutes on Lyria 3 Pro, thirty seconds on Lyria 3',
      vocals: 'Yes, with multi-vocal conditioning across eight languages',
      stems: 'No stem export',
      sonura: 'Yes, pick it in songs mode',
      download: 'Yes, through Vertex AI or Flow',
      training: 'Not disclosed in detail',
      commercial: 'Covered by Google Cloud terms rather than a music licence',
      weights: 'Closed',
      access: 'Vertex AI and Google Flow, so it suits products more than sessions',
    },
  },

  mureka: {
    slug: 'mureka',
    name: 'Mureka O2',
    short: 'Mureka',
    maker: 'Kunlun Tech',
    version: 'O2, with V7.5 still selectable',
    released: 'V7.5 July 2025, O2 current',
    oneLiner: 'Lyrics-first, and the most complete post-generation toolkit of the closed platforms.',
    inSonura: false,
    specs: {
      length: 'Full songs, with extend and region edit',
      vocals: 'Yes, plus voice cloning on paid plans',
      stems: 'Yes, 5-stem and 12-stem separation',
      sonura: 'No, it only runs inside Mureka',
      download: 'Audio and midi',
      training: 'Not disclosed',
      commercial: 'Paid plans',
      weights: 'Closed',
      access: 'Web app and API, with fine-tuning for a custom model',
    },
  },

  sonura: {
    slug: 'sonura',
    name: 'Sonura',
    short: 'Sonura',
    maker: 'Sonura',
    version: 'Sonura Studio',
    released: 'Continuously',
    oneLiner: 'Built the other way round: parts you can chop and own, not finished songs you can only play.',
    inSonura: true,
    specs: {
      length: 'One-shots, loops, and full tracks',
      vocals: 'Yes',
      stems: 'Split any track into stems, on every plan including free',
      sonura: 'This is Sonura',
      download: 'High quality downloads from Pro up',
      training: 'Trained on licensed music data rather than scraped catalogues',
      commercial: 'Exclusive rights on every paid plan, with no royalty splits; free output is public domain (CC0)',
      weights: 'Closed',
      access: 'Web, plus an AU and VST3 plugin for Ableton, Logic, and FL Studio',
    },
  },
};

/** Row order for every spec table. Labels are Metadata role (uppercase in CSS). */
export const SPEC_ROWS: { key: keyof ModelSpecs | 'version' | 'released'; label: string }[] = [
  { key: 'version', label: 'Current model' },
  { key: 'released', label: 'Shipped' },
  { key: 'length', label: 'Longest run' },
  { key: 'vocals', label: 'Vocals' },
  { key: 'stems', label: 'Stems' },
  { key: 'download', label: 'Files out' },
  { key: 'training', label: 'Training data' },
  { key: 'commercial', label: 'Commercial use' },
  { key: 'weights', label: 'Weights' },
  { key: 'access', label: 'Where it runs' },
  { key: 'sonura', label: 'Run it in Sonura' },
];

export function specValue(model: MusicModel, key: string): string {
  if (key === 'version') return model.version;
  if (key === 'released') return model.released;
  return model.specs[key as keyof ModelSpecs];
}

/** Every comparison page, in hub order. Used for the hub grid and the related rails. */
export const COMPARISONS: { slug: string; a: string; b: string; angle: string }[] = [
  { slug: 'suno-vs-udio', a: 'suno', b: 'udio', angle: 'The market leader against the licensed walled garden' },
  { slug: 'mureka-vs-suno', a: 'mureka', b: 'suno', angle: 'The deepest edit toolkit against the best vocals' },
  { slug: 'elevenlabs-vs-suno', a: 'elevenlabs', b: 'suno', angle: 'A clean rights story against the highest ceiling' },
  { slug: 'lyria-vs-suno', a: 'lyria', b: 'suno', angle: 'A cloud building block against a consumer studio' },
];

/* Human-readable form, shown in the hero and sources rows on /compare/ pages. */
export const LAST_VERIFIED = '19 August 2026';

/* Same date in ISO form for schema.org dateModified. Keep the two in step:
   structured data that disagrees with the visible date is a trust signal lost
   for no reason. */
export const LAST_VERIFIED_ISO = '2026-08-19';
