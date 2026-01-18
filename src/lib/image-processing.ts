/**
 * Image Processing Utilities
 * For preparing images for Gemini API and storage
 */

import sharp from 'sharp';

/**
 * Maximum dimensions for uploaded images
 */
const MAX_IMAGE_DIMENSION = 2048;
const MAX_FILE_SIZE_KB = 1024; // 1MB
const THUMBNAIL_SIZE = 300;

/**
 * Resize image to fit within maximum dimensions
 */
export async function resizeImage(
    imageBuffer: Buffer,
    maxDimension: number = MAX_IMAGE_DIMENSION
): Promise<Buffer> {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    const { width = 0, height = 0 } = metadata;

    // Only resize if larger than max dimension
    if (width <= maxDimension && height <= maxDimension) {
        return imageBuffer;
    }

    return image
        .resize(maxDimension, maxDimension, {
            fit: 'inside',
            withoutEnlargement: true,
        })
        .toBuffer();
}

/**
 * Compress image to target file size
 */
export async function compressImage(
    imageBuffer: Buffer,
    targetSizeKB: number = MAX_FILE_SIZE_KB,
    format: 'jpeg' | 'png' | 'webp' = 'jpeg'
): Promise<Buffer> {
    let quality = 90;
    let result = imageBuffer;

    while (result.length > targetSizeKB * 1024 && quality > 20) {
        const image = sharp(imageBuffer);

        if (format === 'jpeg') {
            result = await image.jpeg({ quality }).toBuffer();
        } else if (format === 'webp') {
            result = await image.webp({ quality }).toBuffer();
        } else {
            result = await image.png({ compressionLevel: 9 }).toBuffer();
            break; // PNG compression is lossless, so break after one try
        }

        quality -= 10;
    }

    return result;
}

/**
 * Create a thumbnail version of an image
 */
export async function createThumbnail(
    imageBuffer: Buffer,
    size: number = THUMBNAIL_SIZE
): Promise<Buffer> {
    return sharp(imageBuffer)
        .resize(size, size, {
            fit: 'cover',
            position: 'center',
        })
        .jpeg({ quality: 80 })
        .toBuffer();
}

/**
 * Process an uploaded image for API use
 * Resizes, compresses, and converts to base64
 */
export async function processUploadedImage(
    imageBuffer: Buffer
): Promise<{ base64: string; mimeType: string }> {
    // Resize if too large
    const resized = await resizeImage(imageBuffer);

    // Compress for API efficiency
    const compressed = await compressImage(resized, MAX_FILE_SIZE_KB, 'jpeg');

    return {
        base64: compressed.toString('base64'),
        mimeType: 'image/jpeg',
    };
}

/**
 * Convert base64 string to buffer
 * Handles data URL format if present
 */
export function base64ToBuffer(base64String: string): Buffer {
    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:[^;]+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
}

/**
 * Convert buffer to base64 data URL
 */
export function bufferToBase64DataUrl(buffer: Buffer, mimeType: string): string {
    const base64 = buffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
}

/**
 * Extract MIME type from base64 data URL
 */
export function getMimeTypeFromDataUrl(dataUrl: string): string {
    const matches = dataUrl.match(/^data:([^;]+);base64,/);
    return matches ? matches[1] : 'image/png';
}

/**
 * Validate that a buffer is a valid image
 */
export async function isValidImage(buffer: Buffer): Promise<boolean> {
    try {
        const metadata = await sharp(buffer).metadata();
        return !!metadata.format && !!metadata.width && !!metadata.height;
    } catch {
        return false;
    }
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(
    buffer: Buffer
): Promise<{ width: number; height: number }> {
    const metadata = await sharp(buffer).metadata();
    return {
        width: metadata.width || 0,
        height: metadata.height || 0,
    };
}
