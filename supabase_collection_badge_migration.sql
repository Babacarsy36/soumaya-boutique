-- Add Collection Badge Settings
-- This migration adds the collection_badge settings entry to manage the hero badge on the home page

INSERT INTO settings (key, value, description) VALUES 
(
  'collection_badge', 
  '{
    "text": "Nouvelle Collection 2024",
    "visible": true
  }',
  'Badge affiché au-dessus du titre principal sur la page d''accueil'
)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value,
    description = EXCLUDED.description,
    "updatedAt" = NOW();
