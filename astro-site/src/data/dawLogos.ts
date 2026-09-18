// The DAWs the plugin runs in. Mirrors the onboarding install screen in the
// app (frontend/src/components/onboarding/dawLogos.ts), same marks, same
// order, so the site and the product show one set.
export interface DawLogo {
  name: string;
  src: string;
  // a flat single-colour mark is rendered white; originals keep their colours
  mono?: boolean;
}

export const DAW_LOGOS: DawLogo[] = [
  { name: 'Ableton Live', src: '/images/daws/ableton.svg', mono: true },
  { name: 'FL Studio', src: '/images/daws/fl_studio.png' },
  { name: 'Logic Pro', src: '/images/daws/logic.png' },
  { name: 'Pro Tools', src: '/images/daws/pro_tools.svg' },
  { name: 'Cubase', src: '/images/daws/cubase.svg' },
  { name: 'Reaper', src: '/images/daws/reaper.svg' },
  { name: 'Bitwig Studio', src: '/images/daws/bitwig.svg' },
  { name: 'GarageBand', src: '/images/daws/garageband.png' },
];
