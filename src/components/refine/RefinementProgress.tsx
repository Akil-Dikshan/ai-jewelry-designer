'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RefinementProgressProps {
    isActive: boolean;
}

const PROGRESS_MESSAGES = [
    { message: 'Understanding your changes...', duration: 2000 },
    { message: 'Applying modifications...', duration: 4000 },
    { message: 'Rendering updated design...', duration: 4000 },
];

export function RefinementProgress({ isActive }: RefinementProgressProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isActive) {
            setCurrentStep(0);
            setProgress(0);
            return;
        }

        // Progress animation
        const totalDuration = PROGRESS_MESSAGES.reduce((acc, m) => acc + m.duration, 0);
        const startTime = Date.now();

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
            setProgress(newProgress);

            // Determine current step
            let accumulator = 0;
            for (let i = 0; i < PROGRESS_MESSAGES.length; i++) {
                accumulator += PROGRESS_MESSAGES[i].duration;
                if (elapsed < accumulator) {
                    setCurrentStep(i);
                    break;
                }
            }
        }, 100);

        return () => clearInterval(progressInterval);
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
            <div className="text-center text-white">
                {/* Spinner */}
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />

                {/* Current Message */}
                <p className="text-lg font-medium mb-2">
                    {PROGRESS_MESSAGES[currentStep]?.message}
                </p>

                {/* Progress Bar */}
                <div className="w-48 h-1.5 bg-white/20 rounded-full mx-auto overflow-hidden">
                    <div
                        className="h-full bg-gold rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Percentage */}
                <p className="text-sm text-white/80 mt-2">
                    {Math.round(progress)}%
                </p>
            </div>
        </div>
    );
}

export default RefinementProgress;
