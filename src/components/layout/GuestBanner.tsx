'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface GuestBannerProps {
    variant?: 'minimal' | 'full';
}

export function GuestBanner({ variant = 'minimal' }: GuestBannerProps) {
    const { user, loading } = useAuth();
    const [isDismissed, setIsDismissed] = useState(false);

    // Check if previously dismissed (for minimal banner)
    useEffect(() => {
        if (variant === 'minimal') {
            const dismissed = sessionStorage.getItem('guestBannerDismissed');
            if (dismissed) {
                setIsDismissed(true);
            }
        }
    }, [variant]);

    const handleDismiss = () => {
        setIsDismissed(true);
        if (variant === 'minimal') {
            sessionStorage.setItem('guestBannerDismissed', 'true');
        }
    };

    // Don't show if loading, logged in, or dismissed
    if (loading || user || isDismissed) {
        return null;
    }

    if (variant === 'minimal') {
        return (
            <div className="bg-navy/5 border-b border-navy/10">
                <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
                    <p className="text-sm text-navy">
                        <Sparkles className="w-4 h-4 inline mr-1 text-gold" />
                        <Link href="/auth/sign-in" className="text-gold hover:underline font-medium">
                            Sign in
                        </Link>
                        {' '}to save your designs and access them anywhere
                    </p>
                    <button
                        onClick={handleDismiss}
                        className="p-1 text-slate hover:text-navy transition-colors"
                        aria-label="Dismiss"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    // Full variant - for results page
    return (
        <div className="bg-gradient-to-r from-navy/5 to-gold/10 rounded-xl p-6 border border-gold/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                    <h4 className="font-serif font-semibold text-navy mb-1">
                        Create a Free Account to Save These Designs
                    </h4>
                    <ul className="text-sm text-slate space-y-1">
                        <li>✓ Save unlimited designs to your collection</li>
                        <li>✓ Access your designs from any device</li>
                        <li>✓ Refine and iterate on saved designs</li>
                    </ul>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/auth/sign-up"
                        className="btn-primary flex items-center gap-2"
                    >
                        Create Free Account
                    </Link>
                    <Link
                        href="/auth/sign-in"
                        className="text-sm text-gold hover:underline"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default GuestBanner;
