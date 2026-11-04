// Utilisable côté serveur comme dans le navigateur.

export const SHOP_NAME = "Soumaya Boutique";
export const SHOP_CITY = "Dakar";

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value).replace(/ /g, " ")} FCFA`;
}

export function whatsappLink(number: string, message: string) {
  const text = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

// Référence courte d'une commande, reprise dans le message WhatsApp (sans 0/O ni 1/I pour éviter les confusions).
const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function newOrderRef() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("");
}

export function isOrderRef(value: unknown): value is string {
  return typeof value === "string" && /^[A-HJ-NP-Z2-9]{6}$/.test(value);
}

export type OrderRequest = {
  ref: string;
  lines: { slug: string; option?: string; quantity: number }[];
  customer: { name: string; city: string; note: string };
  website?: string;
};
