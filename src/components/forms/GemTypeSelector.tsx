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
            <label className="block text-sm font-medium text-navy mb-2">
                What type of gem do you have?
                {required && <span className="text-error ml-1">*</span>}
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
                        'bg-white border rounded-md',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold',
                        error ? 'border-error' : 'border-light-gray',
                        disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-slate',
                        isOpen && 'ring-2 ring-gold border-gold'
                    )}
                >
                    <span className={cn(
                        value ? 'text-navy' : 'text-slate'
                    )}>
                        {displayValue}
                    </span>
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
                        aria-label="Gem types"
                        className={cn(
                            'absolute z-50 w-full mt-1',
                            'bg-white border border-light-gray rounded-md shadow-lg',
                            'max-h-60 overflow-y-auto',
                            'py-1'
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
                                    'px-4 py-2 cursor-pointer',
                                    'transition-colors duration-150',
                                    'focus:outline-none focus:bg-cream',
                                    value === gemType
                                        ? 'bg-cream text-navy font-medium'
                                        : 'text-navy hover:bg-cream'
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
                            'bg-white border border-light-gray rounded-md',
                            'text-navy placeholder:text-slate',
                            'transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold',
                            disabled && 'bg-gray-100 cursor-not-allowed opacity-60'
                        )}
                    />
                </div>
            )}

            {/* Helper Text */}
            <p className="mt-2 text-sm text-slate">
                Select the primary gemstone for your design
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

export default GemTypeSelector;
