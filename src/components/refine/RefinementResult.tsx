'use client';

import { CheckCircle, Sparkles, RotateCcw, Download, ArrowRight, Share2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RefinementResultProps {
    isVisible: boolean;
    onAccept: () => void;
    onRefineMore: () => void;
    onRevert: () => void;
    onDownload: () => void;
    onShare?: () => void;
    onSave?: () => void;
}

export function RefinementResult({
    isVisible,
    onAccept,
    onRefineMore,
    onRevert,
    onDownload,
    onShare,
    onSave,
}: RefinementResultProps) {
    if (!isVisible) return null;

    return (
        <div className="bg-success/10 border border-success/20 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Success Header */}
            <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-medium text-navy">Refinement applied!</span>
                <Sparkles className="w-4 h-4 text-gold" />
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Accept */}
                <button
                    type="button"
                    onClick={onAccept}
                    className={cn(
                        'flex items-center justify-center gap-2',
                        'px-4 py-2.5 rounded-lg',
                        'bg-gold text-navy font-medium text-sm',
                        'hover:brightness-110 transition-all'
                    )}
                >
                    <CheckCircle className="w-4 h-4" />
                    Accept version
                </button>

                {/* Refine More */}
                <button
                    type="button"
                    onClick={onRefineMore}
                    className={cn(
                        'flex items-center justify-center gap-2',
                        'px-4 py-2.5 rounded-lg',
                        'border-2 border-gold text-gold font-medium text-sm',
                        'hover:bg-gold/10 transition-colors'
                    )}
                >
                    <ArrowRight className="w-4 h-4" />
                    Refine further
                </button>
            </div>

            {/* Secondary Action Buttons */}
            <div className="grid grid-cols-4 gap-2">
                {/* Save */}
                {onSave && (
                    <button
                        type="button"
                        onClick={onSave}
                        className={cn(
                            'flex items-center justify-center gap-1.5',
                            'px-3 py-2 rounded-lg',
                            'text-slate text-sm',
                            'hover:bg-cream transition-colors'
                        )}
                    >
                        <Save className="w-4 h-4" />
                        Save
                    </button>
                )}

                {/* Share */}
                {onShare && (
                    <button
                        type="button"
                        onClick={onShare}
                        className={cn(
                            'flex items-center justify-center gap-1.5',
                            'px-3 py-2 rounded-lg',
                            'text-slate text-sm',
                            'hover:bg-cream transition-colors'
                        )}
                    >
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                )}

                {/* Download */}
                <button
                    type="button"
                    onClick={onDownload}
                    className={cn(
                        'flex items-center justify-center gap-1.5',
                        'px-3 py-2 rounded-lg',
                        'text-slate text-sm',
                        'hover:bg-cream transition-colors'
                    )}
                >
                    <Download className="w-4 h-4" />
                    Download
                </button>

                {/* Revert */}
                <button
                    type="button"
                    onClick={onRevert}
                    className={cn(
                        'flex items-center justify-center gap-1.5',
                        'px-3 py-2 rounded-lg',
                        'text-slate text-sm',
                        'hover:bg-cream transition-colors'
                    )}
                >
                    <RotateCcw className="w-4 h-4" />
                    Revert
                </button>
            </div>
        </div>
    );
}

export default RefinementResult;
