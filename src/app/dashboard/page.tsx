'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Gem, Plus, Trash2, ExternalLink, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { getUserDesigns, deleteDesign, SavedDesign } from '@/lib/firestore';

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading, signOut } = useAuth();

    const [designs, setDesigns] = useState<SavedDesign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/sign-in');
        }
    }, [user, loading, router]);

    // Load designs
    useEffect(() => {
        async function loadDesigns() {
            if (!user) return;

            try {
                const userDesigns = await getUserDesigns(user.uid);
                setDesigns(userDesigns);
            } catch (err) {
                setError('Failed to load your designs');
                console.error('Error loading designs:', err);
            } finally {
                setIsLoading(false);
            }
        }

        if (user) {
            loadDesigns();
        }
    }, [user]);

    const handleDelete = async (designId: string) => {
        if (!confirm('Are you sure you want to delete this design?')) return;

        setDeletingId(designId);
        try {
            await deleteDesign(designId);
            setDesigns(designs.filter(d => d.id !== designId));
        } catch (err) {
            alert('Failed to delete design');
            console.error('Error deleting design:', err);
        } finally {
            setDeletingId(null);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (err) {
            console.error('Error signing out:', err);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-light-gray border-t-gold rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <header className="bg-navy text-white py-4 px-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <Gem className="w-8 h-8 text-gold" />
                        <h1 className="text-xl font-serif font-semibold">AI Jewelry Designer</h1>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-white/80">
                            <User className="w-4 h-4" />
                            <span>{user.displayName || user.email}</span>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-navy">
                            My Designs
                        </h2>
                        <p className="text-slate mt-1">
                            {designs.length} saved design{designs.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Link
                        href="/design/create"
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        New Design
                    </Link>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-error rounded-lg text-error">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 border-4 border-light-gray border-t-gold rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate">Loading your designs...</p>
                    </div>
                ) : designs.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-16 bg-white rounded-xl border border-light-gray">
                        <Gem className="w-16 h-16 text-light-gray mx-auto mb-4" />
                        <h3 className="text-xl font-serif font-semibold text-navy mb-2">
                            No Designs Yet
                        </h3>
                        <p className="text-slate mb-6">
                            Create your first AI-generated jewelry design
                        </p>
                        <Link
                            href="/design/create"
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create Design
                        </Link>
                    </div>
                ) : (
                    /* Designs Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {designs.map((design) => (
                            <div
                                key={design.id}
                                className="bg-white rounded-xl border border-light-gray overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Image */}
                                <div className="aspect-square bg-cream relative">
                                    {design.images[0]?.imageUrl ? (
                                        <img
                                            src={design.images[0].imageUrl}
                                            alt={`${design.gemData.type} jewelry design`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Gem className="w-12 h-12 text-light-gray" />
                                        </div>
                                    )}
                                    {/* Image Count Badge */}
                                    {design.images.length > 1 && (
                                        <span className="absolute top-2 right-2 bg-navy/80 text-white text-xs px-2 py-1 rounded">
                                            +{design.images.length - 1} more
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h4 className="font-serif font-semibold text-navy mb-1">
                                        {design.gemData.type} • {design.gemData.cut}
                                    </h4>
                                    <p className="text-sm text-slate line-clamp-2 mb-3">
                                        {design.prompt}
                                    </p>
                                    <p className="text-xs text-slate mb-3">
                                        {design.createdAt.toLocaleDateString()}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/design/results?id=${design.designId}`}
                                            className="btn-secondary flex-1 text-center text-sm py-2 flex items-center justify-center gap-1"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            View
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(design.id)}
                                            disabled={deletingId === design.id}
                                            className="p-2 text-slate hover:text-error transition-colors disabled:opacity-50"
                                            title="Delete design"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
