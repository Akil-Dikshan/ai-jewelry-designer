'use client';

import { useState } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonViewProps {
    beforeImageUrl: string;
    afterImageUrl: string;
    beforeLabel?: string;
    afterLabel?: string;
    isEnabled: boolean;
    onToggle: (enabled: boolean) => void;
}

export function ComparisonView({
    beforeImageUrl,
    afterImageUrl,
    beforeLabel = 'Before',
    afterLabel = 'After',
    isEnabled,
    onToggle,
}: ComparisonViewProps) {
    const [sliderPosition, setSliderPosition] = useState(50);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSliderPosition(parseInt(e.target.value));
    };

    return (
        <div className="w-full">
            {/* Toggle Switch */}
            <button
                type="button"
                onClick={() => onToggle(!isEnabled)}
                className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg',
                    'text-sm font-medium transition-colors',
                    isEnabled
                        ? 'bg-gold/10 text-gold'
                        : 'bg-cream text-slate hover:text-navy'
                )}
            >
                {isEnabled ? (
                    <ToggleRight className="w-5 h-5" />
                ) : (
                    <ToggleLeft className="w-5 h-5" />
                )}
                Compare with previous
            </button>

            {/* Comparison View */}
            {isEnabled && (
                <div className="mt-4 relative rounded-xl overflow-hidden border border-light-gray">
                    {/* Side by Side (Desktop) */}
                    <div className="hidden md:grid grid-cols-2 gap-0">
                        {/* Before */}
                        <div className="relative">
                            <img
                                src={beforeImageUrl}
                                alt={beforeLabel}
                                className="w-full aspect-square object-cover"
                            />
                            <div className="absolute top-3 left-3 px-2 py-1 bg-navy/80 text-white text-xs font-medium rounded backdrop-blur-sm">
                                {beforeLabel}
                            </div>
                        </div>

                        {/* After */}
                        <div className="relative border-l border-light-gray">
                            <img
                                src={afterImageUrl}
                                alt={afterLabel}
                                className="w-full aspect-square object-cover"
                            />
                            <div className="absolute top-3 right-3 px-2 py-1 bg-gold text-navy text-xs font-medium rounded">
                                {afterLabel}
                            </div>
                        </div>
                    </div>

                    {/* Slider Overlay (Mobile) */}
                    <div className="md:hidden relative aspect-square">
                        {/* After Image (Bottom Layer) */}
                        <img
                            src={afterImageUrl}
                            alt={afterLabel}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Before Image (Top Layer with Clip) */}
                        <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                        >
                            <img
                                src={beforeImageUrl}
                                alt={beforeLabel}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Slider Line */}
                        <div
                            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                            style={{ left: `${sliderPosition}%` }}
                        >
                            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                                <div className="flex gap-0.5">
                                    <div className="w-0.5 h-3 bg-slate rounded" />
                                    <div className="w-0.5 h-3 bg-slate rounded" />
                                </div>
                            </div>
                        </div>

                        {/* Slider Input */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderPosition}
                            onChange={handleSliderChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                        />

                        {/* Labels */}
                        <div className="absolute top-3 left-3 px-2 py-1 bg-navy/80 text-white text-xs font-medium rounded backdrop-blur-sm">
                            {beforeLabel}
                        </div>
                        <div className="absolute top-3 right-3 px-2 py-1 bg-gold text-navy text-xs font-medium rounded">
                            {afterLabel}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ComparisonView;
