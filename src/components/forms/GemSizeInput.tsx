'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GEM_SIZES, type GemSizeValue } from '@/constants/materials';
import type { GemSize } from '@/types/gem.types';

interface GemSizeInputProps {
    value: GemSize;
    onChange: (value: GemSize) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

export function GemSizeInput({
    value,
    onChange,
    error,
    disabled = false,
    required = false,
}: GemSizeInputProps) {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(value.mode === 'advanced');

    const handleSimpleChange = (size: GemSizeValue) => {
        onChange({
            ...value,
            mode: 'simple',
            simple: size,
        });
    };

    const handleDimensionChange = (
        field: 'lengthMm' | 'widthMm' | 'heightMm' | 'caratWeight',
        inputValue: string
    ) => {
        const numValue = inputValue === '' ? null : parseFloat(inputValue);

        if (field === 'caratWeight') {
            onChange({
                ...value,
                mode: 'advanced',
                caratWeight: numValue,
            });
        } else {
            onChange({
                ...value,
                mode: 'advanced',
                dimensions: {
                    ...value.dimensions,
                    [field]: numValue,
                } as { lengthMm: number | null; widthMm: number | null; heightMm: number | null },
            });
        }
    };

    const toggleAdvanced = () => {
        const newIsAdvanced = !isAdvancedOpen;
        setIsAdvancedOpen(newIsAdvanced);

        if (newIsAdvanced) {
            onChange({
                ...value,
                mode: 'advanced',
                simple: null,
            });
        } else {
            onChange({
                ...value,
                mode: 'simple',
                dimensions: null,
                caratWeight: null,
            });
        }
    };

    return (
        <div className="w-full">
            {/* Label */}
            <label className="block text-sm font-medium text-navy mb-3">
                What size is your gem?
                {required && <span className="text-error ml-1">*</span>}
            </label>

            {/* Simple Size Options (Radio Buttons) */}
            {!isAdvancedOpen && (
                <div
                    role="radiogroup"
                    aria-label="Gem size"
                    className="space-y-2"
                >
                    {GEM_SIZES.map((size) => (
                        <label
                            key={size.value}
                            className={cn(
                                'flex items-start p-4 rounded-lg border-2 cursor-pointer',
                                'transition-all duration-200',
                                disabled && 'opacity-60 cursor-not-allowed',
                                value.simple === size.value
                                    ? 'border-gold bg-cream'
                                    : 'border-light-gray bg-white hover:border-gold'
                            )}
                        >
                            <input
                                type="radio"
                                name="gem-size"
                                value={size.value}
                                checked={value.simple === size.value}
                                onChange={() => handleSimpleChange(size.value)}
                                disabled={disabled}
                                className="sr-only"
                            />
                            <div
                                className={cn(
                                    'w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5',
                                    'transition-colors duration-200',
                                    value.simple === size.value
                                        ? 'border-gold bg-gold'
                                        : 'border-light-gray'
                                )}
                            >
                                {value.simple === size.value && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                            </div>
                            <div>
                                <span className="font-medium text-navy">{size.label}</span>
                                <p className="text-sm text-slate mt-0.5">{size.description}</p>
                            </div>
                        </label>
                    ))}
                </div>
            )}

            {/* Toggle to Advanced Mode */}
            <button
                type="button"
                onClick={toggleAdvanced}
                disabled={disabled}
                className={cn(
                    'flex items-center gap-1 mt-3',
                    'text-sm font-medium text-gold',
                    'hover:underline focus:outline-none focus:underline',
                    disabled && 'opacity-60 cursor-not-allowed'
                )}
            >
                {isAdvancedOpen ? (
                    <>
                        <ChevronUp className="w-4 h-4" />
                        Use simple sizes
                    </>
                ) : (
                    <>
                        <ChevronDown className="w-4 h-4" />
                        I know exact dimensions
                    </>
                )}
            </button>

            {/* Advanced Dimensions Input */}
            {isAdvancedOpen && (
                <div className="mt-4 p-4 bg-cream rounded-lg border border-light-gray">
                    <p className="text-sm text-slate mb-4">
                        Enter your gem dimensions in millimeters
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {/* Length */}
                        <div>
                            <label className="block text-xs font-medium text-navy mb-1">
                                Length (mm)
                            </label>
                            <input
                                type="number"
                                min="0.1"
                                max="100"
                                step="0.1"
                                value={value.dimensions?.lengthMm ?? ''}
                                onChange={(e) => handleDimensionChange('lengthMm', e.target.value)}
                                disabled={disabled}
                                placeholder="0.0"
                                className={cn(
                                    'w-full px-3 py-2 text-sm',
                                    'bg-white border border-light-gray rounded-md',
                                    'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold',
                                    disabled && 'opacity-60 cursor-not-allowed'
                                )}
                            />
                        </div>

                        {/* Width */}
                        <div>
                            <label className="block text-xs font-medium text-navy mb-1">
                                Width (mm)
                            </label>
                            <input
                                type="number"
                                min="0.1"
                                max="100"
                                step="0.1"
                                value={value.dimensions?.widthMm ?? ''}
                                onChange={(e) => handleDimensionChange('widthMm', e.target.value)}
                                disabled={disabled}
                                placeholder="0.0"
                                className={cn(
                                    'w-full px-3 py-2 text-sm',
                                    'bg-white border border-light-gray rounded-md',
                                    'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold',
                                    disabled && 'opacity-60 cursor-not-allowed'
                                )}
                            />
                        </div>

                        {/* Height */}
                        <div>
                            <label className="block text-xs font-medium text-navy mb-1">
                                Height (mm)
                            </label>
                            <input
                                type="number"
                                min="0.1"
                                max="100"
                                step="0.1"
                                value={value.dimensions?.heightMm ?? ''}
                                onChange={(e) => handleDimensionChange('heightMm', e.target.value)}
                                disabled={disabled}
                                placeholder="0.0"
                                className={cn(
                                    'w-full px-3 py-2 text-sm',
                                    'bg-white border border-light-gray rounded-md',
                                    'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold',
                                    disabled && 'opacity-60 cursor-not-allowed'
                                )}
                            />
                        </div>
                    </div>

                    {/* Carat Weight (Optional) */}
                    <div className="max-w-[200px]">
                        <label className="block text-xs font-medium text-navy mb-1">
                            Carat Weight (optional)
                        </label>
                        <input
                            type="number"
                            min="0.01"
                            max="100"
                            step="0.01"
                            value={value.caratWeight ?? ''}
                            onChange={(e) => handleDimensionChange('caratWeight', e.target.value)}
                            disabled={disabled}
                            placeholder="0.00"
                            className={cn(
                                'w-full px-3 py-2 text-sm',
                                'bg-white border border-light-gray rounded-md',
                                'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold',
                                disabled && 'opacity-60 cursor-not-allowed'
                            )}
                        />
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="mt-2 text-sm text-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

export default GemSizeInput;
