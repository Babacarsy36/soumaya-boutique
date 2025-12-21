import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  {
    name: 'Tissus Wax',
    slug: 'wax',
    description: 'Tissus Wax Hollandais authentiques aux motifs vibrants',
    image: 'https://images.unsplash.com/photo-1621815777085-3b9557672809?q=80&w=2070&auto=format&fit=crop',
  },
  {
    name: 'Bazin Riche',
    slug: 'bazin',
    description: 'Bazin riche Getzner et damassé de première qualité',
    image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=2000&auto=format&fit=crop',
  },
  {
    name: 'Accessoires',
    slug: 'accessoires',
    description: 'Sacs, foulards et bijoux pour compléter votre tenue',
    image: 'https://images.unsplash.com/photo-1614031679232-15a002220451?q=80&w=1974&auto=format&fit=crop',
  },
  {
    name: 'Parfums',
    slug: 'parfums',
    description: 'Fragrances orientales et boisées',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1904&auto=format&fit=crop',
  }
];

const products = [
  // Wax Products
  {
    name: 'Wax Hollandais "Fleurs de Mariage"',
    description: 'Authentique Wax Hollandais avec motif Fleurs de Mariage. 100% coton, couleurs éclatantes garanties. Idéal pour vos tenues de cérémonie. Vendu par coupon de 6 yards.',
    price: 35000,
    category: 'wax',
    subCategory: 'Vlisco',
    images: [
      'https://images.unsplash.com/photo-1598556885311-667793d5843a?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596482103852-652395a32973?q=80&w=2070&auto=format&fit=crop',
    ],
    inStock: true,
    featured: true,
  },
  {
    name: 'Wax "Disque" Rouge et Jaune',
    description: 'Le classique motif Disque revisité dans des tons chauds. Tissu robuste et confortable. Parfait pour boubous et jupes. 6 yards.',
    price: 25000,
    category: 'wax',
    subCategory: 'Hitarget',
    images: [
      'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?q=80&w=1948&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579969566367-5509210082f8?q=80&w=2070&auto=format&fit=crop',
    ],
    inStock: true,
    featured: false,
  },
  
  // Bazin Products
  {
    name: 'Bazin Riche Getzner Blanc',
    description: 'Le roi des tissus. Bazin Getzner blanc immaculé, brillance exceptionnelle. Teinture possible. Qualité supérieure autrichienne. 5 mètres.',
    price: 80000,
    category: 'bazin',
    subCategory: 'Getzner',
    images: [
      'https://images.unsplash.com/photo-1564859228273-278d3254e568?q=80&w=1974&auto=format&fit=crop',
    ],
    inStock: true,
    featured: true,
  },
  {
    name: 'Bazin Damassé Bleu Roi',
    description: 'Magnifique Bazin damassé teinté artisanalement. Couleur bleu roi profonde et motifs géométriques discrets. Tissu souple et agréable.',
    price: 45000,
    category: 'bazin',
    subCategory: 'Damassé',
    images: [
      'https://images.unsplash.com/photo-1550614000-4b9519e02a48?q=80&w=1934&auto=format&fit=crop',
    ],
    inStock: false,
    featured: false,
  },

  // Accessoires
  {
    name: 'Sac à main en cuir et Wax',
    description: 'Sac à main artisanal unique mélangeant cuir véritable et tissu wax. Finitions soignées, poche intérieure zippée.',
    price: 20000,
    category: 'accessoires',
    subCategory: 'Maroquinerie',
    images: [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1957&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1974&auto=format&fit=crop',
    ],
    inStock: true,
    featured: true,
  },

  // Parfums
  {
    name: 'Oud Royal',
    description: 'Un parfum envoûtant aux notes de bois de oud, d\'ambre et d\'épices. Tenue longue durée. Flacon de 100ml.',
    price: 15000,
    category: 'parfums',
    subCategory: 'Mixte',
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea4779426e9?q=80&w=2080&auto=format&fit=crop',
    ],
    inStock: true,
    featured: true,
  }
];

async function seed() {
  console.log('🌱 Starting database seed...');

  // 1. Insert Categories
  console.log('Cleaning existing categories...');
  const { error: deleteCatError } = await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Hack to delete all
  
  // Note: RLS might prevent deletion if not admin, but for seeding locally/with service key it's fine. 
  // If this fails due to FK constraints, we should delete products first.
  
  console.log('Cleaning existing products...');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('Inserting categories...');
  for (const cat of categories) {
    const { error } = await supabase.from('categories').insert({
      ...cat,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    if (error) console.error(`Error inserting category ${cat.name}:`, error.message);
    else console.log(`✅ Category ${cat.name} added`);
  }

  // 2. Insert Products
  console.log('Inserting products...');
  for (const prod of products) {
    const { error } = await supabase.from('products').insert({
      ...prod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    if (error) console.error(`Error inserting product ${prod.name}:`, error.message);
    else console.log(`✅ Product ${prod.name} added`);
  }

  console.log('✨ Seed completed!');
}

seed();
