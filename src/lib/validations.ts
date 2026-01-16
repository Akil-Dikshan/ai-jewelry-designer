import { z } from 'zod';
import { GEM_TYPES } from '@/constants/gemTypes';
import { GEM_CUTS } from '@/constants/gemCuts';
import { GEM_TRANSPARENCY } from '@/constants/colors';
import { GEM_SIZES } from '@/constants/materials';
import { METAL_FINISHES } from '@/constants/materials';

/**
 * Gem Data Validation Schema
 */
export const gemDataSchema = z.object({
    type: z.enum(GEM_TYPES as unknown as [string, ...string[]]),
    customType: z.string().max(50).optional(),
    cut: z.enum(GEM_CUTS.map((c) => c.id) as unknown as [string, ...string[]]),
    size: z.object({
        mode: z.enum(['simple', 'advanced']),
        simple: z.enum(GEM_SIZES.map((s) => s.value) as unknown as [string, ...string[]]).nullable(),
        dimensions: z
            .object({
                lengthMm: z.number().min(0.1).max(100).nullable(),
                widthMm: z.number().min(0.1).max(100).nullable(),
                heightMm: z.number().min(0.1).max(100).nullable(),
            })
            .nullable(),
        caratWeight: z.number().min(0.01).max(100).nullable(),
    }),
    color: z.string().min(1, 'Color is required'),
    customColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    transparency: z.enum(
        GEM_TRANSPARENCY.map((t) => t.value) as unknown as [string, ...string[]]
    ),
    uploadedImageUrl: z.string().url().optional().or(z.literal('')),
});

/**
 * Material Preferences Schema
 */
export const materialPreferencesSchema = z.object({
    metals: z.array(z.string()).default([]),
    finish: z.enum(METAL_FINISHES.map((f) => f.value) as unknown as [string, ...string[]]).nullable(),
});

/**
 * Design Prompt Schema
 */
export const designPromptSchema = z
    .string()
    .min(10, 'Please describe your design (at least 10 characters)')
    .max(1000, 'Description too long (maximum 1000 characters)');

/**
 * Number of Variations Schema
 */
export const numVariationsSchema = z.union([z.literal(2), z.literal(3), z.literal(4)]);

/**
 * Complete Design Form Schema
 */
export const designFormSchema = z.object({
    gemData: gemDataSchema,
    prompt: designPromptSchema,
    materials: materialPreferencesSchema,
    numVariations: numVariationsSchema,
});

export type DesignFormSchemaType = z.infer<typeof designFormSchema>;
