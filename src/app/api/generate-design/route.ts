import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';
import { generateImages, withRetry } from '@/lib/gemini';
import { uploadBase64Image } from '@/lib/firebase-storage';
import { buildGenerationPrompt, buildImageReferencePrompt, type GemPromptData, type MaterialPromptData } from '@/lib/prompt-builder';
import { base64ToBuffer, processUploadedImage } from '@/lib/image-processing';
import { checkRateLimit, incrementRateLimit, getRateLimitHeaders, getClientIP } from '@/lib/rate-limit';

// Check if we're using real API or mock mode
const USE_MOCK = process.env.USE_MOCK_API === 'true' || !process.env.GEMINI_API_KEY;

// Mock images for development when API is not configured
const MOCK_IMAGES = [
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Ring+Design+1',
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Ring+Design+2',
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Ring+Design+3',
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Ring+Design+4',
];

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        // Rate limiting
        const clientIP = getClientIP(request.headers);
        const rateLimitResult = checkRateLimit('guest', clientIP);

        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'RATE_LIMIT_EXCEEDED',
                        message: 'You have exceeded the generation limit. Please try again later.',
                    },
                },
                {
                    status: 429,
                    headers: getRateLimitHeaders('guest', clientIP),
                }
            );
        }

        const body = await request.json();

        // Validate required fields
        const { gemData, userPrompt, materials, numVariations = 3, gemImage } = body;

        if (!gemData || !gemData.type || !gemData.cut) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'INVALID_INPUT',
                        message: 'Gem type and cut are required',
                    },
                },
                { status: 400 }
            );
        }

        if (!userPrompt || userPrompt.length < 10) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'INVALID_INPUT',
                        message: 'Design description must be at least 10 characters',
                    },
                },
                { status: 400 }
            );
        }

        const validNumVariations = Math.min(Math.max(numVariations, 2), 4);

        // Prepare gem data for prompt
        const gemPromptData: GemPromptData = {
            type: gemData.type,
            cut: gemData.cut,
            size: gemData.size?.simple || 'medium',
            color: gemData.color || 'Clear',
            transparency: gemData.transparency || 'transparent',
        };

        // Prepare materials for prompt
        const materialPromptData: MaterialPromptData = {
            metals: materials?.metals || [],
            finish: materials?.finish || null,
        };

        // Log the generation request
        console.log('Design generation request:', {
            gemType: gemPromptData.type,
            cut: gemPromptData.cut,
            hasGemImage: !!gemImage,
            numVariations: validNumVariations,
            userPrompt: userPrompt.substring(0, 50) + '...',
        });

        let images: Array<{ imageId: string; imageUrl: string; thumbnailUrl?: string }> = [];

        if (USE_MOCK) {
            // Mock mode - simulate delay and return placeholder images
            console.log('Using mock mode - Gemini API not configured');
            await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 2000));

            images = MOCK_IMAGES.slice(0, validNumVariations).map((url, index) => ({
                imageId: `mock-${generateId()}`,
                imageUrl: url,
                thumbnailUrl: url.replace('800x800', '300x300'),
            }));
        } else {
            // Real Gemini API mode
            try {
                // Build the prompt
                let prompt: string;
                let referenceImage: string | undefined;

                if (gemImage) {
                    // User uploaded a gem image - use reference-based prompt
                    prompt = buildImageReferencePrompt(userPrompt, materialPromptData);

                    // Process the uploaded image
                    const imageBuffer = base64ToBuffer(gemImage);
                    const processed = await processUploadedImage(imageBuffer);
                    referenceImage = `data:${processed.mimeType};base64,${processed.base64}`;
                } else {
                    // No image - use detailed prompt
                    prompt = buildGenerationPrompt(userPrompt, gemPromptData, materialPromptData);
                }

                // Generate images with retry logic
                // Note: Gemini may not always generate the exact number requested
                // We'll generate one at a time and collect up to numVariations
                const generatedImages: Array<{ imageId: string; imageUrl: string; thumbnailUrl?: string }> = [];

                for (let i = 0; i < validNumVariations; i++) {
                    try {
                        const result = await withRetry(
                            () => generateImages({
                                prompt: prompt + `\n\nVariation ${i + 1} of ${validNumVariations} - create a unique interpretation.`,
                                referenceImage: i === 0 ? referenceImage : undefined, // Only use reference for first image
                            }),
                            2, // Max retries
                            1500 // Base delay
                        );

                        if (result.length > 0) {
                            // Upload to Firebase Storage
                            const imageUrl = await uploadBase64Image(
                                result[0].base64,
                                result[0].mimeType,
                                'designs'
                            );

                            generatedImages.push({
                                imageId: `gen-${generateId()}`,
                                imageUrl,
                                thumbnailUrl: imageUrl, // Could generate actual thumbnail
                            });
                        }
                    } catch (genError) {
                        console.error(`Failed to generate variation ${i + 1}:`, genError);
                        // Continue to next variation
                    }
                }

                if (generatedImages.length === 0) {
                    throw new Error('Failed to generate any images');
                }

                images = generatedImages;
            } catch (apiError) {
                console.error('Gemini API error:', apiError);

                // Fall back to mock images on API failure
                console.log('Falling back to mock images due to API error');
                await new Promise((resolve) => setTimeout(resolve, 1000));

                images = MOCK_IMAGES.slice(0, validNumVariations).map((url, index) => ({
                    imageId: `fallback-${generateId()}`,
                    imageUrl: url,
                    thumbnailUrl: url.replace('800x800', '300x300'),
                }));
            }
        }

        // Increment rate limit counter
        incrementRateLimit('guest', clientIP);

        const generationTime = (Date.now() - startTime) / 1000;

        // Return successful response
        return NextResponse.json(
            {
                success: true,
                designId: `design-${generateId()}`,
                images,
                metadata: {
                    generationTime,
                    variationsRequested: validNumVariations,
                    variationsGenerated: images.length,
                    model: USE_MOCK ? 'mock' : 'gemini-2.0-flash-exp',
                },
            },
            { headers: getRateLimitHeaders('guest', clientIP) }
        );
    } catch (error) {
        console.error('Design generation error:', error);

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
