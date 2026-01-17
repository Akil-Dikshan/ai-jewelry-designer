'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectedDesignDisplayProps {
    imageUrl: string;
    versionLabel: string;
    isLoading?: boolean;
    onFullscreen?: () => void;
}

export function SelectedDesignDisplay({
    imageUrl,
    versionLabel,
    isLoading = false,
    onFullscreen,
}: SelectedDesignDisplayProps) {
    const [zoom, setZoom] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
    const handleResetZoom = () => setZoom(1);

    const toggleFullscreen = () => {
        if (onFullscreen) {
            onFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div className="relative bg-white rounded-xl border border-light-gray overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-light-gray">
                <span className="text-sm font-medium text-navy">{versionLabel}</span>

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleZoomOut}
                        disabled={zoom <= 0.5 || isLoading}
                        className={cn(
                            'p-1.5 rounded-md transition-colors',
                            'hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                        aria-label="Zoom out"
                    >
                        <ZoomOut className="w-4 h-4 text-slate" />
                    </button>

                    <button
                        type="button"
                        onClick={handleResetZoom}
                        disabled={isLoading}
                        className="text-xs font-medium text-slate min-w-[45px] text-center hover:text-navy"
                    >
                        {Math.round(zoom * 100)}%
                    </button>

                    <button
                        type="button"
                        onClick={handleZoomIn}
                        disabled={zoom >= 2 || isLoading}
                        className={cn(
                            'p-1.5 rounded-md transition-colors',
                            'hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                        aria-label="Zoom in"
                    >
                        <ZoomIn className="w-4 h-4 text-slate" />
                    </button>

                    <div className="w-px h-4 bg-light-gray mx-1" />

                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        disabled={isLoading}
                        className={cn(
                            'p-1.5 rounded-md transition-colors',
                            'hover:bg-cream disabled:opacity-50'
                        )}
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    >
                        {isFullscreen ? (
                            <Minimize2 className="w-4 h-4 text-slate" />
                        ) : (
                            <Maximize2 className="w-4 h-4 text-slate" />
                        )}
                    </button>
                </div>
            </div>

            {/* Image Container */}
            <div className="relative aspect-square bg-cream overflow-hidden">
                {/* Loading Skeleton */}
                {isLoading && (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-cream via-light-gray to-cream z-10" />
                )}

                {/* Image */}
                <div
                    className="w-full h-full flex items-center justify-center overflow-hidden"
                    style={{ cursor: zoom > 1 ? 'move' : 'default' }}
                >
                    <img
                        src={imageUrl}
                        alt="Selected design"
                        className={cn(
                            'max-w-full max-h-full object-contain transition-transform duration-200',
                            isLoading && 'opacity-50'
                        )}
                        style={{ transform: `scale(${zoom})` }}
                        draggable={false}
                    />
                </div>
            </div>
        </div>
    );
}

export default SelectedDesignDisplay;
