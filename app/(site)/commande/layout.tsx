import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ma commande" };

export default function CommandeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
