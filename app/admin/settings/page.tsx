'use client';

import { useState, useEffect } from 'react';
import { Cog6ToothIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { getSettings, updateSetting } from '@/lib/settings';
import { SiteSettings } from '@/lib/types';
import Image from 'next/image';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        setLoading(true);
        try {
            const data = await getSettings();
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setMessage({ type: 'error', text: 'Impossible de charger les paramètres.' });
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(key: string, value: any) {
        setSaving(true);
        setMessage(null);
        try {
            await updateSetting(key, value);
            // Update local state
            setSettings(prev => ({ ...prev, [key]: value }));
            setMessage({ type: 'success', text: 'Paramètres mis à jour avec succès.' });
            
            // Clear message after 3s
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving setting:', error);
            setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde.' });
        } finally {
            setSaving(false);
        }
    }

    // Helper to update nested state
    const updateNestedState = (section: string, field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <ArrowPathIcon className="h-8 w-8 text-amber-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3">
                        <Cog6ToothIcon className="h-8 w-8 text-amber-600" />
                        Paramètres du Site
                    </h1>
                    <p className="text-slate-500 mt-1">Gérez les contenus dynamiques de votre boutique.</p>
                </div>
                {message && (
                    <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                        message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {message.type === 'success' && <CheckCircleIcon className="h-5 w-5" />}
                        {message.text}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* 1. Informations Générales */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-900">Informations Générales</h2>
                        <button
                            onClick={() => handleSave('site_info', settings.site_info)}
                            disabled={saving}
                            className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
                        >
                            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">Nom du Site</label>
                            <input
                                type="text"
                                value={settings.site_info?.name || ''}
                                onChange={(e) => updateNestedState('site_info', 'name', e.target.value)}
                                className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">WhatsApp (Format international sans +)</label>
                            <input
                                type="text"
                                value={settings.site_info?.whatsapp || ''}
                                onChange={(e) => updateNestedState('site_info', 'whatsapp', e.target.value)}
                                className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                                placeholder="ex: 221770000000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">Email de contact</label>
                            <input
                                type="email"
                                value={settings.site_info?.email || ''}
                                onChange={(e) => updateNestedState('site_info', 'email', e.target.value)}
                                className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">Adresse</label>
                            <input
                                type="text"
                                value={settings.site_info?.address || ''}
                                onChange={(e) => updateNestedState('site_info', 'address', e.target.value)}
                                className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Page d'Accueil (Hero) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-900">Page d'Accueil (Hero Section)</h2>
                        <button
                            onClick={() => handleSave('home_hero', settings.home_hero)}
                            disabled={saving}
                            className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
                        >
                            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-1">Titre Principal</label>
                                <input
                                    type="text"
                                    value={settings.home_hero?.title || ''}
                                    onChange={(e) => updateNestedState('home_hero', 'title', e.target.value)}
                                    className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-1">Sous-titre</label>
                                <textarea
                                    value={settings.home_hero?.subtitle || ''}
                                    onChange={(e) => updateNestedState('home_hero', 'subtitle', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-1">Texte du Bouton</label>
                                <input
                                    type="text"
                                    value={settings.home_hero?.buttonText || ''}
                                    onChange={(e) => updateNestedState('home_hero', 'buttonText', e.target.value)}
                                    className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">Image de fond (URL)</label>
                            <input
                                type="text"
                                value={settings.home_hero?.imageUrl || ''}
                                onChange={(e) => updateNestedState('home_hero', 'imageUrl', e.target.value)}
                                className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 mb-4 py-3 px-4"
                                placeholder="https://..."
                            />
                            {settings.home_hero?.imageUrl && (
                                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                    <Image
                                        src={settings.home_hero.imageUrl}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Page Produits (Hero) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-900">Page Produits (Hero Section)</h2>
                        <button
                            onClick={() => handleSave('products_hero', settings.products_hero)}
                            disabled={saving}
                            className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
                        >
                            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-1">Titre</label>
                                <input
                                    type="text"
                                    value={settings.products_hero?.title || ''}
                                    onChange={(e) => updateNestedState('products_hero', 'title', e.target.value)}
                                    className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-1">Sous-titre</label>
                                <textarea
                                    value={settings.products_hero?.subtitle || ''}
                                    onChange={(e) => updateNestedState('products_hero', 'subtitle', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">Image de fond (URL)</label>
                            <input
                                type="text"
                                value={settings.products_hero?.imageUrl || ''}
                                onChange={(e) => updateNestedState('products_hero', 'imageUrl', e.target.value)}
                                className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 mb-4 py-3 px-4"
                                placeholder="https://..."
                            />
                            {settings.products_hero?.imageUrl && (
                                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                    <Image
                                        src={settings.products_hero.imageUrl}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
