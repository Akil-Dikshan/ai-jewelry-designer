'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gem } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    GemTypeSelector,
    GemCutSelector,
    GemSizeInput,
    GemColorSelector,
    TransparencySelector,
    ImageUpload,
    DesignPrompt,
    MaterialPreferences,
    GenerateButton,
} from '@/components/forms';
import type { GemTypeName } from '@/constants/gemTypes';
import type { GemCutId } from '@/constants/gemCuts';
import type { TransparencyValue } from '@/constants/colors';
import type { GemSize } from '@/types/gem.types';
import type { MaterialPreferences as MaterialPreferencesType } from '@/types/form.types';

export default function CreateDesignPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [gemType, setGemType] = useState<GemTypeName | null>(null);
    const [customGemType, setCustomGemType] = useState('');
    const [gemCut, setGemCut] = useState<GemCutId | null>(null);
    const [gemSize, setGemSize] = useState<GemSize>({
        mode: 'simple',
        simple: null,
        dimensions: null,
        caratWeight: null,
    });
    const [gemColor, setGemColor] = useState<string | null>(null);
    const [customColor, setCustomColor] = useState('');
    const [transparency, setTransparency] = useState<TransparencyValue | null>(null);
    const [gemImage, setGemImage] = useState<File | null>(null);
    const [designPrompt, setDesignPrompt] = useState('');
    const [materials, setMaterials] = useState<MaterialPreferencesType>({
        metals: [],
        finish: null,
    });
    const [numVariations, setNumVariations] = useState<2 | 3 | 4>(3);

    // Validation
    const isFormValid =
        gemType !== null &&
        gemCut !== null &&
        (gemSize.mode === 'simple' ? gemSize.simple !== null : gemSize.dimensions?.lengthMm !== null) &&
        gemColor !== null &&
        transparency !== null &&
        designPrompt.length >= 10;

    const handleGemTypeChange = (type: GemTypeName, custom?: string) => {
        setGemType(type);
        if (custom !== undefined) {
            setCustomGemType(custom);
        }
    };

    const handleGemColorChange = (color: string, customHex?: string) => {
        setGemColor(color);
        if (customHex !== undefined) {
            setCustomColor(customHex);
        }
    };

    const handleGenerate = async () => {
        if (!isFormValid) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/generate-design', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gemData: {
                        type: gemType === 'Other' ? customGemType : gemType,
                        cut: gemCut,
                        size: gemSize.mode === 'simple' ? gemSize.simple : gemSize.dimensions,
                        color: gemColor === 'custom' ? customColor : gemColor,
                        transparency,
                    },
                    userPrompt: designPrompt,
                    materials: {
                        metals: materials.metals,
                        finish: materials.finish,
                    },
                    numVariations,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to generate design');
            }

            // Store design data in sessionStorage for results page
            const designDataToStore = {
                designId: data.designId,
                images: data.images,
                gemData: {
                    type: gemType === 'Other' ? customGemType : gemType,
                    cut: gemCut,
                    size: gemSize.mode === 'simple' ? gemSize.simple : 'Custom',
                    color: gemColor === 'custom' ? customColor : gemColor,
                    transparency,
                },
                prompt: designPrompt,
                materials: {
                    metals: materials.metals,
                    finish: materials.finish,
                },
            };
            sessionStorage.setItem(data.designId, JSON.stringify(designDataToStore));

            // Navigate to results page with design ID
            router.push(`/design/results?id=${data.designId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <header className="bg-navy text-white py-4 px-6">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <Gem className="w-8 h-8 text-gold" />
                    <h1 className="text-xl font-serif font-semibold">AI Jewelry Designer</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Page Title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif font-bold text-navy mb-2">
                        Create Your Dream Design
                    </h2>
                    <p className="text-slate">
                        Tell us about your gem and describe your vision
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-error rounded-lg text-error">
                        {error}
                    </div>
                )}

                {/* Form */}
                <div className="space-y-8">
                    {/* Section 1: Gem Information */}
                    <section className="bg-white rounded-xl p-6 shadow-sm border border-light-gray">
                        <h3 className="text-lg font-serif font-semibold text-navy mb-6 pb-2 border-b border-light-gray">
                            1. Gem Information
                        </h3>
                        <div className="space-y-6">
                            <GemTypeSelector
                                value={gemType}
                                onChange={handleGemTypeChange}
                                customType={customGemType}
                                required
                            />
                            <GemCutSelector
                                value={gemCut}
                                onChange={setGemCut}
                                required
                            />
                            <GemSizeInput
                                value={gemSize}
                                onChange={setGemSize}
                                required
                            />
                            <GemColorSelector
                                value={gemColor}
                                onChange={handleGemColorChange}
                                customColor={customColor}
                                required
                            />
                            <TransparencySelector
                                value={transparency}
                                onChange={setTransparency}
                                required
                            />
                        </div>
                    </section>

                    {/* Section 2: Image Upload */}
                    <section className="bg-white rounded-xl p-6 shadow-sm border border-light-gray">
                        <h3 className="text-lg font-serif font-semibold text-navy mb-6 pb-2 border-b border-light-gray">
                            2. Gem Photo
                        </h3>
                        <ImageUpload
                            value={gemImage}
                            onChange={setGemImage}
                        />
                    </section>

                    {/* Section 3: Design Description */}
                    <section className="bg-white rounded-xl p-6 shadow-sm border border-light-gray">
                        <h3 className="text-lg font-serif font-semibold text-navy mb-6 pb-2 border-b border-light-gray">
                            3. Design Description
                        </h3>
                        <div className="space-y-6">
                            <DesignPrompt
                                value={designPrompt}
                                onChange={setDesignPrompt}
                                required
                            />
                            <MaterialPreferences
                                value={materials}
                                onChange={setMaterials}
                            />
                        </div>
                    </section>

                    {/* Section 4: Generate */}
                    <section className="bg-white rounded-xl p-6 shadow-sm border border-light-gray">
                        <h3 className="text-lg font-serif font-semibold text-navy mb-6 pb-2 border-b border-light-gray">
                            4. Generate Your Design
                        </h3>
                        <GenerateButton
                            onClick={handleGenerate}
                            isLoading={isLoading}
                            disabled={!isFormValid}
                            numVariations={numVariations}
                            onVariationsChange={setNumVariations}
                        />
                    </section>
                </div>
            </main>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 shadow-2xl text-center max-w-md mx-4">
                        <div className="w-16 h-16 border-4 border-light-gray border-t-gold rounded-full animate-spin mx-auto mb-4" />
                        <h3 className="text-xl font-serif font-semibold text-navy mb-2">
                            Creating Your Designs
                        </h3>
                        <p className="text-slate">
                            Our AI is crafting unique jewelry concepts just for you...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
