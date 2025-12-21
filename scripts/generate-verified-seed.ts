import fs from 'fs';
import path from 'path';

// Liste des données candidates avec des images Unsplash de haute qualité
const candidates = {
  categories: [
    {
      name: 'Tissus & Wax',
      slug: 'tissus',
      description: 'Authentiques tissus Wax Hollandais, Bazin Riche et étoffes précieuses.',
      image: 'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?q=80&w=1948&auto=format&fit=crop', // Tissu coloré très fiable
    },
    {
      name: 'Parfums de Luxe',
      slug: 'parfums',
      description: 'Fragrances orientales, Oud et essences rares.',
      image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1974&auto=format&fit=crop', // Parfum élégant
    },
    {
      name: 'Chaussures & Maroquinerie',
      slug: 'chaussures',
      description: 'Escarpins, sandales et sacs en cuir véritable.',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop', // Talons bleus
    },
    {
      name: 'Accessoires & Bijoux',
      slug: 'accessoires',
      description: 'La touche finale pour sublimer votre élégance.',
      image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=2000&auto=format&fit=crop', // Bijoux or
    }
  ],
  products: [
    // --- TISSUS ---
    {
      name: 'Wax Hollandais "Fleurs de Mariage"',
      description: 'Le célèbre motif Fleurs de Mariage dans sa version originale. Coton 100% qualité supérieure. Idéal pour les grandes occasions.',
      price: 45000,
      category: 'tissus',
      subCategory: 'Vlisco',
      images: [
        'https://images.unsplash.com/photo-1621815777085-3b9557672809?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?q=80&w=1948&auto=format&fit=crop'
      ],
      inStock: true,
      featured: true
    },
    {
      name: 'Bazin Riche Getzner Blanc',
      description: 'Bazin blanc éclatant, brillance permanente. Le choix numéro 1 pour les boubous de cérémonie.',
      price: 90000,
      category: 'tissus',
      subCategory: 'Bazin',
      images: [
        'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1934&auto=format&fit=crop', // Tissu blanc drapé
        'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=2000&auto=format&fit=crop'  // Texture blanche
      ],
      inStock: true,
      featured: true
    },
    {
      name: 'Soie Imprimée "Savane"',
      description: 'Tissu en soie légère avec des motifs inspirés de la nature. Très fluide et agréable à porter.',
      price: 25000,
      category: 'tissus',
      subCategory: 'Soie',
      images: [
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop'
      ],
      inStock: true,
      featured: false
    },

    // --- PARFUMS ---
    {
      name: 'Oud Royal Intense',
      description: 'Un parfum de caractère aux notes boisées et épicées. Tenue exceptionnelle de 24h.',
      price: 35000,
      category: 'parfums',
      subCategory: 'Homme',
      images: [
        'https://images.unsplash.com/photo-1594035910387-fea4779426e9?q=80&w=2080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=2070&auto=format&fit=crop'
      ],
      inStock: true,
      featured: true
    },
    {
      name: 'Rose de Damas',
      description: 'Eau de parfum féminine, douce et florale. Un classique intemporel.',
      price: 28000,
      category: 'parfums',
      subCategory: 'Femme',
      images: [
        'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1904&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2053&auto=format&fit=crop'
      ],
      inStock: true,
      featured: false
    },

    // --- CHAUSSURES ---
    {
      name: 'Escarpins "Soirée"',
      description: 'Magnifiques escarpins à talons hauts, finition daim. L\'élégance absolue pour vos soirées.',
      price: 40000,
      category: 'chaussures',
      subCategory: 'Talons',
      images: [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1974&auto=format&fit=crop'
      ],
      inStock: true,
      featured: true
    },
    {
      name: 'Sandales Dorées',
      description: 'Sandales plates confortables avec détails dorés. Parfaites pour l\'été et les tenues décontractées chics.',
      price: 15000,
      category: 'chaussures',
      subCategory: 'Sandales',
      images: [
        'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=2070&auto=format&fit=crop'
      ],
      inStock: true,
      featured: false
    },

    // --- ACCESSOIRES ---
    {
      name: 'Sac à Main Cuir Camel',
      description: 'Sac à main structuré en cuir véritable couleur camel. Grande capacité et finitions dorées.',
      price: 55000,
      category: 'accessoires',
      subCategory: 'Sacs',
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2038&auto=format&fit=crop'
      ],
      inStock: true,
      featured: true
    },
    {
      name: 'Parure Bijoux Or',
      description: 'Ensemble collier et boucles d\'oreilles plaqué or. Design traditionnel revisité.',
      price: 22000,
      category: 'accessoires',
      subCategory: 'Bijoux',
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop'
      ],
      inStock: false, // Rupture de stock pour tester l'affichage
      featured: false
    }
  ]
};

async function checkUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error(`❌ Échec URL: ${url}`);
    return false;
  }
}

async function generateSeed() {
  console.log('🔍 Vérification des images en cours...');

  let sqlContent = `
-- RESET DATA
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE categories CASCADE;

-- CATEGORIES
`;

  // Process Categories
  for (const cat of candidates.categories) {
    const isValid = await checkUrl(cat.image);
    if (isValid) {
      console.log(`✅ Catégorie validée: ${cat.name}`);
      sqlContent += `
INSERT INTO categories (id, name, slug, description, image, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), '${cat.name.replace(/'/g, "''")}', '${cat.slug}', '${cat.description.replace(/'/g, "''")}', '${cat.image}', NOW(), NOW());
`;
    } else {
      console.warn(`⚠️ Image invalide pour catégorie ${cat.name}, catégorie ignorée.`);
    }
  }

  sqlContent += `\n-- PRODUCTS\n`;

  // Process Products
  for (const prod of candidates.products) {
    const validImages = [];
    
    for (const img of prod.images) {
      if (await checkUrl(img)) {
        validImages.push(img);
      }
    }

    if (validImages.length > 0) {
      console.log(`✅ Produit validé: ${prod.name} (${validImages.length} images)`);
      
      const imagesArrayStr = `ARRAY['${validImages.join("', '")}']`;
      
      sqlContent += `
INSERT INTO products (id, name, description, price, category, "subCategory", images, "inStock", featured, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  '${prod.name.replace(/'/g, "''")}',
  '${prod.description.replace(/'/g, "''")}',
  ${prod.price},
  '${prod.category}',
  '${prod.subCategory}',
  ${imagesArrayStr},
  ${prod.inStock},
  ${prod.featured},
  NOW(),
  NOW()
);
`;
    } else {
      console.warn(`⚠️ Aucune image valide pour produit ${prod.name}, produit ignoré.`);
    }
  }

  fs.writeFileSync(path.join(process.cwd(), 'supabase_seed.sql'), sqlContent);
  console.log('\n✨ Fichier supabase_seed.sql généré avec succès !');
}

generateSeed();
