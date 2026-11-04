import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/catalogue";
import { getAbout } from "@/lib/site";

export const metadata: Metadata = { title: "Notre histoire" };

const values = [
  { title: "Choisir", text: "Chaque pièce est vue, touchée ou sentie avant d’entrer en boutique." },
  { title: "Conseiller", text: "On vous aide à trouver le bon tissu, la bonne quantité, le bon parfum." },
  { title: "Livrer", text: "À Dakar comme en région, votre commande arrive vite et bien emballée." },
];

export default async function NotreHistoire() {
  const [about, categories] = await Promise.all([getAbout(), getCategories()]);
  const image = about.image ?? categories[0]?.image;

  return (
    <div className="container-page pt-10 md:pt-16">
      <p className="eyebrow">Notre histoire</p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight sm:text-6xl">{about.title}</h1>

      <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand">
          {image && <Image src={image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />}
        </div>
        <div className="space-y-5 leading-relaxed text-muted md:pl-8">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <ul className="mt-20 grid gap-8 border-t border-line pt-12 sm:grid-cols-3">
        {values.map((v, i) => (
          <li key={v.title}>
            <p className="font-display text-5xl text-gold">0{i + 1}</p>
            <h2 className="mt-3 font-display text-2xl">{v.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-16">
        <Link href="/boutique" className="btn-dark">
          Découvrir la boutique
        </Link>
      </div>
    </div>
  );
}
