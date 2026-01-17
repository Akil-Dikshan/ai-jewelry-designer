'use client';

import { AlertTriangle } from 'lucide-react';

export function DesignDisclaimer() {
    return (
        <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
                <p className="font-medium text-navy mb-1">Important Disclaimer</p>
                <p className="text-slate">
                    These are AI-generated concept renderings for visualization purposes only.
                    They are not production-ready designs. Actual jewelry will vary.
                    Please consult with a professional jeweler for production specifications,
                    metal compatibility, structural integrity, and gemstone setting requirements.
                </p>
            </div>
        </div>
    );
}

export default DesignDisclaimer;
