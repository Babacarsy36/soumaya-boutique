'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ShoppingBagIcon, TagIcon, ExclamationTriangleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { Product } from '@/lib/types';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        productsCount: 0,
        categoriesCount: 0,
        outOfStockCount: 0,
        featuredCount: 0
    });
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    setUser(session.user);
                    loadStats();
                } else {
                    router.push('/admin/login');
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user);
            } else {
                router.push('/admin/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const loadStats = async () => {
        try {
            // Fetch raw data to calculate stats
            const [productsResult, categoriesResult] = await Promise.all([
                getProducts({ limit: 1000 }), // Get all products (or reasonable limit)
                getCategories({ limit: 1000 })
            ]);

            const products = productsResult.data;
            const categories = categoriesResult.data;

            setStats({
                productsCount: productsResult.count,
                categoriesCount: categoriesResult.count,
                outOfStockCount: products.filter(p => !p.inStock).length,
                featuredCount: products.filter(p => p.featured).length
            });

            // Set recent products (first 5)
            setRecentProducts(products.slice(0, 5));

        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    const statCards = [
        { 
            name: 'Total Produits', 
            value: stats.productsCount.toString(), 
            icon: ShoppingBagIcon, 
            color: 'text-blue-600 bg-blue-50', 
            href: '/admin/products' 
        },
        { 
            name: 'Catégories', 
            value: stats.categoriesCount.toString(), 
            icon: TagIcon, 
            color: 'text-purple-600 bg-purple-50', 
            href: '/admin/categories' 
        },
        { 
            name: 'En Rupture', 
            value: stats.outOfStockCount.toString(), 
            icon: ExclamationTriangleIcon, 
            color: 'text-red-600 bg-red-50', 
            href: '/admin/products' 
        },
        { 
            name: 'Produits Vedettes', 
            value: stats.featuredCount.toString(), 
            icon: SparklesIcon, 
            color: 'text-amber-600 bg-amber-50', 
            href: '/admin/products' 
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900">
                    Tableau de bord
                </h1>
                <p className="mt-2 text-slate-600">
                    Bienvenue, <span className="font-semibold text-amber-600">{user?.email}</span>
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((item) => (
                    <Link 
                        key={item.name} 
                        href={item.href}
                        className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-slate-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{item.name}</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">{item.value}</p>
                            </div>
                            <div className={`rounded-xl p-3 ${item.color}`}>
                                <item.icon className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-slate-50 group-hover:bg-amber-500 transition-colors duration-300" />
                    </Link>
                ))}
            </div>

            {/* Recent Products */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900">Derniers produits ajoutés</h2>
                    <Link 
                        href="/admin/products"
                        className="text-sm font-medium text-amber-600 hover:text-amber-700 hover:underline"
                    >
                        Voir tout
                    </Link>
                </div>
                
                {recentProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider rounded-l-lg">Produit</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prix</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Catégorie</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider rounded-r-lg">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 relative rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                                                    {product.images[0] ? (
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <ShoppingBagIcon className="h-5 w-5 text-slate-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900">{product.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{formatPrice(product.price)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {product.inStock ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    En stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Rupture
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <ShoppingBagIcon className="h-12 w-12 mb-3 text-slate-300" />
                        <p>Aucun produit ajouté pour le moment</p>
                        <Link 
                            href="/admin/products"
                            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                        >
                            Ajouter un produit
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
