import Image from "next/image";
import Link from "next/link";
import { fromPrice, type Product } from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";

type Props = { product: Product; priority?: boolean; index?: number };

export default function ProductCard({ product, priority = false, index = 0 }: Props) {
  return (
    <Link
      href={`/produits/${product.slug}`}
      data-reveal
      style={{ "--i": index % 4 } as React.CSSProperties}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand shadow-[0_0_0_rgb(27_21_17/0)] transition-[box-shadow,translate] duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_40px_-24px_rgb(27_21_17/0.45)]">
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
        <span className="absolute inset-x-3 bottom-3 translate-y-3 rounded-full bg-ivory/95 py-2.5 text-center text-xs font-semibold uppercase tracking-widest opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Voir l’article
        </span>
        <div className="absolute left-3 top-3 flex gap-2">
          {product.isNew && (
            <span className="rounded-full bg-gold px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-ink">
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
        <h3 className="font-display text-xl leading-tight transition-colors group-hover:text-ochre">{product.name}</h3>
        <p className="text-sm font-semibold">
          {fromPrice(product) && <span className="font-normal text-muted">À partir de </span>}
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
