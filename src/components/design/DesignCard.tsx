'use client';

import { useState } from 'react';
import { Download, Heart, Maximize2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DesignCardProps {
    imageUrl: string;
    imageId: string;
    index: number;
    total: number;
    isSelected?: boolean;
    isFavorite?: boolean;
    onSelect: () => void;
    onDownload: () => void;
    onFavorite?: () => void;
    onViewFull: () => void;
}

export function DesignCard({
    imageUrl,
    imageId,
    index,
    total,
    isSelected = false,
    isFavorite = false,
    onSelect,
    onDownload,
    onFavorite,
    onViewFull,
}: DesignCardProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={cn(
                'relative bg-white rounded-xl border-2 overflow-hidden',
                'transition-all duration-300',
                isSelected
                    ? 'border-gold shadow-lg ring-2 ring-gold/20'
                    : 'border-light-gray hover:border-gold hover:shadow-lg',
                'group'
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-square bg-cream">
                {/* Loading Skeleton */}
                {isLoading && (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-cream via-light-gray to-cream" />
                )}

                {/* Image */}
                <img
                    src={imageUrl}
                    alt={`Design concept ${index + 1} of ${total}`}
                    className={cn(
                        'w-full h-full object-cover transition-all duration-500',
                        isLoading ? 'opacity-0' : 'opacity-100',
                        isHovered && 'scale-105'
                    )}
                    onLoad={() => setIsLoading(false)}
                />

                {/* Image Number Badge */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-navy/80 text-white text-xs font-medium rounded-md backdrop-blur-sm">
                    Design {index + 1} of {total}
                </div>

                {/* Favorite Button */}
                {onFavorite && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onFavorite();
                        }}
                        className={cn(
                            'absolute top-3 right-3 p-2 rounded-full',
                            'transition-all duration-200',
                            isFavorite
                                ? 'bg-gold text-white'
                                : 'bg-white/80 text-slate hover:bg-gold hover:text-white backdrop-blur-sm'
                        )}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
                    </button>
                )}

                {/* Hover Overlay */}
                <div
                    className={cn(
                        'absolute inset-0 bg-navy/40 flex items-center justify-center',
                        'transition-opacity duration-300',
                        isHovered ? 'opacity-100' : 'opacity-0'
                    )}
                >
                    <button
                        type="button"
                        onClick={onViewFull}
                        className="p-3 bg-white rounded-full text-navy hover:bg-gold hover:text-white transition-colors"
                        aria-label="View full size"
                    >
                        <Maximize2 className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 space-y-3">
                {/* Primary Action */}
                <button
                    type="button"
                    onClick={onSelect}
                    className={cn(
                        'w-full flex items-center justify-center gap-2',
                        'px-4 py-3 rounded-lg font-medium text-sm',
                        'transition-all duration-200',
                        isSelected
                            ? 'bg-gold text-navy'
                            : 'bg-navy text-white hover:bg-gold hover:text-navy'
                    )}
                >
                    <Sparkles className="w-4 h-4" />
                    {isSelected ? 'Selected' : 'Select & Refine'}
                </button>

                {/* Secondary Action */}
                <button
                    type="button"
                    onClick={onDownload}
                    className={cn(
                        'w-full flex items-center justify-center gap-2',
                        'px-4 py-2 rounded-lg font-medium text-sm',
                        'border-2 border-light-gray text-slate',
                        'hover:border-gold hover:text-gold transition-colors'
                    )}
                >
                    <Download className="w-4 h-4" />
                    Download
                </button>
            </div>
        </div>
    );
}

export default DesignCard;
