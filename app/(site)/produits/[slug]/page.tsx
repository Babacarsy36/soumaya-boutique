import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { WaxBand } from "@/components/patterns";
import AddToOrder from "@/components/AddToOrder";
import { getCategory, getProduct, getProducts, getRelated } from "@/lib/catalogue";

type Props = { params: Promise<{ slug: string }> };

const services = [
  {
    title: "Livraison",
    text: "Dakar 24 h · Régions 48 à 72 h",
    icon: "M3 6h11v10H3zM14 9h4l3 3v4h-7M5 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0M15 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
  },
  { title: "Paiement", text: "Wave, Orange Money ou espèces", icon: "M3 6h18v12H3zM3 10h18M7 15h3" },
  { title: "Retrait", text: "Possible en boutique", icon: "M4 10l8-6 8 6v10H4zM10 20v-6h4v6" },
];

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
        <div data-reveal className="lg:col-span-7">
          <ProductGallery images={product.images} alt={product.name} />
        </div>

        <div className="lg:col-span-5 lg:pt-4">
          <div className="lg:sticky lg:top-28">
            <p data-reveal className="eyebrow">
              {product.subCategory}
            </p>
            <h1
              data-reveal
              style={{ "--i": 1 } as React.CSSProperties}
              className="mt-3 font-display text-4xl leading-tight sm:text-5xl"
            >
              {product.name}
            </h1>
            <div data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              <p className="mt-6 leading-relaxed text-muted">{product.description}</p>
              <AddToOrder product={product} />
            </div>

            <ul
              data-reveal
              style={{ "--i": 3 } as React.CSSProperties}
              className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
            >
              {services.map((s) => (
                <li key={s.title} className="rounded-sm bg-sand/70 p-4 transition-colors hover:bg-sand">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-ochre"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={s.icon} />
                  </svg>
                  <p className="mt-3 text-sm font-semibold">{s.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{s.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <WaxBand id="related-band" className="mb-12 h-4 rounded-full" />
          <h2 data-reveal className="font-display text-3xl sm:text-4xl">
            Dans le même univers
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
