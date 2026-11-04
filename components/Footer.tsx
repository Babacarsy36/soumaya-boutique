import Link from "next/link";
import { getCategories } from "@/lib/catalogue";
import { SHOP_NAME, getSettings, whatsappLink } from "@/lib/site";

export default async function Footer() {
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);
  return (
    <footer className="mt-24 bg-ink text-ivory/80">
      <div className="container-page grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-4xl text-ivory">Soumaya</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Tissus, parfums et accessoires choisis avec soin à Dakar. Commandez sur WhatsApp,
            nous livrons partout au Sénégal.
          </p>
          <a
            href={whatsappLink(settings.whatsapp, `Bonjour ${SHOP_NAME}, j'ai une question.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-6"
          >
            Écrire sur WhatsApp
          </a>
        </div>

        <div>
          <p className="eyebrow text-gold">Univers</p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/boutique?categorie=${c.slug}`} className="hover:text-ivory">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold">La boutique</p>
          <address className="mt-4 space-y-1 text-sm not-italic">
            <p>{settings.address}</p>
            {settings.hours.map((h) => (
              <p key={h.days}>
                {h.days} : {h.time}
              </p>
            ))}
          </address>
          <div className="mt-4 flex gap-4 text-sm">
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">
                Instagram
              </a>
            )}
            {settings.tiktok && (
              <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">
                TikTok
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <p className="container-page py-6 text-xs text-ivory/50">
          © {new Date().getFullYear()} {SHOP_NAME}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
