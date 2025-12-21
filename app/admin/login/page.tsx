'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSuccess, setResetSuccess] = useState('');
    const [resetError, setResetError] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            router.push('/admin/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);
            setError('Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetError('');
        setResetSuccess('');
        setResetLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
            if (error) throw error;
            
            setResetSuccess('Un email de réinitialisation a été envoyé à votre adresse email.');
            setResetEmail('');
            setTimeout(() => {
                setShowResetModal(false);
                setResetSuccess('');
            }, 3000);
        } catch (err: any) {
            console.error('Reset password error:', err);
            setResetError('Erreur lors de l\'envoi de l\'email. Vérifiez l\'adresse email.');
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Solid Dark Background */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center">
                <div className="text-center px-12">
                    <h1 className="font-serif text-5xl md:text-6xl text-amber-500 mb-6 font-medium tracking-tight">
                        Soumaya Boutique
                    </h1>
                    <p className="text-xl text-slate-400 font-light max-w-md mx-auto leading-relaxed">
                        Gérez votre collection exclusive et offrez une expérience unique à vos clients.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10">
                        <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-900">
                            Bienvenue
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Connectez-vous à votre espace d'administration
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm py-3 px-4 bg-slate-50 border text-slate-900"
                                    placeholder="admin@soumaya.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                    Mot de passe
                                </label>
                                <div className="text-sm">
                                    <button
                                        type="button"
                                        onClick={() => setShowResetModal(true)}
                                        className="font-medium text-amber-600 hover:text-amber-500"
                                    >
                                        Oublié ?
                                    </button>
                                </div>
                            </div>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm py-3 px-4 bg-slate-50 border text-slate-900"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4 border border-red-100">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">
                                            Erreur de connexion
                                        </h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-lg border border-transparent bg-amber-600 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Connexion en cours...' : 'Se connecter'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal de réinitialisation du mot de passe */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
                        <h2 className="font-serif text-2xl font-bold mb-4 text-slate-900">
                            Réinitialiser le mot de passe
                        </h2>
                        <p className="text-slate-600 mb-6 text-sm">
                            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                        </p>

                        <form onSubmit={handlePasswordReset} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none text-slate-900"
                                    placeholder="admin@soumaya.com"
                                    required
                                />
                            </div>

                            {resetError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
                                    {resetError}
                                </div>
                            )}

                            {resetSuccess && (
                                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm font-medium">
                                    {resetSuccess}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowResetModal(false);
                                        setResetEmail('');
                                        setResetError('');
                                        setResetSuccess('');
                                    }}
                                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={resetLoading}
                                    className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50"
                                >
                                    {resetLoading ? 'Envoi...' : 'Envoyer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
