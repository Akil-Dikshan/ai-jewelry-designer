'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Gem, ArrowLeft, User, Mail, Lock, Trash2, Save,
    AlertTriangle, Check, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import {
    updateProfile,
    updateEmail,
    updatePassword,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider
} from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { getUserDesigns } from '@/lib/firestore';

export default function SettingsPage() {
    const router = useRouter();
    const { user, loading, signOut } = useAuth();

    // Form states
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [deletePassword, setDeletePassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // UI states
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [designCount, setDesignCount] = useState(0);

    // Messages
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/sign-in');
        }
    }, [user, loading, router]);

    // Load user data
    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            setEmail(user.email || '');

            // Load design count
            getUserDesigns(user.uid).then(designs => {
                setDesignCount(designs.length);
            }).catch(() => {
                setDesignCount(0);
            });
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !auth) return;

        setIsUpdatingProfile(true);
        setProfileMessage(null);

        try {
            // Update display name
            await updateProfile(user, { displayName: displayName || null });

            // Update email if changed
            if (email !== user.email) {
                await updateEmail(user, email);
            }

            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: unknown) {
            const code = (error as { code?: string }).code || '';
            if (code === 'auth/requires-recent-login') {
                setProfileMessage({ type: 'error', text: 'Please sign out and sign in again to update your email.' });
            } else {
                setProfileMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
            }
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !auth) return;

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
            return;
        }

        setIsUpdatingPassword(true);
        setPasswordMessage(null);

        try {
            // Re-authenticate first
            const credential = EmailAuthProvider.credential(user.email!, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, newPassword);

            setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: unknown) {
            const code = (error as { code?: string }).code || '';
            if (code === 'auth/wrong-password') {
                setPasswordMessage({ type: 'error', text: 'Current password is incorrect.' });
            } else {
                setPasswordMessage({ type: 'error', text: 'Failed to update password. Please try again.' });
            }
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user || !auth) return;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            // Re-authenticate first
            const credential = EmailAuthProvider.credential(user.email!, deletePassword);
            await reauthenticateWithCredential(user, credential);

            // Delete user
            await deleteUser(user);

            router.push('/');
        } catch (error: unknown) {
            const code = (error as { code?: string }).code || '';
            if (code === 'auth/wrong-password') {
                setDeleteError('Incorrect password.');
            } else {
                setDeleteError('Failed to delete account. Please try again.');
            }
        } finally {
            setIsDeleting(false);
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
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <Gem className="w-8 h-8 text-gold" />
                        <h1 className="text-xl font-serif font-semibold">AI Jewelry Designer</h1>
                    </Link>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-navy">
                        Account Settings
                    </h2>
                    <p className="text-slate mt-1">
                        Manage your account information and preferences
                    </p>
                </div>

                {/* Account Info Card */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-light-gray">
                    <h3 className="text-lg font-serif font-semibold text-navy mb-4">
                        Account Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate">Email</p>
                            <p className="font-medium text-navy">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-slate">Member Since</p>
                            <p className="font-medium text-navy">
                                {user.metadata.creationTime
                                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                                    : 'Unknown'}
                            </p>
                        </div>
                        <div>
                            <p className="text-slate">Saved Designs</p>
                            <p className="font-medium text-navy">{designCount}</p>
                        </div>
                        <div>
                            <p className="text-slate">Account Status</p>
                            <p className="font-medium text-success">Active</p>
                        </div>
                    </div>
                </section>

                {/* Profile Settings */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-light-gray">
                    <h3 className="text-lg font-serif font-semibold text-navy mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile Information
                    </h3>

                    {profileMessage && (
                        <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${profileMessage.type === 'success'
                                ? 'bg-green-50 text-success border border-success'
                                : 'bg-red-50 text-error border border-error'
                            }`}>
                            {profileMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                            {profileMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-navy mb-1">
                                Display Name
                            </label>
                            <input
                                type="text"
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="input-field"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-navy mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isUpdatingProfile}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </section>

                {/* Password Settings */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-light-gray">
                    <h3 className="text-lg font-serif font-semibold text-navy mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Change Password
                    </h3>

                    {passwordMessage && (
                        <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${passwordMessage.type === 'success'
                                ? 'bg-green-50 text-success border border-success'
                                : 'bg-red-50 text-error border border-error'
                            }`}>
                            {passwordMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                            {passwordMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-navy mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-navy mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="input-field pr-10"
                                    placeholder="At least 6 characters"
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

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-navy mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isUpdatingPassword}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50"
                        >
                            <Lock className="w-4 h-4" />
                            {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </section>

                {/* Danger Zone */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-error/30">
                    <h3 className="text-lg font-serif font-semibold text-error mb-4 flex items-center gap-2">
                        <Trash2 className="w-5 h-5" />
                        Danger Zone
                    </h3>

                    {!showDeleteConfirm ? (
                        <div>
                            <p className="text-slate text-sm mb-4">
                                Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="text-error hover:bg-error/10 px-4 py-2 rounded-lg transition-colors border border-error"
                            >
                                Delete Account
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-red-50 p-4 rounded-lg">
                                <p className="text-error font-medium mb-2">
                                    ⚠️ Are you absolutely sure?
                                </p>
                                <p className="text-sm text-slate">
                                    This will permanently delete your account and all {designCount} saved designs.
                                </p>
                            </div>

                            {deleteError && (
                                <p className="text-error text-sm">{deleteError}</p>
                            )}

                            <div>
                                <label htmlFor="deletePassword" className="block text-sm font-medium text-navy mb-1">
                                    Enter your password to confirm
                                </label>
                                <input
                                    type="password"
                                    id="deletePassword"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    className="input-field"
                                    placeholder="Your current password"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting || !deletePassword}
                                    className="bg-error text-white px-4 py-2 rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
                                >
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeletePassword('');
                                        setDeleteError(null);
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
