"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SHOP_NAME, formatPrice, newOrderRef, whatsappLink, type OrderRequest } from "./format";

export type OrderLine = {
  slug: string;
  name: string;
  price: number;
  image: string;
  option?: string;
  quantity: number;
};

type OrderContextValue = {
  lines: OrderLine[];
  count: number;
  total: number;
  add: (line: Omit<OrderLine, "quantity">, quantity?: number) => void;
  setQuantity: (slug: string, option: string | undefined, quantity: number) => void;
  remove: (slug: string, option: string | undefined) => void;
  clear: () => void;
  // Lien WhatsApp vers le numéro de la boutique, réglé dans l'admin.
  whatsapp: (message: string) => string;
};

const OrderContext = createContext<OrderContextValue | null>(null);
const STORAGE_KEY = "soumaya-commande";

const sameLine = (l: OrderLine, slug: string, option?: string) =>
  l.slug === slug && l.option === option;

export function OrderProvider({ children, whatsapp }: { children: React.ReactNode; whatsapp: string }) {
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let saved: OrderLine[] = [];
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique au montage
    setLines(saved);
    setLoaded(true);
    if (saved.length === 0) return;

    // Les prix ont pu changer dans l'admin depuis l'ajout : on reprend ceux du catalogue
    // et on retire les articles épuisés ou supprimés.
    fetch("/api/panier", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lines: saved.map(({ slug, option }) => ({ slug, option })) }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { lines?: (Pick<OrderLine, "name" | "price" | "image"> | null)[] } | null) => {
        if (!data?.lines) return;
        const fresh = data.lines;
        setLines((prev) =>
          prev.flatMap((line) => {
            const i = saved.findIndex((l) => sameLine(l, line.slug, line.option));
            if (i === -1) return [line];
            return fresh[i] ? [{ ...line, ...fresh[i] }] : [];
          }),
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, loaded]);

  const add = useCallback<OrderContextValue["add"]>((line, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => sameLine(l, line.slug, line.option));
      if (existing) {
        return prev.map((l) =>
          sameLine(l, line.slug, line.option) ? { ...l, quantity: l.quantity + quantity } : l,
        );
      }
      return [...prev, { ...line, quantity }];
    });
  }, []);

  const setQuantity = useCallback<OrderContextValue["setQuantity"]>((slug, option, quantity) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => !sameLine(l, slug, option))
        : prev.map((l) => (sameLine(l, slug, option) ? { ...l, quantity } : l)),
    );
  }, []);

  const remove = useCallback<OrderContextValue["remove"]>((slug, option) => {
    setLines((prev) => prev.filter((l) => !sameLine(l, slug, option)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      total: lines.reduce((n, l) => n + l.quantity * l.price, 0),
      add,
      setQuantity,
      remove,
      clear,
      whatsapp: (message: string) => whatsappLink(whatsapp, message),
    }),
    [lines, add, setQuantity, remove, clear, whatsapp],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder doit être utilisé dans <OrderProvider>");
  return ctx;
}

export function orderMessage(
  lines: OrderLine[],
  total: number,
  customer: { name: string; city: string; note: string },
  ref?: string,
) {
  const items = lines
    .map(
      (l) =>
        `• ${l.quantity} × ${l.name}${l.option ? ` (${l.option})` : ""} — ${formatPrice(l.price * l.quantity)}`,
    )
    .join("\n");
  const details = [
    customer.name && `Nom : ${customer.name}`,
    customer.city && `Livraison : ${customer.city}`,
    customer.note && `Remarque : ${customer.note}`,
  ].filter(Boolean);
  return [
    `Bonjour ${SHOP_NAME}, je souhaite commander :`,
    items,
    [`Total : ${formatPrice(total)}`, ...details, ref && `Réf. commande : ${ref}`].filter(Boolean).join("\n"),
  ].join("\n\n");
}

// Enregistre la commande dans l'admin puis ouvre WhatsApp, dans le même clic pour ne pas être bloqué
// par le navigateur. L'enregistrement part en arrière-plan : WhatsApp s'ouvre même s'il échoue.
export function sendOrder(
  order: Omit<OrderRequest, "ref">,
  link: (ref: string) => string,
  event?: { preventDefault: () => void },
) {
  const ref = newOrderRef();
  const body = JSON.stringify({ ...order, ref } satisfies OrderRequest);
  try {
    const sent = navigator.sendBeacon?.("/api/commandes", new Blob([body], { type: "application/json" }));
    if (!sent) void fetch("/api/commandes", { method: "POST", body, keepalive: true }).catch(() => {});
  } catch {}
  event?.preventDefault();
  window.open(link(ref), "_blank", "noopener");
  return ref;
}
