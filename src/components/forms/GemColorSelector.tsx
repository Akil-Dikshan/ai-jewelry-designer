'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GEM_COLORS } from '@/constants/colors';

interface GemColorSelectorProps {
    value: string | null;
    onChange: (value: string, customHex?: string) => void;
    customColor?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

export function GemColorSelector({
    value,
    onChange,
    customColor = '',
    error,
    disabled = false,
    required = false,
}: GemColorSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [localCustomColor, setLocalCustomColor] = useState(customColor || '#D4AF37');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (colorValue: string) => {
        if (colorValue === 'custom') {
            onChange(colorValue, localCustomColor);
        } else {
            onChange(colorValue);
        }
        setIsOpen(false);
    };

    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setLocalCustomColor(newColor);
        if (value === 'custom') {
            onChange('custom', newColor);
        }
    };

    const selectedColor = GEM_COLORS.find((c) => c.value === value);
    const displayHex = value === 'custom' ? localCustomColor : selectedColor?.hex;

    return (
        <div className="w-full">
            {/* Label */}
            <label className="block text-sm font-medium text-navy mb-2">
                What color is your gem?
                {required && <span className="text-error ml-1">*</span>}
            </label>

            {/* Dropdown Container */}
            <div ref={dropdownRef} className="relative">
                {/* Dropdown Button */}
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    className={cn(
                        'w-full flex items-center justify-between',
                        'px-4 py-3 text-left',
                        'bg-white border rounded-md',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold',
                        error ? 'border-error' : 'border-light-gray',
                        disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-slate',
                        isOpen && 'ring-2 ring-gold border-gold'
                    )}
                >
                    <div className="flex items-center gap-3">
                        {/* Color Swatch Preview */}
                        {displayHex && (
                            <div
                                className="w-6 h-6 rounded-full border border-light-gray"
                                style={{ backgroundColor: displayHex }}
                            />
                        )}
                        <span className={cn(value ? 'text-navy' : 'text-slate')}>
                            {value === 'custom' && localCustomColor
                                ? `Custom (${localCustomColor})`
                                : selectedColor?.label || 'Select color...'}
                        </span>
                    </div>
                    <ChevronDown
                        className={cn(
                            'w-5 h-5 text-slate transition-transform duration-200',
                            isOpen && 'rotate-180'
                        )}
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && !disabled && (
                    <ul
                        role="listbox"
                        aria-label="Gem colors"
                        className={cn(
                            'absolute z-50 w-full mt-1',
                            'bg-white border border-light-gray rounded-md shadow-lg',
                            'max-h-60 overflow-y-auto',
                            'py-1'
                        )}
                    >
                        {GEM_COLORS.map((color) => (
                            <li
                                key={color.value}
                                role="option"
                                aria-selected={value === color.value}
                                onClick={() => handleSelect(color.value)}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-2 cursor-pointer',
                                    'transition-colors duration-150',
                                    value === color.value
                                        ? 'bg-cream text-navy font-medium'
                                        : 'text-navy hover:bg-cream'
                                )}
                            >
                                {/* Color Swatch */}
                                {color.hex ? (
                                    <div
                                        className="w-5 h-5 rounded-full border border-light-gray"
                                        style={{ backgroundColor: color.hex }}
                                    />
                                ) : (
                                    <div className="w-5 h-5 rounded-full border border-light-gray bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400" />
                                )}
                                <span>{color.label}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Custom Color Picker (shown when "Custom" is selected) */}
            {value === 'custom' && (
                <div className="mt-3 flex items-center gap-3">
                    <label className="text-sm text-slate">Pick your color:</label>
                    <input
                        type="color"
                        value={localCustomColor}
                        onChange={handleCustomColorChange}
                        disabled={disabled}
                        className={cn(
                            'w-12 h-10 rounded cursor-pointer border border-light-gray',
                            'focus:outline-none focus:ring-2 focus:ring-gold',
                            disabled && 'opacity-60 cursor-not-allowed'
                        )}
                    />
                    <span className="text-sm text-slate font-mono">{localCustomColor}</span>
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

export default GemColorSelector;
