'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GEM_TYPES, type GemTypeName } from '@/constants/gemTypes';

interface GemTypeSelectorProps {
    value: GemTypeName | null;
    onChange: (value: GemTypeName, customType?: string) => void;
    customType?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

export function GemTypeSelector({
    value,
    onChange,
    customType = '',
    error,
    disabled = false,
    required = false,
}: GemTypeSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [localCustomType, setLocalCustomType] = useState(customType);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

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

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                setIsOpen(!isOpen);
                break;
            case 'Escape':
                setIsOpen(false);
                buttonRef.current?.focus();
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) setIsOpen(true);
                break;
        }
    };

    const handleSelect = (gemType: GemTypeName) => {
        onChange(gemType, gemType === 'Other' ? localCustomType : undefined);
        setIsOpen(false);
        buttonRef.current?.focus();
    };

    const handleCustomTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalCustomType(newValue);
        if (value === 'Other') {
            onChange('Other', newValue);
        }
    };

    const displayValue = value
        ? (value === 'Other' && localCustomType ? localCustomType : value)
        : 'Select gem type...';

    return (
        <div className="w-full">
            {/* Label */}
            <label className="block text-sm font-medium text-gray-200 mb-2">
                What type of gem do you have?
                {required && <span className="text-gold ml-1">*</span>}
            </label>

            {/* Dropdown Container */}
            <div ref={dropdownRef} className="relative">
                {/* Dropdown Button */}
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-labelledby="gem-type-label"
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
                    <span className={cn(
                        value ? 'text-white' : 'text-gray-400'
                    )}>
                        {displayValue}
                    </span>
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
                        aria-label="Gem types"
                        className={cn(
                            'absolute z-50 w-full mt-2',
                            'bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl',
                            'max-h-60 overflow-y-auto',
                            'py-2'
                        )}
                    >
                        {GEM_TYPES.map((gemType) => (
                            <li
                                key={gemType}
                                role="option"
                                aria-selected={value === gemType}
                                onClick={() => handleSelect(gemType)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleSelect(gemType);
                                    }
                                }}
                                tabIndex={0}
                                className={cn(
                                    'px-4 py-2.5 cursor-pointer',
                                    'transition-colors duration-150',
                                    'focus:outline-none',
                                    value === gemType
                                        ? 'bg-gold/20 text-gold font-medium'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                )}
                            >
                                {gemType}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Custom Type Input (shown when "Other" is selected) */}
            {value === 'Other' && (
                <div className="mt-3">
                    <input
                        type="text"
                        value={localCustomType}
                        onChange={handleCustomTypeChange}
                        placeholder="Enter your gem type..."
                        disabled={disabled}
                        className={cn(
                            'w-full px-4 py-3',
                            'bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm',
                            'text-white placeholder:text-white/30',
                            'transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50',
                            disabled && 'opacity-60 cursor-not-allowed'
                        )}
                    />
                </div>
            )}

            {/* Helper Text */}
            <p className="mt-2 text-sm text-gray-400">
                Select the primary gemstone for your design
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

export default GemTypeSelector;
