// ===================================================================
// GEM COLORS - Constants from PROMPT_2
// ===================================================================

export interface GemColorOption {
    value: string;
    label: string;
    hex?: string;
}

export const GEM_COLORS: GemColorOption[] = [
    { value: 'colorless', label: 'Colorless/White', hex: '#FFFFFF' },
    { value: 'blue-light', label: 'Light Blue', hex: '#87CEEB' },
    { value: 'blue-medium', label: 'Medium Blue', hex: '#4169E1' },
    { value: 'blue-dark', label: 'Dark Blue', hex: '#0F52BA' },
    { value: 'red-light', label: 'Light Red', hex: '#FF6B6B' },
    { value: 'red-medium', label: 'Medium Red', hex: '#DC143C' },
    { value: 'red-dark', label: 'Dark Red', hex: '#8B0000' },
    { value: 'green-light', label: 'Light Green', hex: '#90EE90' },
    { value: 'green-medium', label: 'Medium Green', hex: '#228B22' },
    { value: 'green-dark', label: 'Dark Green', hex: '#046307' },
    { value: 'yellow', label: 'Yellow/Golden', hex: '#FFD700' },
    { value: 'pink', label: 'Pink/Rose', hex: '#FF69B4' },
    { value: 'purple', label: 'Purple/Violet', hex: '#8B008B' },
    { value: 'orange', label: 'Orange', hex: '#FF8C00' },
    { value: 'black', label: 'Black', hex: '#1A1A1A' },
    { value: 'multi', label: 'Multi-color', hex: undefined },
    { value: 'custom', label: 'Custom Color', hex: undefined },
];

export const GEM_TRANSPARENCY = [
    { value: 'transparent', label: 'Transparent', description: 'Clear, see-through' },
    { value: 'semi-transparent', label: 'Semi-transparent', description: 'Slightly cloudy' },
    { value: 'opaque', label: 'Opaque', description: 'Solid, no transparency' },
] as const;

export type TransparencyValue = (typeof GEM_TRANSPARENCY)[number]['value'];
