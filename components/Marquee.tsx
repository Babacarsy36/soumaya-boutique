// Bandeau qui défile en continu, entre deux sections.
const defaults = [
  "Wax hollandais",
  "Bazin riche",
  "Soie",
  "Oud & parfums",
  "Livraison Dakar 24 h",
  "Wave & Orange Money",
];

export default function Marquee({
  items = defaults,
  className = "bg-earth text-ivory",
}: {
  items?: string[];
  className?: string;
}) {
  // Le texte est répété deux fois pour boucler sans saut.
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-10 whitespace-nowrap font-display text-2xl italic sm:text-3xl">
          {item}
          <span className="h-2 w-2 rotate-45 bg-gold" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`overflow-hidden py-5 ${className}`}>
      <div className="marquee flex w-max">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
