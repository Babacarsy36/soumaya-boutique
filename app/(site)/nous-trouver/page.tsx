import type { Metadata } from "next";
import { SHOP_CITY, SHOP_NAME, getSettings, whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Nous trouver" };

export default async function NousTrouver() {
  const settings = await getSettings();

  return (
    <div className="container-page pt-10 md:pt-16">
      <p className="eyebrow">Nous trouver</p>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">Passez nous voir à {SHOP_CITY}</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl">Adresse</h2>
            <p className="mt-2 text-muted">{settings.address}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl">Horaires</h2>
            <dl className="mt-2 space-y-1 text-muted">
              {settings.hours.map((h) => (
                <div key={h.days} className="flex max-w-xs justify-between">
                  <dt>{h.days}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappLink(settings.whatsapp, `Bonjour ${SHOP_NAME}, j'ai une question.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              Nous écrire sur WhatsApp
            </a>
            {settings.mapsUrl && (
              <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Itinéraire
              </a>
            )}
          </div>
        </div>

        <div className="flex aspect-[4/3] items-center justify-center rounded-sm border border-dashed border-line bg-sand/60 p-6 text-center text-sm text-muted">
          {settings.mapsUrl
            ? "Ouvrez l’itinéraire dans Google Maps avec le bouton ci-contre."
            : "Ajoutez le lien Google Maps dans l’admin (Infos boutique) pour afficher l’itinéraire."}
        </div>
      </div>

      <section className="mt-20 border-t border-line pt-12">
        <h2 className="font-display text-4xl">Questions fréquentes</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {settings.faq.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {item.question}
                <span className="text-xl text-ochre transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
