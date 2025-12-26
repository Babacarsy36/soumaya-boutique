-- Add About Page Settings
-- This migration adds the about_page settings entry to manage the About page story section content

INSERT INTO settings (key, value, description) VALUES 
(
  'about_page', 
  '{
    "title": "Une Histoire de Passion",
    "description": "Chez Soumaya Boutique, nous célébrons la beauté et l''authenticité. Chaque pièce est choisie avec amour pour vous offrir le meilleur de la mode et de l''artisanat."
  }',
  'Contenu de la section histoire de la page À propos'
)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value,
    description = EXCLUDED.description,
    "updatedAt" = NOW();
