'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Gem, Check, ChevronRight, Sparkles, Upload, Palette, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserMenu, GuestBanner } from '@/components/layout';
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

// Step configuration
const STEPS = [
    { id: 1, title: 'Gem Details', icon: Gem, description: 'Type, cut, size & color' },
    { id: 2, title: 'Upload Photo', icon: Upload, description: 'Optional reference image' },
    { id: 3, title: 'Design Vision', icon: Palette, description: 'Describe your dream jewelry' },
    { id: 4, title: 'Generate', icon: Wand2, description: 'Create AI designs' },
];

export default function CreateDesignPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
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

    // Step validation
    const isStep1Valid = gemType !== null && gemCut !== null &&
        (gemSize.mode === 'simple' ? gemSize.simple !== null : gemSize.dimensions?.lengthMm !== null) &&
        gemColor !== null && transparency !== null;
    const isStep2Valid = true; // Optional step
    const isStep3Valid = designPrompt.length >= 10;
    const isFormValid = isStep1Valid && isStep3Valid;

    const getStepStatus = (stepId: number) => {
        if (stepId === 1) return isStep1Valid ? 'complete' : (currentStep === 1 ? 'current' : 'upcoming');
        if (stepId === 2) return currentStep > 2 ? 'complete' : (currentStep === 2 ? 'current' : 'upcoming');
        if (stepId === 3) return isStep3Valid ? 'complete' : (currentStep === 3 ? 'current' : 'upcoming');
        if (stepId === 4) return currentStep === 4 ? 'current' : 'upcoming';
        return 'upcoming';
    };

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

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream">
            {/* Guest Banner */}
            <GuestBanner variant="minimal" />

            {/* Header */}
            <header className="bg-navy text-white py-4 px-6 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Gem className="w-8 h-8 text-gold" />
                        <h1 className="text-xl font-serif font-semibold">AI Jewelry Designer</h1>
                    </Link>
                    <UserMenu />
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Page Title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-2">
                        Design Your Perfect Jewelry
                    </h2>
                    <p className="text-slate text-lg">
                        Follow the steps below to create your AI-generated masterpiece
                    </p>
                </div>

                {/* Stepper Navigation */}
                <div className="mb-10">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        {STEPS.map((step, index) => {
                            const status = getStepStatus(step.id);
                            const StepIcon = step.icon;

                            return (
                                <div key={step.id} className="flex items-center">
                                    {/* Step Circle */}
                                    <button
                                        onClick={() => setCurrentStep(step.id)}
                                        className={cn(
                                            'flex flex-col items-center gap-2 group transition-all',
                                            status === 'complete' && 'cursor-pointer',
                                            status === 'current' && 'cursor-default',
                                        )}
                                    >
                                        <div className={cn(
                                            'w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all',
                                            'border-2 shadow-md',
                                            status === 'complete' && 'bg-success border-success text-white',
                                            status === 'current' && 'bg-gold border-gold text-navy scale-110',
                                            status === 'upcoming' && 'bg-white border-light-gray text-slate',
                                        )}>
                                            {status === 'complete' ? (
                                                <Check className="w-6 h-6" />
                                            ) : (
                                                <StepIcon className="w-5 h-5 md:w-6 md:h-6" />
                                            )}
                                        </div>
                                        <div className="text-center hidden md:block">
                                            <p className={cn(
                                                'text-sm font-medium',
                                                status === 'current' ? 'text-navy' : 'text-slate'
                                            )}>
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-slate/70">{step.description}</p>
                                        </div>
                                    </button>

                                    {/* Connector Line */}
                                    {index < STEPS.length - 1 && (
                                        <div className={cn(
                                            'flex-1 h-1 mx-2 md:mx-4 rounded transition-colors',
                                            status === 'complete' ? 'bg-success' : 'bg-light-gray'
                                        )} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-error rounded-xl text-error max-w-3xl mx-auto animate-fade-in">
                        <p className="font-medium">⚠️ {error}</p>
                    </div>
                )}

                {/* Step Content */}
                <div className="max-w-3xl mx-auto">
                    {/* Step 1: Gem Details */}
                    {currentStep === 1 && (
                        <div className="animate-fade-in">
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-light-gray/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                                        <Gem className="w-5 h-5 text-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif font-semibold text-navy">Gem Details</h3>
                                        <p className="text-sm text-slate">Tell us about your gemstone</p>
                                    </div>
                                </div>

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
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={nextStep}
                                    disabled={!isStep1Valid}
                                    className={cn(
                                        'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
                                        isStep1Valid
                                            ? 'bg-navy text-white hover:bg-navy/90 shadow-lg hover:shadow-xl'
                                            : 'bg-light-gray text-slate cursor-not-allowed'
                                    )}
                                >
                                    Continue
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Upload Photo */}
                    {currentStep === 2 && (
                        <div className="animate-fade-in">
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-light-gray/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                                        <Upload className="w-5 h-5 text-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif font-semibold text-navy">Upload Photo</h3>
                                        <p className="text-sm text-slate">Optional: Add a reference image of your gem</p>
                                    </div>
                                </div>

                                <ImageUpload
                                    value={gemImage}
                                    onChange={setGemImage}
                                />
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-3 rounded-xl font-medium text-slate hover:text-navy transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-navy text-white hover:bg-navy/90 shadow-lg hover:shadow-xl transition-all"
                                >
                                    Continue
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Design Vision */}
                    {currentStep === 3 && (
                        <div className="animate-fade-in">
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-light-gray/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                                        <Palette className="w-5 h-5 text-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif font-semibold text-navy">Design Vision</h3>
                                        <p className="text-sm text-slate">Describe your dream jewelry piece</p>
                                    </div>
                                </div>

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
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-3 rounded-xl font-medium text-slate hover:text-navy transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={nextStep}
                                    disabled={!isStep3Valid}
                                    className={cn(
                                        'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
                                        isStep3Valid
                                            ? 'bg-navy text-white hover:bg-navy/90 shadow-lg hover:shadow-xl'
                                            : 'bg-light-gray text-slate cursor-not-allowed'
                                    )}
                                >
                                    Continue
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Generate */}
                    {currentStep === 4 && (
                        <div className="animate-fade-in">
                            <div className="bg-gradient-to-br from-navy to-navy/90 rounded-2xl p-6 md:p-8 shadow-xl text-white">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif font-semibold">Ready to Create</h3>
                                        <p className="text-sm text-white/70">Review and generate your designs</p>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="bg-white/10 rounded-xl p-5 mb-6 backdrop-blur-sm">
                                    <h4 className="font-medium mb-3 text-gold">Your Design Summary</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-white/60">Gem Type:</span>
                                            <span className="ml-2">{gemType === 'Other' ? customGemType : gemType}</span>
                                        </div>
                                        <div>
                                            <span className="text-white/60">Cut:</span>
                                            <span className="ml-2">{gemCut}</span>
                                        </div>
                                        <div>
                                            <span className="text-white/60">Color:</span>
                                            <span className="ml-2">{gemColor === 'custom' ? customColor : gemColor}</span>
                                        </div>
                                        <div>
                                            <span className="text-white/60">Transparency:</span>
                                            <span className="ml-2">{transparency}</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-white/10">
                                        <span className="text-white/60">Vision:</span>
                                        <p className="mt-1 text-sm line-clamp-2">{designPrompt}</p>
                                    </div>
                                </div>

                                <GenerateButton
                                    onClick={handleGenerate}
                                    isLoading={isLoading}
                                    disabled={!isFormValid}
                                    numVariations={numVariations}
                                    onVariationsChange={setNumVariations}
                                />
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-start mt-6">
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-3 rounded-xl font-medium text-slate hover:text-navy transition-colors"
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-navy/60 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl text-center mx-4 max-w-md animate-fade-in">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 border-4 border-light-gray rounded-full" />
                            <div className="absolute inset-0 border-4 border-transparent border-t-gold rounded-full animate-spin" />
                            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-gold animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-serif font-semibold text-navy mb-2">
                            Creating Magic ✨
                        </h3>
                        <p className="text-slate">
                            Our AI is crafting {numVariations} unique jewelry concepts just for you...
                        </p>
                        <div className="mt-4 text-sm text-slate/70">
                            This may take 15-30 seconds
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
