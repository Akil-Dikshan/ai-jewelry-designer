'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvancedOptionsValue {
    strength: number; // 1-5
    preserveGemSize: boolean;
    preserveShape: boolean;
    preserveMetalType: boolean;
    styleGuidance: string | null;
}

interface AdvancedOptionsProps {
    value: AdvancedOptionsValue;
    onChange: (value: AdvancedOptionsValue) => void;
    disabled?: boolean;
}

const STYLE_OPTIONS = [
    { value: '', label: 'No style preference' },
    { value: 'vintage', label: 'Make more vintage' },
    { value: 'modern', label: 'Make more modern' },
    { value: 'minimal', label: 'Make more minimal' },
    { value: 'ornate', label: 'Make more ornate' },
];

const STRENGTH_LABELS = ['Subtle', '', 'Moderate', '', 'Major'];

export function AdvancedOptions({
    value,
    onChange,
    disabled = false,
}: AdvancedOptionsProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleStrengthChange = (strength: number) => {
        onChange({ ...value, strength });
    };

    const handlePreserveChange = (field: keyof AdvancedOptionsValue, checked: boolean) => {
        onChange({ ...value, [field]: checked });
    };

    const handleStyleChange = (style: string) => {
        onChange({ ...value, styleGuidance: style || null });
    };

    return (
        <div className="w-full">
            {/* Toggle Header */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
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
                <span className="text-sm font-medium text-navy">
                    Advanced Options
                </span>
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-slate" />
                )}
            </button>

            {/* Expandable Content */}
            {isExpanded && (
                <div className="mt-3 p-4 bg-white border border-light-gray rounded-lg space-y-5">
                    {/* Refinement Strength */}
                    <div>
                        <label className="block text-sm font-medium text-navy mb-2">
                            Refinement Strength
                        </label>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={value.strength}
                                onChange={(e) => handleStrengthChange(parseInt(e.target.value))}
                                disabled={disabled}
                                className={cn(
                                    'w-full h-2 rounded-lg appearance-none cursor-pointer',
                                    'bg-light-gray accent-gold',
                                    disabled && 'opacity-60 cursor-not-allowed'
                                )}
                            />
                            <div className="flex justify-between text-xs text-slate px-1">
                                {STRENGTH_LABELS.map((label, i) => (
                                    <span key={i} className={value.strength === i + 1 ? 'text-gold font-medium' : ''}>
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preserve Elements */}
                    <div>
                        <label className="block text-sm font-medium text-navy mb-2">
                            Preserve Elements
                        </label>
                        <div className="space-y-2">
                            {[
                                { key: 'preserveGemSize', label: 'Keep gem size' },
                                { key: 'preserveShape', label: 'Keep overall shape' },
                                { key: 'preserveMetalType', label: 'Keep metal type' },
                            ].map((item) => (
                                <label
                                    key={item.key}
                                    className={cn(
                                        'flex items-center gap-2 cursor-pointer',
                                        disabled && 'opacity-60 cursor-not-allowed'
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        checked={value[item.key as keyof AdvancedOptionsValue] as boolean}
                                        onChange={(e) => handlePreserveChange(item.key as keyof AdvancedOptionsValue, e.target.checked)}
                                        disabled={disabled}
                                        className="w-4 h-4 rounded border-light-gray text-gold focus:ring-gold"
                                    />
                                    <span className="text-sm text-slate">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Style Guidance */}
                    <div>
                        <label className="block text-sm font-medium text-navy mb-2">
                            Style Guidance
                        </label>
                        <select
                            value={value.styleGuidance || ''}
                            onChange={(e) => handleStyleChange(e.target.value)}
                            disabled={disabled}
                            className={cn(
                                'w-full px-3 py-2 rounded-lg',
                                'border border-light-gray bg-white',
                                'text-sm text-navy',
                                'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold',
                                disabled && 'opacity-60 cursor-not-allowed'
                            )}
                        >
                            {STYLE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdvancedOptions;
