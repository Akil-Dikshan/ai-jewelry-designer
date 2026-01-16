'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { METAL_TYPES, METAL_FINISHES, type MetalFinish } from '@/constants/materials';
import type { MaterialPreferences as MaterialPreferencesType } from '@/types/form.types';

interface MaterialPreferencesProps {
    value: MaterialPreferencesType;
    onChange: (value: MaterialPreferencesType) => void;
    disabled?: boolean;
}

export function MaterialPreferences({
    value,
    onChange,
    disabled = false,
}: MaterialPreferencesProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleMetalToggle = (metalValue: string) => {
        const currentMetals = value.metals || [];
        const newMetals = currentMetals.includes(metalValue)
            ? currentMetals.filter((m) => m !== metalValue)
            : [...currentMetals, metalValue];

        onChange({
            ...value,
            metals: newMetals,
        });
    };

    const handleFinishChange = (finish: MetalFinish) => {
        onChange({
            ...value,
            finish,
        });
    };

    const selectedCount = (value.metals?.length || 0) + (value.finish ? 1 : 0);

    return (
        <div className="w-full">
            {/* Collapsible Header */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    'w-full flex items-center justify-between',
                    'px-4 py-3 rounded-lg',
                    'bg-cream border border-light-gray',
                    'transition-all duration-200',
                    'hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold',
                    disabled && 'opacity-60 cursor-not-allowed'
                )}
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-navy">
                        Metal & Materials
                    </span>
                    <span className="text-xs text-slate">(optional)</span>
                    {selectedCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gold text-navy rounded-full">
                            {selectedCount} selected
                        </span>
                    )}
                </div>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate" />
                )}
            </button>

            {/* Collapsible Content */}
            {isOpen && (
                <div className="mt-3 p-4 bg-white border border-light-gray rounded-lg space-y-6">
                    {/* Metal Types (Checkboxes) */}
                    <div>
                        <p className="text-sm font-medium text-navy mb-3">
                            Metal Type
                            <span className="text-slate font-normal ml-1">(select one or more)</span>
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {METAL_TYPES.map((metal) => (
                                <label
                                    key={metal.value}
                                    className={cn(
                                        'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer',
                                        'border transition-all duration-200',
                                        disabled && 'opacity-60 cursor-not-allowed',
                                        value.metals?.includes(metal.value)
                                            ? 'border-gold bg-cream'
                                            : 'border-light-gray hover:border-gold'
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        checked={value.metals?.includes(metal.value) || false}
                                        onChange={() => handleMetalToggle(metal.value)}
                                        disabled={disabled}
                                        className={cn(
                                            'w-4 h-4 rounded border-light-gray',
                                            'text-gold focus:ring-gold focus:ring-offset-0',
                                            'transition-colors'
                                        )}
                                    />
                                    <span className="text-sm text-navy">{metal.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Finish (Radio Buttons) */}
                    <div>
                        <p className="text-sm font-medium text-navy mb-3">
                            Finish
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {METAL_FINISHES.map((finish) => (
                                <label
                                    key={finish.value}
                                    className={cn(
                                        'flex items-start gap-2 px-3 py-2 rounded-md cursor-pointer',
                                        'border transition-all duration-200',
                                        disabled && 'opacity-60 cursor-not-allowed',
                                        value.finish === finish.value
                                            ? 'border-gold bg-cream'
                                            : 'border-light-gray hover:border-gold'
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="metal-finish"
                                        checked={value.finish === finish.value}
                                        onChange={() => handleFinishChange(finish.value)}
                                        disabled={disabled}
                                        className={cn(
                                            'w-4 h-4 mt-0.5 border-light-gray',
                                            'text-gold focus:ring-gold focus:ring-offset-0',
                                            'transition-colors'
                                        )}
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-navy">{finish.label}</span>
                                        <p className="text-xs text-slate">{finish.description}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MaterialPreferences;
