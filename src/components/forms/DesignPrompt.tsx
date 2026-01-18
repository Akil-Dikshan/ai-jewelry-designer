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
            <label className="block text-sm font-medium text-gray-200 mb-2">
                Describe your dream jewelry design
                {required && <span className="text-gold ml-1">*</span>}
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
                        'bg-white/5 border rounded-xl backdrop-blur-sm',
                        'text-white placeholder:text-white/30',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50',
                        error || isOverLimit ? 'border-red-500/50' : 'border-white/10',
                        disabled && 'opacity-60 cursor-not-allowed'
                    )}
                />

                {/* Character Counter */}
                <div
                    className={cn(
                        'absolute bottom-3 right-3',
                        'text-xs font-medium',
                        isOverLimit
                            ? 'text-red-400'
                            : isNearLimit
                                ? 'text-amber-400'
                                : 'text-gray-400'
                    )}
                >
                    {characterCount}/{maxLength}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-sm text-red-400" role="alert">
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
                    'hover:text-gold/80 focus:outline-none'
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
                <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm font-medium text-white/80 mb-2">
                        Tips for better designs:
                    </p>
                    <ul className="space-y-1.5">
                        {DESIGN_TIPS.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
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
