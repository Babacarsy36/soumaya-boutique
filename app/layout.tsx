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
      <body className={`${playfair.variable} ${montserrat.variable} font-sans antialiased`}>
        {!isAdminPage && <Header />}
        <main className="min-h-screen">{children}</main>
        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}
