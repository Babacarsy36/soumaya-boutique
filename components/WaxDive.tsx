"use client";

// Ouverture de l'accueil, inspirée des vidéos « plongée caméra » : au défilement, un coupon de
// wax se soulève, remplit l'écran, puis on traverse le wax, le bazin et la soie avant d'arriver
// aux boutons. Les motifs sont dessinés en SVG pour rester nets à tous les niveaux de zoom.
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { BazinPattern, WaxPattern } from "@/components/patterns";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
// Progression de 0 à 1 entre deux bornes de la progression globale.
const span = (p: number, from: number, to: number) => clamp((p - from) / (to - from));
const ease = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

// Les trois étapes de la plongée : texte affiché entre `from` et `to`, voile sombre `veil`.
const beats = [
  { label: "Le wax", text: "Des motifs qui racontent une histoire.", from: 0.2, to: 0.4, veil: 0.5 },
  { label: "Le bazin", text: "Un éclat qui se remarque à chaque pas.", from: 0.46, to: 0.62, veil: 0.1, dark: true },
  { label: "La soie", text: "La douceur des grandes occasions.", from: 0.7, to: 0.84, veil: 0.35 },
];

export default function WaxDive({ photo }: { photo?: string }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const part = <T extends Element = HTMLElement>(name: string) => el.querySelector<T>(`[data-part="${name}"]`)!;
    const photoLayer = part("photo");
    const swatch = part("swatch");
    const folds = part("folds");
    const wax = part("wax");
    const waxMotif = part<SVGPatternElement>("wax-motif");
    const bazin = part("bazin");
    const bazinMotif = part<SVGPatternElement>("bazin-motif");
    const sheen = part("sheen");
    const silk = part("silk");
    const ring = part("ring");
    const veil = part("veil");
    const intro = part("intro");
    const hint = part("hint");
    const outro = part("outro");
    const beatEls = beats.map((_, i) => part(`beat-${i}`));

    const zoom = (pattern: SVGPatternElement, scale: number, turn: number) =>
      pattern.setAttribute("patternTransform", `translate(500 500) rotate(${turn}) scale(${scale}) translate(-500 -500)`);
    // Trou circulaire au centre d'une couche, qui laisse voir la suivante.
    const hole = (layer: HTMLElement, t: number) => {
      const r = ease(t) * 80;
      const mask = t > 0 ? `radial-gradient(circle at 50% 50%, transparent ${r}vmax, #000 ${r + 0.4}vmax)` : "none";
      layer.style.setProperty("mask-image", mask);
      layer.style.setProperty("-webkit-mask-image", mask);
      return r;
    };

    const render = (p: number) => {
      // 1. Le coupon posé sur la table se soulève et s'ouvre jusqu'à remplir l'écran.
      const open = easeInOut(span(p, 0.02, 0.2));
      photoLayer.style.transform = `scale(${1 + open * 1.4})`;
      photoLayer.style.opacity = String(1 - span(p, 0.14, 0.2));
      const narrow = innerWidth < 640; // mêmes marges que .wax-dive-swatch dans globals.css
      const x = (narrow ? 16 : 34) * (1 - open);
      const y = (narrow ? 30 : 28) * (1 - open);
      swatch.style.clipPath = `inset(${y}% ${x}% round ${14 * (1 - open)}px)`;
      swatch.style.transform = `perspective(1200px) rotateX(${(1 - open) * 24}deg) translateY(${(1 - open) * 4}%)`;
      folds.style.opacity = String(1 - open);

      // 2. On plonge dans le wax, puis on passe à travers le rond central.
      zoom(waxMotif, 1 + open * 0.3 + ease(span(p, 0.2, 0.48)) * 2.6, span(p, 0.1, 0.48) * 18);
      const r1 = hole(wax, span(p, 0.36, 0.48));
      // 3. Le bazin, puis la soie.
      zoom(bazinMotif, 1.6 + ease(span(p, 0.38, 0.72)) * 2.2, -span(p, 0.38, 0.72) * 10);
      sheen.style.transform = `translateX(${(span(p, 0.4, 0.7) * 2 - 1) * 120}%)`;
      const r2 = hole(bazin, span(p, 0.6, 0.72));
      silk.style.backgroundPosition = `${span(p, 0.6, 1) * 100}% 50%`;
      silk.style.transform = `scale(${1.25 - span(p, 0.6, 1) * 0.25})`;

      // Liseré doré au bord du trou en cours d'ouverture.
      const r = r1 > 0 && r1 < 80 ? r1 : r2 > 0 && r2 < 80 ? r2 : 0;
      ring.style.opacity = r > 0 ? "1" : "0";
      ring.style.width = ring.style.height = `${r * 2}vmax`;

      // Textes
      intro.style.opacity = String(1 - span(p, 0.03, 0.12));
      intro.style.transform = `translateY(${-span(p, 0, 0.12) * 60}px)`;
      hint.style.opacity = String(1 - span(p, 0, 0.04));
      let dim = 0;
      beats.forEach((b, i) => {
        const shown = Math.min(span(p, b.from, b.from + 0.04), 1 - span(p, b.to - 0.04, b.to));
        const t = span(p, b.from, b.to);
        beatEls[i].style.opacity = String(shown);
        beatEls[i].style.transform = `translateY(${(0.5 - t) * 60}px)`;
        dim += shown * b.veil;
      });
      const o = span(p, 0.86, 0.95);
      outro.style.opacity = String(o);
      outro.style.transform = `translateY(${(1 - o) * 30}px)`;
      outro.style.pointerEvents = o > 0.5 ? "auto" : "none";
      veil.style.opacity = String(dim + o * 0.55);
    };

    // La progression suit le défilement avec un peu d'inertie, pour un mouvement de caméra fluide.
    let target = 0;
    let current = -1;
    let frame = 0;
    const measure = () => {
      const { top, height } = el.getBoundingClientRect();
      target = clamp(-top / (height - innerHeight));
    };
    const tick = () => {
      current = current < 0 ? target : current + (target - current) * 0.14;
      if (Math.abs(target - current) < 0.0005) current = target;
      render(current);
      frame = current === target ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      measure();
      if (!frame) frame = requestAnimationFrame(tick);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={root} aria-label="Entrez dans le wax" className="wax-dive relative bg-ink text-ivory">
      <div className="wax-dive-stage sticky top-16 h-[calc(100svh-4rem)] overflow-hidden md:top-20 md:h-[calc(100svh-5rem)]">
        {/* La boutique, vue de loin */}
        <div data-part="photo" className="wax-dive-photo absolute inset-0 origin-center">
          {photo && <Image src={photo} alt="" fill priority sizes="100vw" className="object-cover" />}
          <div className="absolute inset-0 bg-ink/55" />
        </div>

        {/* Le coupon : soie au fond, bazin au milieu, wax devant */}
        <div data-part="swatch" className="wax-dive-swatch absolute inset-0 origin-bottom shadow-2xl">
          <div
            data-part="silk"
            className="absolute inset-0 bg-[linear-gradient(115deg,#3d190b_0%,#6e3519_22%,#b06a24_42%,#e7b56c_50%,#b06a24_58%,#6e3519_78%,#3d190b_100%)] bg-[length:300%_100%]"
          >
            {/* Plis du satin */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(100deg,rgb(0_0_0/0.18)_0%,transparent_6%,rgb(255_255_255/0.12)_11%,transparent_17%,rgb(0_0_0/0.1)_24%)] mix-blend-soft-light" />
          </div>
          <div data-part="bazin" className="absolute inset-0">
            <BazinPattern id="dive-bazin" part="bazin-motif" cover />
            <div
              data-part="sheen"
              className="absolute inset-y-0 -left-1/2 w-[200%] bg-[linear-gradient(105deg,transparent_35%,rgb(255_255_255/0.55)_50%,transparent_65%)] mix-blend-soft-light"
            />
          </div>
          <div data-part="wax" className="absolute inset-0">
            <WaxPattern id="dive-wax" part="wax-motif" cover />
          </div>
          {/* Plis du tissu posé, puis grain de la trame */}
          <div
            data-part="folds"
            className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgb(0_0_0/0.22)_0%,transparent_7%,rgb(255_255_255/0.1)_13%,transparent_20%)]"
          />
          <div className="wax-dive-grain absolute inset-0 opacity-25 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/30" />
          <div data-part="veil" className="wax-dive-veil absolute inset-0 bg-ink opacity-0" />
        </div>
        <div
          data-part="ring"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold opacity-0 shadow-[0_0_40px_rgb(201_163_91/0.6)]"
        />

        {/* Textes */}
        <div
          data-part="intro"
          className="wax-dive-intro absolute inset-x-0 top-[8%] px-4 text-center [text-shadow:0_2px_24px_rgb(27_21_17/0.6)]"
        >
          <p className="eyebrow text-gold">Soumaya Boutique · Dakar</p>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Entrez dans le <em className="text-gold">wax</em>
          </h1>
        </div>
        <p
          data-part="hint"
          className="wax-dive-hint absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-ivory/80"
        >
          Faites défiler
          <span className="h-8 w-px animate-pulse bg-ivory/60" aria-hidden="true" />
        </p>
        {beats.map((b, i) => (
          <div
            key={b.label}
            data-part={`beat-${i}`}
            className={`wax-dive-beat absolute inset-x-0 top-1/2 -mt-16 px-6 text-center opacity-0 ${
              b.dark ? "text-ink" : "text-ivory [text-shadow:0_2px_24px_rgb(27_21_17/0.6)]"
            }`}
          >
            <p className={`eyebrow ${b.dark ? "text-earth" : "text-gold"}`}>
              {String(i + 1).padStart(2, "0")} · {b.label}
            </p>
            <p className="mx-auto mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-6xl">{b.text}</p>
          </div>
        ))}
        <div
          data-part="outro"
          className="wax-dive-outro absolute inset-x-0 bottom-[12%] px-6 text-center opacity-0 [text-shadow:0_2px_24px_rgb(27_21_17/0.6)]"
        >
          <p className="mx-auto max-w-xl font-display text-3xl leading-tight sm:text-5xl">
            Wax, bazin et soie, choisis un à un pour vos grandes occasions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 [text-shadow:none]">
            <Link href="/boutique?categorie=tissus" className="btn-light">
              Voir les tissus
            </Link>
            <Link href="/boutique" className="btn border border-ivory/40 text-ivory hover:border-ivory">
              Toute la boutique
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
