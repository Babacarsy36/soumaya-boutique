// Motifs de tissus dessinés en SVG, nets à toutes les tailles : wax et bazin damassé.
// `id` doit être unique dans la page ; `part` permet à WaxDive d'animer le motif.

type FabricProps = {
  id: string;
  part?: string;
  // Taille d'un motif en pixels, ou en unités du cadre 1000 × 1000 quand `cover` est vrai.
  scale?: number;
  // Le motif remplit un cadre carré recadré (pour les plein écran animés).
  cover?: boolean;
  className?: string;
};

function Fabric({
  id,
  part,
  scale = 1,
  cover,
  className,
  tile,
  size,
}: FabricProps & { tile: React.ReactNode; size: number }) {
  return (
    <svg
      {...(cover ? { viewBox: "0 0 1000 1000", preserveAspectRatio: "xMidYMid slice" } : {})}
      className={className ?? "absolute inset-0 h-full w-full"}
      aria-hidden="true"
    >
      <defs>
        <pattern
          data-part={part}
          id={id}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          patternTransform={scale === 1 ? undefined : `scale(${scale})`}
        >
          {tile}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

const corners = (size: number) => [
  [0, 0],
  [size, 0],
  [0, size],
  [size, size],
];

// Wax : cercles concentriques, feuilles et pois, dans les couleurs du site.
const waxTile = (
  <>
    <rect width="250" height="250" fill="#1f2d5c" />
    <circle cx="125" cy="125" r="96" fill="#b06a24" />
    <circle
      cx="125"
      cy="125"
      r="80"
      fill="none"
      stroke="#f8f3eb"
      strokeWidth="6"
      strokeDasharray="2 12"
      strokeLinecap="round"
    />
    <circle cx="125" cy="125" r="64" fill="#6e3519" />
    <circle cx="125" cy="125" r="48" fill="#c9a35b" />
    <circle cx="125" cy="125" r="30" fill="#1f2d5c" />
    <circle cx="125" cy="125" r="14" fill="#f8f3eb" />
    {corners(250).map(([cx, cy]) => (
      <g key={`${cx}-${cy}`}>
        <circle cx={cx} cy={cy} r="46" fill="#c9a35b" />
        <circle cx={cx} cy={cy} r="32" fill="#f8f3eb" />
        <circle cx={cx} cy={cy} r="18" fill="#b06a24" />
      </g>
    ))}
    {[0, 90, 180, 270].map((r) => (
      <g key={r} transform={`rotate(${r} 125 125)`}>
        <path d="M125 2 C141 14 141 32 125 22 C109 32 109 14 125 2Z" fill="#f8f3eb" />
        <circle cx="125" cy="38" r="4" fill="#c9a35b" />
      </g>
    ))}
    {[
      [62, 62],
      [188, 62],
      [62, 188],
      [188, 188],
    ].map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" fill="#c9a35b" />
    ))}
  </>
);

// Bazin damassé : médaillons ton sur ton, rehaussés d'or.
const bazinTile = (
  <>
    <rect width="200" height="200" fill="#f1e8da" />
    <path d="M100 8 L192 100 L100 192 L8 100Z" fill="#e6d9c4" stroke="#c9a35b" strokeWidth="1.5" />
    <path d="M100 30 L170 100 L100 170 L30 100Z" fill="none" stroke="#d8c6a8" strokeWidth="1" />
    {Array.from({ length: 8 }, (_, i) => (
      <ellipse
        key={i}
        cx="100"
        cy="70"
        rx="11"
        ry="30"
        transform={`rotate(${i * 45} 100 100)`}
        fill="#f6efe3"
        stroke="#c9a35b"
        strokeWidth="1"
      />
    ))}
    <circle cx="100" cy="100" r="12" fill="#c9a35b" />
    <circle cx="100" cy="100" r="5" fill="#f6efe3" />
    {corners(200).map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" fill="#c9a35b" />
    ))}
  </>
);

export function WaxPattern(props: FabricProps) {
  return <Fabric {...props} tile={waxTile} size={250} />;
}

export function BazinPattern(props: FabricProps) {
  return <Fabric {...props} tile={bazinTile} size={200} />;
}

// Liseré de wax, comme la lisière d'un coupon : sépare deux sections.
export function WaxBand({ id, className = "h-6" }: { id: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
      <WaxPattern id={id} scale={0.24} />
    </div>
  );
}
