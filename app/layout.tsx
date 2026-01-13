'use client';

import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { usePathname } from 'next/navigation';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="fr">
      <head>
        <title>Soumaya Boutique - Tissus Africains, Parfums & Accessoires</title>
        <meta name="description" content="Découvrez notre collection exclusive de tissus africains, parfums et accessoires de qualité. Livraison partout au Sénégal." />
        <meta name="theme-color" content="#d97706" />
      </head>
      <body className={`${playfair.variable} ${montserrat.variable} font-sans antialiased`}>
        {!isAdminPage && <Header />}
        <main className="min-h-screen">{children}</main>
        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}
