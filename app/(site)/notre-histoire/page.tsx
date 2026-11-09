import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import PageHero from "@/components/PageHero";
import { BazinPattern, WaxPattern } from "@/components/patterns";
import { getCategories } from "@/lib/catalogue";
import { getAbout } from "@/lib/site";

export const metadata: Metadata = { title: "Notre histoire" };

const values = [
  { title: "Choisir", text: "Chaque pièce est vue, touchée ou sentie avant d’entrer en boutique." },
  { title: "Conseiller", text: "On vous aide à trouver le bon tissu, la bonne quantité, le bon parfum." },
  { title: "Livrer", text: "À Dakar comme en région, votre commande arrive vite et bien emballée." },
];

const delay = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default async function NotreHistoire() {
  const [about, categories] = await Promise.all([getAbout(), getCategories()]);
  const image = about.image ?? categories[0]?.image;
  const [first, ...rest] = about.paragraphs;

  return (
    <>
      <PageHero eyebrow="Notre histoire" title={about.title} />

      <section className="container-page grid gap-14 py-20 md:grid-cols-2 md:items-center lg:py-28">
        {/* Photo posée sur un coupon de wax */}
        <div data-reveal className="relative mx-4 md:mx-0">
          <div className="absolute -bottom-5 -left-5 h-2/3 w-2/3 overflow-hidden rounded-sm sm:-bottom-8 sm:-left-8">
            <WaxPattern id="story-wax" scale={0.5} />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand shadow-[0_30px_60px_-30px_rgb(27_21_17/0.5)]">
            {image && <Image src={image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />}
          </div>
        </div>
        <div className="md:pl-8">
          {first && (
            <p data-reveal className="font-display text-3xl leading-snug text-ink sm:text-4xl">
              {first}
            </p>
          )}
          <div className="mt-6 space-y-5 leading-relaxed text-muted">
            {rest.map((p, i) => (
              <p key={i} data-reveal style={delay(i + 1)}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 opacity-60">
          <BazinPattern id="values-bazin" scale={0.8} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ivory via-ivory/30 to-ivory" />
        <div className="container-page relative">
          <p data-reveal className="eyebrow">
            Notre façon de faire
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {values.map((v, i) => (
              <li
                key={v.title}
                data-reveal
                style={delay(i)}
                className="group rounded-sm bg-ivory/90 p-8 shadow-[0_20px_40px_-30px_rgb(27_21_17/0.4)] backdrop-blur transition-transform duration-500 hover:-translate-y-1.5"
              >
                <p className="font-display text-6xl text-gold transition-colors group-hover:text-ochre">0{i + 1}</p>
                <h2 className="mt-4 font-display text-3xl">{v.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
          <div data-reveal className="mt-14 text-center">
            <Link href="/boutique" className="btn-dark">
              Découvrir la boutique
            </Link>
          </div>
        </div>
      </section>

      <Marquee className="-mb-24 bg-ink text-gold" />
    </>
  );
}
