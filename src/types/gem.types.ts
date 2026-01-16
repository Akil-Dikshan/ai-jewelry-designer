// ===================================================================
// GEM TYPES - TypeScript Type Definitions
// ===================================================================

import type { GemTypeName } from '@/constants/gemTypes';
import type { GemCutId } from '@/constants/gemCuts';
import type { TransparencyValue, GemSizeValue } from '@/constants';

/**
 * Gem dimensions for advanced size input
 */
export interface GemDimensions {
    lengthMm: number | null;
    widthMm: number | null;
    heightMm: number | null;
}

/**
 * Gem size can be simple (small/medium/large) or advanced (exact dimensions)
 */
export interface GemSize {
    mode: 'simple' | 'advanced';
    simple: GemSizeValue | null;
    dimensions: GemDimensions | null;
    caratWeight: number | null;
}

/**
 * Complete gem data object
 */
export interface GemData {
    type: GemTypeName;
    customType?: string; // Used when type is "Other"
    cut: GemCutId;
    size: GemSize;
    color: string;
    customColor?: string; // Hex value when using custom color picker
    transparency: TransparencyValue;
    uploadedImageUrl?: string;
    uploadedImageBase64?: string;
}

/**
 * Default values for new gem data
 */
export const DEFAULT_GEM_DATA: Partial<GemData> = {
    size: {
        mode: 'simple',
        simple: null,
        dimensions: null,
        caratWeight: null,
    },
};
