import { supabase } from './supabase';
import { Product } from './types';

const PRODUCTS_TABLE = 'products';

// Get all products with pagination
export async function getProducts(filters?: {
    category?: string;
    featured?: boolean;
    limitCount?: number;
    page?: number;
    limit?: number;
    searchTerm?: string;
}): Promise<{ data: Product[]; count: number }> {
    try {
        let query = supabase.from(PRODUCTS_TABLE).select('*', { count: 'exact' });

        if (filters?.category) {
            query = query.eq('category', filters.category);
        }

        if (filters?.featured !== undefined) {
            query = query.eq('featured', filters.featured);
        }

        if (filters?.searchTerm) {
            query = query.ilike('name', `%${filters.searchTerm}%`);
        }

        query = query.order('createdAt', { ascending: false });

        if (filters?.page !== undefined && filters?.limit !== undefined) {
            const from = (filters.page - 1) * filters.limit;
            const to = from + filters.limit - 1;
            query = query.range(from, to);
        } else if (filters?.limitCount) {
            query = query.limit(filters.limitCount);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        const products = (data || []).map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
        })) as Product[];

        return { data: products, count: count || 0 };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { data: [], count: 0 };
    }
}

// Get single product by ID
export async function getProductById(id: string): Promise<Product | null> {
    console.log(`[getProductById] Fetching product with ID: ${id}`);
    try {
        const { data, error } = await supabase
            .from(PRODUCTS_TABLE)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`[getProductById] Supabase error for ID ${id}:`, error.message, error.details);
            throw error;
        }
        
        if (!data) {
            console.warn(`[getProductById] No data found for ID ${id}`);
            return null;
        }

        console.log(`[getProductById] Successfully fetched product: ${data.name}`);

        return {
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        } as Product;
    } catch (error) {
        console.error('[getProductById] Exception:', error);
        return null;
    }
}

// Add new product (admin only)
export async function addProduct(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string | null> {
    try {
        const { data, error } = await supabase
            .from(PRODUCTS_TABLE)
            .insert({
                ...product,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })
            .select('id')
            .single();

        if (error) throw error;
        return data?.id || null;
    } catch (error) {
        console.error('Error adding product:', error);
        return null;
    }
}

// Update product (admin only)
export async function updateProduct(
    id: string,
    updates: Partial<Omit<Product, 'id' | 'createdAt'>>
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from(PRODUCTS_TABLE)
            .update({
                ...updates,
                updatedAt: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating product:', error);
        return false;
    }
}

// Delete product (admin only)
export async function deleteProduct(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from(PRODUCTS_TABLE)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}
