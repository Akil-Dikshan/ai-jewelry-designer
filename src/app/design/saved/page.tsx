'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gem, ArrowLeft, Trash2, Download, FolderOpen, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SavedDesign {
    id: string;
    imageUrl: string;
    label: string;
    savedAt: string;
    versions?: Array<{ id: string; imageUrl: string; label: string }>;
}

export default function SavedDesignsPage() {
    const [designs, setDesigns] = useState<SavedDesign[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('savedDesigns');
            if (saved) {
                setDesigns(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load saved designs:', e);
        }
        setIsLoading(false);
    }, []);

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to delete this design?')) return;

        const updated = designs.filter(d => d.id !== id);
        setDesigns(updated);
        localStorage.setItem('savedDesigns', JSON.stringify(updated));
    };

    const handleDownload = async (design: SavedDesign) => {
        try {
            const response = await fetch(design.imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `design-${design.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            const link = document.createElement('a');
            link.href = design.imageUrl;
            link.download = 'design.png';
            link.click();
        }
    };

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
                    <Link
                        href="/design/create"
                        className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Create
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gold/80 mb-2">My Saved Designs</h1>
                        <p className="text-white/50">
                            {designs.length} design{designs.length !== 1 ? 's' : ''} saved
                        </p>
                    </div>
                    <Link
                        href="/design/create"
                        className="flex items-center gap-2 px-4 py-2 bg-gold text-navy font-medium rounded-lg hover:brightness-110 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        New Design
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-white/10 border-t-gold rounded-full animate-spin" />
                    </div>
                ) : designs.length === 0 ? (
                    <div className="text-center py-20">
                        <FolderOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <h2 className="text-xl font-serif font-bold text-white mb-2">No Saved Designs</h2>
                        <p className="text-white/50 mb-6">Create and refine a design, then save it to see it here.</p>
                        <Link
                            href="/design/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-medium rounded-lg hover:brightness-110 transition-all"
                        >
                            Create Your First Design
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {designs.map((design) => (
                            <div
                                key={design.id}
                                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-gold/30 transition-all"
                            >
                                {/* Image */}
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={design.imageUrl}
                                        alt={design.label}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="text-sm font-medium text-white truncate">{design.label}</h3>
                                    <p className="text-xs text-white/40">
                                        Saved {new Date(design.savedAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Actions - Appear on hover */}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDownload(design)}
                                        className="p-2 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-gold hover:text-navy transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(design.id)}
                                        className="p-2 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
