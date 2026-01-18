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
            <label className="block text-sm font-medium text-gray-200 mb-2">
                What color is your gem?
                {required && <span className="text-gold ml-1">*</span>}
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
                        'bg-white/5 border rounded-xl backdrop-blur-sm',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50',
                        error ? 'border-red-500/50' : 'border-white/10',
                        disabled ? 'bg-white/5 cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-white/20 hover:bg-white/10',
                        isOpen && 'ring-2 ring-gold/50 border-gold/50'
                    )}
                >
                    <div className="flex items-center gap-3">
                        {/* Color Swatch Preview */}
                        {displayHex && (
                            <div
                                className="w-6 h-6 rounded-full border border-white/20"
                                style={{ backgroundColor: displayHex }}
                            />
                        )}
                        <span className={cn(value ? 'text-white' : 'text-gray-400')}>
                            {value === 'custom' && localCustomColor
                                ? `Custom (${localCustomColor})`
                                : selectedColor?.label || 'Select color...'}
                        </span>
                    </div>
                    <ChevronDown
                        className={cn(
                            'w-5 h-5 text-gray-400 transition-transform duration-200',
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
                            'absolute z-50 w-full mt-2',
                            'bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl',
                            'max-h-60 overflow-y-auto',
                            'py-2'
                        )}
                    >
                        {GEM_COLORS.map((color) => (
                            <li
                                key={color.value}
                                role="option"
                                aria-selected={value === color.value}
                                onClick={() => handleSelect(color.value)}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-2.5 cursor-pointer',
                                    'transition-colors duration-150',
                                    value === color.value
                                        ? 'bg-gold/20 text-gold font-medium'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                )}
                            >
                                {/* Color Swatch */}
                                {color.hex ? (
                                    <div
                                        className="w-5 h-5 rounded-full border border-white/20"
                                        style={{ backgroundColor: color.hex }}
                                    />
                                ) : (
                                    <div className="w-5 h-5 rounded-full border border-white/20 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400" />
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
                    <label className="text-sm text-gray-400">Pick your color:</label>
                    <input
                        type="color"
                        value={localCustomColor}
                        onChange={handleCustomColorChange}
                        disabled={disabled}
                        className={cn(
                            'w-12 h-10 rounded cursor-pointer border border-white/20 bg-transparent',
                            'focus:outline-none focus:ring-2 focus:ring-gold/50',
                            disabled && 'opacity-60 cursor-not-allowed'
                        )}
                    />
                    <span className="text-sm text-white/60 font-mono">{localCustomColor}</span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="mt-2 text-sm text-red-400" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

export default GemColorSelector;
