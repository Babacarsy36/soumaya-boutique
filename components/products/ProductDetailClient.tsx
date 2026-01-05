'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById } from '@/lib/products';
import { getSettings } from '@/lib/settings';
import { Product, SiteSettings } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { PhoneIcon } from '@heroicons/react/24/solid';

interface ProductDetailClientProps {
    id: string;
}

export default function ProductDetailClient({ id }: ProductDetailClientProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [settings, setSettings] = useState<SiteSettings>({});
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedWhatsApp, setSelectedWhatsApp] = useState('ligne1');

    useEffect(() => {
        async function fetchData() {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                const [productData, settingsData] = await Promise.all([
                    getProductById(id),
                    getSettings()
                ]);
                setProduct(productData);
                setSettings(settingsData);
            } catch (error) {
                console.error('Error fetching product data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <ShoppingBagIcon className="h-16 w-16 text-slate-300 mb-4" />
                <h1 className="text-2xl font-serif text-slate-900 mb-2">Produit non trouvé</h1>
                <p className="text-slate-500 mb-6">Ce produit ne semble pas exister ou a été retiré.</p>
                <Link
                    href="/products"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-amber-600 hover:bg-amber-700 transition"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Retour à la boutique
                </Link>
            </div>
        );
    }


    // WhatsApp numbers configuration
    const whatsappNumbers = {
        ligne1: settings.site_info?.whatsapp?.ligne1 || "221771494747",
        ligne2: settings.site_info?.whatsapp?.ligne2 || "221779163200"
    };

    const whatsappNumber = whatsappNumbers[selectedWhatsApp as keyof typeof whatsappNumbers];
    const whatsappMessage = `Bonjour, je suis intéressé(e) par le produit : ${product.name} (${formatPrice(product.price)})`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="min-h-screen bg-white mt-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <nav className="mb-8 lg:mb-12">
                    <Link
                        href="/products"
                        className="group inline-flex items-center text-sm font-medium text-slate-500 hover:text-amber-600 transition-colors"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Retour aux produits
                    </Link>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12">
                    {/* Gallery Section */}
                    <div className="space-y-4">
                        <div className="aspect-[3/4] lg:aspect-square bg-slate-50 rounded-2xl overflow-hidden relative shadow-sm border border-slate-100">
                            {product.images && product.images.length > 0 ? (
                                <Image
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    unoptimized
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    <ShoppingBagIcon className="h-20 w-20 opacity-20" />
                                </div>
                            )}

                            {/* Badges Overlay */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.featured && (
                                    <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-sm shadow-sm">
                                        Nouveauté
                                    </span>
                                )}
                                {!product.inStock && (
                                    <span className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-sm shadow-sm">
                                        Épuisé
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                                            ? 'border-amber-600 ring-2 ring-amber-600/20'
                                            : 'border-transparent hover:border-slate-300'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} vue ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info Section */}
                    <div className="lg:py-8 flex flex-col">
                        <div className="mb-2">
                            <span className="text-sm text-amber-600 font-medium tracking-wide uppercase">
                                {product.category}
                                {product.subCategory && <span className="text-slate-400"> / {product.subCategory}</span>}
                            </span>
                        </div>

                        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-slate-900 mb-4 tracking-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-8">
                            <span className="text-3xl font-light text-slate-900">
                                {formatPrice(product.price)}
                            </span>
                            {product.inStock ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    En stock
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Rupture de stock
                                </span>
                            )}
                        </div>

                        <div className="prose prose-slate prose-sm sm:prose-base text-slate-600 mb-10 flex-grow">
                            <p>{product.description}</p>
                        </div>


                        <div className="mt-auto pt-8 border-t border-slate-100">
                            {product.inStock ? (
                                <div className="space-y-4">
                                    {/* WhatsApp Line Selector */}
                                    <div>
                                        <label htmlFor="whatsapp-line" className="block text-sm font-medium text-slate-700 mb-2">
                                            Choisir une ligne WhatsApp
                                        </label>
                                        <select
                                            id="whatsapp-line"
                                            value={selectedWhatsApp}
                                            onChange={(e) => setSelectedWhatsApp(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-slate-900"
                                        >
                                            <option value="ligne1">SOUMAYA-BOUTIQUE - Ligne 1</option>
                                            <option value="ligne2">SOUMAYA-BOUTIQUE - Ligne 2</option>
                                        </select>
                                    </div>

                                    {/* WhatsApp Button */}
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex w-full items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-green-600 hover:bg-green-700 md:text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        <PhoneIcon className="h-6 w-6 mr-3" />
                                        Commander sur WhatsApp
                                    </a>
                                </div>
                            ) : (
                                <button
                                    disabled
                                    className="w-full flex items-center justify-center px-8 py-4 border border-slate-200 text-base font-medium rounded-full text-slate-400 bg-slate-50 cursor-not-allowed"
                                >
                                    Actuellement indisponible
                                </button>
                            )}
                            <p className="mt-4 text-center text-xs text-slate-400">
                                Livraison disponible partout au Sénégal • Paiement à la livraison
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
