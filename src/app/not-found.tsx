'use client';

import Link from 'next/link';
import { Gem, Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
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

            {/* 404 Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gold/10 text-gold mb-8">
                        <Search className="w-12 h-12" />
                    </div>

                    {/* Heading */}
                    <h2 className="text-6xl font-serif font-bold text-navy mb-4">
                        404
                    </h2>
                    <h3 className="text-2xl font-serif font-semibold text-navy mb-4">
                        Page Not Found
                    </h3>
                    <p className="text-slate max-w-md mx-auto mb-8">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                        Let&apos;s get you back on track.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="btn-primary inline-flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Go Home
                        </Link>
                        <Link
                            href="/design/create"
                            className="btn-secondary inline-flex items-center justify-center gap-2"
                        >
                            <Gem className="w-5 h-5" />
                            Create Design
                        </Link>
                    </div>

                    {/* Back Link */}
                    <button
                        onClick={() => window.history.back()}
                        className="mt-8 inline-flex items-center gap-2 text-sm text-slate hover:text-navy transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>
            </main>
        </div>
    );
}
