import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabase } from '../lib/supabase';

async function runMigration() {
    console.log('🚀 Running about_page migration...');

    try {
        const { data, error } = await supabase
            .from('settings')
            .upsert({
                key: 'about_page',
                value: {
                    title: "Une Histoire de Passion",
                    description: "Chez Soumaya Boutique, nous célébrons la beauté et l'authenticité. Chaque pièce est choisie avec amour pour vous offrir le meilleur de la mode et de l'artisanat."
                },
                description: 'Contenu de la section histoire de la page À propos',
                updatedAt: new Date()
            }, {
                onConflict: 'key'
            });

        if (error) {
            console.error('❌ Migration failed:', error);
            process.exit(1);
        }

        console.log('✅ Migration successful!');

        // Verify the setting was created
        const { data: verifyData, error: verifyError } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'about_page')
            .single();

        if (verifyError) {
            console.error('❌ Verification failed:', verifyError);
        } else {
            console.log('✅ Verification successful!');
            console.log('📄 About page settings:', JSON.stringify(verifyData, null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Unexpected error:', err);
        process.exit(1);
    }
}

runMigration();
