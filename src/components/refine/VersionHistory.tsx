'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Version {
    id: string;
    imageUrl: string;
    label: string;
    timestamp?: Date;
}

interface VersionHistoryProps {
    versions: Version[];
    currentVersionId: string;
    onSelectVersion: (versionId: string) => void;
    onRevertToVersion: (versionId: string) => void;
    disabled?: boolean;
}

export function VersionHistory({
    versions,
    currentVersionId,
    onSelectVersion,
    onRevertToVersion,
    disabled = false,
}: VersionHistoryProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    if (versions.length <= 1) {
        return null; // Don't show if only original version
    }

    return (
        <div className="bg-white rounded-xl border border-light-gray overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream/50 transition-colors"
            >
                <span className="text-sm font-medium text-navy">
                    Version History ({versions.length})
                </span>
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-slate" />
                )}
            </button>

            {/* Thumbnails */}
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-light-gray pt-3">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                        {versions.map((version, index) => (
                            <div
                                key={version.id}
                                className="relative flex-shrink-0"
                                onMouseEnter={() => setHoveredId(version.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {/* Thumbnail */}
                                <button
                                    type="button"
                                    onClick={() => onSelectVersion(version.id)}
                                    disabled={disabled}
                                    className={cn(
                                        'w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                                        'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2',
                                        disabled && 'opacity-60 cursor-not-allowed',
                                        currentVersionId === version.id
                                            ? 'border-gold shadow-md'
                                            : 'border-light-gray hover:border-gold'
                                    )}
                                >
                                    <img
                                        src={version.imageUrl}
                                        alt={version.label}
                                        className="w-full h-full object-cover"
                                    />
                                </button>

                                {/* Label */}
                                <p className="text-xs text-slate mt-1 text-center truncate max-w-[80px]">
                                    {version.label}
                                </p>

                                {/* Revert Button (on hover) */}
                                {hoveredId === version.id && currentVersionId !== version.id && !disabled && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRevertToVersion(version.id);
                                        }}
                                        className={cn(
                                            'absolute -top-2 -right-2 p-1.5 rounded-full',
                                            'bg-gold text-navy shadow-lg',
                                            'hover:brightness-110 transition-all',
                                            'animate-in fade-in zoom-in duration-200'
                                        )}
                                        title="Use this version"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                    </button>
                                )}

                                {/* Current Version Badge */}
                                {currentVersionId === version.id && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-white" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Navigation hint */}
                    <p className="text-xs text-slate mt-2">
                        Click a version to preview • Hover and click ↺ to revert
                    </p>
                </div>
            )}
        </div>
    );
}

export default VersionHistory;
