'use client';

import { ArrowRight, Plus, Share2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CallToActionProps {
    selectedImageId: string | null;
    onShare?: () => void;
}

export function CallToAction({ selectedImageId, onShare }: CallToActionProps) {
    return (
        <div className="bg-white rounded-xl border border-light-gray p-6">
            <h3 className="text-lg font-serif font-semibold text-navy mb-4">
                What&apos;s Next?
            </h3>

            <div className="space-y-3">
                {/* Refine Selected */}
                {selectedImageId ? (
                    <Link
                        href={`/design/refine?imageId=${selectedImageId}`}
                        className={cn(
                            'flex items-center justify-between w-full',
                            'px-4 py-3 rounded-lg',
                            'bg-gold text-navy font-medium',
                            'hover:brightness-110 transition-all'
                        )}
                    >
                        <span>Refine Your Selection</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                ) : (
                    <div
                        className={cn(
                            'flex items-center justify-between w-full',
                            'px-4 py-3 rounded-lg',
                            'bg-light-gray text-slate',
                            'cursor-not-allowed'
                        )}
                    >
                        <span>Select a design to refine</span>
                        <ArrowRight className="w-5 h-5" />
                    </div>
                )}

                {/* Create New Design */}
                <Link
                    href="/design/create"
                    className={cn(
                        'flex items-center justify-between w-full',
                        'px-4 py-3 rounded-lg',
                        'border-2 border-light-gray text-slate',
                        'hover:border-gold hover:text-gold transition-colors'
                    )}
                >
                    <span>Create New Design</span>
                    <Plus className="w-5 h-5" />
                </Link>

                {/* Share */}
                {onShare && (
                    <button
                        type="button"
                        onClick={onShare}
                        className={cn(
                            'flex items-center justify-between w-full',
                            'px-4 py-3 rounded-lg',
                            'border-2 border-light-gray text-slate',
                            'hover:border-gold hover:text-gold transition-colors'
                        )}
                    >
                        <span>Share Results</span>
                        <Share2 className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default CallToAction;
