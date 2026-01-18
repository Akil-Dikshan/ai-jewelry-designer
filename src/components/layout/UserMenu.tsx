'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Settings, LayoutDashboard, LogOut, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export function UserMenu() {
    const router = useRouter();
    const { user, loading, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
            setIsOpen(false);
            router.push('/');
        } catch (err) {
            console.error('Error signing out:', err);
        }
    };

    if (loading) {
        return (
            <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
        );
    }

    if (!user) {
        return (
            <div className="flex items-center gap-3">
                <Link
                    href="/auth/sign-in"
                    className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
                >
                    <LogIn className="w-4 h-4" />
                    Sign In
                </Link>
                <Link
                    href="/auth/sign-up"
                    className="flex items-center gap-1.5 text-sm bg-gold text-navy px-3 py-1.5 rounded-lg hover:bg-gold/90 transition-colors"
                >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                </Link>
            </div>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-gold" />
                </div>
                <span className="hidden sm:inline max-w-[150px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-light-gray overflow-hidden z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-light-gray bg-cream/50">
                        <p className="font-medium text-navy text-sm truncate">
                            {user.displayName || 'User'}
                        </p>
                        <p className="text-xs text-slate truncate">
                            {user.email}
                        </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy hover:bg-cream transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4 text-slate" />
                            My Designs
                        </Link>
                        <Link
                            href="/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy hover:bg-cream transition-colors"
                        >
                            <Settings className="w-4 h-4 text-slate" />
                            Account Settings
                        </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-light-gray py-1">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate hover:bg-cream transition-colors w-full"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserMenu;
