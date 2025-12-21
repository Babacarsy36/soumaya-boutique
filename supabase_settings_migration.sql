-- Create Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view settings" ON settings
  FOR SELECT USING (true);

-- Allow authenticated admins to insert/update/delete
CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Seed Initial Data
INSERT INTO settings (key, value, description) VALUES 
(
  'site_info', 
  '{
    "name": "Soumaya Boutique",
    "whatsapp": "221770000000",
    "email": "contact@soumayaboutique.com",
    "address": "Dakar, Sénégal"
  }',
  'Informations générales du site'
),
(
  'home_hero', 
  '{
    "title": "L''Art de l''Élégance Sénégalaise",
    "subtitle": "Découvrez notre sélection exclusive de tissus raffinés, parfums envoûtants et accessoires de mode.",
    "buttonText": "Découvrir la boutique",
    "imageUrl": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
  }',
  'Section Hero de la page d''accueil'
),
(
  'products_hero',
  '{
    "title": "Nos Collections",
    "subtitle": "Explorez notre sélection unique de tissus, parfums et accessoires, choisis avec soin pour leur qualité et leur élégance.",
    "imageUrl": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop"
  }',
  'Section Hero de la page produits'
)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value;
