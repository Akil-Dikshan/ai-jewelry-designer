'use client';

import { cn } from '@/lib/utils';

interface QuickSuggestionsProps {
    onSuggestionClick: (suggestion: string) => void;
    disabled?: boolean;
}

const SUGGESTIONS = [
    'Make band thicker',
    'Add side stones',
    'Change to rose gold',
    'Lower profile setting',
    'Add engraving detail',
    'Make more minimalist',
    'Add vintage details',
    'Increase gem size',
];

export function QuickSuggestions({
    onSuggestionClick,
    disabled = false,
}: QuickSuggestionsProps) {
    return (
        <div className="w-full">
            {/* Label */}
            <label className="block text-sm font-medium text-navy mb-2">
                Quick suggestions
            </label>

            {/* Chips */}
            <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                    <button
                        key={suggestion}
                        type="button"
                        onClick={() => onSuggestionClick(suggestion)}
                        disabled={disabled}
                        className={cn(
                            'px-3 py-1.5 rounded-full text-sm',
                            'border border-light-gray bg-white',
                            'transition-all duration-200',
                            'hover:border-gold hover:bg-cream hover:text-gold',
                            'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2',
                            'active:scale-95',
                            disabled && 'opacity-60 cursor-not-allowed hover:border-light-gray hover:bg-white hover:text-navy'
                        )}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>

            {/* Helper */}
            <p className="mt-2 text-xs text-slate">
                Click to add to your refinement description
            </p>
        </div>
    );
}

export default QuickSuggestions;
