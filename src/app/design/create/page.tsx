'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Hexagon, Check, ChevronRight, ChevronLeft, Camera, Paintbrush, Wand2, Gem, Crown } from 'lucide-react';
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
    { id: 1, title: 'Gem Details', icon: Gem, description: 'Describe your gemstone' },
    { id: 2, title: 'Reference', icon: Camera, description: 'Add a photo' },
    { id: 3, title: 'Vision', icon: Paintbrush, description: 'Your dream design' },
    { id: 4, title: 'Create', icon: Wand2, description: 'Generate magic' },
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
    const isStep2Valid = true;
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
        if (custom !== undefined) setCustomGemType(custom);
    };

    const handleGemColorChange = (color: string, customHex?: string) => {
        setGemColor(color);
        if (customHex !== undefined) setCustomColor(customHex);
    };

    const handleGenerate = async () => {
        if (!isFormValid) return;
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/generate-design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gemData: {
                        type: gemType === 'Other' ? customGemType : gemType,
                        cut: gemCut,
                        size: gemSize.mode === 'simple' ? gemSize.simple : gemSize.dimensions,
                        color: gemColor === 'custom' ? customColor : gemColor,
                        transparency,
                    },
                    userPrompt: designPrompt,
                    materials: { metals: materials.metals, finish: materials.finish },
                    numVariations,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || 'Failed to generate design');

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
                materials: { metals: materials.metals, finish: materials.finish },
            };
            localStorage.setItem(data.designId, JSON.stringify(designDataToStore));
            router.push(`/design/results?id=${data.designId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => { if (currentStep < 4) setCurrentStep(currentStep + 1); };
    const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-[#0a0a0f] to-blue-900/20" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
            </div>

            {/* Guest Banner */}
            <GuestBanner variant="minimal" />

            {/* Header - Glassmorphism */}
            <header className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-lg shadow-gold/20 group-hover:shadow-gold/40 transition-shadow">
                            <Hexagon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-serif font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            AI Jewelry Designer
                        </span>
                    </Link>
                    <UserMenu />
                </div>
            </header>

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
                {/* Hero Title */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm mb-4">
                        <Crown className="w-4 h-4" />
                        AI-Powered Design Studio
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3 text-gold/80">
                        Create Your Masterpiece
                    </h1>
                    <p className="text-white/50 text-lg max-w-xl mx-auto">
                        Transform your vision into stunning jewelry with the power of AI
                    </p>
                </div>

                {/* Horizontal Stepper */}
                <div className="mb-10">
                    <div className="flex items-center justify-center gap-0 md:gap-2">
                        {STEPS.map((step, index) => {
                            const status = getStepStatus(step.id);
                            const StepIcon = step.icon;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <button
                                        onClick={() => setCurrentStep(step.id)}
                                        className="flex items-center gap-3 group"
                                    >
                                        {/* Step Badge */}
                                        <div className={cn(
                                            'relative w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300',
                                            status === 'complete' && 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30',
                                            status === 'current' && 'bg-gradient-to-br from-gold to-amber-600 shadow-lg shadow-gold/40 scale-110',
                                            status === 'upcoming' && 'bg-white/5 border border-white/10',
                                        )}>
                                            {status === 'complete' ? (
                                                <Check className="w-6 h-6 text-white" />
                                            ) : (
                                                <StepIcon className={cn(
                                                    'w-5 h-5 md:w-6 md:h-6',
                                                    status === 'current' ? 'text-navy' : 'text-white/40'
                                                )} />
                                            )}
                                            {status === 'current' && (
                                                <div className="absolute -inset-1 rounded-2xl bg-gold/20 blur-lg -z-10" />
                                            )}
                                        </div>

                                        {/* Step Label - Hidden on mobile */}
                                        <div className="hidden lg:block text-left">
                                            <p className={cn(
                                                'text-sm font-medium transition-colors',
                                                status === 'current' ? 'text-gold' : 'text-white/60'
                                            )}>
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-white/30">{step.description}</p>
                                        </div>
                                    </button>

                                    {/* Connector */}
                                    {index < STEPS.length - 1 && (
                                        <div className={cn(
                                            'w-8 md:w-16 lg:w-24 h-0.5 mx-2 rounded-full transition-colors',
                                            status === 'complete' ? 'bg-emerald-500' : 'bg-white/10'
                                        )} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 backdrop-blur-sm animate-fade-in">
                        <p className="font-medium">⚠️ {error}</p>
                    </div>
                )}

                {/* Step Content - Glassmorphism Card */}
                <div className="relative">
                    {/* Glow behind card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 rounded-3xl blur-2xl" />

                    <div className="relative backdrop-blur-xl bg-white/[0.03] rounded-3xl border border-white/10 p-6 md:p-10 shadow-2xl">

                        {/* Step 1: Gem Details */}
                        {currentStep === 1 && (
                            <div className="animate-fade-in space-y-8">
                                <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                        <Gem className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-gold/80">Gem Details</h2>
                                        <p className="text-white/50">Tell us about your precious gemstone</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <GemTypeSelector value={gemType} onChange={handleGemTypeChange} customType={customGemType} required />
                                    <GemCutSelector value={gemCut} onChange={setGemCut} required />
                                    <GemSizeInput value={gemSize} onChange={setGemSize} required />
                                    <GemColorSelector value={gemColor} onChange={handleGemColorChange} customColor={customColor} required />
                                    <TransparencySelector value={transparency} onChange={setTransparency} required />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Upload */}
                        {currentStep === 2 && (
                            <div className="animate-fade-in space-y-8">
                                <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <Camera className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-white">Upload Reference</h2>
                                        <p className="text-white/50">Add a photo of your gem (optional)</p>
                                    </div>
                                </div>

                                <ImageUpload value={gemImage} onChange={setGemImage} />
                            </div>
                        )}

                        {/* Step 3: Vision */}
                        {currentStep === 3 && (
                            <div className="animate-fade-in space-y-8">
                                <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
                                        <Paintbrush className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-white">Design Vision</h2>
                                        <p className="text-white/50">Describe your dream jewelry piece</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <DesignPrompt value={designPrompt} onChange={setDesignPrompt} required />
                                    <MaterialPreferences value={materials} onChange={setMaterials} />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Generate */}
                        {currentStep === 4 && (
                            <div className="animate-fade-in space-y-8">
                                <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-lg shadow-gold/30">
                                        <Wand2 className="w-7 h-7 text-navy" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-white">Ready to Create</h2>
                                        <p className="text-white/50">Review your choices and generate designs</p>
                                    </div>
                                </div>

                                {/* Summary Cards */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                        <h4 className="text-sm font-medium text-gold mb-3 flex items-center gap-2">
                                            <Gem className="w-4 h-4" /> Gem Specifications
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span className="text-white/40">Type</span><span>{gemType === 'Other' ? customGemType : gemType}</span></div>
                                            <div className="flex justify-between"><span className="text-white/40">Cut</span><span>{gemCut}</span></div>
                                            <div className="flex justify-between"><span className="text-white/40">Color</span><span>{gemColor === 'custom' ? customColor : gemColor}</span></div>
                                            <div className="flex justify-between"><span className="text-white/40">Clarity</span><span>{transparency}</span></div>
                                        </div>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                        <h4 className="text-sm font-medium text-gold mb-3 flex items-center gap-2">
                                            <Paintbrush className="w-4 h-4" /> Design Vision
                                        </h4>
                                        <p className="text-sm text-white/70 line-clamp-4">{designPrompt || 'No description provided'}</p>
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
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between mt-10 pt-6 border-t border-white/10">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={cn(
                                    'flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all',
                                    currentStep === 1
                                        ? 'text-white/20 cursor-not-allowed'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                )}
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Back
                            </button>

                            {currentStep < 4 && (
                                <button
                                    onClick={nextStep}
                                    disabled={(currentStep === 1 && !isStep1Valid) || (currentStep === 3 && !isStep3Valid)}
                                    className={cn(
                                        'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all',
                                        ((currentStep === 1 && isStep1Valid) || currentStep === 2 || (currentStep === 3 && isStep3Valid))
                                            ? 'bg-gradient-to-r from-gold to-amber-500 text-navy shadow-lg shadow-gold/30 hover:shadow-gold/50 hover:scale-[1.02]'
                                            : 'bg-white/10 text-white/30 cursor-not-allowed'
                                    )}
                                >
                                    Continue
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Overlay - Premium */}
            {isLoading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#0a0a0f]/90 backdrop-blur-xl" />
                    <div className="relative text-center px-6">
                        {/* Animated rings */}
                        <div className="relative w-32 h-32 mx-auto mb-8">
                            <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-ping" />
                            <div className="absolute inset-2 rounded-full border-2 border-gold/30 animate-ping" style={{ animationDelay: '0.3s' }} />
                            <div className="absolute inset-4 rounded-full border-2 border-gold/40 animate-ping" style={{ animationDelay: '0.6s' }} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-2xl shadow-gold/40">
                                    <Wand2 className="w-10 h-10 text-navy animate-pulse" />
                                </div>
                            </div>
                        </div>

                        <h3 className="text-3xl font-serif font-bold text-white mb-2">
                            Creating Magic
                        </h3>
                        <p className="text-white/50 text-lg mb-6">
                            AI is crafting {numVariations} unique designs...
                        </p>

                        {/* Progress bar */}
                        <div className="w-64 mx-auto h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-gold to-amber-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                        </div>
                        <p className="text-white/30 text-sm mt-4">Usually takes 15-30 seconds</p>
                    </div>
                </div>
            )}
        </div>
    );
}
