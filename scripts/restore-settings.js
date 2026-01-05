/**
 * Script de récupération des données Supabase
 * Ce script restaure toutes les données de configuration du site
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Variables d\'environnement Supabase manquantes');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Données à restaurer
const settingsData = [
    {
        key: 'site_info',
        value: {
            name: 'Soumaya Boutique',
            whatsapp: {
                ligne1: '221771494747',
                ligne2: '221779163200'
            },
            email: 'contact@soumayaboutique.com',
            address: 'Dakar, Sénégal'
        },
        description: 'Informations générales du site'
    },
    {
        key: 'home_hero',
        value: {
            title: 'L\'Art de l\'Élégance Sénégalaise',
            subtitle: 'Découvrez notre sélection exclusive de tissus raffinés, parfums envoûtants et accessoires de mode.',
            buttonText: 'Découvrir la boutique',
            imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop'
        },
        description: 'Section Hero de la page d\'accueil'
    },
    {
        key: 'products_hero',
        value: {
            title: 'Nos Collections',
            subtitle: 'Explorez notre sélection unique de tissus, parfums et accessoires, choisis avec soin pour leur qualité et leur élégance.',
            imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop'
        },
        description: 'Section Hero de la page produits'
    },
    {
        key: 'about_page',
        value: {
            title: 'Une Histoire de Passion',
            description: 'Chez Soumaya Boutique, nous célébrons la beauté et l\'authenticité. Chaque pièce est choisie avec amour pour vous offrir le meilleur de la mode et de l\'artisanat.'
        },
        description: 'Contenu de la section histoire de la page À propos'
    },
    {
        key: 'collection_badge',
        value: {
            text: 'Nouvelle Collection 2024',
            visible: true
        },
        description: 'Badge affiché au-dessus du titre principal sur la page d\'accueil'
    }
];

async function restoreSettings() {
    console.log('🔄 Début de la restauration des données...\n');

    try {
        // Vérifier si la table existe
        const { data: existingSettings, error: fetchError } = await supabase
            .from('settings')
            .select('key')
            .limit(1);

        if (fetchError) {
            console.error('❌ Erreur lors de la vérification de la table:', fetchError.message);
            console.log('\n⚠️  La table "settings" n\'existe peut-être pas.');
            console.log('📝 Veuillez exécuter le fichier supabase_settings_migration.sql dans votre tableau de bord Supabase.');
            process.exit(1);
        }

        // Restaurer chaque paramètre
        for (const setting of settingsData) {
            console.log(`📝 Restauration de "${setting.key}"...`);

            // Vérifier si le paramètre existe déjà
            const { data: existing } = await supabase
                .from('settings')
                .select('id')
                .eq('key', setting.key)
                .single();

            if (existing) {
                // Mettre à jour
                const { error } = await supabase
                    .from('settings')
                    .update({
                        value: setting.value,
                        description: setting.description,
                        updatedAt: new Date().toISOString()
                    })
                    .eq('key', setting.key);

                if (error) {
                    console.error(`   ❌ Erreur lors de la mise à jour de "${setting.key}":`, error.message);
                } else {
                    console.log(`   ✅ "${setting.key}" mis à jour`);
                }
            } else {
                // Insérer
                const { error } = await supabase
                    .from('settings')
                    .insert({
                        key: setting.key,
                        value: setting.value,
                        description: setting.description
                    });

                if (error) {
                    console.error(`   ❌ Erreur lors de l'insertion de "${setting.key}":`, error.message);
                } else {
                    console.log(`   ✅ "${setting.key}" créé`);
                }
            }
        }

        console.log('\n✨ Restauration terminée avec succès !');
        console.log('🔄 Redémarrez votre serveur de développement pour voir les changements.');

    } catch (error) {
        console.error('❌ Erreur inattendue:', error);
        process.exit(1);
    }
}

// Exécuter le script
restoreSettings();
