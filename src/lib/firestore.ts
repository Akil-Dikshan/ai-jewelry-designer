/**
 * Firestore Utilities
 * Client-side Firestore functions for saving and loading user designs
 */

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
} from 'firebase/firestore';
import { db } from './firebase-client';

export interface SavedDesign {
    id: string;
    userId: string;
    designId: string;
    images: Array<{
        imageId: string;
        imageUrl: string;
        thumbnailUrl?: string;
    }>;
    gemData: {
        type: string;
        cut: string;
        size: string;
        color: string;
        transparency: string;
    };
    prompt: string;
    materials: {
        metals: string[];
        finish: string | null;
    };
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Save a design to Firestore
 */
export async function saveDesign(
    userId: string,
    design: Omit<SavedDesign, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
    if (!db) {
        throw new Error('Firestore not initialized');
    }

    const designsRef = collection(db, 'designs');
    const docRef = await addDoc(designsRef, {
        userId,
        ...design,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });

    return docRef.id;
}

/**
 * Get all designs for a user
 */
export async function getUserDesigns(
    userId: string,
    maxResults = 50
): Promise<SavedDesign[]> {
    if (!db) {
        throw new Error('Firestore not initialized');
    }

    const designsRef = collection(db, 'designs');
    const q = query(
        designsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(maxResults)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
            designId: data.designId,
            images: data.images,
            gemData: data.gemData,
            prompt: data.prompt,
            materials: data.materials,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    });
}

/**
 * Get a single design by ID
 */
export async function getDesignById(designId: string): Promise<SavedDesign | null> {
    if (!db) {
        throw new Error('Firestore not initialized');
    }

    const docRef = doc(db, 'designs', designId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
        return null;
    }

    const data = snapshot.data();
    return {
        id: snapshot.id,
        userId: data.userId,
        designId: data.designId,
        images: data.images,
        gemData: data.gemData,
        prompt: data.prompt,
        materials: data.materials,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    };
}

/**
 * Delete a design
 */
export async function deleteDesign(designId: string): Promise<void> {
    if (!db) {
        throw new Error('Firestore not initialized');
    }

    const docRef = doc(db, 'designs', designId);
    await deleteDoc(docRef);
}
