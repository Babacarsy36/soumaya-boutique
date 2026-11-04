import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/catalogue";

const BASE = "https://soumayaboutique.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/boutique`, changeFrequency: "daily", priority: 0.9 },
    ...categories.map((c) => ({ url: `${BASE}/boutique?categorie=${c.slug}`, priority: 0.8 })),
    ...products.map((p) => ({ url: `${BASE}/produits/${p.slug}`, priority: 0.7 })),
    { url: `${BASE}/notre-histoire`, priority: 0.4 },
    { url: `${BASE}/nous-trouver`, priority: 0.5 },
  ];
}
