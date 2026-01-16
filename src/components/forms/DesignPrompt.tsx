'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DesignPromptProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    maxLength?: number;
}

const DESIGN_TIPS = [
    'Be specific about style (vintage, modern, minimalist, ornate)',
    'Mention metal preference (gold, platinum, silver)',
    'Describe setting type (prong, bezel, pave, halo)',
    'Include any special features (engraving, side stones, texture)',
];

const EXAMPLE_PROMPTS = [
    'Art deco engagement ring with halo setting in platinum',
    'Vintage-style pendant necklace with filigree details',
    'Modern minimalist solitaire ring with thin band',
    'Three-stone ring with side diamonds in yellow gold',
];

export function DesignPrompt({
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    maxLength = 1000,
}: DesignPromptProps) {
    const [showTips, setShowTips] = useState(false);
    const characterCount = value.length;
    const isNearLimit = characterCount > maxLength * 0.9;
    const isOverLimit = characterCount > maxLength;

    return (
        <div className="w-full">
            {/* Label */}
            <label className="block text-sm font-medium text-navy mb-2">
                Describe your dream jewelry design
                {required && <span className="text-error ml-1">*</span>}
            </label>

            {/* Textarea */}
            <div className="relative">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    maxLength={maxLength}
                    rows={5}
                    placeholder={`Examples:\n– ${EXAMPLE_PROMPTS.join('\n– ')}`}
                    className={cn(
                        'w-full px-4 py-3 resize-none',
                        'bg-white border rounded-lg',
                        'text-navy placeholder:text-slate/60',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold',
                        error || isOverLimit ? 'border-error' : 'border-light-gray',
                        disabled && 'bg-gray-100 cursor-not-allowed opacity-60'
                    )}
                />

                {/* Character Counter */}
                <div
                    className={cn(
                        'absolute bottom-3 right-3',
                        'text-xs font-medium',
                        isOverLimit
                            ? 'text-error'
                            : isNearLimit
                                ? 'text-warning'
                                : 'text-slate'
                    )}
                >
                    {characterCount}/{maxLength}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-sm text-error" role="alert">
                    {error}
                </p>
            )}

            {/* Design Tips Toggle */}
            <button
                type="button"
                onClick={() => setShowTips(!showTips)}
                className={cn(
                    'flex items-center gap-2 mt-3',
                    'text-sm font-medium text-gold',
                    'hover:underline focus:outline-none focus:underline'
                )}
            >
                <Lightbulb className="w-4 h-4" />
                Design Tips
                {showTips ? (
                    <ChevronUp className="w-4 h-4" />
                ) : (
                    <ChevronDown className="w-4 h-4" />
                )}
            </button>

            {/* Design Tips Content */}
            {showTips && (
                <div className="mt-3 p-4 bg-cream rounded-lg border border-light-gray">
                    <p className="text-sm font-medium text-navy mb-2">
                        Tips for better designs:
                    </p>
                    <ul className="space-y-1.5">
                        {DESIGN_TIPS.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-slate">
                                <span className="text-gold mt-0.5">•</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default DesignPrompt;
