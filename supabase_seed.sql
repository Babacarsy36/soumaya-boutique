
-- RESET DATA

TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE categories CASCADE;

-- CATEGORIES

INSERT INTO categories (id, name, slug, description, image, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Tissus & Wax', 'tissus', 'Authentiques tissus Wax Hollandais, Bazin Riche et étoffes précieuses.', 'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?q=80&w=1948&auto=format&fit=crop', NOW(), NOW());

INSERT INTO categories (id, name, slug, description, image, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Parfums de Luxe', 'parfums', 'Fragrances orientales, Oud et essences rares.', 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1974&auto=format&fit=crop', NOW(), NOW());

INSERT INTO categories (id, name, slug, description, image, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Chaussures & Maroquinerie', 'chaussures', 'Escarpins, sandales et sacs en cuir véritable.', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop', NOW(), NOW());

INSERT INTO categories (id, name, slug, description, image, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Accessoires & Bijoux', 'accessoires', 'La touche finale pour sublimer votre élégance.', 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=2000&auto=format&fit=crop', NOW(), NOW());

-- PRODUCTS

INSERT INTO products (id, name, description, price, category, "subCategory", images, "inStock", featured, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Wax Hollandais "Fleurs de Mariage"',
  'Le célèbre motif Fleurs de Mariage dans sa version originale. Coton 100% qualité supérieure. Idéal pour les grandes occasions.',
  45000,
  'tissus',
  'Vlisco',
  ARRAY['https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?q=80&w=1948&auto=format&fit=crop'],
  true,
  true,
  NOW(),
  NOW()
);

INSERT INTO products (id, name, description, price, category, "subCategory", images, "inStock", featured, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Bazin Riche Getzner Blanc',
  'Bazin blanc éclatant, brillance permanente. Le choix numéro 1 pour les boubous de cérémonie.',
  90000,
  'tissus',
  'Bazin',
  ARRAY['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1934&auto=format&fit=crop', 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=2000&auto=format&fit=crop'],
  true,
  true,
  NOW(),
  NOW()
);

INSERT INTO products (id, name, description, price, category, "subCategory", images, "inStock", featured, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Soie Imprimée "Savane"',
  'Tissu en soie légère avec des motifs inspirés de la nature. Très fluide et agréable à porter.',
  25000,
  'tissus',
  'Soie',
  ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop'],
  true,
  false,
  NOW(),
  NOW()
);

INSERT INTO products (id, name, description, price, category, "subCategory", images, "inStock", featured, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Oud Royal Intense',
  'Un parfum de caractère aux notes boisées et épicées. Tenue exceptionnelle de 24h.',
  35000,
  'parfums',
  'Homme',
  ARRAY['https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=2070&auto=format&fit=crop'],
  true,
  true,
  NOW(),
  NOW()
);

INSERT INTO products (id, name, description, price, category, "subCategory", images, "inStock", featured, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Rose de Damas',
  'Eau de parfum féminine, douce et florale. Un classique intemporel.',
  28000,
  'parfums',
  'Femme',
  ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1904&auto=format&fit=crop', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2053&auto=format&fit=crop'],
  true,
  false,
  NOW(),
  NOW()
);

INSERT INTO products (id, name, description, price, category, "subCategory", images, "inStock", featured, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Escarpins "Soirée"',
  'Magnifiques escarpins à talons hauts, finition daim. L''élégance absolue pour vos soirées.',
  40000,
  'chaussures',
  'Talons',
  ARRAY['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1974&auto=format&fit=crop'],
  true,
  true,
  NOW(),
  NOW()
);

INSERT INTO products (id, name, description, price, category, "subCategory", images, "inStock", featured, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Sandales Dorées',
  'Sandales plates confortables avec détails dorés. Parfaites pour l''été et les tenues décontractées chics.',
  15000,
  'chaussures',
  'Sandales',
  ARRAY['https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=2070&auto=format&fit=crop'],
  true,
  false,
  NOW(),
  NOW()
);

INSERT INTO products (id, name, description, price, category, "subCategory", images, "inStock", featured, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Sac à Main Cuir Camel',
  'Sac à main structuré en cuir véritable couleur camel. Grande capacité et finitions dorées.',
  55000,
  'accessoires',
  'Sacs',
  ARRAY['https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2038&auto=format&fit=crop'],
  true,
  true,
  NOW(),
  NOW()
);

INSERT INTO products (id, name, description, price, category, "subCategory", images, "inStock", featured, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Parure Bijoux Or',
  'Ensemble collier et boucles d''oreilles plaqué or. Design traditionnel revisité.',
  22000,
  'accessoires',
  'Bijoux',
  ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop'],
  false,
  false,
  NOW(),
  NOW()
);
