/**
 * Firebase Authentication Utilities
 * Client-side auth functions for sign up, sign in, sign out, password reset
 */

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
    User,
    UserCredential,
} from 'firebase/auth';
import { auth } from './firebase-client';

export type AuthUser = User | null;

/**
 * Sign up with email and password
 */
export async function signUp(
    email: string,
    password: string,
    displayName?: string
): Promise<UserCredential> {
    if (!auth) {
        throw new Error('Auth not initialized');
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);

    // Update display name if provided
    if (displayName && credential.user) {
        await updateProfile(credential.user, { displayName });
    }

    return credential;
}

/**
 * Sign in with email and password
 */
export async function signIn(
    email: string,
    password: string
): Promise<UserCredential> {
    if (!auth) {
        throw new Error('Auth not initialized');
    }

    return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
    if (!auth) {
        throw new Error('Auth not initialized');
    }

    return firebaseSignOut(auth);
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
    if (!auth) {
        throw new Error('Auth not initialized');
    }

    return sendPasswordResetEmail(auth, email);
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuthChanges(
    callback: (user: AuthUser) => void
): () => void {
    if (!auth) {
        callback(null);
        return () => { };
    }

    return onAuthStateChanged(auth, callback);
}

/**
 * Get current user
 */
export function getCurrentUser(): AuthUser {
    if (!auth) {
        return null;
    }
    return auth.currentUser;
}

/**
 * Parse Firebase auth errors into user-friendly messages
 */
export function getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/operation-not-allowed':
            return 'Email/password sign-in is not enabled.';
        case 'auth/weak-password':
            return 'Password must be at least 6 characters.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        default:
            return 'An error occurred. Please try again.';
    }
}
