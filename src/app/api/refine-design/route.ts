import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';
import { generateImages, withRetry } from '@/lib/gemini';
import { uploadBase64Image, downloadImageAsBase64 } from '@/lib/firebase-storage';
import { buildRefinementPrompt, type GemPromptData } from '@/lib/prompt-builder';
import { checkRateLimit, incrementRateLimit, getRateLimitHeaders, getClientIP } from '@/lib/rate-limit';

// Check if we're using real API or mock mode
const USE_MOCK = process.env.USE_MOCK_API === 'true' || !process.env.GEMINI_API_KEY;

// Mock images for development when API is not configured
const MOCK_REFINED_IMAGES = [
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Refined+Design+A',
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Refined+Design+B',
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Refined+Design+C',
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Refined+Design+D',
];

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        // Rate limiting
        const clientIP = getClientIP(request.headers);
        const rateLimitResult = checkRateLimit('refinement', clientIP);

        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'RATE_LIMIT_EXCEEDED',
                        message: 'You have exceeded the refinement limit. Please try again later.',
                    },
                },
                {
                    status: 429,
                    headers: getRateLimitHeaders('refinement', clientIP),
                }
            );
        }

        const body = await request.json();

        // Validate required fields
        const {
            imageId,
            imageUrl,
            refinementPrompt,
            advancedOptions,
            gemData
        } = body;

        if (!imageId && !imageUrl) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'INVALID_INPUT',
                        message: 'Image ID or URL is required',
                    },
                },
                { status: 400 }
            );
        }

        if (!refinementPrompt || refinementPrompt.length < 3) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'INVALID_INPUT',
                        message: 'Refinement prompt must be at least 3 characters',
                    },
                },
                { status: 400 }
            );
        }

        if (refinementPrompt.length > 300) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'INVALID_INPUT',
                        message: 'Refinement prompt must not exceed 300 characters',
                    },
                },
                { status: 400 }
            );
        }

        // Extract advanced options
        const strength = advancedOptions?.strength ?? 3;
        const preserveElements: string[] = [];
        if (advancedOptions?.preserveGemSize) preserveElements.push('gemstone size');
        if (advancedOptions?.preserveShape) preserveElements.push('overall shape');
        if (advancedOptions?.preserveMetalType) preserveElements.push('metal type');
        const styleGuidance = advancedOptions?.styleGuidance;

        // Log the refinement request
        console.log('Refinement request:', {
            imageId,
            prompt: refinementPrompt.substring(0, 50) + (refinementPrompt.length > 50 ? '...' : ''),
            strength,
            preserveElements,
            styleGuidance,
        });

        let resultImageUrl: string;
        let resultImageId: string;

        if (USE_MOCK) {
            // Mock mode - simulate delay and return placeholder image
            console.log('Using mock mode - Gemini API not configured');
            const delay = 3000 + Math.random() * 2000;
            await new Promise((resolve) => setTimeout(resolve, delay));

            resultImageUrl = MOCK_REFINED_IMAGES[Math.floor(Math.random() * MOCK_REFINED_IMAGES.length)];
            resultImageId = `mock-refined-${generateId()}`;
        } else {
            // Real Gemini API mode
            try {
                // Download the base image
                let baseImageBase64: string;

                if (imageUrl && !imageUrl.includes('placehold.co')) {
                    // Download from URL
                    baseImageBase64 = await downloadImageAsBase64(imageUrl);
                } else {
                    // Can't refine placeholder images with real API
                    throw new Error('Cannot refine placeholder images');
                }

                // Prepare gem data for prompt (use provided or defaults)
                const gemPromptData: GemPromptData = gemData || {
                    type: 'gemstone',
                    cut: 'brilliant',
                    size: 'medium',
                    color: 'natural',
                    transparency: 'transparent',
                };

                // Build the refinement prompt
                const prompt = buildRefinementPrompt(
                    refinementPrompt,
                    gemPromptData,
                    preserveElements,
                    styleGuidance
                );

                // Add strength modifier to prompt
                const strengthModifier = strength <= 2
                    ? 'Make subtle, minor adjustments only.'
                    : strength >= 4
                        ? 'Make significant, noticeable changes.'
                        : 'Make moderate adjustments.';

                const fullPrompt = `${prompt}\n\n${strengthModifier}`;

                // Generate refined image
                const result = await withRetry(
                    () => generateImages({
                        prompt: fullPrompt,
                        referenceImage: baseImageBase64,
                    }),
                    2,
                    2000
                );

                if (result.length === 0) {
                    throw new Error('No refined image generated');
                }

                // Upload to Firebase Storage
                resultImageUrl = await uploadBase64Image(
                    result[0].base64,
                    result[0].mimeType,
                    'refined'
                );
                resultImageId = `refined-${generateId()}`;

            } catch (apiError) {
                console.error('Gemini refinement error:', apiError);

                // Fall back to mock on API failure
                console.log('Falling back to mock refined image due to API error');
                await new Promise((resolve) => setTimeout(resolve, 1000));

                resultImageUrl = MOCK_REFINED_IMAGES[Math.floor(Math.random() * MOCK_REFINED_IMAGES.length)];
                resultImageId = `fallback-refined-${generateId()}`;
            }
        }

        // Increment rate limit counter
        incrementRateLimit('refinement', clientIP);

        const generationTime = (Date.now() - startTime) / 1000;

        return NextResponse.json(
            {
                success: true,
                refinementId: resultImageId,
                imageId: resultImageId,
                imageUrl: resultImageUrl,
                thumbnailUrl: resultImageUrl,
                metadata: {
                    generationTime,
                    promptUsed: refinementPrompt,
                    appliedOptions: {
                        strength,
                        preserveElements,
                        styleGuidance,
                    },
                    model: USE_MOCK ? 'mock' : 'gemini-2.5-flash-image',
                },
            },
            { headers: getRateLimitHeaders('refinement', clientIP) }
        );
    } catch (error) {
        console.error('Refinement error:', error);

        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'An unexpected error occurred. Please try again.',
                },
            },
            { status: 500 }
        );
    }
}
