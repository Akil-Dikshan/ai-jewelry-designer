'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Gem, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function SignInPage() {
    const router = useRouter();
    const { signIn, user } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already logged in
    if (user) {
        router.push('/dashboard');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await signIn(email, password);
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in');
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
                        href="/design/create"
                        className="inline-flex items-center gap-2 text-sm text-slate hover:text-navy transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Designer
                    </Link>

                    <h2 className="text-2xl font-serif font-bold text-navy mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-slate mb-6">
                        Sign in to access your saved designs
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
                                className="w-full px-4 py-3 rounded-lg border border-light-gray bg-white text-navy placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-navy mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 pr-12 rounded-lg border border-light-gray bg-white text-navy placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                                    placeholder="Your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-navy"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-gold hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-slate mt-6">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/sign-up" className="text-gold hover:underline font-medium">
                            Create one
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
