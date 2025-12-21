'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import ProductCard from '@/components/ui/ProductCard';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { getSettings } from '@/lib/settings';
import { Product, Category, SiteSettings } from '@/lib/types';
import { FunnelIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

function ProductsContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [settings, setSettings] = useState<SiteSettings>({});
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const ITEMS_PER_PAGE = 3; // Reduced for testing pagination

    useEffect(() => {
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');
        const pageParam = searchParams.get('page');

        setSelectedCategory(category);
        if (pageParam) setCurrentPage(parseInt(pageParam));

        async function fetchData() {
            setLoading(true);
            try {
                // Fetch settings & categories only once ideally, but here we do parallel
                const [categoriesResult, settingsData] = await Promise.all([
                    getCategories(),
                    getSettings()
                ]);
                
                setCategories(categoriesResult.data);
                setSettings(settingsData);

                // Fetch products with pagination
                const { data, count } = await getProducts({
                    category: category || undefined,
                    featured: featured === 'true' ? true : undefined,
                    page: currentPage,
                    limit: ITEMS_PER_PAGE
                });

                setProducts(data);
                setTotalCount(count);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [searchParams, currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        window.history.pushState({}, '', `?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const hero = settings.products_hero || {
        title: "Nos Collections",
        subtitle: "Explorez notre sélection unique de tissus, parfums et accessoires, choisis avec soin pour leur qualité et leur élégance.",
        imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop"
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-slate-900 border-b border-slate-100 py-24 sm:py-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    {hero.imageUrl && (
                        <Image
                            src={hero.imageUrl}
                            alt="Collection background"
                            fill
                            className="object-cover opacity-80"
                            priority
                            unoptimized
                        />
                    )}
                </div>
                
                <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-serif text-4xl font-medium text-white sm:text-5xl mb-4 tracking-tight">
                        {hero.title}
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-lg text-white/90 font-light">
                        {hero.subtitle}
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters (Desktop) */}
                    <div className="hidden lg:block w-64 flex-shrink-0 space-y-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">
                                Catégories
                            </h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setCurrentPage(1);
                                        window.history.pushState({}, '', '/products');
                                    }}
                                    className={`w-full flex items-center justify-between text-sm py-2 px-3 rounded-md transition-all group ${
                                        !selectedCategory 
                                            ? 'bg-amber-50 text-amber-900 font-medium' 
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <span>Tout voir</span>
                                    {!selectedCategory && <ChevronRightIcon className="h-4 w-4 text-amber-600" />}
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setSelectedCategory(cat.slug);
                                            setCurrentPage(1);
                                            const params = new URLSearchParams();
                                            params.set('category', cat.slug);
                                            window.history.pushState({}, '', `?${params.toString()}`);
                                        }}
                                        className={`w-full flex items-center justify-between text-sm py-2 px-3 rounded-md transition-all group ${
                                            selectedCategory === cat.slug
                                                ? 'bg-amber-50 text-amber-900 font-medium' 
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        <span>{cat.name}</span>
                                        {selectedCategory === cat.slug && (
                                            <ChevronRightIcon className="h-4 w-4 text-amber-600" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filters & Search */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between lg:hidden">
                            <div className="w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 flex gap-2 no-scrollbar">
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setCurrentPage(1);
                                    }}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                                        !selectedCategory 
                                            ? 'bg-amber-600 text-white border-amber-600' 
                                            : 'bg-white text-slate-700 border-slate-200'
                                    }`}
                                >
                                    Tout
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setSelectedCategory(cat.slug);
                                            setCurrentPage(1);
                                        }}
                                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                                            selectedCategory === cat.slug
                                                ? 'bg-amber-600 text-white border-amber-600' 
                                                : 'bg-white text-slate-700 border-slate-200'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-slate-200 aspect-[3/4] rounded-lg mb-4"></div>
                                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                                
                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="mt-12 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeftIcon className="h-5 w-5" />
                                        </button>
                                        
                                        {[...Array(totalPages)].map((_, i) => {
                                            const page = i + 1;
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                                                        currentPage === page
                                                            ? 'bg-amber-600 text-white'
                                                            : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRightIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <FunnelIcon className="mx-auto h-12 w-12 text-slate-300" />
                                <h3 className="mt-2 text-sm font-semibold text-slate-900">Aucun produit trouvé</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Essayez de modifier vos filtres ou votre recherche.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
