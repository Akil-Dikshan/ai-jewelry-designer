// ===================================================================
// MATERIALS - Constants from PROMPT_2
// ===================================================================

export interface MetalOption {
    value: string;
    label: string;
}

export const METAL_TYPES: MetalOption[] = [
    { value: 'yellow-gold-10k', label: 'Yellow Gold (10K)' },
    { value: 'yellow-gold-14k', label: 'Yellow Gold (14K)' },
    { value: 'yellow-gold-18k', label: 'Yellow Gold (18K)' },
    { value: 'white-gold', label: 'White Gold' },
    { value: 'rose-gold', label: 'Rose Gold' },
    { value: 'platinum', label: 'Platinum' },
    { value: 'sterling-silver', label: 'Sterling Silver' },
    { value: 'fine-silver', label: 'Fine Silver' },
    { value: 'mixed-metals', label: 'Mixed Metals' },
];

export const METAL_FINISHES = [
    { value: 'polished', label: 'Polished', description: 'Shiny, mirror-like finish' },
    { value: 'matte', label: 'Matte', description: 'Brushed, non-reflective finish' },
    { value: 'hammered', label: 'Hammered', description: 'Textured, artisan finish' },
    { value: 'mixed', label: 'Mixed Finish', description: 'Combination of finishes' },
] as const;

export type MetalFinish = (typeof METAL_FINISHES)[number]['value'];

export const GEM_SIZES = [
    { value: 'small', label: 'Small', description: 'Under 5mm - Perfect for delicate designs' },
    { value: 'medium', label: 'Medium', description: '5-8mm - Most popular size' },
    { value: 'large', label: 'Large', description: 'Over 8mm - Statement piece' },
] as const;

export type GemSizeValue = (typeof GEM_SIZES)[number]['value'];
