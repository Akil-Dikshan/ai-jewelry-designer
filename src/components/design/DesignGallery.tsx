'use client';

import { useState } from 'react';
import { DesignCard } from './DesignCard';
import { cn } from '@/lib/utils';

interface GeneratedImage {
    imageId: string;
    imageUrl: string;
    thumbnailUrl?: string;
}

interface DesignGalleryProps {
    images: GeneratedImage[];
    selectedId: string | null;
    favorites?: string[];
    onSelect: (imageId: string) => void;
    onDownload: (imageId: string, imageUrl: string) => void;
    onFavorite?: (imageId: string) => void;
    onViewFull: (imageUrl: string) => void;
}

export function DesignGallery({
    images,
    selectedId,
    favorites = [],
    onSelect,
    onDownload,
    onFavorite,
    onViewFull,
}: DesignGalleryProps) {
    return (
        <div className="w-full">
            {/* Grid */}
            <div
                className={cn(
                    'grid gap-6',
                    images.length === 2 && 'grid-cols-1 sm:grid-cols-2',
                    images.length === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
                    images.length >= 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                )}
            >
                {images.map((image, index) => (
                    <DesignCard
                        key={image.imageId}
                        imageId={image.imageId}
                        imageUrl={image.imageUrl}
                        index={index}
                        total={images.length}
                        isSelected={selectedId === image.imageId}
                        isFavorite={favorites.includes(image.imageId)}
                        onSelect={() => onSelect(image.imageId)}
                        onDownload={() => onDownload(image.imageId, image.imageUrl)}
                        onFavorite={onFavorite ? () => onFavorite(image.imageId) : undefined}
                        onViewFull={() => onViewFull(image.imageUrl)}
                    />
                ))}
            </div>

            {/* Empty State */}
            {images.length === 0 && (
                <div className="text-center py-12 bg-cream rounded-xl">
                    <p className="text-slate">No designs generated yet</p>
                </div>
            )}
        </div>
    );
}

export default DesignGallery;
