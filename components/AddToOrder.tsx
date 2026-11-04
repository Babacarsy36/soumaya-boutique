"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/catalogue";
import { sendOrder, useOrder } from "@/lib/order";
import { SHOP_NAME, formatPrice } from "@/lib/format";

export default function AddToOrder({ product }: { product: Product }) {
  const { add, whatsapp } = useOrder();
  const [option, setOption] = useState(product.option?.choices[0].label);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product.inStock) {
    return (
      <div className="mt-8 rounded-sm bg-sand p-5">
        <p className="font-semibold">Article momentanément épuisé</p>
        <p className="mt-1 text-sm text-muted">Demandez-nous quand il revient en boutique.</p>
        <a
          href={whatsapp(`Bonjour ${SHOP_NAME}, l'article « ${product.name} » sera-t-il bientôt disponible ?`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp mt-4 w-full"
        >
          Être prévenu(e) sur WhatsApp
        </a>
      </div>
    );
  }

  const price = product.option?.choices.find((c) => c.label === option)?.price ?? product.price;

  const onAdd = () => {
    add({ slug: product.slug, name: product.name, price, image: product.images[0], option }, quantity);
    setAdded(true);
  };

  const quickMessage = (ref?: string) =>
    `Bonjour ${SHOP_NAME}, je souhaite commander :\n\n• ${quantity} × ${product.name}${
      option ? ` (${option})` : ""
    } — ${formatPrice(price * quantity)}${ref ? `\n\nRéf. commande : ${ref}` : ""}`;

  return (
    <div className="mt-6 space-y-6">
      <p className="text-2xl font-semibold" aria-live="polite">
        {formatPrice(price)}
      </p>
      {product.option && (
        <fieldset>
          <legend className="text-sm font-semibold">
            {product.option.label} : <span className="font-normal text-muted">{option}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.option.choices.map(({ label }) => (
              <button
                key={label}
                type="button"
                onClick={() => setOption(label)}
                aria-pressed={label === option}
                className={`min-w-12 rounded-full border px-4 py-2 text-sm transition-colors ${
                  label === option ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold">Quantité</span>
        <Stepper value={quantity} onChange={setQuantity} />
      </div>

      <div className="flex flex-col gap-3">
        <button type="button" onClick={onAdd} className="btn-dark w-full">
          Ajouter à ma commande
        </button>
        <a
          href={whatsapp(quickMessage())}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp w-full"
          onClick={(e) =>
            sendOrder(
              { lines: [{ slug: product.slug, option, quantity }], customer: { name: "", city: "", note: "" } },
              (ref) => whatsapp(quickMessage(ref)),
              e,
            )
          }
        >
          Commander directement sur WhatsApp
        </a>
      </div>

      {added && (
        <p role="status" className="rounded-sm bg-sand px-4 py-3 text-sm">
          Ajouté à votre commande.{" "}
          <Link href="/commande" className="font-semibold underline underline-offset-4">
            Voir ma commande
          </Link>
        </p>
      )}
    </div>
  );
}

export function Stepper({ value, onChange, min = 1 }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div className="inline-flex items-center rounded-full border border-line">
      <button
        type="button"
        className="h-10 w-10 text-lg disabled:opacity-30"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Diminuer la quantité"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="h-10 w-10 text-lg"
        onClick={() => onChange(value + 1)}
        aria-label="Augmenter la quantité"
      >
        +
      </button>
    </div>
  );
}
