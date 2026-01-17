/**
 * Authentication Context
 * Provides auth state and functions throughout the app
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
    signUp as authSignUp,
    signIn as authSignIn,
    signOut as authSignOut,
    resetPassword as authResetPassword,
    subscribeToAuthChanges,
    getAuthErrorMessage,
} from '@/lib/firebase-auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string, displayName?: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, displayName?: string) => {
        try {
            await authSignUp(email, password, displayName);
        } catch (error: unknown) {
            const code = (error as { code?: string }).code || '';
            throw new Error(getAuthErrorMessage(code));
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            await authSignIn(email, password);
        } catch (error: unknown) {
            const code = (error as { code?: string }).code || '';
            throw new Error(getAuthErrorMessage(code));
        }
    };

    const signOut = async () => {
        try {
            await authSignOut();
        } catch (error: unknown) {
            const code = (error as { code?: string }).code || '';
            throw new Error(getAuthErrorMessage(code));
        }
    };

    const resetPassword = async (email: string) => {
        try {
            await authResetPassword(email);
        } catch (error: unknown) {
            const code = (error as { code?: string }).code || '';
            throw new Error(getAuthErrorMessage(code));
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signUp,
                signIn,
                signOut,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

/**
 * Higher-order component for protected routes
 */
export function withAuth<T extends object>(
    WrappedComponent: React.ComponentType<T>
): React.FC<T> {
    return function AuthenticatedComponent(props: T) {
        const { user, loading } = useAuth();

        if (loading) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-cream">
                    <div className="w-12 h-12 border-4 border-light-gray border-t-gold rounded-full animate-spin" />
                </div>
            );
        }

        if (!user) {
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/sign-in';
            }
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}
