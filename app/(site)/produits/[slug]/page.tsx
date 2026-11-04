import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import AddToOrder from "@/components/AddToOrder";
import { getCategory, getProduct, getProducts, getRelated } from "@/lib/catalogue";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const [category, related] = await Promise.all([getCategory(product.category), getRelated(product)]);

  return (
    <div className="container-page pt-6 md:pt-10">
      <nav aria-label="Fil d’Ariane" className="text-sm text-muted">
        <Link href="/boutique" className="hover:text-ink">
          Boutique
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/boutique?categorie=${product.category}`} className="hover:text-ink">
          {category?.name}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} alt={product.name} />
        </div>

        <div className="lg:col-span-5 lg:pt-4">
          <p className="eyebrow">{product.subCategory}</p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

          <AddToOrder product={product} />

          <dl className="mt-10 divide-y divide-line border-y border-line text-sm">
            <div className="flex justify-between gap-4 py-4">
              <dt className="font-semibold">Livraison</dt>
              <dd className="text-right text-muted">Dakar 24 h · Régions 48 à 72 h</dd>
            </div>
            <div className="flex justify-between gap-4 py-4">
              <dt className="font-semibold">Paiement</dt>
              <dd className="text-right text-muted">Wave, Orange Money ou espèces</dd>
            </div>
            <div className="flex justify-between gap-4 py-4">
              <dt className="font-semibold">Retrait</dt>
              <dd className="text-right text-muted">Possible en boutique</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl sm:text-4xl">Dans le même univers</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
