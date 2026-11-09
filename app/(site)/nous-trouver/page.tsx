import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { WaxPattern } from "@/components/patterns";
import { SHOP_CITY, SHOP_NAME, getSettings, whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Nous trouver" };

const delay = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default async function NousTrouver() {
  const settings = await getSettings();
  const write = whatsappLink(settings.whatsapp, `Bonjour ${SHOP_NAME}, j'ai une question.`);

  return (
    <>
      <PageHero
        eyebrow="Nous trouver"
        title={
          <>
            Passez nous voir à <em className="text-gold">{SHOP_CITY}</em>
          </>
        }
        intro="Venez toucher les tissus et sentir les parfums, ou écrivez-nous : on vous répond vite."
      >
        <div className="flex flex-wrap gap-3">
          <a href={write} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            Nous écrire sur WhatsApp
          </a>
          {settings.mapsUrl && (
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border border-ivory/40 text-ivory hover:border-ivory"
            >
              Itinéraire
            </a>
          )}
        </div>
      </PageHero>

      <div className="container-page">
        <section className="grid gap-6 py-20 lg:grid-cols-5 lg:py-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
            <div data-reveal className="rounded-sm bg-sand/70 p-8">
              <p className="eyebrow">Adresse</p>
              <p className="mt-4 font-display text-3xl leading-snug">{settings.address}</p>
            </div>
            <div data-reveal style={delay(1)} className="rounded-sm bg-sand/70 p-8">
              <p className="eyebrow">Horaires</p>
              <dl className="mt-4 space-y-2">
                {settings.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-6 border-b border-line pb-2 last:border-0">
                    <dt className="text-muted">{h.days}</dt>
                    <dd className="font-semibold">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Carte d'accès, sur un coupon de wax */}
          <a
            data-reveal
            style={delay(2)}
            href={settings.mapsUrl ?? write}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex min-h-80 items-end overflow-hidden rounded-sm lg:col-span-3"
          >
            <div className="absolute inset-0 transition-transform duration-[1.5s] group-hover:scale-110">
              <WaxPattern id="map-wax" scale={0.6} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/20" />
            <div className="relative p-8 text-ivory">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold text-ink transition-transform duration-500 group-hover:-translate-y-1">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21Z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
              </span>
              <p className="mt-5 font-display text-4xl leading-tight">{SHOP_NAME}</p>
              <p className="mt-2 text-ivory/80">{settings.address}</p>
              <p className="mt-6 text-sm font-semibold underline underline-offset-4">
                {settings.mapsUrl ? "Ouvrir l’itinéraire dans Google Maps" : "Demander l’adresse exacte sur WhatsApp"}
              </p>
            </div>
          </a>
        </section>

        <section className="grid gap-10 border-t border-line pt-16 lg:grid-cols-3">
          <div data-reveal>
            <p className="eyebrow">Avant de commander</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Questions fréquentes</h2>
          </div>
          <div className="divide-y divide-line border-y border-line lg:col-span-2">
            {settings.faq.map((item, i) => (
              <details key={item.question} data-reveal style={delay(i)} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold transition-colors hover:text-ochre">
                  {item.question}
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-xl text-ochre transition-transform duration-300 group-open:rotate-45 group-open:border-ochre"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
