export const SITE_URL = 'https://sonurastudio.com';

const LOOP_CREDIT_COST = 2;
const ONESHOT_CREDIT_COST = 1;
const FULL_TRACK_CREDIT_COST = 5;

export interface Plan {
  name: 'Free' | 'Starter' | 'Pro' | 'Max';
  monthlyPrice: number;
  annualMonthlyPrice: number;
  credits: number;
  perks: string;
}

export const PLANS: Plan[] = [
  { name: 'Free', monthlyPrice: 0, annualMonthlyPrice: 0, credits: 20, perks: 'No credit card. Credits on signup plus daily free credits. Creations are public domain (CC0).' },
  { name: 'Starter', monthlyPrice: 10, annualMonthlyPrice: 8, credits: 400, perks: 'Creations are exclusively yours. High-quality downloads.' },
  { name: 'Pro', monthlyPrice: 20, annualMonthlyPrice: 15, credits: 1000, perks: 'Everything in Starter, priority 24/7 support, early access to new features. Most popular plan.' },
  { name: 'Max', monthlyPrice: 45, annualMonthlyPrice: 35, credits: 2500, perks: 'Everything in Pro, one-to-one support calls, custom feature requests.' },
];

export function creations(credits: number) {
  return {
    loops: Math.floor(credits / LOOP_CREDIT_COST),
    oneShots: Math.floor(credits / ONESHOT_CREDIT_COST),
    fullTracks: Math.floor(credits / FULL_TRACK_CREDIT_COST),
  };
}

export function planAllowance(plan: Plan): string {
  const c = creations(plan.credits);
  const n = (value: number) => value.toLocaleString('en-US');
  const period = plan.name === 'Free' ? '' : '/month';
  return `${n(plan.credits)} creation credits${period}: around ${n(c.loops)} 4-bar loops, ${n(c.oneShots)} one-shots and fx, or up to ${n(c.fullTracks)} full tracks`;
}

export const RIGHTS = {
  summary: 'Free-plan creations are released as public domain (CC0), so you can use them commercially but they are not exclusively yours. Every paid plan makes your creations exclusively yours. No royalty splits on any plan.',
  commercial: 'Yes. Everything you create can be used in commercial releases, sync, streaming and client work with no royalties or attribution. On the free plan creations are public domain (CC0). On any paid plan they are exclusively yours.',
};

export const PLUGIN = {
  name: 'Sonura Flow',
  url: `${SITE_URL}/plugin/`,
  formats: ['VST3', 'AU'],
  mac: 'macOS 12 Monterey or later, Apple Silicon or Intel',
  windows: 'Windows 10 or 11, 64-bit',
  daws: ['Ableton Live', 'Logic Pro', 'FL Studio', 'Studio One', 'Bitwig Studio', 'Cubase', 'Reaper', 'GarageBand', 'Nuendo'],
  price: 'Free to download, starts with free credits. Creations use Sonura account credits.',
  creates: 'Drums, one-shots, melodic loops, basslines, vocal chops, hooks and ad-libs, FX and textures, in any key and BPM',
};

export const ORG_ID = `${SITE_URL}/about/#organization`;
