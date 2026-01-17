'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Gem, Home, RefreshCw, AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-cream flex flex-col">
            {/* Header */}
            <header className="bg-navy text-white py-4 px-6">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3">
                        <Gem className="w-8 h-8 text-gold" />
                        <h1 className="text-xl font-serif font-semibold">AI Jewelry Designer</h1>
                    </Link>
                </div>
            </header>

            {/* Error Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-error/10 text-error mb-8">
                        <AlertTriangle className="w-12 h-12" />
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl font-serif font-bold text-navy mb-4">
                        Something Went Wrong
                    </h2>
                    <p className="text-slate max-w-md mx-auto mb-8">
                        We encountered an unexpected error. Don&apos;t worry, your designs are safe.
                        Please try again or return to the homepage.
                    </p>

                    {/* Error Details (Development Only) */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mb-8 p-4 bg-red-50 border border-error rounded-lg text-left max-w-lg mx-auto">
                            <p className="text-sm font-mono text-error break-all">
                                {error.message}
                            </p>
                            {error.digest && (
                                <p className="text-xs text-slate mt-2">
                                    Error ID: {error.digest}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={reset}
                            className="btn-primary inline-flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="btn-secondary inline-flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Go Home
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
