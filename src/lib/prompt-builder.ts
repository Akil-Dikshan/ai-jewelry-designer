/**
 * Prompt Builder for Gemini API
 * Constructs optimized prompts for jewelry design generation
 */

import type { GemTypeName } from '@/constants/gemTypes';
import type { GemCutId } from '@/constants/gemCuts';
import type { TransparencyValue } from '@/constants/colors';

/**
 * Gem data for prompt construction
 */
export interface GemPromptData {
    type: GemTypeName | string;
    cut: GemCutId | string;
    size: string;
    color: string;
    transparency: TransparencyValue | string;
}

/**
 * Material preferences for prompt construction
 */
export interface MaterialPromptData {
    metals: string[];
    finish: string | null;
}

/**
 * Style modifiers based on user description
 */
const STYLE_MODIFIERS: Record<string, string[]> = {
    vintage: ['Art deco details', 'Filigree work', 'Antique styling', 'Classic elegance'],
    modern: ['Clean lines', 'Minimalist design', 'Contemporary styling', 'Sleek finish'],
    ornate: ['Intricate details', 'Embellishments', 'Decorative elements', 'Elaborate design'],
    minimalist: ['Simple elegance', 'Clean design', 'Understated beauty', 'Refined simplicity'],
    elegant: ['Sophisticated styling', 'Refined details', 'Graceful design', 'Luxurious finish'],
    bold: ['Statement piece', 'Eye-catching design', 'Dramatic styling', 'Impactful presence'],
};

/**
 * Quality keywords to ensure high-quality generation
 */
const QUALITY_KEYWORDS = [
    'Professional jewelry photography',
    'High-end jewelry render',
    'Photorealistic',
    'Studio lighting',
    'Sharp focus on gemstone',
    'Accurate light refraction and reflections',
    'Product photography quality',
    'White background',
    '8K resolution',
    'Detailed craftsmanship',
];

/**
 * Negative prompts to avoid common issues
 */
const NEGATIVE_PROMPTS = [
    'cartoon',
    'illustration',
    'sketch',
    'drawing',
    'blurry',
    'low quality',
    'amateur',
    'unrealistic',
    'fantasy',
    'impossible geometry',
    'distorted',
    'watermark',
    'text',
];

/**
 * Detect style keywords in user prompt
 */
function detectStyleModifiers(userPrompt: string): string[] {
    const lowerPrompt = userPrompt.toLowerCase();
    const detectedModifiers: string[] = [];

    for (const [style, modifiers] of Object.entries(STYLE_MODIFIERS)) {
        if (lowerPrompt.includes(style)) {
            detectedModifiers.push(...modifiers.slice(0, 2)); // Add top 2 modifiers
        }
    }

    return detectedModifiers;
}

/**
 * Build enhanced prompt for initial design generation
 */
export function buildGenerationPrompt(
    userPrompt: string,
    gemData: GemPromptData,
    materials: MaterialPromptData
): string {
    const styleModifiers = detectStyleModifiers(userPrompt);

    const metalString = materials.metals.length > 0
        ? materials.metals.join(' and ')
        : 'precious metal';

    const finishString = materials.finish || 'polished';

    const prompt = `
Create a ${QUALITY_KEYWORDS[0].toLowerCase()} of a jewelry piece:

USER VISION: ${userPrompt}

GEMSTONE SPECIFICATIONS:
- Gemstone Type: ${gemData.type}
- Cut Style: ${gemData.cut} cut
- Size: ${gemData.size}
- Color: ${gemData.color}
- Transparency: ${gemData.transparency}

MATERIALS:
- Metal: ${metalString}
- Finish: ${finishString} finish

STYLE REQUIREMENTS:
${styleModifiers.length > 0 ? styleModifiers.map(m => `- ${m}`).join('\n') : '- Elegant and timeless design'}

QUALITY STANDARDS:
${QUALITY_KEYWORDS.slice(1, 6).map(k => `- ${k}`).join('\n')}

IMPORTANT: Generate a single, cohesive jewelry design that incorporates ALL of the above specifications. 
The gemstone should be the focal point, properly set and secured, with accurate light behavior for its transparency level.
Render as a high-end product photo suitable for a luxury jewelry catalog.

DO NOT include: ${NEGATIVE_PROMPTS.slice(0, 5).join(', ')}
`.trim();

    return prompt;
}

/**
 * Build prompt for design refinement
 */
export function buildRefinementPrompt(
    refinementRequest: string,
    originalGemData: GemPromptData,
    preserveElements: string[] = [],
    styleGuidance?: string
): string {
    const preserveString = preserveElements.length > 0
        ? `\n\nPRESERVE THESE ELEMENTS:\n${preserveElements.map(e => `- ${e}`).join('\n')}`
        : '';

    const styleString = styleGuidance
        ? `\n\nSTYLE GUIDANCE: Make the design more ${styleGuidance}`
        : '';

    const prompt = `
REFINEMENT REQUEST: ${refinementRequest}

Based on the existing jewelry design, apply the requested modification while maintaining:
- The ${originalGemData.type} gemstone with ${originalGemData.cut} cut
- Overall professional jewelry photography quality
- Proper gemstone setting and proportions
- Accurate light refraction and reflections
${preserveString}
${styleString}

Render the refined design with:
- Same high-end product photography style
- White/neutral background
- Studio lighting
- Sharp focus
- Photorealistic quality

The refinement should be visible but the jewelry should remain a cohesive, wearable piece.
`.trim();

    return prompt;
}

/**
 * Build a simple prompt when user uploads a gem image
 */
export function buildImageReferencePrompt(
    userPrompt: string,
    materials: MaterialPromptData
): string {
    const metalString = materials.metals.length > 0
        ? materials.metals.join(' and ')
        : 'precious metal';

    return `
Using the gemstone shown in this image, create a jewelry design based on this description:

"${userPrompt}"

DESIGN REQUIREMENTS:
- Use the exact gemstone from the image
- Set it in ${metalString} with ${materials.finish || 'polished'} finish
- Create a ${detectStyleModifiers(userPrompt).join(', ') || 'elegant and refined'} design
- Render as professional jewelry photography
- White background, studio lighting, photorealistic quality

Generate a high-end jewelry product photo featuring this gemstone.
`.trim();
}
