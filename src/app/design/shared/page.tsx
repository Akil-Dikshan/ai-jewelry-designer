'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Gem, ArrowLeft, Download, AlertCircle } from 'lucide-react';

interface SharedDesign {
    id: string;
    imageUrl: string;
    label: string;
    sharedAt: string;
}

function SharedDesignContent() {
    const searchParams = useSearchParams();
    const shareId = searchParams.get('id');
    const [design, setDesign] = useState<SharedDesign | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!shareId) {
            setError('No share ID provided');
            return;
        }

        try {
            const data = localStorage.getItem(shareId);
            if (data) {
                setDesign(JSON.parse(data));
            } else {
                setError('Design not found or link has expired');
            }
        } catch (e) {
            setError('Failed to load design');
        }
    }, [shareId]);

    const handleDownload = async () => {
        if (!design) return;
        try {
            const response = await fetch(design.imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `shared-design-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            const link = document.createElement('a');
            link.href = design.imageUrl;
            link.download = 'shared-design.png';
            link.click();
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">Design Not Found</h2>
                    <p className="text-white/60 mb-6">{error}</p>
                    <Link
                        href="/design/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-medium rounded-lg hover:brightness-110 transition-all"
                    >
                        Create Your Own Design
                    </Link>
                </div>
            </div>
        );
    }

    if (!design) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/10 border-t-gold rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Header */}
            <header className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-lg shadow-gold/20">
                            <Gem className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-serif font-bold text-white">
                            AI Jewelry Designer
                        </span>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <p className="text-gold text-sm font-medium mb-2">Shared Design</p>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">{design.label}</h1>
                    <p className="text-white/40 text-sm">
                        Shared on {new Date(design.sharedAt).toLocaleDateString()}
                    </p>
                </div>

                {/* Design Image */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 mb-8">
                    <img
                        src={design.imageUrl}
                        alt={design.label}
                        className="w-full h-auto"
                    />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-6 py-3 bg-gold text-navy font-medium rounded-lg hover:brightness-110 transition-all"
                    >
                        <Download className="w-5 h-5" />
                        Download Design
                    </button>
                    <Link
                        href="/design/create"
                        className="flex items-center gap-2 px-6 py-3 border-2 border-gold text-gold font-medium rounded-lg hover:bg-gold/10 transition-colors"
                    >
                        Create Your Own
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default function SharedPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-white/10 border-t-gold rounded-full animate-spin" />
                </div>
            }
        >
            <SharedDesignContent />
        </Suspense>
    );
}
