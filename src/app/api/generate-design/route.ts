import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';

// Mock images for development
const MOCK_IMAGES = [
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Design+1',
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Design+2',
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Design+3',
    'https://placehold.co/800x800/F5F5F0/0A1128?text=Design+4',
];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const { gemData, userPrompt, numVariations = 3 } = body;

        if (!gemData?.type || !gemData?.cut || !gemData?.color || !gemData?.transparency) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'INVALID_INPUT',
                        message: 'Missing required gem data fields',
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
                        message: 'Design prompt must be at least 10 characters',
                    },
                },
                { status: 400 }
            );
        }

        // Simulate API processing delay (2-3 seconds)
        await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));

        // Generate mock response
        const designId = generateId();
        const images = MOCK_IMAGES.slice(0, numVariations).map((url, index) => ({
            imageId: `img-${designId}-${index}`,
            imageUrl: url,
            thumbnailUrl: url.replace('800x800', '300x300'),
        }));

        // Log the request for debugging
        console.log('Design generation request:', {
            designId,
            gemData,
            userPrompt: userPrompt.substring(0, 50) + '...',
            numVariations,
        });

        return NextResponse.json({
            success: true,
            designId,
            images,
            metadata: {
                generationTime: 2.5,
                cost: 0.039 * numVariations,
            },
        });
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
