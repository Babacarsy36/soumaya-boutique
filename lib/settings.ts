import { supabase } from './supabase';
import { Setting, SiteSettings } from './types';

// Cache simple pour éviter trop d'appels à la BDD
let settingsCache: SiteSettings | null = null;
let lastFetch = 0;
const CACHE_DURATION = 60000; // 1 minute

export async function getSettings(): Promise<SiteSettings> {
    const now = Date.now();
    if (settingsCache && (now - lastFetch < CACHE_DURATION)) {
        return settingsCache;
    }

    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*');

        if (error) throw error;

        // Transformer le tableau de settings en objet clé/valeur
        const settingsObject: SiteSettings = {};
        data?.forEach((item: Setting) => {
            settingsObject[item.key] = item.value;
        });

        settingsCache = settingsObject;
        lastFetch = now;
        
        return settingsObject;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return {};
    }
}

export async function getSettingByKey(key: string): Promise<any> {
    const settings = await getSettings();
    return settings[key];
}

export async function updateSetting(key: string, value: any) {
    try {
        const { error } = await supabase
            .from('settings')
            .update({ value, updatedAt: new Date() })
            .eq('key', key);

        if (error) throw error;
        
        // Invalider le cache
        settingsCache = null;
        return true;
    } catch (error) {
        console.error(`Error updating setting ${key}:`, error);
        throw error;
    }
}
