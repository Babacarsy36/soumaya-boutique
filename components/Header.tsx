"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useOrder } from "@/lib/order";

const nav = [
  { href: "/boutique", label: "Boutique" },
  { href: "/boutique?categorie=tissus", label: "Tissus" },
  { href: "/boutique?categorie=parfums", label: "Parfums" },
  { href: "/notre-histoire", label: "Notre histoire" },
  { href: "/nous-trouver", label: "Nous trouver" },
];

export default function Header() {
  const { count } = useOrder();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- fermer le menu à chaque navigation
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled || open ? "border-line bg-ivory/95 backdrop-blur" : "border-transparent bg-ivory"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 md:h-20">
        <Link href="/" className="flex items-baseline gap-2" aria-label="Soumaya Boutique, accueil">
          <span className="font-display text-2xl font-semibold tracking-wide md:text-3xl">Soumaya</span>
          <span className="eyebrow hidden text-[0.6rem] sm:inline">Boutique · Dakar</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-ochre"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/commande"
            className="relative inline-flex h-11 items-center gap-2 rounded-full border border-ink/15 px-4 text-sm font-semibold hover:border-ink"
          >
            <BagIcon />
            <span className="hidden sm:inline">Ma commande</span>
            {count > 0 && (
              <span className="inline-flex min-w-5 justify-center rounded-full bg-ochre px-1.5 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-px w-5 bg-ink transition-transform ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-px w-5 bg-ink transition-transform ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label="Menu mobile" className="border-t border-line lg:hidden">
          <ul className="container-page py-4">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block py-3 font-display text-2xl">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M5 8h14l-1 12H6L5 8Z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}
