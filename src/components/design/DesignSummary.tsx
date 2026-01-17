'use client';

import { ChevronDown, ChevronUp, Edit3, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface GemDataSummary {
    type: string;
    cut: string;
    size: string;
    color: string;
    transparency: string;
    imageUrl?: string;
}

interface MaterialsSummary {
    metals: string[];
    finish: string | null;
}

interface DesignSummaryProps {
    gemData: GemDataSummary;
    prompt: string;
    materials: MaterialsSummary;
    onEdit?: () => void;
}

export function DesignSummary({
    gemData,
    prompt,
    materials,
    onEdit,
}: DesignSummaryProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-light-gray shadow-sm overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-cream/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-gold" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-medium text-navy">Your Design Specifications</h3>
                        <p className="text-sm text-slate">
                            {gemData.type} • {gemData.cut} • {gemData.size}
                        </p>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate" />
                )}
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-light-gray pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left Column - Gem Details */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-navy">Gem Details</h4>

                            <div className="flex items-start gap-3">
                                {/* Gem Image Thumbnail */}
                                {gemData.imageUrl && (
                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-light-gray flex-shrink-0">
                                        <img
                                            src={gemData.imageUrl}
                                            alt="Your gem"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="space-y-1 text-sm">
                                    <p><span className="text-slate">Type:</span> <span className="text-navy">{gemData.type}</span></p>
                                    <p><span className="text-slate">Cut:</span> <span className="text-navy">{gemData.cut}</span></p>
                                    <p><span className="text-slate">Size:</span> <span className="text-navy">{gemData.size}</span></p>
                                    <p><span className="text-slate">Color:</span> <span className="text-navy">{gemData.color}</span></p>
                                    <p><span className="text-slate">Transparency:</span> <span className="text-navy">{gemData.transparency}</span></p>
                                </div>
                            </div>

                            {/* Materials */}
                            {(materials.metals.length > 0 || materials.finish) && (
                                <div className="pt-2">
                                    <h4 className="text-sm font-medium text-navy mb-1">Materials</h4>
                                    <div className="text-sm">
                                        {materials.metals.length > 0 && (
                                            <p><span className="text-slate">Metals:</span> <span className="text-navy">{materials.metals.join(', ')}</span></p>
                                        )}
                                        {materials.finish && (
                                            <p><span className="text-slate">Finish:</span> <span className="text-navy">{materials.finish}</span></p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Prompt */}
                        <div>
                            <h4 className="text-sm font-medium text-navy mb-2">Your Description</h4>
                            <p className="text-sm text-slate bg-cream rounded-lg p-3 italic">
                                &ldquo;{prompt}&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Edit Button */}
                    {onEdit && (
                        <div className="mt-4 pt-4 border-t border-light-gray">
                            <button
                                type="button"
                                onClick={onEdit}
                                className={cn(
                                    'flex items-center gap-2',
                                    'text-sm font-medium text-gold',
                                    'hover:underline'
                                )}
                            >
                                <Edit3 className="w-4 h-4" />
                                Modify inputs
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default DesignSummary;
