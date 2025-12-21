'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { getCategories } from '@/lib/categories';
import { Category } from '@/lib/types';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await getCategories();
            setCategories(data);
        }
        fetchCategories();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Transparent header on homepage hero, solid otherwise
    const isTransparent = pathname === '/' && !isScrolled;

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isTransparent 
                    ? 'bg-transparent text-white py-4' 
                    : 'bg-white/80 backdrop-blur-md text-slate-900 shadow-sm py-2'
            }`}
        >
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            isTransparent ? 'bg-white/20 text-white' : 'bg-amber-600 text-white'
                        }`}>
                            <span className="font-serif font-bold text-lg">S</span>
                        </div>
                        <span className={`font-serif text-xl font-bold tracking-tight ${
                            isTransparent ? 'text-white' : 'text-slate-900'
                        }`}>
                            Soumaya <span className={isTransparent ? 'text-amber-400' : 'text-amber-600'}>Boutique</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link 
                            href="/" 
                            className={`text-sm font-medium transition-colors ${
                                isTransparent ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-amber-600'
                            }`}
                        >
                            Accueil
                        </Link>
                        
                        <div className="relative group">
                            <Link 
                                href="/products"
                                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                                    isTransparent ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-amber-600'
                                }`}
                            >
                                Collections
                                <ChevronDownIcon className="h-3 w-3 transition-transform group-hover:rotate-180" />
                            </Link>
                            
                            {/* Dropdown */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top">
                                <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-4 min-w-[200px] grid gap-1">
                                    <Link 
                                        href="/products"
                                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors font-medium"
                                    >
                                        Tout voir
                                    </Link>
                                    <div className="h-px bg-slate-100 my-1" />
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/products?category=${cat.slug}`}
                                            className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link 
                            href="/about" 
                            className={`text-sm font-medium transition-colors ${
                                isTransparent ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-amber-600'
                            }`}
                        >
                            À propos
                        </Link>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-4">
                        {/* Mobile menu button */}
                        <button
                            className={`md:hidden p-2 rounded-full transition-colors ${
                                isTransparent ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'
                            }`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-4 animate-in slide-in-from-top-5 duration-200">
                        <div className="space-y-1">
                            <Link
                                href="/"
                                className="block px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50 rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Accueil
                            </Link>
                            <div className="px-4 py-2">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Collections</p>
                                <div className="space-y-1 pl-2 border-l-2 border-slate-100">
                                    <Link
                                        href="/products"
                                        className="block px-4 py-2 text-sm text-slate-600 hover:text-amber-600 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Tout voir
                                    </Link>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/products?category=${cat.slug}`}
                                            className="block px-4 py-2 text-sm text-slate-600 hover:text-amber-600 transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <Link
                                href="/about"
                                className="block px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50 rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                À propos
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
