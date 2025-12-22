'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Cette page sert maintenant uniquement de redirection vers la nouvelle structure d'URL
// pour assurer la rétrocompatibilité
export default function ProductRedirectPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    useEffect(() => {
        if (id) {
            router.replace(`/product?id=${id}`);
        } else {
            router.replace('/products');
        }
    }, [id, router]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
    );
}
