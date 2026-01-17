'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RefinementInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit?: () => void;
    maxLength?: number;
    disabled?: boolean;
    placeholder?: string;
}

export function RefinementInput({
    value,
    onChange,
    onSubmit,
    maxLength = 300,
    disabled = false,
    placeholder = "Describe the changes you'd like to make...",
}: RefinementInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const characterCount = value.length;
    const isNearLimit = characterCount > maxLength * 0.8;
    const isOverLimit = characterCount > maxLength;

    // Handle Enter key to submit
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && onSubmit && value.trim().length > 0) {
            e.preventDefault();
            onSubmit();
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [value]);

    return (
        <div className="w-full">
            {/* Label */}
            <label className="block text-sm font-medium text-navy mb-2">
                How would you like to modify this design?
            </label>

            {/* Textarea */}
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    maxLength={maxLength}
                    rows={3}
                    placeholder={placeholder}
                    className={cn(
                        'w-full px-4 py-3 resize-none',
                        'bg-white border rounded-lg',
                        'text-navy placeholder:text-slate/60',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold',
                        isOverLimit ? 'border-error' : 'border-light-gray',
                        disabled && 'bg-gray-100 cursor-not-allowed opacity-60'
                    )}
                />

                {/* Character Counter */}
                <div
                    className={cn(
                        'absolute bottom-3 right-3',
                        'text-xs font-medium',
                        isOverLimit
                            ? 'text-error'
                            : isNearLimit
                                ? 'text-warning'
                                : 'text-slate'
                    )}
                >
                    {characterCount}/{maxLength}
                </div>
            </div>

            {/* Helper Text */}
            <p className="mt-2 text-xs text-slate">
                Press <kbd className="px-1.5 py-0.5 bg-cream rounded text-navy font-mono">Enter</kbd> to generate •
                <kbd className="px-1.5 py-0.5 bg-cream rounded text-navy font-mono ml-1">Shift+Enter</kbd> for new line
            </p>
        </div>
    );
}

export default RefinementInput;
