// Catalogue de secours, repris de l'ancien site : affiché tant que Sanity n'est pas relié,
// et importé une fois dans Sanity comme point de départ.
import type { Category, Product } from "./catalogue";
import type { About, Settings } from "./site";

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1600&auto=format&fit=crop`;

export const fallbackCategories: Category[] = [
  {
    slug: "tissus",
    name: "Tissus & Wax",
    tagline: "Wax hollandais, bazin riche et étoffes précieuses.",
    image: unsplash("1528458909336-e7a0adfed0a5"),
  },
  {
    slug: "parfums",
    name: "Parfums",
    tagline: "Oud, fragrances orientales et essences rares.",
    image: unsplash("1615634260167-c8cdede054de"),
  },
  {
    slug: "chaussures",
    name: "Chaussures",
    tagline: "Escarpins, sandales et cuir véritable.",
    image: unsplash("1543163521-1bf539c55dd2"),
  },
  {
    slug: "accessoires",
    name: "Accessoires & Bijoux",
    tagline: "Sacs et parures pour la touche finale.",
    image: unsplash("1576053139778-7e32f2ae3cfd"),
  },
];

// Prix des tissus au mètre, vendus par coupons de 3, 6 ou 12 mètres.
const metrage = (perMetre: number) => ({
  label: "Métrage",
  choices: [3, 6, 12].map((m) => ({ label: `${m} mètres`, price: perMetre * m })),
});

const sizes = (price: number) => ({
  label: "Pointure",
  choices: ["37", "38", "39", "40", "41"].map((label) => ({ label, price })),
});

const volumes = (price50: number, price100: number) => ({
  label: "Contenance",
  choices: [
    { label: "50 ml", price: price50 },
    { label: "100 ml", price: price100 },
  ],
});

export const fallbackProducts: Product[] = [
  {
    slug: "wax-fleurs-de-mariage",
    name: "Wax hollandais « Fleurs de Mariage »",
    category: "tissus",
    subCategory: "Vlisco",
    description:
      "Le célèbre motif Fleurs de Mariage dans sa version originale. Coton 100 %, qualité supérieure. Idéal pour les grandes occasions.",
    price: 22500,
    images: [unsplash("1528458909336-e7a0adfed0a5")],
    inStock: true,
    featured: true,
    isNew: true,
    option: metrage(7500),
  },
  {
    slug: "bazin-riche-getzner-blanc",
    name: "Bazin riche Getzner blanc",
    category: "tissus",
    subCategory: "Bazin",
    description:
      "Bazin blanc éclatant à la brillance durable. Le premier choix pour les boubous de cérémonie.",
    price: 45000,
    images: [unsplash("1585487000160-6ebcfceb0d03"), unsplash("1520006403909-838d6b92c22e")],
    inStock: true,
    featured: true,
    option: metrage(15000),
  },
  {
    slug: "soie-imprimee-savane",
    name: "Soie imprimée « Savane »",
    category: "tissus",
    subCategory: "Soie",
    description:
      "Soie légère aux motifs inspirés de la nature. Très fluide, agréable à porter toute la journée.",
    price: 25500,
    images: [unsplash("1523381210434-271e8be1f52b")],
    inStock: true,
    featured: false,
    isNew: true,
    option: metrage(8500),
  },
  {
    slug: "oud-royal-intense",
    name: "Oud Royal Intense",
    category: "parfums",
    subCategory: "Homme",
    description:
      "Un parfum de caractère aux notes boisées et épicées, d'une tenue remarquable.",
    price: 35000,
    images: [unsplash("1615634260167-c8cdede054de")],
    inStock: true,
    featured: true,
    option: volumes(35000, 55000),
  },
  {
    slug: "rose-de-damas",
    name: "Rose de Damas",
    category: "parfums",
    subCategory: "Femme",
    description: "Eau de parfum féminine, douce et florale. Un classique intemporel.",
    price: 28000,
    images: [unsplash("1541643600914-78b084683601"), unsplash("1592945403244-b3fbafd7f539")],
    inStock: true,
    featured: false,
    option: volumes(28000, 45000),
  },
  {
    slug: "escarpins-soiree",
    name: "Escarpins « Soirée »",
    category: "chaussures",
    subCategory: "Talons",
    description:
      "Escarpins à talons hauts, finition daim. L'élégance absolue pour vos soirées.",
    price: 40000,
    images: [unsplash("1543163521-1bf539c55dd2"), unsplash("1560343090-f0409e92791a")],
    inStock: true,
    featured: true,
    option: sizes(40000),
  },
  {
    slug: "sandales-dorees",
    name: "Sandales dorées",
    category: "chaussures",
    subCategory: "Sandales",
    description:
      "Sandales plates confortables aux détails dorés, pour les tenues décontractées chics.",
    price: 15000,
    images: [unsplash("1535043934128-cf0b28d52f95")],
    inStock: true,
    featured: false,
    isNew: true,
    option: sizes(15000),
  },
  {
    slug: "sac-cuir-camel",
    name: "Sac à main cuir camel",
    category: "accessoires",
    subCategory: "Sacs",
    description:
      "Sac structuré en cuir véritable couleur camel. Grande contenance, finitions dorées.",
    price: 55000,
    images: [unsplash("1584917865442-de89df76afd3"), unsplash("1590874103328-eac38a683ce7")],
    inStock: true,
    featured: true,
  },
  {
    slug: "parure-bijoux-or",
    name: "Parure bijoux or",
    category: "accessoires",
    subCategory: "Bijoux",
    description:
      "Collier et boucles d'oreilles plaqués or. Un dessin traditionnel revisité.",
    price: 22000,
    images: [unsplash("1535632066927-ab7c9ab60908")],
    inStock: false,
    featured: false,
  },
];

export const fallbackSettings: Settings = {
  // Sans numéro configuré, WhatsApp s'ouvre et laisse choisir le destinataire.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
  address: "Adresse à confirmer, Dakar",
  hours: [
    { days: "Lundi – Samedi", time: "10h – 20h" },
    { days: "Dimanche", time: "Fermé" },
  ],
  heroText:
    "Wax hollandais, bazin riche, parfums d’Orient et accessoires de fête. Une sélection faite à Dakar, livrée partout au Sénégal.",
  faq: [
    {
      question: "Comment passer commande ?",
      answer:
        "Ajoutez vos articles à votre commande, puis envoyez-la sur WhatsApp. Nous confirmons la disponibilité, le prix de livraison et le paiement avec vous.",
    },
    { question: "Quels moyens de paiement acceptez-vous ?", answer: "Wave, Orange Money, ou espèces à la livraison et en boutique." },
    { question: "Livrez-vous hors de Dakar ?", answer: "Oui, partout au Sénégal. Comptez 24 h à Dakar et 48 à 72 h en région." },
    {
      question: "Puis-je échanger un article ?",
      answer:
        "Oui, sous 7 jours pour un article non porté et dans son emballage. Les tissus coupés ne sont ni repris ni échangés.",
    },
  ],
};

export const fallbackAbout: About = {
  title: "L’élégance se transmet, comme un beau tissu.",
  paragraphs: [
    "Soumaya Boutique est née d’une passion pour les belles matières et les tenues qui marquent les grands moments : mariages, baptêmes, Korité, Tabaski.",
    "Aujourd’hui, la boutique réunit à Dakar une sélection de wax hollandais, de bazin riche, de parfums et d’accessoires, choisis pour leur qualité et leur tenue.",
    "Que vous passiez en boutique ou que vous commandiez sur WhatsApp, vous trouvez la même attention.",
  ],
};
