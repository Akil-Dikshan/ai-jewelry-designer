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
        <div className="w-full space-y-4">
            {/* Variations Selector */}
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-navy">
                    Number of design variations:
                </label>
                <div className="flex gap-2">
                    {([2, 3, 4] as const).map((num) => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => onVariationsChange(num)}
                            disabled={isLoading}
                            className={cn(
                                'w-10 h-10 rounded-md font-medium text-sm',
                                'transition-all duration-200',
                                'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2',
                                numVariations === num
                                    ? 'bg-gold text-navy'
                                    : 'bg-white border border-light-gray text-slate hover:border-gold',
                                isLoading && 'opacity-60 cursor-not-allowed'
                            )}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            {/* Generate Button */}
            <button
                type="button"
                onClick={handleClick}
                disabled={disabled || isLoading}
                className={cn(
                    'w-full flex items-center justify-center gap-3',
                    'px-8 py-4 rounded-lg',
                    'font-semibold text-lg',
                    'transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2',
                    disabled || isLoading
                        ? 'bg-light-gray text-slate cursor-not-allowed'
                        : 'bg-gold text-navy hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
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

            {/* Estimated Time */}
            {!isLoading && (
                <p className="text-center text-sm text-slate">
                    This will take 10-15 seconds
                </p>
            )}

            {/* Loading Progress Bar */}
            {isLoading && (
                <div className="relative h-2 bg-light-gray rounded-full overflow-hidden">
                    <div
                        className="absolute inset-y-0 left-0 bg-gold rounded-full transition-all duration-1000"
                        style={{
                            width: `${((loadingStep + 1) / LOADING_MESSAGES.length) * 100}%`,
                        }}
                    />
                </div>
            )}

            {/* Disclaimer */}
            <div className="flex items-start gap-2 p-3 bg-cream rounded-lg border border-light-gray">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate">
                    <span className="font-medium text-navy">Important:</span> These are concept renderings,
                    not final production designs. Actual jewelry may vary. Consult a professional
                    jeweler for production-ready designs.
                </p>
            </div>
        </div>
    );
}

export default GenerateButton;
