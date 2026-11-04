import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProduct, getProducts } from "@/lib/catalogue";
import { SHOP_NAME, getSettings, whatsappLink } from "@/lib/site";

const promises = [
  { title: "Commande sur WhatsApp", text: "Choisissez vos articles, envoyez la liste, on vous répond vite." },
  { title: "Livraison au Sénégal", text: "Dakar en 24 h, les régions sous 48 à 72 h." },
  { title: "Wave & Orange Money", text: "Payez comme vous préférez, à la livraison ou à l'avance." },
];

export default async function Home() {
  const [settings, categories, featuredAll, newestAll] = await Promise.all([
    getSettings(),
    getCategories(),
    getProducts({ featured: true }),
    getProducts({ isNew: true }),
  ]);
  const featured = featuredAll.slice(0, 4);
  const newest = newestAll.slice(0, 3);
  const spotlight = (settings.spotlight && (await getProduct(settings.spotlight))) || featured[0];
  const heroImage = settings.heroImage ?? spotlight?.images[0] ?? categories[0]?.image;
  const storyImage = categories.at(-1)?.image;
  const ask = (message: string) => whatsappLink(settings.whatsapp, `Bonjour ${SHOP_NAME}, ${message}`);

  return (
    <>
      {/* Ouverture */}
      <section className="container-page grid gap-10 pb-16 pt-6 md:grid-cols-12 md:items-center md:pt-12 lg:pb-24">
        <div className="md:col-span-5">
          <p className="eyebrow">Nouvelle collection · {new Date().getFullYear()}</p>
          <h1 className="mt-5 font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            L’élégance <em className="text-earth">sénégalaise</em>, choisie pour vous.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">{settings.heroText}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/boutique" className="btn-dark">
              Découvrir la boutique
            </Link>
            <a
              href={ask("je voudrais des conseils.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Conseil sur WhatsApp
            </a>
          </div>
        </div>
        <div className="relative md:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand sm:aspect-[5/4] md:aspect-[4/5] lg:aspect-[5/4]">
            {heroImage && (
              <Image src={heroImage} alt="" fill priority sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
            )}
          </div>
          {spotlight && (
            <div className="absolute -bottom-6 left-4 max-w-[15rem] bg-ivory p-5 shadow-[0_20px_50px_-20px_rgba(27,21,17,0.35)] sm:left-8">
              <p className="eyebrow">À la une</p>
              <p className="mt-2 font-display text-2xl leading-tight">{spotlight.name}</p>
              <Link href={`/produits/${spotlight.slug}`} className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">
                Voir l’article
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Promesses */}
      <section className="border-y border-line bg-sand/60">
        <ul className="container-page grid gap-6 py-8 sm:grid-cols-3">
          {promises.map((p) => (
            <li key={p.title} className="flex gap-4">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ochre" aria-hidden="true" />
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="mt-1 text-sm text-muted">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Univers */}
      <section className="container-page py-20 lg:py-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Nos univers</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Tout pour vos grandes occasions</h2>
          </div>
          <Link href="/boutique" className="hidden text-sm font-semibold underline underline-offset-4 sm:block">
            Tout voir
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              href={`/boutique?categorie=${c.slug}`}
              className={`group relative overflow-hidden rounded-sm bg-sand ${i === 0 ? "col-span-2 aspect-[16/10] lg:col-span-1 lg:aspect-[3/4]" : "aspect-[3/4]"}`}
            >
              {c.image && (
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-ivory sm:p-6">
                <h3 className="font-display text-2xl sm:text-3xl">{c.name}</h3>
                <p className="mt-1 hidden text-sm text-ivory/80 sm:block">{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Incontournables */}
      <section className="bg-sand/60 py-20 lg:py-28">
        <div className="container-page">
          <p className="eyebrow">Les incontournables</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">Les pièces qu’on nous demande le plus</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/boutique" className="btn-dark">
              Voir toute la collection
            </Link>
          </div>
        </div>
      </section>

      {/* Histoire */}
      <section className="container-page grid gap-10 py-20 md:grid-cols-2 md:items-center lg:py-28">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand">
          {storyImage && (
            <Image src={storyImage} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          )}
        </div>
        <div className="md:pl-8">
          <p className="eyebrow">Notre histoire</p>
          <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            Une boutique de quartier devenue une adresse de confiance.
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            Chez Soumaya, chaque tissu est touché, chaque parfum senti avant d’entrer en boutique.
            Nous choisissons des pièces qui tiennent leurs promesses, pour les baptêmes, les mariages,
            la Tabaski et tous les jours qui comptent.
          </p>
          <Link href="/notre-histoire" className="btn-outline mt-8">
            Découvrir Soumaya
          </Link>
        </div>
      </section>

      {/* Nouveautés */}
      {newest.length > 0 && (
        <section className="container-page pb-4">
          <div className="flex items-end justify-between gap-6 border-t border-line pt-16">
            <div>
              <p className="eyebrow">Arrivages</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">Nouveautés</h2>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
            {newest.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Appel WhatsApp */}
      <section className="container-page pt-20">
        <div className="rounded-sm bg-earth px-6 py-14 text-center text-ivory sm:px-12">
          <p className="eyebrow text-gold">Besoin d’un conseil ?</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
            Envoyez-nous une photo de votre tenue, on vous aide à choisir.
          </h2>
          <a
            href={ask("j'aimerais un conseil pour une tenue.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-light mt-8"
          >
            Discuter sur WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
