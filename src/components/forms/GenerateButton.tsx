'use client';

import { useState } from 'react';
import { Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerateButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    numVariations: 2 | 3 | 4;
    onVariationsChange: (num: 2 | 3 | 4) => void;
}

const LOADING_MESSAGES = [
    'Analyzing your gem...',
    'Creating design concepts...',
    'Adding final touches...',
];

export function GenerateButton({
    onClick,
    isLoading = false,
    disabled = false,
    numVariations,
    onVariationsChange,
}: GenerateButtonProps) {
    const [loadingStep, setLoadingStep] = useState(0);

    // Simulate loading messages
    if (isLoading && loadingStep < LOADING_MESSAGES.length - 1) {
        setTimeout(() => {
            setLoadingStep((prev) => Math.min(prev + 1, LOADING_MESSAGES.length - 1));
        }, 3000);
    }

    const handleClick = () => {
        if (!disabled && !isLoading) {
            setLoadingStep(0);
            onClick();
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Variations Selector */}
            <div className="flex items-center justify-center gap-4">
                <label className="text-sm font-medium text-white/70">
                    Variations:
                </label>
                <div className="flex gap-2">
                    {([2, 3, 4] as const).map((num) => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => onVariationsChange(num)}
                            disabled={isLoading}
                            className={cn(
                                'w-10 h-10 rounded-lg font-medium text-sm',
                                'transition-all duration-200',
                                'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[#0a0a0f]',
                                numVariations === num
                                    ? 'bg-gold text-navy'
                                    : 'bg-white/10 border border-white/20 text-white hover:border-gold/50',
                                isLoading && 'opacity-60 cursor-not-allowed'
                            )}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            {/* Generate Button - Centered and button-like */}
            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={handleClick}
                    disabled={disabled || isLoading}
                    className={cn(
                        'flex items-center justify-center gap-3',
                        'px-12 py-4 rounded-xl',
                        'font-semibold text-lg',
                        'transition-all duration-300',
                        'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[#0a0a0f]',
                        disabled || isLoading
                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                            : 'bg-gradient-to-r from-gold to-amber-600 text-navy hover:shadow-lg hover:shadow-gold/30 hover:scale-[1.02] active:scale-[0.98]'
                    )}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>{LOADING_MESSAGES[loadingStep]}</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-6 h-6" />
                            <span>Generate My Design</span>
                        </>
                    )}
                </button>
            </div>

            {/* Estimated Time */}
            {!isLoading && (
                <p className="text-center text-sm text-white/40">
                    This will take 10-15 seconds
                </p>
            )}

            {/* Loading Progress Bar */}
            {isLoading && (
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden max-w-md mx-auto">
                    <div
                        className="absolute inset-y-0 left-0 bg-gold rounded-full transition-all duration-1000"
                        style={{
                            width: `${((loadingStep + 1) / LOADING_MESSAGES.length) * 100}%`,
                        }}
                    />
                </div>
            )}

            {/* Disclaimer - Clear, readable, no glass effect */}
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/80">
                    <span className="font-semibold text-amber-400">Important:</span>{' '}
                    These are concept renderings, not final production designs. Actual jewelry may vary.
                    Consult a professional jeweler for production-ready designs.
                </p>
            </div>
        </div>
    );
}

export default GenerateButton;
