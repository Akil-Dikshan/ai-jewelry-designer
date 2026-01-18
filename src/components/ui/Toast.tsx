'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (type: ToastType, message: string, duration?: number) => void;
    dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, message: string, duration = 5000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        setToasts(prev => [...prev, { id, type, message, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                dismissToast(id);
            }, duration);
        }
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// Toast Container
function ToastContainer({
    toasts,
    onDismiss
}: {
    toasts: Toast[];
    onDismiss: (id: string) => void;
}) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    );
}

// Individual Toast
function ToastItem({
    toast,
    onDismiss
}: {
    toast: Toast;
    onDismiss: (id: string) => void;
}) {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-success" />,
        error: <AlertCircle className="w-5 h-5 text-error" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-warning" />,
    };

    const backgrounds = {
        success: 'bg-success/10 border-success',
        error: 'bg-error/10 border-error',
        info: 'bg-blue-50 border-blue-500',
        warning: 'bg-warning/10 border-warning',
    };

    return (
        <div
            className={`
                toast-enter flex items-start gap-3 p-4 rounded-lg border shadow-lg bg-white
                ${backgrounds[toast.type]}
            `}
        >
            {icons[toast.type]}
            <p className="flex-1 text-sm text-navy">{toast.message}</p>
            <button
                onClick={() => onDismiss(toast.id)}
                className="text-slate hover:text-navy transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

export default ToastProvider;
