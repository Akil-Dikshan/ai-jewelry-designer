/**
 * Gemini AI Client
 * Server-side only - API key is never exposed to frontend
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure this only runs on server
if (typeof window !== 'undefined') {
    throw new Error('Gemini client should only be used on the server side');
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn('GEMINI_API_KEY not found in environment variables');
}

// Initialize the Gemini client
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Use the Gemini 2.0 Flash model which supports image generation
const MODEL_NAME = 'gemini-2.0-flash-exp';

/**
 * Configuration for image generation
 */
export interface GenerationConfig {
    prompt: string;
    referenceImage?: string; // Base64 encoded image
    numImages?: number;
}

/**
 * Generated image result
 */
export interface GeneratedImage {
    base64: string;
    mimeType: string;
}

/**
 * Generate images using Gemini AI
 */
export async function generateImages(config: GenerationConfig): Promise<GeneratedImage[]> {
    if (!genAI) {
        throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({
        model: MODEL_NAME,
        generationConfig: {
            // @ts-expect-error - responseModalities is valid for image generation
            responseModalities: ['Text', 'Image'],
        },
    });

    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

    // Add reference image if provided
    if (config.referenceImage) {
        // Extract mime type and data from base64 string
        const matches = config.referenceImage.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
            parts.push({
                inlineData: {
                    mimeType: matches[1],
                    data: matches[2],
                },
            });
        }
    }

    // Add the prompt
    parts.push({ text: config.prompt });

    try {
        const result = await model.generateContent(parts);
        const response = result.response;

        const images: GeneratedImage[] = [];

        // Extract images from response
        for (const candidate of response.candidates || []) {
            for (const part of candidate.content?.parts || []) {
                // Check if this part contains image data
                if ('inlineData' in part && part.inlineData) {
                    images.push({
                        base64: part.inlineData.data,
                        mimeType: part.inlineData.mimeType,
                    });
                }
            }
        }

        return images;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw error;
    }
}

/**
 * Retry wrapper with exponential backoff
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            // Don't retry on certain errors
            if (error instanceof Error) {
                if (error.message.includes('API key') || error.message.includes('Invalid')) {
                    throw error;
                }
            }

            if (attempt < maxRetries) {
                const delay = baseDelay * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
                console.log(`Retrying Gemini API call (attempt ${attempt + 2}/${maxRetries + 1})...`);
            }
        }
    }

    throw lastError || new Error('Max retries exceeded');
}

export { genAI, MODEL_NAME };
