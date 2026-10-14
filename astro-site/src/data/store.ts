export interface Variant {
  size: string;
  sku: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  cat: string;
  name: string;
  format: string;
  price: number;
  images: { src: string; alt: string }[];
  specs: Spec[];
  variants: Variant[];
}

export const RUN = 'Run 001';

export const products: Product[] = [
  {
    id: 'prompt-tee',
    cat: 'SNR001',
    name: 'T-shirt: Prompt',
    format: 'Tee / Black',
    price: 25,
    images: [
      { src: '/images/store/snr001-tee-back', alt: 'Black Sonura tee, back print reading make a kick that sets off car alarms' },
      { src: '/images/store/snr001-tee-front', alt: 'Black Sonura tee, front with SONURA on the chest' },
    ],
    specs: [
      { label: 'Front', value: 'SONURA' },
      { label: 'Back', value: 'make a kick that sets off car alarms' },
      { label: 'Sleeve', value: 'Produced in London' },
      { label: 'Fit', value: 'Oversized' },
    ],
    variants: [
      { size: 'S', sku: 'SNR001-S' },
      { size: 'M', sku: 'SNR001-M' },
      { size: 'L', sku: 'SNR001-L' },
      { size: 'XL', sku: 'SNR001-XL' },
      { size: 'XXL', sku: 'SNR001-XXL' },
    ],
  },
  {
    id: 'final-v7-cap',
    cat: 'SNR002',
    name: 'Cap: final_v7.wav',
    format: 'Cap / Black',
    price: 15,
    images: [
      { src: '/images/store/snr002-cap', alt: 'Black dad cap embroidered with final_v7.wav' },
    ],
    specs: [
      { label: 'Front', value: 'final_v7.wav' },
      { label: 'Finish', value: 'Embroidered' },
      { label: 'Size', value: 'One size' },
    ],
    variants: [{ size: 'One size', sku: 'SNR002' }],
  },
];
