'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { GEM_CUTS, type GemCutId } from '@/constants/gemCuts';

interface GemCutSelectorProps {
    value: GemCutId | null;
    onChange: (value: GemCutId) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

// Placeholder SVG icons for gem cuts (geometric representations)
const CutIcon = ({ cutId }: { cutId: string }) => {
    const iconMap: Record<string, React.ReactNode> = {
        'round-brilliant': (
            <svg viewBox="0 0 40 40" className="w-10 h-10">
                <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="20" y1="4" x2="20" y2="12" stroke="currentColor" strokeWidth="1" />
                <line x1="20" y1="28" x2="20" y2="36" stroke="currentColor" strokeWidth="1" />
                <line x1="4" y1="20" x2="12" y2="20" stroke="currentColor" strokeWidth="1" />
                <line x1="28" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1" />
            </svg>
        ),
        'oval': (
            <svg viewBox="0 0 40 40" className="w-10 h-10">
                <ellipse cx="20" cy="20" rx="16" ry="12" fill="none" stroke="currentColor" strokeWidth="2" />
                <ellipse cx="20" cy="20" rx="8" ry="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
        'cushion': (
            <svg viewBox="0 0 40 40" className="w-10 h-10">
                <rect x="6" y="6" width="28" height="28" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="12" y="12" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
        'pear': (
            <svg viewBox="0 0 40 40" className="w-10 h-10">
                <path d="M20 4 C8 16, 8 32, 20 36 C32 32, 32 16, 20 4" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="20" cy="24" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
        'emerald': (
            <svg viewBox="0 0 40 40" className="w-10 h-10">
                <polygon points="8,10 32,10 36,14 36,26 32,30 8,30 4,26 4,14" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="12" y="14" width="16" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
        'marquise': (
            <svg viewBox="0 0 40 40" className="w-10 h-10">
                <ellipse cx="20" cy="20" rx="8" ry="16" fill="none" stroke="currentColor" strokeWidth="2" />
                <ellipse cx="20" cy="20" rx="4" ry="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
        'asscher': (
            <svg viewBox="0 0 40 40" className="w-10 h-10">
                <rect x="6" y="6" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="12" y="12" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="6" y1="6" x2="12" y2="12" stroke="currentColor" strokeWidth="1" />
                <line x1="34" y1="6" x2="28" y2="12" stroke="currentColor" strokeWidth="1" />
                <line x1="6" y1="34" x2="12" y2="28" stroke="currentColor" strokeWidth="1" />
                <line x1="34" y1="34" x2="28" y2="28" stroke="currentColor" strokeWidth="1" />
            </svg>
        ),
        'princess': (
            <svg viewBox="0 0 40 40" className="w-10 h-10">
                <rect x="6" y="6" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="6" y1="6" x2="34" y2="34" stroke="currentColor" strokeWidth="1.5" />
                <line x1="34" y1="6" x2="6" y2="34" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
        'radiant': (
            <svg viewBox="0 0 40 40" className="w-10 h-10">
                <polygon points="10,6 30,6 36,12 36,28 30,34 10,34 4,28 4,12" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
        'heart': (
            <svg viewBox="0 0 40 40" className="w-10 h-10">
                <path d="M20 36 C8 24 4 16 10 10 C14 6 18 8 20 12 C22 8 26 6 30 10 C36 16 32 24 20 36" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
    };

    return iconMap[cutId] || (
        <svg viewBox="0 0 40 40" className="w-10 h-10">
            <polygon points="20,4 36,36 4,36" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
};

export function GemCutSelector({
    value,
    onChange,
    error,
    disabled = false,
    required = false,
}: GemCutSelectorProps) {
    return (
        <div className="w-full">
            {/* Label */}
            <label className="block text-sm font-medium text-navy mb-3">
                What is the shape/cut of your gem?
                {required && <span className="text-error ml-1">*</span>}
            </label>

            {/* Grid of Cut Options */}
            <div
                role="radiogroup"
                aria-label="Gem cuts"
                className={cn(
                    'grid gap-3',
                    'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                )}
            >
                {GEM_CUTS.map((cut) => (
                    <button
                        key={cut.id}
                        type="button"
                        role="radio"
                        aria-checked={value === cut.id}
                        onClick={() => !disabled && onChange(cut.id)}
                        disabled={disabled}
                        title={cut.description}
                        className={cn(
                            'flex flex-col items-center justify-center',
                            'p-4 rounded-lg',
                            'border-2 transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2',
                            disabled && 'opacity-60 cursor-not-allowed',
                            !disabled && 'cursor-pointer',
                            value === cut.id
                                ? 'border-gold bg-cream text-gold shadow-md'
                                : 'border-light-gray bg-white text-slate hover:border-gold hover:text-gold hover:scale-105'
                        )}
                    >
                        {/* Cut Icon */}
                        <div className={cn(
                            'mb-2 transition-colors duration-200',
                            value === cut.id ? 'text-gold' : 'text-slate'
                        )}>
                            <CutIcon cutId={cut.id} />
                        </div>

                        {/* Cut Name */}
                        <span className={cn(
                            'text-xs font-medium text-center',
                            'transition-colors duration-200',
                            value === cut.id ? 'text-navy' : 'text-slate'
                        )}>
                            {cut.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Helper Text */}
            <p className="mt-3 text-sm text-slate">
                Click on a shape that matches your gemstone
            </p>

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-sm text-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

export default GemCutSelector;
