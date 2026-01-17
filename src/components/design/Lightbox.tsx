'use client';

import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LightboxProps {
    isOpen: boolean;
    imageUrl: string;
    imageIndex: number;
    totalImages: number;
    onClose: () => void;
    onPrevious?: () => void;
    onNext?: () => void;
    onDownload?: () => void;
}

export function Lightbox({
    isOpen,
    imageUrl,
    imageIndex,
    totalImages,
    onClose,
    onPrevious,
    onNext,
    onDownload,
}: LightboxProps) {
    const [zoom, setZoom] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    onPrevious?.();
                    break;
                case 'ArrowRight':
                    onNext?.();
                    break;
            }
        },
        [isOpen, onClose, onPrevious, onNext]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Reset zoom when image changes
    useEffect(() => {
        setZoom(1);
        setIsLoading(true);
    }, [imageUrl]);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 3));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 0.5));

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy/95"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                aria-label="Close lightbox"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Top Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
                {/* Image Counter */}
                <span className="text-white text-sm font-medium px-3 py-1.5 bg-white/10 rounded-full">
                    {imageIndex + 1} of {totalImages}
                </span>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-white/10 rounded-full">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleZoomOut();
                        }}
                        disabled={zoom <= 0.5}
                        className="p-2 text-white hover:bg-white/10 rounded-full disabled:opacity-50 transition-colors"
                        aria-label="Zoom out"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <span className="text-white text-sm min-w-[50px] text-center">
                        {Math.round(zoom * 100)}%
                    </span>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleZoomIn();
                        }}
                        disabled={zoom >= 3}
                        className="p-2 text-white hover:bg-white/10 rounded-full disabled:opacity-50 transition-colors"
                        aria-label="Zoom in"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                </div>

                {/* Download Button */}
                {onDownload && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownload();
                        }}
                        className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Download image"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Navigation - Previous */}
            {onPrevious && imageIndex > 0 && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrevious();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
            )}

            {/* Navigation - Next */}
            {onNext && imageIndex < totalImages - 1 && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            )}

            {/* Image Container */}
            <div
                className="relative max-w-[90vw] max-h-[85vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Loading State */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                )}

                {/* Image */}
                <img
                    src={imageUrl}
                    alt={`Design ${imageIndex + 1}`}
                    className={cn(
                        'max-w-full max-h-[85vh] object-contain transition-all duration-300',
                        isLoading ? 'opacity-0' : 'opacity-100'
                    )}
                    style={{ transform: `scale(${zoom})` }}
                    onLoad={() => setIsLoading(false)}
                    draggable={false}
                />
            </div>
        </div>
    );
}

export default Lightbox;
