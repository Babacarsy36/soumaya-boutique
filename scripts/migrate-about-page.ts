// Load environment variables first
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local from the project root
config({ path: resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Try to use service role key for migrations, fall back to anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables:');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing');
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
    throw new Error('Missing Supabase environment variables');
}

console.log('Using', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service role key' : 'anon key', 'for migration');

const supabase = createClient(supabaseUrl, supabaseKey);

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
