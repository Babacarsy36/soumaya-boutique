import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL("https://soumayaboutique.com"),
  title: {
    default: "Soumaya Boutique — Tissus, parfums et accessoires à Dakar",
    template: "%s · Soumaya Boutique",
  },
  description:
    "Wax hollandais, bazin riche, parfums, chaussures et accessoires. Commandez sur WhatsApp, livraison à Dakar et partout au Sénégal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
