// ===================================================================
// DESIGN TYPES - TypeScript Type Definitions for Designs
// ===================================================================

import type { GemData } from './gem.types';
import type { MaterialPreferences } from './form.types';
import type { GeneratedImage } from './api.types';

/**
 * Refinement history entry
 */
export interface RefinementEntry {
    refinementId: string;
    prompt: string;
    baseImageId: string;
    refinedImageUrl: string;
    refinedThumbnailUrl?: string;
    refinementStrength: number;
    preserveElements: string[];
    refinedAt: Date;
}

/**
 * Share settings for a design
 */
export interface ShareSettings {
    isShared: boolean;
    shareToken: string | null;
    passwordProtected: boolean;
    expiresAt: Date | null;
    viewCount: number;
}

/**
 * Current version reference
 */
export interface CurrentVersion {
    type: 'original' | 'refinement';
    imageId: string;
}

/**
 * Complete design object (from database)
 */
export interface Design {
    id: string;
    userId: string | null;
    gemData: GemData;
    originalPrompt: string;
    materialPreferences: MaterialPreferences;
    numVariationsRequested: number;
    generatedImages: GeneratedImage[];
    selectedImageId: string | null;
    refinements: RefinementEntry[];
    currentVersion: CurrentVersion;
    folderId: string | null;
    isFavorite: boolean;
    isDeleted: boolean;
    shareSettings: ShareSettings;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Design summary for list display
 */
export interface DesignSummary {
    id: string;
    thumbnailUrl: string;
    gemType: string;
    gemCut: string;
    createdAt: Date;
    refinementCount: number;
    isFavorite: boolean;
}
