/**
 * Canonical spec sheet for the music models compared under /compare/.
 *
 * ONE source of truth: every comparison page renders its spec table from these
 * records, so a model update lands on every comparison page at once. Keep every value
 * verifiable from a public source, and keep the voice rules from
 * DESIGN-SYSTEM.md §5 (prose is lowercase, no em dashes, no "AI" in headings).
 *
 * Last verified against public sources: 18 August 2026.
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
  /** one lowercase sentence, used on the hub and in ledes */
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
    version: 'v5.5',
    released: '26 March 2026',
    oneLiner: 'the market leader, and the one most released tracks actually come from.',
    inSonura: false,
    specs: {
      length: 'full songs, extendable in the app',
      vocals: 'yes, plus Voices for a reusable voice and custom models trained on your own catalogue',
      stems: 'up to 12 stems, but only inside Suno Studio on the top plan',
      sonura: 'no, it only runs inside Suno',
      download: 'wav, per-clip wav, and midi out of Studio',
      training: 'a licensing deal with Warner Music, with other label litigation still unresolved',
      commercial: 'paid plans only',
      weights: 'closed',
      access: 'web and mobile app',
    },
  },

  udio: {
    slug: 'udio',
    name: 'Udio',
    short: 'Udio',
    maker: 'Udio',
    version: 'post-settlement platform, in transition',
    released: 'UMG settlement October 2025, relaunch still pending',
    oneLiner: 'the cleanest licensing story in the space, on a platform you currently cannot export from.',
    inSonura: false,
    specs: {
      length: 'full songs',
      vocals: 'yes',
      stems: 'stem download is switched off during the transition',
      sonura: 'no, it only runs inside Udio',
      download: 'switched off: audio, stems, and video export are all disabled',
      training: 'licensed through Universal Music Group, Warner Music, Merlin, and Kobalt, with a royalty pool for artists',
      commercial: 'paid plans, and only inside the platform',
      weights: 'closed',
      access: 'web, as a closed platform you create and keep tracks inside',
    },
  },

  minimax: {
    slug: 'minimax',
    name: 'MiniMax Music 3.0',
    short: 'MiniMax',
    maker: 'MiniMax',
    version: 'Music 3.0 (MiniMax-Music3)',
    released: '17 August 2026',
    oneLiner: 'the newest open-weights song model, and the first you can run on your own hardware end to end.',
    inSonura: true,
    specs: {
      length: 'up to five minutes in a single pass',
      vocals: 'yes, with an instrumental-only mode and named instrument and technique control',
      stems: 'no stem export, it returns a finished mix',
      sonura: 'yes, pick it in songs mode',
      download: '32 kHz 16-bit stereo wav',
      training: 'not disclosed',
      commercial: 'governed by a custom community licence, so read it against your use',
      weights: 'open, published on hugging face',
      access: 'hosted api, or your own gpu',
    },
  },

  'stable-audio': {
    slug: 'stable-audio',
    name: 'Stable Audio 3',
    short: 'Stable Audio',
    maker: 'Stability AI',
    version: 'Stable Audio 3, in Small SFX, Small, Medium, and Large sizes',
    released: '20 May 2026',
    oneLiner: 'a sound-design toolkit first and a song model second, trained only on data it is allowed to use.',
    inSonura: true,
    specs: {
      length: 'six minutes twenty on the medium and large models',
      vocals: 'thin: this family is built for instrumentals, textures, and sound effects',
      stems: 'no stem export, but it edits and inpaints regions of an existing file',
      sonura: 'yes, pick it in songs mode',
      download: 'wav, from the api or straight off your own machine',
      training: 'fully licensed data plus creative commons material',
      commercial: 'yes, with an enterprise licence and legal indemnification above $1m revenue',
      weights: 'open for the small and medium sizes',
      access: 'api, a laptop, or even a phone for the small model',
    },
  },

  elevenlabs: {
    slug: 'elevenlabs',
    name: 'ElevenLabs Music v2',
    short: 'ElevenLabs',
    maker: 'ElevenLabs',
    version: 'Music v2',
    released: 'May 2026',
    oneLiner: 'the licensing-first model, with a rights story built before the product shipped.',
    inSonura: true,
    specs: {
      length: 'full songs',
      vocals: 'yes',
      stems: 'no stem export, but you can inpaint a section or transition between genres',
      sonura: 'yes, pick it in songs mode',
      download: 'yes',
      training: 'licensed through Merlin and Kobalt on a 50/50 royalty split',
      commercial: 'yes, though self-serve plans carve out film, tv, and Studio Games',
      weights: 'closed',
      access: 'web app and api',
    },
  },

  lyria: {
    slug: 'lyria',
    name: 'Google Lyria 3.5',
    short: 'Lyria',
    maker: 'Google DeepMind',
    version: 'Lyria 3.5 in Flow Music, with Lyria 3 and Lyria 3 Pro on Vertex AI',
    released: '29 July 2026',
    oneLiner: 'the cloud-native option: strong structural control, wrapped in google cloud terms and a watermark.',
    inSonura: true,
    specs: {
      length: 'three minutes on Lyria 3 Pro, thirty seconds on Lyria 3',
      vocals: 'yes, with multi-vocal conditioning across eight languages',
      stems: 'no stem export',
      sonura: 'yes, pick it in songs mode',
      download: 'yes, through Vertex AI or Flow',
      training: 'not disclosed in detail',
      commercial: 'covered by google cloud terms rather than a music licence',
      weights: 'closed',
      access: 'Vertex AI and Google Flow, so it suits products more than sessions',
    },
  },

  riffusion: {
    slug: 'riffusion',
    name: 'Riffusion FUZZ',
    short: 'Riffusion',
    maker: 'Riffusion',
    version: 'FUZZ',
    released: 'public beta 2025, still free through 2026',
    oneLiner: 'the one that stayed free while everyone else tightened the free tier.',
    inSonura: false,
    specs: {
      length: 'around three minutes',
      vocals: 'yes, full songs with lyrics rather than clips',
      stems: 'no stem export',
      sonura: 'no, it only runs inside Riffusion',
      download: 'mp3',
      training: 'not disclosed',
      commercial: 'read the current terms before you release anything',
      weights: 'closed',
      access: 'web, free for as long as the gpus hold up',
    },
  },

  mureka: {
    slug: 'mureka',
    name: 'Mureka O2',
    short: 'Mureka',
    maker: 'Kunlun Tech',
    version: 'O2, with V7.5 still selectable',
    released: 'V7.5 July 2025, O2 current',
    oneLiner: 'lyrics-first, and the most complete post-generation toolkit of the closed platforms.',
    inSonura: false,
    specs: {
      length: 'full songs, with extend and region edit',
      vocals: 'yes, plus voice cloning on paid plans',
      stems: 'yes, 5-stem and 12-stem separation',
      sonura: 'no, it only runs inside Mureka',
      download: 'audio and midi',
      training: 'not disclosed',
      commercial: 'paid plans',
      weights: 'closed',
      access: 'web app and api, with fine-tuning for a custom model',
    },
  },

  sonura: {
    slug: 'sonura',
    name: 'Sonura',
    short: 'Sonura',
    maker: 'Sonura',
    version: 'Sonura Studio',
    released: 'continuously',
    oneLiner: 'built the other way round: parts you can chop and own, not finished songs you can only play.',
    inSonura: true,
    specs: {
      length: 'one-shots, loops, and full tracks',
      vocals: 'yes',
      stems: 'split any track into stems, on every plan including free',
      sonura: 'this is Sonura',
      download: 'high quality downloads from Pro up',
      training: 'licensed, commercially cleared music technology rather than scraped catalogues',
      commercial: 'exclusive rights on every paid plan, with no royalty splits; free output is public domain (CC0)',
      weights: 'closed',
      access: 'web, plus an AU and VST3 plugin for Ableton, Logic, and FL Studio',
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
  { slug: 'suno-vs-udio', a: 'suno', b: 'udio', angle: 'the market leader against the licensed walled garden' },
  { slug: 'mureka-vs-suno', a: 'mureka', b: 'suno', angle: 'the deepest edit toolkit against the best vocals' },
  { slug: 'elevenlabs-vs-suno', a: 'elevenlabs', b: 'suno', angle: 'a clean rights story against the highest ceiling' },
  { slug: 'riffusion-vs-suno', a: 'riffusion', b: 'suno', angle: 'free and generous against paid and polished' },
  { slug: 'lyria-vs-suno', a: 'lyria', b: 'suno', angle: 'a cloud building block against a consumer studio' },
];

export const LAST_VERIFIED = '18 August 2026';
