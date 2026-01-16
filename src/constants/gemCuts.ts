// ===================================================================
// GEM CUTS - Constants from PROMPT_2
// ===================================================================

export interface GemCutOption {
    id: string;
    name: string;
    description?: string;
}

export const GEM_CUTS: GemCutOption[] = [
    { id: 'round-brilliant', name: 'Round Brilliant', description: 'Classic round shape with maximum brilliance' },
    { id: 'oval', name: 'Oval', description: 'Elegant elongated shape' },
    { id: 'cushion', name: 'Cushion', description: 'Soft rounded corners with pillow-like shape' },
    { id: 'pear', name: 'Pear', description: 'Teardrop shape combining round and marquise' },
    { id: 'emerald', name: 'Emerald Cut', description: 'Rectangular with step-cut facets' },
    { id: 'marquise', name: 'Marquise', description: 'Football-shaped with pointed ends' },
    { id: 'asscher', name: 'Asscher', description: 'Square with step-cut facets' },
    { id: 'princess', name: 'Princess', description: 'Square brilliant cut' },
    { id: 'radiant', name: 'Radiant', description: 'Rectangular with brilliant-cut facets' },
    { id: 'heart', name: 'Heart', description: 'Romantic heart shape' },
] as const;

export type GemCutId = (typeof GEM_CUTS)[number]['id'];
