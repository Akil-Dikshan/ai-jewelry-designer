'use client';

import { useState } from 'react';
import { X, Copy, Check, Link, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareUrl: string;
    imageUrl: string;
}

export function ShareModal({ isOpen, onClose, shareUrl, imageUrl }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#1a1a2e] rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-gold" />
                        <h3 className="text-lg font-semibold text-white">Share Design</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-white/60" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Preview */}
                    <div className="aspect-square w-32 mx-auto rounded-xl overflow-hidden border border-white/10">
                        <img
                            src={imageUrl}
                            alt="Design preview"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Share Link */}
                    <div className="space-y-2">
                        <label className="block text-sm text-white/60">
                            Share this link with anyone
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                                <Link className="w-4 h-4 text-white/40 flex-shrink-0" />
                                <span className="text-sm text-white/80 truncate">
                                    {shareUrl}
                                </span>
                            </div>
                            <button
                                onClick={handleCopy}
                                className={cn(
                                    'px-4 py-2 rounded-lg font-medium text-sm transition-all',
                                    copied
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-gold text-navy hover:brightness-110'
                                )}
                            >
                                {copied ? (
                                    <span className="flex items-center gap-1.5">
                                        <Check className="w-4 h-4" />
                                        Copied!
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5">
                                        <Copy className="w-4 h-4" />
                                        Copy
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Note */}
                    <p className="text-xs text-white/40 text-center">
                        This link will be valid as long as the design is saved in your browser.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ShareModal;
