'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gem, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex flex-col">
            {/* Header */}
            <header className="bg-navy text-white py-4 px-6">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3">
                        <Gem className="w-8 h-8 text-gold" />
                        <h1 className="text-xl font-serif font-semibold">AI Jewelry Designer</h1>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full bg-white rounded-xl shadow-lg p-8" style={{ maxWidth: '448px' }}>
                    {/* Back Link */}
                    <Link
                        href="/auth/sign-in"
                        className="inline-flex items-center gap-2 text-sm text-slate hover:text-navy transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                    </Link>

                    {success ? (
                        /* Success State */
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-4">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-navy mb-2">
                                Check Your Email
                            </h2>
                            <p className="text-slate mb-6">
                                We&apos;ve sent a password reset link to <strong>{email}</strong>
                            </p>
                            <Link
                                href="/auth/sign-in"
                                className="btn-primary inline-block"
                            >
                                Return to Sign In
                            </Link>
                        </div>
                    ) : (
                        /* Form State */
                        <>
                            <h2 className="text-2xl font-serif font-bold text-navy mb-2">
                                Reset Your Password
                            </h2>
                            <p className="text-slate mb-6">
                                Enter your email and we&apos;ll send you a link to reset your password
                            </p>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-error rounded-lg text-error text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-navy mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="input-field"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
