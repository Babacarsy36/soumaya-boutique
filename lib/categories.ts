import { supabase } from './supabase';
import { Category } from './types';

const CATEGORIES_TABLE = 'categories';

// Get all categories with pagination
export async function getCategories(filters?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
}): Promise<{ data: Category[]; count: number }> {
    try {
        let query = supabase.from(CATEGORIES_TABLE).select('*', { count: 'exact' });

        if (filters?.searchTerm) {
            query = query.ilike('name', `%${filters.searchTerm}%`);
        }

        query = query.order('name');

        if (filters?.page !== undefined && filters?.limit !== undefined) {
            const from = (filters.page - 1) * filters.limit;
            const to = from + filters.limit - 1;
            query = query.range(from, to);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        const categories = (data || []).map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
        })) as Category[];

        return { data: categories, count: count || 0 };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { data: [], count: 0 };
    }
}

// Get single category by ID
export async function getCategoryById(id: string): Promise<Category | null> {
    try {
        const { data, error } = await supabase
            .from(CATEGORIES_TABLE)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return null;

        return {
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        } as Category;
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
}

// Add new category (admin only)
export async function addCategory(
    category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string | null> {
    try {
        const { data, error } = await supabase
            .from(CATEGORIES_TABLE)
            .insert({
                ...category,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })
            .select('id')
            .single();

        if (error) throw error;
        return data?.id || null;
    } catch (error) {
        console.error('Error adding category:', error);
        return null;
    }
}

// Update category (admin only)
export async function updateCategory(
    id: string,
    updates: Partial<Omit<Category, 'id' | 'createdAt'>>
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from(CATEGORIES_TABLE)
            .update({
                ...updates,
                updatedAt: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating category:', error);
        return false;
    }
}

// Delete category (admin only)
export async function deleteCategory(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from(CATEGORIES_TABLE)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting category:', error);
        return false;
    }
}
