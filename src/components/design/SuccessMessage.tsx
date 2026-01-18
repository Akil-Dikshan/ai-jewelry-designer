'use client';

import { CheckCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessMessageProps {
    title?: string;
    message?: string;
    numVariations?: number;
}

export function SuccessMessage({
    title = 'Your Designs Are Ready!',
    message,
    numVariations = 3,
}: SuccessMessageProps) {
    return (
        <div className="text-center py-8">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-4">
                <CheckCircle className="w-8 h-8" />
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy mb-2">
                {title}
            </h2>

            {/* Message */}
            <p className="text-slate mx-auto leading-relaxed" style={{ maxWidth: '512px' }}>
                {message || (
                    `We've created ${numVariations} unique jewelry concepts based on your specifications. Select your favorite to refine or download.`
                )}
            </p>

            {/* Decorative Elements */}
            <div className="flex items-center justify-center gap-2 mt-4 text-gold">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Generated Concepts</span>
                <Sparkles className="w-4 h-4" />
            </div>
        </div>
    );
}

export default SuccessMessage;
