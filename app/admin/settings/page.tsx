'use client';

import { useState, useEffect } from 'react';
import { Cog6ToothIcon, CheckCircleIcon, ArrowPathIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { getSettings, updateSetting } from '@/lib/settings';
import { uploadImage } from '@/lib/storage';
import { SiteSettings } from '@/lib/types';
import Image from 'next/image';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [homeHeroFile, setHomeHeroFile] = useState<File | null>(null);
    const [productsHeroFile, setProductsHeroFile] = useState<File | null>(null);
    const [categoriesBgFile, setCategoriesBgFile] = useState<File | null>(null);

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

    async function handleSave(key: string, value: any, file?: File | null) {
        setSaving(true);
        setMessage(null);
        try {
            let finalValue = { ...value };

            // Upload image if file exists
            if (file) {
                const timestamp = Date.now();
                const path = `settings/${key}_${timestamp}_${file.name}`;
                const imageUrl = await uploadImage(file, path);
                finalValue.imageUrl = imageUrl;
            }

            await updateSetting(key, finalValue);

            // Update local state
            setSettings(prev => ({ ...prev, [key]: finalValue }));

            // Clear file input
            if (key === 'home_hero') setHomeHeroFile(null);
            if (key === 'products_hero') setProductsHeroFile(null);

            setMessage({ type: 'success', text: 'Paramètres mis à jour avec succès.' });

            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving setting:', error);
            setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde.' });
        } finally {
            setSaving(false);
        }
    }


    // Helper to update nested state
    const updateNestedState = (section: string, field: string, value: string | boolean) => {
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
                    <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                            <label className="block text-sm font-bold text-slate-800 mb-1">WhatsApp Ligne 1 (Format international sans +)</label>
                            <input
                                type="text"
                                value={settings.site_info?.whatsapp?.ligne1 || ''}
                                onChange={(e) => {
                                    setSettings(prev => ({
                                        ...prev,
                                        site_info: {
                                            ...prev.site_info,
                                            name: prev.site_info?.name || '',
                                            email: prev.site_info?.email || '',
                                            address: prev.site_info?.address || '',
                                            whatsapp: {
                                                ligne1: e.target.value,
                                                ligne2: prev.site_info?.whatsapp?.ligne2 || ''
                                            }
                                        }
                                    }));
                                }}
                                className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                                placeholder="ex: 221771494747"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">WhatsApp Ligne 2 (Format international sans +)</label>
                            <input
                                type="text"
                                value={settings.site_info?.whatsapp?.ligne2 || ''}
                                onChange={(e) => {
                                    setSettings(prev => ({
                                        ...prev,
                                        site_info: {
                                            ...prev.site_info,
                                            name: prev.site_info?.name || '',
                                            email: prev.site_info?.email || '',
                                            address: prev.site_info?.address || '',
                                            whatsapp: {
                                                ligne1: prev.site_info?.whatsapp?.ligne1 || '',
                                                ligne2: e.target.value
                                            }
                                        }
                                    }));
                                }}
                                className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                                placeholder="ex: 221779163200"
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
                            onClick={() => handleSave('home_hero', settings.home_hero, homeHeroFile)}
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
                            <label className="block text-sm font-bold text-slate-800 mb-1">Image de fond</label>

                            {/* Prévisualisation */}
                            <div className="mb-4 relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                {(homeHeroFile ? URL.createObjectURL(homeHeroFile) : settings.home_hero?.imageUrl) ? (
                                    <Image
                                        src={homeHeroFile ? URL.createObjectURL(homeHeroFile) : settings.home_hero?.imageUrl || ''}
                                        alt="Hero Preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                        <PhotoIcon className="h-12 w-12" />
                                    </div>
                                )}
                            </div>

                            {/* Upload Input */}
                            <label className="block">
                                <span className="sr-only">Choisir une image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setHomeHeroFile(e.target.files?.[0] || null)}
                                    className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-amber-50 file:text-amber-700
                                    hover:file:bg-amber-100
                                    cursor-pointer"
                                />
                            </label>
                            <p className="mt-1 text-xs text-slate-500">PNG, JPG, GIF jusqu'à 5MB</p>
                        </div>
                    </div>
                </div>

                {/* 3. Page Produits (Hero) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-900">Page Produits (Hero Section)</h2>
                        <button
                            onClick={() => handleSave('products_hero', settings.products_hero, productsHeroFile)}
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
                            <label className="block text-sm font-bold text-slate-800 mb-1">Image de fond</label>

                            {/* Prévisualisation */}
                            <div className="mb-4 relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                {(productsHeroFile ? URL.createObjectURL(productsHeroFile) : settings.products_hero?.imageUrl) ? (
                                    <Image
                                        src={productsHeroFile ? URL.createObjectURL(productsHeroFile) : settings.products_hero?.imageUrl || ''}
                                        alt="Products Hero Preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                        <PhotoIcon className="h-12 w-12" />
                                    </div>
                                )}
                            </div>

                            {/* Upload Input */}
                            <label className="block">
                                <span className="sr-only">Choisir une image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setProductsHeroFile(e.target.files?.[0] || null)}
                                    className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-amber-50 file:text-amber-700
                                    hover:file:bg-amber-100
                                    cursor-pointer"
                                />
                            </label>
                            <p className="mt-1 text-xs text-slate-500">PNG, JPG, GIF jusqu'à 5MB</p>
                        </div>
                    </div>
                </div>

                {/* 4. Page À Propos */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-900">Page À Propos</h2>
                        <button
                            onClick={() => handleSave('about_page', settings.about_page)}
                            disabled={saving}
                            className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
                        >
                            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">Titre Hero</label>
                            <input
                                type="text"
                                value={settings.about_page?.heroTitle || ''}
                                onChange={(e) => updateNestedState('about_page', 'heroTitle', e.target.value)}
                                className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                                placeholder="ex: Notre Histoire"
                            />
                            <p className="mt-1 text-xs text-slate-500">Titre principal affiché en haut de la page À propos</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">Sous-titre Hero</label>
                            <textarea
                                value={settings.about_page?.heroSubtitle || ''}
                                onChange={(e) => updateNestedState('about_page', 'heroSubtitle', e.target.value)}
                                rows={2}
                                className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                                placeholder="ex: L'élégance et la tradition au service de votre style depuis plus de 10 ans."
                            />
                            <p className="mt-1 text-xs text-slate-500">Sous-titre affiché sous le titre hero</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">Titre (Section Story)</label>
                            <input
                                type="text"
                                value={settings.about_page?.title || ''}
                                onChange={(e) => updateNestedState('about_page', 'title', e.target.value)}
                                className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                                placeholder="ex: Une Histoire de Passion"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">Description (Section Story)</label>
                            <textarea
                                value={settings.about_page?.description || ''}
                                onChange={(e) => updateNestedState('about_page', 'description', e.target.value)}
                                rows={4}
                                className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                                placeholder="Description de votre boutique..."
                            />
                        </div>
                    </div>
                </div>

                {/* 5. Badge Collection */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-900">Badge Collection (Page d'Accueil)</h2>
                        <button
                            onClick={() => handleSave('collection_badge', settings.collection_badge)}
                            disabled={saving}
                            className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
                        >
                            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">Texte du Badge</label>
                            <input
                                type="text"
                                value={settings.collection_badge?.text || ''}
                                onChange={(e) => updateNestedState('collection_badge', 'text', e.target.value)}
                                className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                                placeholder="ex: Nouvelle Collection 2024"
                            />
                            <p className="mt-1 text-xs text-slate-500">Ce texte apparaît au-dessus du titre principal sur la page d'accueil</p>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="badge-visible"
                                checked={settings.collection_badge?.visible ?? true}
                                onChange={(e) => updateNestedState('collection_badge', 'visible', e.target.checked)}
                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded"
                            />
                            <label htmlFor="badge-visible" className="ml-2 block text-sm text-slate-700">
                                Afficher le badge sur la page d'accueil
                            </label>
                        </div>
                    </div>
                </div>

                {/* 6. Section Catégories */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-900">Section Catégories (Page d'Accueil)</h2>
                        <button
                            onClick={() => handleSave('categories_section', settings.categories_section, categoriesBgFile)}
                            disabled={saving}
                            className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
                        >
                            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">Titre</label>
                            <input
                                type="text"
                                value={settings.categories_section?.title || ''}
                                onChange={(e) => updateNestedState('categories_section', 'title', e.target.value)}
                                className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                                placeholder="ex: Nos Univers"
                            />
                            <p className="mt-1 text-xs text-slate-500">Titre de la section catégories sur la page d'accueil</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">Sous-titre (optionnel)</label>
                            <input
                                type="text"
                                value={settings.categories_section?.subtitle || ''}
                                onChange={(e) => updateNestedState('categories_section', 'subtitle', e.target.value)}
                                className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500 py-3 px-4"
                                placeholder="ex: Découvrez nos collections"
                            />
                            <p className="mt-1 text-xs text-slate-500">Description affichée sous le titre (optionnel)</p>
                        </div>

                        {/* Image de fond */}
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-2">Image de Fond (optionnel)</label>

                            {/* Prévisualisation */}
                            <div className="mb-4 relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                {(categoriesBgFile ? URL.createObjectURL(categoriesBgFile) : settings.categories_section?.backgroundImage) ? (
                                    <Image
                                        src={categoriesBgFile ? URL.createObjectURL(categoriesBgFile) : settings.categories_section?.backgroundImage || ''}
                                        alt="Categories Background Preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                        <PhotoIcon className="h-12 w-12" />
                                    </div>
                                )}
                            </div>

                            {/* Upload Input */}
                            <label className="block">
                                <span className="sr-only">Choisir une image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setCategoriesBgFile(e.target.files?.[0] || null)}
                                    className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-amber-50 file:text-amber-700
                                    hover:file:bg-amber-100
                                    cursor-pointer"
                                />
                            </label>
                            <p className="mt-1 text-xs text-slate-500">PNG, JPG, GIF jusqu'à 5MB. Image de fond pour la section catégories.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
