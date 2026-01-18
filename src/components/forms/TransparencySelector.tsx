'use client';

import { cn } from '@/lib/utils';
import { GEM_TRANSPARENCY, type TransparencyValue } from '@/constants/colors';
import { Eye, EyeOff, CircleDot } from 'lucide-react';

interface TransparencySelectorProps {
    value: TransparencyValue | null;
    onChange: (value: TransparencyValue) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

// Icons for each transparency level
const TransparencyIcon = ({ type }: { type: TransparencyValue }) => {
    switch (type) {
        case 'transparent':
            return <Eye className="w-8 h-8" />;
        case 'semi-transparent':
            return <CircleDot className="w-8 h-8" />;
        case 'opaque':
            return <EyeOff className="w-8 h-8" />;
        default:
            return null;
    }
};

export function TransparencySelector({
    value,
    onChange,
    error,
    disabled = false,
    required = false,
}: TransparencySelectorProps) {
    return (
        <div className="w-full">
            {/* Label */}
            <label className="block text-sm font-medium text-white/70 mb-3">
                How see-through is your gem?
                {required && <span className="text-gold ml-1">*</span>}
            </label>

            {/* Transparency Options */}
            <div
                role="radiogroup"
                aria-label="Gem transparency"
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
                {GEM_TRANSPARENCY.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={value === option.value}
                        onClick={() => !disabled && onChange(option.value)}
                        disabled={disabled}
                        className={cn(
                            'flex flex-col items-center p-5 rounded-xl',
                            'border transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0f]',
                            disabled && 'opacity-60 cursor-not-allowed',
                            !disabled && 'cursor-pointer',
                            value === option.value
                                ? 'border-gold/50 bg-gold/10 shadow-lg shadow-gold/10'
                                : 'border-white/10 bg-white/5 hover:border-gold/30 hover:bg-white/10'
                        )}
                    >
                        {/* Icon */}
                        <div
                            className={cn(
                                'mb-3 transition-colors duration-200',
                                value === option.value ? 'text-gold' : 'text-white/50'
                            )}
                        >
                            <TransparencyIcon type={option.value} />
                        </div>

                        {/* Label */}
                        <span
                            className={cn(
                                'font-medium text-sm transition-colors duration-200',
                                value === option.value ? 'text-gold' : 'text-white/80'
                            )}
                        >
                            {option.label}
                        </span>

                        {/* Description */}
                        <span className="text-xs text-white/40 mt-1 text-center">
                            {option.description}
                        </span>
                    </button>
                ))}
            </div>

            {/* Helper Text */}
            <p className="mt-3 text-sm text-white/40">
                This helps us render light and reflections accurately
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

export default TransparencySelector;
