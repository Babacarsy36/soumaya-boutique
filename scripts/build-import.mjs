// Génère scripts/import/catalogue.ndjson à partir de lib/fallback.ts, pour remplir Sanity une première fois.
// Usage : node scripts/build-import.mjs, puis npx sanity dataset import scripts/import/catalogue.ndjson production
// Les photos sont téléchargées par Sanity lors de l'import (champ _sanityAsset).
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fallbackAbout, fallbackCategories, fallbackProducts, fallbackSettings } from "../lib/fallback.ts";

const key = (i) => `k${i}`;
const image = (url) => ({ _type: "image", _sanityAsset: `image@${url}` });
const slug = (current) => ({ _type: "slug", current });

const categories = fallbackCategories.map((c, i) => ({
  _id: `category-${c.slug}`,
  _type: "category",
  name: c.name,
  slug: slug(c.slug),
  tagline: c.tagline,
  order: (i + 1) * 10,
  image: image(c.image),
}));

const products = fallbackProducts.map((p) => ({
  _id: `product-${p.slug}`,
  _type: "product",
  name: p.name,
  slug: slug(p.slug),
  category: { _type: "reference", _ref: `category-${p.category}` },
  subCategory: p.subCategory,
  description: p.description,
  ...(p.option
    ? {
        option: {
          label: p.option.label,
          choices: p.option.choices.map((c, i) => ({ _key: key(i), _type: "choice", ...c })),
        },
      }
    : { price: p.price }),
  images: p.images.map((url, i) => ({ _key: key(i), ...image(url) })),
  inStock: p.inStock,
  featured: p.featured,
  isNew: Boolean(p.isNew),
}));

const settings = {
  _id: "settings",
  _type: "settings",
  address: fallbackSettings.address,
  hours: fallbackSettings.hours.map((h, i) => ({ _key: key(i), _type: "hour", ...h })),
  heroText: fallbackSettings.heroText,
  spotlight: { _type: "reference", _ref: `product-${fallbackProducts.find((p) => p.featured)?.slug}` },
  faq: fallbackSettings.faq.map((f, i) => ({ _key: key(i), _type: "faqItem", ...f })),
};

const about = { _id: "about", _type: "about", title: fallbackAbout.title, paragraphs: fallbackAbout.paragraphs };

const out = join(dirname(fileURLToPath(import.meta.url)), "import", "catalogue.ndjson");
mkdirSync(dirname(out), { recursive: true });
const docs = [...categories, ...products, settings, about];
writeFileSync(out, docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
console.log(`${docs.length} documents écrits dans ${out}`);
