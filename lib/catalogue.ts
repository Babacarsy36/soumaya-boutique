// Seule porte d'accès au catalogue : Sanity quand il est relié, sinon lib/fallback.ts.
import { cache } from "react";
import { sanityFetch } from "@/sanity/client";
import { imageUrl } from "@/sanity/image";
import { fallbackCategories, fallbackProducts } from "./fallback";

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  // Prix du premier choix quand le produit a une option.
  price: number;
  images: string[];
  inStock: boolean;
  featured: boolean;
  isNew?: boolean;
  option?: { label: string; choices: { label: string; price: number }[] };
};

type SanityImage = { asset?: { _ref: string } };

type CategoryDoc = { slug: string; name: string; tagline?: string; image?: SanityImage };

type ProductDoc = {
  slug: string;
  name: string;
  category?: string;
  subCategory?: string;
  description?: string;
  price?: number;
  images?: SanityImage[];
  inStock?: boolean;
  featured?: boolean;
  isNew?: boolean;
  option?: { label?: string; choices?: { label: string; price: number }[] };
};

const categoriesQuery = `*[_type == "category" && defined(slug.current)] | order(order asc, name asc) {
  "slug": slug.current, name, tagline, image
}`;

const productsQuery = `*[_type == "product" && defined(slug.current)] | order(_createdAt desc) {
  "slug": slug.current, name, "category": category->slug.current, subCategory, description,
  price, images, inStock, featured, isNew, option
}`;

function toCategory(doc: CategoryDoc): Category {
  return { slug: doc.slug, name: doc.name, tagline: doc.tagline ?? "", image: imageUrl(doc.image) ?? "" };
}

function toProduct(doc: ProductDoc): Product {
  const choices = doc.option?.choices?.filter((c) => c.label && typeof c.price === "number") ?? [];
  return {
    slug: doc.slug,
    name: doc.name,
    category: doc.category ?? "",
    subCategory: doc.subCategory ?? "",
    description: doc.description ?? "",
    price: choices[0]?.price ?? doc.price ?? 0,
    images: (doc.images ?? []).map((img) => imageUrl(img)).filter((url): url is string => Boolean(url)),
    inStock: doc.inStock !== false,
    featured: Boolean(doc.featured),
    isNew: Boolean(doc.isNew),
    option: choices.length ? { label: doc.option?.label || "Option", choices } : undefined,
  };
}

// cache() : une seule requête par page, même si plusieurs composants demandent le catalogue.
export const getCategories = cache(async (): Promise<Category[]> => {
  const docs = await sanityFetch<CategoryDoc[]>(categoriesQuery);
  return docs ? docs.map(toCategory) : fallbackCategories;
});

const getAllProducts = cache(async (): Promise<Product[]> => {
  const docs = await sanityFetch<ProductDoc[]>(productsQuery);
  return docs ? docs.map(toProduct).filter((p) => p.images.length > 0) : fallbackProducts;
});

export async function getCategory(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function getProduct(slug: string) {
  return (await getAllProducts()).find((p) => p.slug === slug);
}

export async function getProducts(filter?: { category?: string; featured?: boolean; isNew?: boolean }) {
  return (await getAllProducts()).filter(
    (p) =>
      (!filter?.category || p.category === filter.category) &&
      (filter?.featured === undefined || p.featured === filter.featured) &&
      (filter?.isNew === undefined || Boolean(p.isNew) === filter.isNew),
  );
}

export async function getRelated(product: Product, limit = 4) {
  return (await getProducts({ category: product.category }))
    .filter((p) => p.slug !== product.slug)
    .slice(0, limit);
}

// Vrai quand les choix n'ont pas tous le même prix.
export function fromPrice(product: Product) {
  return new Set(product.option?.choices.map((c) => c.price)).size > 1;
}
