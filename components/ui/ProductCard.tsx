import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link
            href={`/product?id=${product.id}`}
            className="group block relative"
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg">
                {product.images && product.images.length > 0 ? (
                    <>
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            unoptimized
                        />
                        {/* Overlay au survol */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50">
                        <ShoppingBagIcon className="h-12 w-12 opacity-20" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.featured && (
                        <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-sm shadow-sm">
                            Nouveauté
                        </span>
                    )}
                    {!product.inStock && (
                        <span className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-sm shadow-sm">
                            Épuisé
                        </span>
                    )}
                </div>

                {/* Bouton d'action rapide (optionnel, visible au survol) */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white text-gray-900 text-center py-3 px-4 text-sm font-medium uppercase tracking-wide hover:bg-gray-50 transition-colors shadow-lg rounded-sm">
                        Voir les détails
                    </div>
                </div>
            </div>

            <div className="mt-4 space-y-1">
                <div className="flex justify-between items-start">
                    <h3 className="text-base font-medium text-gray-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                    <p className="text-base font-medium text-gray-900">
                        {formatPrice(product.price)}
                    </p>
                </div>
                <p className="text-sm text-gray-500 capitalize">
                    {product.category}
                    {product.subCategory && (
                        <span className="text-gray-400"> • {product.subCategory}</span>
                    )}
                </p>
            </div>
        </Link>
    );
}
