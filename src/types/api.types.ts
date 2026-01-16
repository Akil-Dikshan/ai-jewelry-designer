// ===================================================================
// API TYPES - TypeScript Type Definitions for API
// ===================================================================

import type { GemData } from './gem.types';
import type { MaterialPreferences } from './form.types';

/**
 * Request body for /api/generate-design
 */
export interface GenerateDesignRequest {
    gemData: {
        type: string;
        cut: string;
        size: string | object;
        color: string;
        transparency: string;
        imageBase64: string | null;
    };
    userPrompt: string;
    materials: {
        metals: string[];
        finish: string | null;
    };
    numVariations: number;
}

/**
 * Single generated image
 */
export interface GeneratedImage {
    imageId: string;
    imageUrl: string;
    thumbnailUrl?: string;
}

/**
 * Response from /api/generate-design
 */
export interface GenerateDesignResponse {
    success: boolean;
    designId: string;
    images: GeneratedImage[];
    metadata: {
        generationTime: number;
        cost: number;
    };
}

/**
 * Request body for /api/refine-design
 */
export interface RefineDesignRequest {
    designId: string;
    selectedImageUrl: string;
    refinementPrompt: string;
    refinementStrength: number;
    preserveElements: string[];
}

/**
 * Response from /api/refine-design
 */
export interface RefineDesignResponse {
    success: boolean;
    refinedImageUrl: string;
    versionNumber: number;
}

/**
 * API Error response
 */
export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
    };
}
