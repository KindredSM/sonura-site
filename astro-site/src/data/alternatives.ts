/**
 * Ranked-list data for the /alternatives/ pages.
 *
 * ONE source of truth, layered on music-models.ts: the hard specs (stems, files
 * out, commercial use, training data) are pulled from MODELS so a model update
 * lands here at the same time it lands on /compare/. Only the editorial fields
 * (verdict, best for, skip it if, pricing shape) live in this file.
 *
 * Two rules that keep these pages citable, per DESIGN-SYSTEM.md §5 and the
 * honesty rules the /compare/ pages already follow:
 *
 *  1. Every entry carries a "skip it if", Sonura's included. A ranked list where
 *     the house pick has no downside is an advert, and reads like one.
 *  2. Pricing is stated as a SHAPE ("free tier, then paid plans"), never as a
 *     figure we cannot source. Competitor pricing moves constantly and a stale
 *     number is the fastest way to lose the reader. Link their pricing page and
 *     let it be current.
 */

import { MODELS, type MusicModel, LAST_VERIFIED } from './music-models';

export { LAST_VERIFIED };

export interface AlternativeEntry {
  /** key into MODELS: where every hard spec on this entry comes from */
  model: string;
  /** the product's own site, so the reader can check us */
  href: string;
  /** one line, the whole argument for this entry */
  verdict: string;
  bestFor: string;
  /** required on every entry, Sonura's included */
  skipIf: string;
  /** shape only, never a figure we cannot source */
  pricing: string;
  /** set on our own entry: links internally and gets the house styling */
  isSonura?: boolean;
}

export interface ResolvedAlternative extends AlternativeEntry {
  rank: number;
  name: string;
  short: string;
  stems: string;
  filesOut: string;
  commercial: string;
  training: string;
}

/** Pulls the hard specs off MODELS so they cannot drift from the comparison pages. */
export function resolveAlternatives(entries: AlternativeEntry[]): ResolvedAlternative[] {
  return entries.map((entry, i) => {
    const model: MusicModel | undefined = MODELS[entry.model];
    if (!model) throw new Error(`alternatives.ts: no MODELS entry for "${entry.model}"`);
    return {
      ...entry,
      rank: i + 1,
      name: model.name,
      short: model.short,
      stems: model.specs.stems,
      filesOut: model.specs.download,
      commercial: model.specs.commercial,
      training: model.specs.training,
    };
  });
}

/**
 * How the ranking was decided, stated before the ranking is justified.
 * If a criterion is not checkable by the reader, it does not belong here.
 */
export const CRITERIA = [
  'Whether the file can leave: downloads, stems, and formats out',
  'What the licence actually lets you do with the result',
  'Whether the output drops into a session, or ends as a finished mix',
];

/**
 * Suno alternatives, ranked. Order follows CRITERIA above, which is why Udio
 * sits last despite having the best licensing story of any of them: export is
 * switched off, so it scores zero on the first criterion today.
 */
export const SUNO_ALTERNATIVES: AlternativeEntry[] = [
  {
    model: 'sonura',
    href: '/',
    isSonura: true,
    verdict: 'The only one here that hands back editable parts instead of a finished mix.',
    bestFor: 'producers who want stems, loops, and one-shots to finish in a DAW, and who want them on the free tier too.',
    skipIf: 'You want a finished song to sit back and listen to. Sonura returns parts, and putting them together is your job.',
    pricing: 'free to start with no card. free output is CC0; paid plans carry exclusive rights with no royalty splits.',
  },
  {
    model: 'mureka',
    href: 'https://www.mureka.ai/',
    verdict: 'The most complete post-generation toolkit of the closed platforms.',
    bestFor: 'lyrics-first writing, and getting stems back out of a song platform: it does 5-stem and 12-stem separation, plus extend and region edit.',
    skipIf: 'Training provenance matters to your work. Kunlun Tech has not disclosed what the model learned from.',
    pricing: 'paid plans. check their current pricing.',
  },
  {
    model: 'elevenlabs',
    href: 'https://elevenlabs.io/music',
    verdict: 'The licensing-first model, with a rights story built before the product shipped.',
    bestFor: 'commercial work where provenance has to hold up: licensed through Merlin and Kobalt on a 50/50 royalty split.',
    skipIf: 'You need stems, or the work is film, tv, or games. Self-serve plans carve those out.',
    pricing: 'subscription with a free tier. check their current pricing.',
  },
  {
    model: 'minimax',
    href: 'https://www.minimax.io/',
    verdict: 'The newest open-weights song model, and the first you can run end to end on your own hardware.',
    bestFor: 'anyone who wants the weights: it runs on your own GPU, does up to five minutes in one pass, and has an instrumental-only mode.',
    skipIf: 'You need stems, or you would rather not read a licence closely. It ships under a custom community licence.',
    pricing: 'hosted api, or free on your own GPU. weights published on Hugging Face.',
  },
  {
    model: 'stable-audio',
    href: 'https://stableaudio.com/',
    verdict: 'A sound-design toolkit first and a song model second, trained only on data it is allowed to use.',
    bestFor: 'instrumentals, textures, and sound effects, with the cleanest training provenance of anything on this page: licensed data plus creative commons.',
    skipIf: 'You want vocals. This family is deliberately thin there.',
    pricing: 'api, plus open weights for the small and medium sizes. enterprise licence with indemnification above $1m revenue.',
  },
  {
    model: 'lyria',
    href: 'https://deepmind.google/models/lyria/',
    verdict: 'The cloud-native option: strong structural control, wrapped in Google Cloud terms and a watermark.',
    bestFor: 'building a product on top of a music model rather than working in a session. multi-vocal conditioning across eight languages.',
    skipIf: 'You want a tool to sit in front of. It lives in Vertex AI and Google Flow, and output carries a watermark.',
    pricing: 'google cloud pricing through Vertex AI. check their current pricing.',
  },
  {
    model: 'udio',
    href: 'https://www.udio.com/',
    verdict: 'The cleanest licensing story in the category, on a platform you currently cannot export from.',
    bestFor: 'hearing what fully licensed training data sounds like. Universal, Warner, Merlin, and Kobalt, opt-in for the artists and songwriters at each.',
    skipIf: 'You need to keep what you make. Audio, stem, and video download are all switched off during the UMG transition.',
    pricing: 'paid plans, and only inside the platform.',
  },
];
