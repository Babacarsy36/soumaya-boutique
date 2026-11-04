import Image from "next/image";
import Link from "next/link";
import { fromPrice, type Product } from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link href={`/produits/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {product.isNew && (
            <span className="rounded-full bg-ivory px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest">
              Nouveau
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-full bg-ink px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-ivory">
              Épuisé
            </span>
          )}
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted">{product.subCategory}</p>
        <h3 className="font-display text-xl leading-tight group-hover:text-ochre">{product.name}</h3>
        <p className="text-sm font-semibold">
          {fromPrice(product) && <span className="font-normal text-muted">À partir de </span>}
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
