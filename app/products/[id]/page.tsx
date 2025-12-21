import { Suspense } from 'react';
import ProductDetailClient from '@/components/products/ProductDetailClient';

// Force dynamic rendering to ensure the page is built on demand on the server
// This fixes 404 errors when new products are added after build time
export const dynamic = 'force-dynamic';

// Server Component (Default in Next.js App Router)
// This receives the `params` prop which is a Promise in Next.js 15+
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Await the params to get the id
    const { id } = await params;

    // Pass the id to the Client Component
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        }>
            <ProductDetailClient id={id} />
        </Suspense>
    );
}
