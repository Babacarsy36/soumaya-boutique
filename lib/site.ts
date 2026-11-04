// Coordonnées de la boutique : modifiables dans l'admin (« Infos boutique »).
// Les valeurs par défaut ci-dessous servent tant que l'admin n'est pas rempli.
import { cache } from "react";
import { sanityFetch } from "@/sanity/client";
import { imageUrl } from "@/sanity/image";

export { SHOP_CITY, SHOP_NAME, formatPrice, whatsappLink } from "./format";
import { fallbackAbout as defaultAbout, fallbackSettings as defaults } from "./fallback";

export type Settings = {
  whatsapp: string;
  address: string;
  mapsUrl?: string;
  hours: { days: string; time: string }[];
  instagram?: string;
  tiktok?: string;
  heroText: string;
  heroImage?: string;
  spotlight?: string;
  faq: { question: string; answer: string }[];
};

export type About = { title: string; image?: string; paragraphs: string[] };

type SettingsDoc = Partial<Omit<Settings, "heroImage">> & { heroImage?: object };

const settingsQuery = `*[_type == "settings" && _id == "settings"][0] {
  whatsapp, address, mapsUrl, hours, instagram, tiktok, heroText, heroImage,
  "spotlight": spotlight->slug.current, faq
}`;

const aboutQuery = `*[_type == "about" && _id == "about"][0] { title, image, paragraphs }`;

// Un champ vide dans l'admin garde la valeur par défaut.
const filled = <T,>(value: T | null | undefined, fallback: T): T =>
  value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)
    ? fallback
    : value;

export const getSettings = cache(async (): Promise<Settings> => {
  const doc = await sanityFetch<SettingsDoc | null>(settingsQuery);
  if (!doc) return defaults;
  return {
    whatsapp: filled(doc.whatsapp, defaults.whatsapp),
    address: filled(doc.address, defaults.address),
    mapsUrl: doc.mapsUrl ?? undefined,
    hours: filled(doc.hours, defaults.hours),
    instagram: doc.instagram ?? undefined,
    tiktok: doc.tiktok ?? undefined,
    heroText: filled(doc.heroText, defaults.heroText),
    heroImage: imageUrl(doc.heroImage, 2000),
    spotlight: doc.spotlight ?? undefined,
    faq: filled(doc.faq, defaults.faq),
  };
});

export const getAbout = cache(async (): Promise<About> => {
  const doc = await sanityFetch<{ title?: string; image?: object; paragraphs?: string[] } | null>(aboutQuery);
  return {
    title: filled(doc?.title, defaultAbout.title),
    image: imageUrl(doc?.image),
    paragraphs: filled(doc?.paragraphs, defaultAbout.paragraphs),
  };
});
