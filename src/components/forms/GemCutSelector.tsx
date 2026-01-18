'use client';

import React from 'react';
import {
    Circle,
    Diamond,
    Square,
    Pentagon,
    Hexagon,
    Heart,
    RectangleHorizontal,
    Octagon,
    Triangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GEM_CUTS, type GemCutId } from '@/constants/gemCuts';

interface GemCutSelectorProps {
    value: GemCutId | null;
    onChange: (value: GemCutId) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

// Map gem cuts to Lucide icons
const CutIcon = ({ cutId }: { cutId: string }) => {
    const iconMap: Record<string, React.ReactNode> = {
        'round-brilliant': <Circle className="w-8 h-8" strokeWidth={1.5} />,
        'oval': <Circle className="w-8 h-8 scale-x-125" strokeWidth={1.5} />,
        'cushion': <Square className="w-8 h-8 rounded-lg" strokeWidth={1.5} />,
        'pear': <Diamond className="w-8 h-8" strokeWidth={1.5} />,
        'emerald': <RectangleHorizontal className="w-8 h-8" strokeWidth={1.5} />,
        'marquise': <Diamond className="w-8 h-8 scale-y-150" strokeWidth={1.5} />,
        'asscher': <Square className="w-8 h-8" strokeWidth={1.5} />,
        'princess': <Square className="w-8 h-8 rotate-45" strokeWidth={1.5} />,
        'radiant': <Octagon className="w-8 h-8" strokeWidth={1.5} />,
        'heart': <Heart className="w-8 h-8" strokeWidth={1.5} />,
    };

    return iconMap[cutId] || <Triangle className="w-8 h-8" strokeWidth={1.5} />;
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
            <label className="block text-sm font-medium text-gray-200 mb-3">
                What is the shape/cut of your gem?
                {required && <span className="text-gold ml-1">*</span>}
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
                            'p-4 rounded-xl',
                            'border transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0f]',
                            disabled && 'opacity-60 cursor-not-allowed',
                            !disabled && 'cursor-pointer',
                            value === cut.id
                                ? 'border-gold/50 bg-gold/10 text-gold shadow-lg shadow-gold/10'
                                : 'border-white/10 bg-white/5 text-white/60 hover:border-gold/30 hover:bg-white/10 hover:text-white hover:scale-105'
                        )}
                    >
                        {/* Cut Icon */}
                        <div className={cn(
                            'mb-2 transition-colors duration-200',
                            value === cut.id ? 'text-gold' : 'text-white/50'
                        )}>
                            <CutIcon cutId={cut.id} />
                        </div>

                        {/* Cut Name */}
                        <span className={cn(
                            'text-xs font-medium text-center',
                            'transition-colors duration-200',
                            value === cut.id ? 'text-gold' : 'text-white/70'
                        )}>
                            {cut.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Helper Text */}
            <p className="mt-3 text-sm text-gray-400">
                Click on a shape that matches your gemstone
            </p>

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-sm text-red-400" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

export default GemCutSelector;
