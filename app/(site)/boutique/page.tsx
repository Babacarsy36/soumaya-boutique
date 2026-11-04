import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getCategories, getCategory, getProducts } from "@/lib/catalogue";

const sorts = [
  { value: "", label: "Mis en avant" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
];

type Props = { searchParams: Promise<{ categorie?: string; tri?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { categorie } = await searchParams;
  const category = categorie ? await getCategory(categorie) : undefined;
  return { title: category ? category.name : "Boutique" };
}

export default async function Boutique({ searchParams }: Props) {
  const { categorie, tri = "" } = await searchParams;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorie);

  const list = (await getProducts({ category: category?.slug })).sort((a, b) => {
    if (tri === "prix-asc") return a.price - b.price;
    if (tri === "prix-desc") return b.price - a.price;
    return Number(b.featured) - Number(a.featured) || Number(b.inStock) - Number(a.inStock);
  });

  const href = (params: { categorie?: string; tri?: string }) => {
    const q = new URLSearchParams();
    if (params.categorie) q.set("categorie", params.categorie);
    if (params.tri) q.set("tri", params.tri);
    const s = q.toString();
    return s ? `/boutique?${s}` : "/boutique";
  };

  return (
    <div className="container-page pt-10 md:pt-16">
      <p className="eyebrow">Boutique</p>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">{category ? category.name : "Toute la collection"}</h1>
      <p className="mt-4 max-w-xl text-muted">
        {category ? category.tagline : "Tissus, parfums, chaussures et accessoires sélectionnés à Dakar."}
      </p>

      <div className="mt-10 flex flex-col gap-4 border-y border-line py-4 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Catégories" className="-mx-4 overflow-x-auto px-4">
          <ul className="flex gap-2 whitespace-nowrap">
            {[{ slug: undefined, name: "Tout" }, ...categories].map((c) => {
              const active = c.slug === category?.slug;
              return (
                <li key={c.name}>
                  <Link
                    href={href({ categorie: c.slug, tri })}
                    aria-current={active ? "page" : undefined}
                    className={`inline-block rounded-full border px-4 py-2 text-sm transition-colors ${
                      active ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink"
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 whitespace-nowrap text-sm">
          <span className="text-muted">Trier :</span>
          {sorts.map((s) => (
            <Link
              key={s.value}
              href={href({ categorie: category?.slug, tri: s.value })}
              className={tri === s.value ? "font-semibold underline underline-offset-4" : "text-muted hover:text-ink"}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        {list.length} article{list.length > 1 ? "s" : ""}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((p, i) => (
          <ProductCard key={p.slug} product={p} priority={i < 4} />
        ))}
      </div>
    </div>
  );
}
