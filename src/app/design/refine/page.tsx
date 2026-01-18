'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Gem, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    SelectedDesignDisplay,
    VersionHistory,
    RefinementInput,
    QuickSuggestions,
    AdvancedOptions,
    ComparisonView,
    RefinementProgress,
    RefinementResult,
    ShareModal,
} from '@/components/refine';
import { Lightbox } from '@/components/design';

// Fallback mock data (only used if no real data)
const MOCK_IMAGE_URL = 'https://placehold.co/800x800/F5F5F0/0A1128?text=No+Image';

const MAX_REFINEMENTS = 5;

function RefineContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const imageId = searchParams.get('imageId');
    const imageUrl = searchParams.get('imageUrl');
    const designId = searchParams.get('designId');

    // State
    const [versions, setVersions] = useState<Array<{ id: string; imageUrl: string; label: string }>>([]);
    const [currentVersionId, setCurrentVersionId] = useState('v1');
    const [refinementText, setRefinementText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [refinementsRemaining, setRefinementsRemaining] = useState(MAX_REFINEMENTS);
    const [advancedOptions, setAdvancedOptions] = useState({
        strength: 3,
        preserveGemSize: true,
        preserveShape: false,
        preserveMetalType: true,
        styleGuidance: null as string | null,
    });

    // Load the real image from URL params or sessionStorage
    useEffect(() => {
        let originalImageUrl = imageUrl;

        // If no imageUrl in URL, try to get from sessionStorage
        if (!originalImageUrl && designId) {
            try {
                const storedData = localStorage.getItem(designId);
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    // Find the image matching imageId, or use first image
                    const targetImage = parsedData.images?.find((img: { imageId: string }) => img.imageId === imageId)
                        || parsedData.images?.[0];
                    if (targetImage?.imageUrl) {
                        originalImageUrl = targetImage.imageUrl;
                    }
                }
            } catch (e) {
                console.error('Error loading from sessionStorage:', e);
            }
        }

        // Initialize versions with the real image
        const initialImageUrl = originalImageUrl || MOCK_IMAGE_URL;
        setVersions([
            { id: 'v1', imageUrl: initialImageUrl, label: 'Original' }
        ]);
    }, [imageId, imageUrl, designId]);

    const currentVersion = versions.find((v) => v.id === currentVersionId);
    const previousVersion = versions.length > 1 ? versions[versions.length - 2] : undefined;

    // Handlers
    const handleSuggestionClick = useCallback((suggestion: string) => {
        setRefinementText((prev) => {
            const separator = prev.trim() ? '. ' : '';
            return prev + separator + suggestion;
        });
    }, []);

    const handleGenerate = useCallback(async () => {
        if (!refinementText.trim() || isGenerating || refinementsRemaining <= 0) return;

        setIsGenerating(true);
        setShowResult(false);

        try {
            const response = await fetch('/api/refine-design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageId: currentVersionId,
                    imageUrl: currentVersion?.imageUrl, // Send the actual image URL
                    refinementPrompt: refinementText,
                    advancedOptions,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Add new version
                const newVersion = {
                    id: `v${versions.length + 1}`,
                    imageUrl: data.imageUrl,
                    label: `Refinement ${versions.length}`,
                };
                setVersions((prev) => [...prev, newVersion]);
                setCurrentVersionId(newVersion.id);
                setRefinementsRemaining((prev) => prev - 1);
                setShowResult(true);
                setRefinementText('');
            }
        } catch (error) {
            console.error('Refinement failed:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [refinementText, isGenerating, refinementsRemaining, currentVersionId, advancedOptions, versions.length]);

    const handleSelectVersion = useCallback((versionId: string) => {
        setCurrentVersionId(versionId);
        setShowResult(false);
    }, []);

    const handleRevertToVersion = useCallback((versionId: string) => {
        const versionIndex = versions.findIndex((v) => v.id === versionId);
        if (versionIndex >= 0) {
            setVersions(versions.slice(0, versionIndex + 1));
            setCurrentVersionId(versionId);
            setShowResult(false);
        }
    }, [versions]);

    const handleAccept = useCallback(() => {
        // Save the refined version to localStorage
        if (designId && currentVersion && imageId) {
            try {
                const storedData = localStorage.getItem(designId);
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    // Update the image in the images array with the refined version
                    if (parsedData.images) {
                        const imageIndex = parsedData.images.findIndex(
                            (img: { imageId: string }) => img.imageId === imageId
                        );
                        if (imageIndex >= 0) {
                            // Replace with refined version
                            parsedData.images[imageIndex] = {
                                ...parsedData.images[imageIndex],
                                imageUrl: currentVersion.imageUrl,
                                isRefined: true,
                                refinedAt: new Date().toISOString(),
                            };
                        } else {
                            // Add as a new image
                            parsedData.images.push({
                                imageId: `refined-${Date.now()}`,
                                imageUrl: currentVersion.imageUrl,
                                isRefined: true,
                                refinedAt: new Date().toISOString(),
                            });
                        }
                        localStorage.setItem(designId, JSON.stringify(parsedData));
                    }
                }
            } catch (error) {
                console.error('Error saving refined design:', error);
            }
        }
        router.push(designId ? `/design/results?id=${designId}` : '/design/results');
    }, [router, designId, currentVersion, imageId]);

    const handleRefineMore = useCallback(() => {
        setShowResult(false);
    }, []);

    const handleRevert = useCallback(() => {
        if (versions.length > 1) {
            const previousId = versions[versions.length - 2].id;
            setVersions(versions.slice(0, -1));
            setCurrentVersionId(previousId);
            setRefinementsRemaining((prev) => prev + 1);
            setShowResult(false);
        }
    }, [versions]);

    const handleDownload = useCallback(async () => {
        if (currentVersion) {
            try {
                // Fetch image as blob to handle cross-origin
                const response = await fetch(currentVersion.imageUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `jewelry-design-${currentVersion.id}-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                // Fallback for same-origin images
                const link = document.createElement('a');
                link.href = currentVersion.imageUrl;
                link.download = `jewelry-design-${currentVersion.id}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }, [currentVersion]);

    // Save design to localStorage
    const handleSave = useCallback(() => {
        if (!currentVersion) return;

        const savedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
        const newDesign = {
            id: `design-${Date.now()}`,
            imageUrl: currentVersion.imageUrl,
            label: currentVersion.label,
            savedAt: new Date().toISOString(),
            versions: versions,
        };

        savedDesigns.push(newDesign);
        localStorage.setItem('savedDesigns', JSON.stringify(savedDesigns));

        alert('Design saved! View it in My Designs.');
    }, [currentVersion, versions]);

    // Share design - generate unique link
    const handleShare = useCallback(() => {
        if (!currentVersion) return;

        const shareId = `share-${Date.now()}`;
        const shareData = {
            id: shareId,
            imageUrl: currentVersion.imageUrl,
            label: currentVersion.label,
            sharedAt: new Date().toISOString(),
        };

        // Store in localStorage for the shared page to access
        localStorage.setItem(shareId, JSON.stringify(shareData));

        const url = `${window.location.origin}/design/shared?id=${shareId}`;
        setShareUrl(url);
        setShowShareModal(true);
    }, [currentVersion]);

    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <header className="bg-navy text-white py-4 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Gem className="w-8 h-8 text-gold" />
                        <h1 className="text-xl font-serif font-semibold">AI Jewelry Designer</h1>
                    </div>
                    <Link
                        href={designId ? `/design/results?id=${designId}` : '/design/results'}
                        className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to designs
                    </Link>
                </div>
            </header>

            {/* Page Title */}
            <div className="bg-white border-b border-light-gray py-4 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-navy">Refine Your Design</h2>
                        <p className="text-sm text-slate">Iterate on your selected design with AI assistance</p>
                    </div>
                    <div className="text-sm">
                        <span className={cn(
                            'px-3 py-1 rounded-full',
                            refinementsRemaining > 0 ? 'bg-cream text-navy' : 'bg-error/10 text-error'
                        )}>
                            {refinementsRemaining} refinements remaining
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Panel - Design Display (60%) */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Selected Design */}
                        <div className="relative">
                            <SelectedDesignDisplay
                                imageUrl={currentVersion?.imageUrl || ''}
                                versionLabel={currentVersion?.label || 'Current Version'}
                                isLoading={isGenerating}
                                onFullscreen={() => setShowLightbox(true)}
                            />

                            {/* Progress Overlay */}
                            <RefinementProgress isActive={isGenerating} />
                        </div>

                        {/* Version History */}
                        <VersionHistory
                            versions={versions}
                            currentVersionId={currentVersionId}
                            onSelectVersion={handleSelectVersion}
                            onRevertToVersion={handleRevertToVersion}
                            disabled={isGenerating}
                        />

                        {/* Comparison View */}
                        {previousVersion && (
                            <ComparisonView
                                beforeImageUrl={previousVersion.imageUrl}
                                afterImageUrl={currentVersion?.imageUrl || ''}
                                beforeLabel={previousVersion.label}
                                afterLabel={currentVersion?.label || 'Current'}
                                isEnabled={showComparison}
                                onToggle={setShowComparison}
                            />
                        )}
                    </div>

                    {/* Right Panel - Controls (40%) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Result Actions (after successful refinement) */}
                        <RefinementResult
                            isVisible={showResult}
                            onAccept={handleAccept}
                            onRefineMore={handleRefineMore}
                            onRevert={handleRevert}
                            onDownload={handleDownload}
                            onShare={handleShare}
                            onSave={handleSave}
                        />

                        {/* Refinement Input */}
                        <div className="bg-white rounded-xl border border-light-gray p-6 space-y-6">
                            <RefinementInput
                                value={refinementText}
                                onChange={setRefinementText}
                                onSubmit={handleGenerate}
                                disabled={isGenerating || refinementsRemaining <= 0}
                                maxLength={300}
                            />

                            <QuickSuggestions
                                onSuggestionClick={handleSuggestionClick}
                                disabled={isGenerating || refinementsRemaining <= 0}
                            />

                            <AdvancedOptions
                                value={advancedOptions}
                                onChange={setAdvancedOptions}
                                disabled={isGenerating}
                            />

                            {/* Generate Button */}
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={!refinementText.trim() || isGenerating || refinementsRemaining <= 0}
                                className={cn(
                                    'w-full flex items-center justify-center gap-2',
                                    'px-6 py-4 rounded-lg font-semibold text-lg',
                                    'transition-all duration-300',
                                    'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2',
                                    (!refinementText.trim() || isGenerating || refinementsRemaining <= 0)
                                        ? 'bg-light-gray text-slate cursor-not-allowed'
                                        : 'bg-gold text-navy hover:brightness-110 shadow-lg hover:shadow-xl'
                                )}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Generate Refinement
                                    </>
                                )}
                            </button>

                            {refinementsRemaining <= 0 && (
                                <p className="text-sm text-error text-center">
                                    You&apos;ve used all refinements. Start a new design to continue.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Lightbox */}
            <Lightbox
                isOpen={showLightbox}
                imageUrl={currentVersion?.imageUrl || ''}
                imageIndex={versions.findIndex((v) => v.id === currentVersionId)}
                totalImages={versions.length}
                onClose={() => setShowLightbox(false)}
                onPrevious={() => {
                    const idx = versions.findIndex((v) => v.id === currentVersionId);
                    if (idx > 0) setCurrentVersionId(versions[idx - 1].id);
                }}
                onNext={() => {
                    const idx = versions.findIndex((v) => v.id === currentVersionId);
                    if (idx < versions.length - 1) setCurrentVersionId(versions[idx + 1].id);
                }}
                onDownload={handleDownload}
            />

            {/* Share Modal */}
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                shareUrl={shareUrl}
                imageUrl={currentVersion?.imageUrl || ''}
            />
        </div>
    );
}

export default function RefinePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-cream flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-light-gray border-t-gold rounded-full animate-spin" />
                </div>
            }
        >
            <RefineContent />
        </Suspense>
    );
}
