'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Gem, ArrowLeft, Save, LogIn, Check } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { saveDesign } from '@/lib/firestore';
import { UserMenu } from '@/components/layout';
import {
    DesignSummary,
    DesignGallery,
    Lightbox,
    SuccessMessage,
    DesignDisclaimer,
    CallToAction,
} from '@/components/design';

// Mock data for development - will be replaced with real API data
const MOCK_DESIGN_RESPONSE = {
    designId: 'design-123',
    images: [
        { imageId: 'img-1', imageUrl: 'https://placehold.co/800x800/F5F5F0/0A1128?text=Ring+Design+1' },
        { imageId: 'img-2', imageUrl: 'https://placehold.co/800x800/F5F5F0/0A1128?text=Ring+Design+2' },
        { imageId: 'img-3', imageUrl: 'https://placehold.co/800x800/F5F5F0/0A1128?text=Ring+Design+3' },
    ],
    gemData: {
        type: 'Diamond',
        cut: 'Round Brilliant',
        size: 'Medium',
        color: 'Clear/White',
        transparency: 'Transparent',
        imageUrl: undefined,
    },
    prompt: 'An elegant vintage-style engagement ring with a halo setting, featuring intricate filigree details on the band and small accent diamonds.',
    materials: {
        metals: ['Platinum', 'White Gold'],
        finish: 'Polished',
    },
};

function ResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const designId = searchParams.get('id');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [designData, setDesignData] = useState(MOCK_DESIGN_RESPONSE);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const { user } = useAuth();

    // Load design data from sessionStorage
    useEffect(() => {
        const loadDesign = async () => {
            setIsLoading(true);
            setError(null);

            try {
                if (designId) {
                    // Try to load from sessionStorage
                    const storedData = sessionStorage.getItem(designId);
                    if (storedData) {
                        const parsedData = JSON.parse(storedData);
                        setDesignData(parsedData);
                    } else {
                        // Fallback to mock data if no stored data
                        console.warn('No stored design data found for:', designId);
                        setDesignData(MOCK_DESIGN_RESPONSE);
                    }
                } else {
                    // Use mock data if no ID provided (for development)
                    setDesignData(MOCK_DESIGN_RESPONSE);
                }
            } catch (err) {
                console.error('Error loading design:', err);
                setError('Failed to load your designs. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        loadDesign();
    }, [designId]);

    // Handlers
    const handleSelect = useCallback((imageId: string) => {
        setSelectedImageId((prev) => (prev === imageId ? null : imageId));
    }, []);

    const handleDownload = useCallback((imageId: string, imageUrl: string) => {
        // Create download link
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `jewelry-design-${imageId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    const handleFavorite = useCallback((imageId: string) => {
        setFavorites((prev) =>
            prev.includes(imageId)
                ? prev.filter((id) => id !== imageId)
                : [...prev, imageId]
        );
    }, []);

    const handleViewFull = useCallback((imageUrl: string) => {
        const index = designData.images.findIndex((img) => img.imageUrl === imageUrl);
        setLightboxIndex(index >= 0 ? index : 0);
        setLightboxOpen(true);
    }, [designData.images]);

    const handleLightboxNav = useCallback(
        (direction: 'prev' | 'next') => {
            setLightboxIndex((prev) => {
                if (direction === 'prev') return Math.max(0, prev - 1);
                return Math.min(designData.images.length - 1, prev + 1);
            });
        },
        [designData.images.length]
    );

    const handleEdit = useCallback(() => {
        router.push('/design/create');
    }, [router]);

    const handleSaveDesign = async () => {
        if (!user || !designData) return;

        setIsSaving(true);
        try {
            await saveDesign(user.uid, {
                designId: designId || 'unknown',
                images: designData.images,
                gemData: designData.gemData,
                prompt: designData.prompt,
                materials: designData.materials,
            });
            setIsSaved(true);
        } catch (err) {
            console.error('Error saving design:', err);
            alert('Failed to save design. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-light-gray border-t-gold rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate">Loading your designs...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center max-w-md mx-4">
                    <p className="text-error mb-4">{error}</p>
                    <Link
                        href="/design/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-navy font-medium rounded-lg"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Create New Design
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <header className="bg-navy text-white py-4 px-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Gem className="w-8 h-8 text-gold" />
                        <h1 className="text-xl font-serif font-semibold">AI Jewelry Designer</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/design/create"
                            className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            New Design
                        </Link>
                        <UserMenu />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Success Message */}
                <SuccessMessage numVariations={designData.images.length} />

                {/* Design Summary (Collapsible) */}
                <DesignSummary
                    gemData={designData.gemData}
                    prompt={designData.prompt}
                    materials={designData.materials}
                    onEdit={handleEdit}
                />

                {/* Design Gallery */}
                <section>
                    <h3 className="text-lg font-serif font-semibold text-navy mb-4">
                        Your Generated Designs
                    </h3>
                    <DesignGallery
                        images={designData.images}
                        selectedId={selectedImageId}
                        favorites={favorites}
                        onSelect={handleSelect}
                        onDownload={handleDownload}
                        onFavorite={handleFavorite}
                        onViewFull={handleViewFull}
                    />
                </section>

                {/* Call to Action */}
                <CallToAction
                    selectedImageId={selectedImageId}
                    selectedImageUrl={designData.images.find(img => img.imageId === selectedImageId)?.imageUrl}
                    designId={designId}
                />

                {/* Save Design Section */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-light-gray">
                    <h3 className="text-lg font-serif font-semibold text-navy mb-4">
                        Save This Design
                    </h3>
                    {user ? (
                        <div className="flex items-center gap-4">
                            {isSaved ? (
                                <div className="flex items-center gap-2 text-success">
                                    <Check className="w-5 h-5" />
                                    <span>Design saved to your collection!</span>
                                    <Link
                                        href="/dashboard"
                                        className="text-gold hover:underline ml-2"
                                    >
                                        View Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <button
                                    onClick={handleSaveDesign}
                                    disabled={isSaving}
                                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Save className="w-5 h-5" />
                                    {isSaving ? 'Saving...' : 'Save to My Collection'}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 flex-wrap">
                            <p className="text-slate">
                                Sign in to save this design to your collection
                            </p>
                            <Link
                                href="/auth/sign-in"
                                className="btn-secondary flex items-center gap-2"
                            >
                                <LogIn className="w-5 h-5" />
                                Sign In
                            </Link>
                            <Link
                                href="/auth/sign-up"
                                className="text-gold hover:underline"
                            >
                                Create Account
                            </Link>
                        </div>
                    )}
                </section>

                {/* Disclaimer */}
                <DesignDisclaimer />
            </main>

            {/* Lightbox */}
            <Lightbox
                isOpen={lightboxOpen}
                imageUrl={designData.images[lightboxIndex]?.imageUrl || ''}
                imageIndex={lightboxIndex}
                totalImages={designData.images.length}
                onClose={() => setLightboxOpen(false)}
                onPrevious={() => handleLightboxNav('prev')}
                onNext={() => handleLightboxNav('next')}
                onDownload={() =>
                    handleDownload(
                        designData.images[lightboxIndex]?.imageId,
                        designData.images[lightboxIndex]?.imageUrl
                    )
                }
            />
        </div>
    );
}

export default function ResultsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-cream flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-light-gray border-t-gold rounded-full animate-spin" />
                </div>
            }
        >
            <ResultsContent />
        </Suspense>
    );
}
