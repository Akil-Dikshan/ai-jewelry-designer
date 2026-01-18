/**
 * Firebase Storage Client
 * Server-side only - Admin SDK credentials never exposed to frontend
 */

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getStorage, type Storage } from 'firebase-admin/storage';
import { generateId } from './utils';

// Ensure this only runs on server
if (typeof window !== 'undefined') {
    throw new Error('Firebase Admin should only be used on the server side');
}

let app: App | null = null;
let storage: Storage | null = null;

/**
 * Initialize Firebase Admin SDK
 */
function initializeFirebase(): App {
    if (getApps().length > 0) {
        return getApps()[0];
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

    if (!projectId || !clientEmail || !privateKey || !storageBucket) {
        console.warn('Firebase Admin credentials not fully configured');
        throw new Error('Firebase Admin credentials not configured');
    }

    return initializeApp({
        credential: cert({
            projectId,
            clientEmail,
            privateKey,
        }),
        storageBucket,
    });
}

/**
 * Get Firebase Storage instance
 */
function getStorageInstance(): Storage {
    if (!app) {
        app = initializeFirebase();
    }
    if (!storage) {
        storage = getStorage(app);
    }
    return storage;
}

/**
 * Upload an image to Firebase Storage
 * @param imageBuffer - Image data as Buffer
 * @param mimeType - MIME type of the image
 * @param folder - Folder path in storage (e.g., 'designs', 'refined')
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(
    imageBuffer: Buffer,
    mimeType: string,
    folder: string = 'designs'
): Promise<string> {
    const storageInstance = getStorageInstance();
    const bucket = storageInstance.bucket();

    // Generate unique filename
    const extension = mimeType.split('/')[1] || 'png';
    const filename = `${folder}/${generateId()}.${extension}`;

    const file = bucket.file(filename);

    await file.save(imageBuffer, {
        metadata: {
            contentType: mimeType,
            cacheControl: 'public, max-age=31536000', // Cache for 1 year
        },
    });

    // Make the file publicly accessible
    await file.makePublic();

    // Return the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    return publicUrl;
}

/**
 * Upload a base64 encoded image to Firebase Storage
 * @param base64Data - Base64 encoded image data (without data URL prefix)
 * @param mimeType - MIME type of the image
 * @param folder - Folder path in storage
 * @returns Public URL of the uploaded image
 */
export async function uploadBase64Image(
    base64Data: string,
    mimeType: string,
    folder: string = 'designs'
): Promise<string> {
    const buffer = Buffer.from(base64Data, 'base64');
    return uploadImage(buffer, mimeType, folder);
}

/**
 * Delete an image from Firebase Storage
 * @param imageUrl - Public URL of the image
 */
export async function deleteImage(imageUrl: string): Promise<void> {
    const storageInstance = getStorageInstance();
    const bucket = storageInstance.bucket();

    // Extract filename from URL
    const urlParts = imageUrl.split(`${bucket.name}/`);
    if (urlParts.length < 2) {
        throw new Error('Invalid image URL');
    }

    const filename = urlParts[1];
    const file = bucket.file(filename);

    await file.delete();
}

/**
 * Download an image from URL and convert to base64
 * @param imageUrl - URL of the image
 * @returns Base64 encoded image data
 */
export async function downloadImageAsBase64(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);

    if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/png';

    return `data:${mimeType};base64,${base64}`;
}
