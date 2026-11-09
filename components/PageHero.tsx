// En-tête des pages intérieures : bandeau sombre, motif wax en fondu et liseré en bas.
import Image from "next/image";
import { WaxBand, WaxPattern } from "@/components/patterns";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  image?: string;
  children?: React.ReactNode;
};

export default function PageHero({ eyebrow, title, intro, image, children }: Props) {
  return (
    <header className="relative overflow-hidden bg-ink text-ivory">
      {image ? (
        <div className="hero-drift absolute inset-0">
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
        </div>
      ) : (
        <div className="hero-drift absolute inset-y-0 right-0 w-full opacity-40 [mask-image:linear-gradient(90deg,transparent_10%,#000_75%)] md:w-2/3">
          <WaxPattern id="page-hero-wax" scale={0.7} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
      <div className="container-page relative py-16 md:py-24">
        <p data-reveal className="eyebrow text-gold">
          {eyebrow}
        </p>
        <h1
          data-reveal
          style={{ "--i": 1 } as React.CSSProperties}
          className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl"
        >
          {title}
        </h1>
        {intro && (
          <p data-reveal style={{ "--i": 2 } as React.CSSProperties} className="mt-5 max-w-xl text-ivory/75">
            {intro}
          </p>
        )}
        {children && (
          <div data-reveal style={{ "--i": 3 } as React.CSSProperties} className="mt-8">
            {children}
          </div>
        )}
      </div>
      <WaxBand id="page-hero-band" className="relative h-5" />
    </header>
  );
}
