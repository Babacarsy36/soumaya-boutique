// Category Types
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Product Types
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string; // Changed from union type to string to support dynamic categories
    subCategory?: string;
    images: string[];
    inStock: boolean;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Cart Types
export interface CartItem {
    product: Product;
    quantity: number;
    size?: string; // Ajouté pour gérer les tailles si besoin
}

export interface Cart {
    items: CartItem[];
    total: number;
}

// Order Types
export interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress?: string; // Ajouté pour la livraison
    items: CartItem[];
    total: number;
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    paymentMethod?: 'cash' | 'orange_money' | 'wave';
    createdAt: Date;
    updatedAt: Date;
}

// User Types
export interface User {
    id: string;
    email: string;
    role: 'admin' | 'customer';
    createdAt: Date;
}

// Settings Types
export interface Setting {
    id: string;
    key: string;
    value: any;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SiteSettings {
    site_info?: {
        name: string;
        whatsapp: {
            ligne1: string;
            ligne2: string;
        };
        email: string;
        address: string;
    };
    home_hero?: {
        title: string;
        subtitle: string;
        buttonText: string;
        imageUrl: string;
    };
    products_hero?: {
        title: string;
        subtitle: string;
        imageUrl: string;
    };
    about_page?: {
        heroTitle: string;
        heroSubtitle: string;
        title: string;
        description: string;
    };
    collection_badge?: {
        text: string;
        visible: boolean;
    };
    categories_section?: {
        title: string;
        subtitle?: string;
        backgroundImage?: string;
    };
    [key: string]: any;
}
