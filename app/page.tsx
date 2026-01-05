'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, StarIcon, TruckIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { getCategories } from '@/lib/categories';
import { getProducts } from '@/lib/products';
import { getSettings } from '@/lib/settings';
import { Category, Product, SiteSettings } from '@/lib/types';
import ProductCard from '@/components/ui/ProductCard';

export default function HomePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [settings, setSettings] = useState<SiteSettings>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [catsResult, productsResult, settingsData] = await Promise.all([
                    getCategories(),
                    getProducts({ featured: true, limitCount: 4 }),
                    getSettings()
                ]);
                setCategories(catsResult.data);
                setFeaturedProducts(productsResult.data);
                setSettings(settingsData);
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const hero = settings.home_hero || {
        title: "L'Art de l'Élégance Sénégalaise",
        subtitle: "Découvrez notre sélection exclusive de tissus raffinés, parfums envoûtants et accessoires de mode.",
        buttonText: "Découvrir la boutique",
        imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
    };

    const collectionBadge = settings.collection_badge || {
        text: "Nouvelle Collection 2024",
        visible: true
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[80vh] bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    {hero.imageUrl && (
                        <Image
                            src={hero.imageUrl}
                            alt="Hero background"
                            fill
                            className="object-cover"
                            priority
                            unoptimized
                        />
                    )}
                </div>

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {collectionBadge.visible && (
                        <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-white/80 text-sm font-medium tracking-widest uppercase mb-6 backdrop-blur-sm">
                            {collectionBadge.text}
                        </span>
                    )}
                    <h1 className="font-serif text-5xl md:text-7xl font-medium text-white mb-8 leading-tight">
                        {hero.title?.includes('Sénégalaise') ? (
                            <>
                                {hero.title.replace(' Sénégalaise', '')} <br />
                                <span className="italic text-amber-500">Sénégalaise</span>
                            </>
                        ) : (
                            hero.title || "L'Art de l'Élégance Sénégalaise"
                        )}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-10 font-light max-w-2xl mx-auto">
                        {hero.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="px-8 py-4 bg-white text-slate-900 font-medium rounded-full hover:bg-amber-50 transition-colors shadow-lg hover:shadow-xl"
                        >
                            {hero.buttonText}
                        </Link>
                        <Link
                            href="/products?category=tissus"
                            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-medium rounded-full hover:bg-white/20 transition-colors"
                        >
                            Nos Tissus
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features / Values */}
            <section className="py-12 border-b border-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center p-4">
                            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-600">
                                <TruckIcon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-serif font-medium text-slate-900 mb-2">Livraison Rapide</h3>
                            <p className="text-slate-500 font-light">Expédition sécurisée partout au Sénégal sous 24-48h.</p>
                        </div>
                        <div className="flex flex-col items-center p-4">
                            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-600">
                                <ShieldCheckIcon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-serif font-medium text-slate-900 mb-2">Qualité Garantie</h3>
                            <p className="text-slate-500 font-light">Une sélection rigoureuse des meilleures marques et matières.</p>
                        </div>
                        <div className="flex flex-col items-center p-4">
                            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-600">
                                <SparklesIcon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-serif font-medium text-slate-900 mb-2">Service Premium</h3>
                            <p className="text-slate-500 font-light">Une équipe dédiée à votre écoute pour vous conseiller.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl text-slate-900 mb-4">Nos Univers</h2>
                        <div className="h-1 w-20 bg-amber-600 mx-auto rounded-full" />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="aspect-[4/5] bg-slate-100 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/products?category=${category.slug}`}
                                    className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-slate-200">
                                        {category.image ? (
                                            <Image
                                                src={category.image}
                                                alt={category.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                                <span className="text-slate-300">Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-2xl font-serif text-white mb-2">{category.name}</h3>
                                        <span className="inline-flex items-center text-sm text-amber-400 font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                            Explorer <ArrowRightIcon className="ml-2 h-4 w-4" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="font-serif text-3xl md:text-4xl text-slate-900 mb-2">Les Incontournables</h2>
                            <p className="text-slate-500 font-light">Nos pièces les plus convoitées du moment.</p>
                        </div>
                        <Link
                            href="/products"
                            className="hidden sm:flex items-center text-amber-700 hover:text-amber-800 font-medium transition-colors"
                        >
                            Tout voir <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[3/4] bg-slate-200 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-slate-500">Bientôt disponible.</p>
                        </div>
                    )}

                    <div className="mt-12 text-center sm:hidden">
                        <Link
                            href="/products"
                            className="inline-flex items-center px-6 py-3 border border-slate-300 rounded-full text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                        >
                            Voir toute la collection
                        </Link>
                    </div>
                </div>
            </section>

            {/* Story / About Section */}
            <section className="py-20 bg-white overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative bg-slate-900 rounded-3xl overflow-hidden">
                        <div className="absolute inset-0">
                            {/* Placeholder for About Image */}
                            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
                        </div>
                        <div className="relative px-6 py-24 sm:px-12 sm:py-32 lg:px-16 text-center max-w-3xl mx-auto">
                            <h2 className="text-3xl font-serif font-bold tracking-tight text-white sm:text-4xl mb-6">
                                Une Histoire de Passion
                            </h2>
                            <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300 font-light leading-relaxed">
                                Chez {settings.site_info?.name || 'Soumaya Boutique'}, nous célébrons la beauté et l'authenticité. Chaque pièce est choisie avec amour pour vous offrir le meilleur de la mode et de l'artisanat.
                            </p>
                            <div className="mt-10 flex justify-center gap-x-6">
                                <Link
                                    href="/products"
                                    className="rounded-full bg-amber-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-all"
                                >
                                    Visiter la boutique
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
