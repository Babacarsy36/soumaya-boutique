"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Stepper } from "@/components/AddToOrder";
import { orderMessage, sendOrder, useOrder } from "@/lib/order";
import { formatPrice } from "@/lib/format";

export default function Commande() {
  const { lines, total, setQuantity, remove, clear, whatsapp } = useOrder();
  const [customer, setCustomer] = useState({ name: "", city: "", note: "" });
  const [website, setWebsite] = useState("");
  const [sentRef, setSentRef] = useState<string>();

  if (sentRef) {
    return (
      <div className="container-page py-24 text-center">
        <p className="eyebrow">Commande envoyée</p>
        <h1 className="mt-3 font-display text-5xl">Merci !</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Votre commande <strong className="text-ink">{sentRef}</strong> a été transmise. Terminez l’envoi dans
          WhatsApp : nous vous répondons pour confirmer la disponibilité et la livraison.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="btn-dark"
            onClick={() => {
              clear();
              setSentRef(undefined);
            }}
          >
            Vider ma liste
          </button>
          <button type="button" className="btn-outline" onClick={() => setSentRef(undefined)}>
            Revenir à ma commande
          </button>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <p className="eyebrow">Ma commande</p>
        <h1 className="mt-3 font-display text-5xl">Votre liste est vide</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Ajoutez des articles depuis la boutique, puis envoyez votre commande sur WhatsApp en un clic.
        </p>
        <Link href="/boutique" className="btn-dark mt-8">
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  const field = (key: keyof typeof customer) => ({
    value: customer[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setCustomer((c) => ({ ...c, [key]: e.target.value })),
  });

  return (
    <div className="container-page pt-10 md:pt-16">
      <p className="eyebrow">Ma commande</p>
      <h1 className="mt-3 font-display text-5xl">Votre sélection</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <ul className="divide-y divide-line border-y border-line lg:col-span-7">
          {lines.map((l) => (
            <li key={`${l.slug}-${l.option}`} className="flex gap-4 py-5">
              <Link href={`/produits/${l.slug}`} className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-sm bg-sand">
                <Image src={l.image} alt={l.name} fill sizes="96px" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between gap-3">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link href={`/produits/${l.slug}`} className="font-display text-xl leading-tight hover:text-ochre">
                      {l.name}
                    </Link>
                    {l.option && <p className="mt-1 text-sm text-muted">{l.option}</p>}
                  </div>
                  <p className="text-sm font-semibold whitespace-nowrap">{formatPrice(l.price * l.quantity)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <Stepper value={l.quantity} onChange={(q) => setQuantity(l.slug, l.option, q)} />
                  <button
                    type="button"
                    onClick={() => remove(l.slug, l.option)}
                    className="text-sm text-muted underline underline-offset-4 hover:text-ink"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-sm bg-sand/70 p-6 lg:sticky lg:top-28 lg:col-span-5">
          <div className="flex items-baseline justify-between">
            <p className="font-semibold">Total</p>
            <p className="font-display text-3xl">{formatPrice(total)}</p>
          </div>
          <p className="mt-1 text-sm text-muted">Frais de livraison confirmés sur WhatsApp.</p>

          <div className="mt-6 space-y-4">
            <label className="block text-sm">
              <span className="font-semibold">Votre nom</span>
              <input {...field("name")} autoComplete="name" className="mt-1 w-full rounded-sm border border-line bg-ivory px-4 py-3" />
            </label>
            <label className="block text-sm">
              <span className="font-semibold">Ville ou quartier de livraison</span>
              <input {...field("city")} placeholder="ex. Sacré-Cœur, Dakar" className="mt-1 w-full rounded-sm border border-line bg-ivory px-4 py-3" />
            </label>
            <label className="block text-sm">
              <span className="font-semibold">Remarque (facultatif)</span>
              <textarea {...field("note")} rows={3} className="mt-1 w-full rounded-sm border border-line bg-ivory px-4 py-3" />
            </label>
          </div>

          {/* Champ piège invisible : seuls les robots le remplissent. */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <a
            href={whatsapp(orderMessage(lines, total, customer))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-6 w-full"
            onClick={(e) =>
              setSentRef(
                sendOrder(
                  { lines: lines.map(({ slug, option, quantity }) => ({ slug, option, quantity })), customer, website },
                  (ref) => whatsapp(orderMessage(lines, total, customer, ref)),
                  e,
                ),
              )
            }
          >
            Envoyer ma commande sur WhatsApp
          </a>
          <p className="mt-3 text-center text-xs text-muted">
            Rien n’est payé ici : nous confirmons la disponibilité et la livraison avec vous.
          </p>
        </aside>
      </div>
    </div>
  );
}
