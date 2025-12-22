'use client';

import { useSearchParams } from 'next/navigation';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import { Suspense, useEffect, useState } from 'react';

function ProductDetailWrapper() {
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
    );

    const id = searchParams?.get('id');

    if (!id) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-500 mb-4">Produit non spécifié</p>
                    <a href="/products" className="text-amber-600 hover:underline">Retour à la boutique</a>
                </div>
            </div>
        );
    }

    return <ProductDetailClient id={id} />;
}

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <ProductDetailWrapper />
        </Suspense>
    );
}
