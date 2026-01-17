import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';

// Mock images for development - simulates different refinement results
const MOCK_REFINED_IMAGES = [
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Refined+Design+A',
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Refined+Design+B',
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Refined+Design+C',
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Refined+Design+D',
];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const { imageId, refinementPrompt, advancedOptions } = body;

        if (!imageId) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'INVALID_INPUT',
                        message: 'Image ID is required',
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

        // Simulate API processing delay (3-5 seconds for refinement)
        const delay = 3000 + Math.random() * 2000;
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Generate mock response
        const refinementId = generateId();
        const randomImage = MOCK_REFINED_IMAGES[Math.floor(Math.random() * MOCK_REFINED_IMAGES.length)];

        // Log the request for debugging
        console.log('Refinement request:', {
            refinementId,
            imageId,
            prompt: refinementPrompt.substring(0, 50) + (refinementPrompt.length > 50 ? '...' : ''),
            advancedOptions: {
                strength: advancedOptions?.strength,
                preserveGemSize: advancedOptions?.preserveGemSize,
                preserveShape: advancedOptions?.preserveShape,
                styleGuidance: advancedOptions?.styleGuidance,
            },
        });

        return NextResponse.json({
            success: true,
            refinementId,
            imageId: `refined-${refinementId}`,
            imageUrl: randomImage,
            thumbnailUrl: randomImage.replace('800x800', '300x300'),
            metadata: {
                generationTime: delay / 1000,
                promptUsed: refinementPrompt,
                appliedOptions: advancedOptions,
            },
        });
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
