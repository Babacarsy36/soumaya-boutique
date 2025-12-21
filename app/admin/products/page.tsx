'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { uploadMultipleImagesWithProgress } from '@/lib/storage';
import { Product, Category } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon, MagnifyingGlassIcon, FunnelIcon, ShoppingBagIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function AdminProductsPage() {
    
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{
        currentFile: number;
        totalFiles: number;
        percentage: number;
        startTime: number | null;
    }>({
        currentFile: 0,
        totalFiles: 0,
        percentage: 0,
        startTime: null,
    });

    
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const ITEMS_PER_PAGE = 5; // Reduced for testing pagination

    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        subCategory: '',
        inStock: true,
        featured: false,
    });
    
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    setUser(session.user);
                    loadInitialData();
                } else {
                    router.push('/admin/login');
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [router]);

    // Re-fetch when filters or page change
    useEffect(() => {
        if (user) {
            loadProducts();
        }
    }, [user, currentPage, categoryFilter, searchTerm]);

    const loadInitialData = async () => {
        const { data: categoriesData } = await getCategories();
        setCategories(categoriesData);
        
        // Set default category if available
        if (categoriesData.length > 0) {
            setFormData(prev => ({ ...prev, category: categoriesData[0].slug }));
        }
        
        loadProducts();
    };

    const loadProducts = async () => {
        // Debounce search could be added here if needed, but for now simple
        const { data, count } = await getProducts({
            category: categoryFilter || undefined,
            searchTerm: searchTerm || undefined,
            page: currentPage,
            limit: ITEMS_PER_PAGE
        });
        setProducts(data);
        setTotalCount(count);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        setUploadProgress({
            currentFile: 0,
            totalFiles: imageFiles.length,
            percentage: 0,
            startTime: Date.now(),
        });

        try {
            // Upload images
            let imageUrls: string[] = [];
            if (imageFiles.length > 0) {
                imageUrls = await uploadMultipleImagesWithProgress(
                    imageFiles,
                    'products',
                    (fileIndex, progress, totalFiles) => {
                        setUploadProgress({
                            currentFile: fileIndex + 1,
                            totalFiles,
                            percentage: progress,
                            startTime: uploadProgress.startTime || Date.now(),
                        });
                    }
                );
            }

            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                subCategory: formData.subCategory || undefined,
                images: editingProduct ? [...editingProduct.images, ...imageUrls] : imageUrls,
                inStock: formData.inStock,
                featured: formData.featured,
            };

            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
            } else {
                await addProduct(productData);
            }

            // Reset form
            setFormData({
                name: '',
                description: '',
                price: '',
                category: categories.length > 0 ? categories[0].slug : '',
                subCategory: '',
                inStock: true,
                featured: false,
            });
            setImageFiles([]);
            setShowForm(false);
            setEditingProduct(null);
            loadProducts(); // Refresh list
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Erreur lors de l\'enregistrement du produit');
        } finally {
            setUploading(false);
            setUploadProgress({
                currentFile: 0,
                totalFiles: 0,
                percentage: 0,
                startTime: null,
            });
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            subCategory: product.subCategory || '',
            inStock: product.inStock,
            featured: product.featured,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            await deleteProduct(id);
            loadProducts();
        }
    };

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="font-serif text-3xl font-bold text-slate-900">
                    {showForm ? (editingProduct ? 'Modifier un produit' : 'Nouveau Produit') : 'Produits'}
                </h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingProduct(null);
                        setFormData({
                            name: '',
                            description: '',
                            price: '',
                            category: categories.length > 0 ? categories[0].slug : '',
                            subCategory: '',
                            inStock: true,
                            featured: false,
                        });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow-sm"
                >
                    {showForm ? (
                        <>
                            <span>Annuler</span>
                        </>
                    ) : (
                        <>
                            <PlusIcon className="h-5 w-5" />
                            <span>Nouveau Produit</span>
                        </>
                    )}
                </button>
            </div>

            {/* Form */}
            {showForm ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in slide-in-from-top-4 duration-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Nom du produit *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none text-slate-900 placeholder-slate-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Prix (FCFA) *</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none text-slate-900 placeholder-slate-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Catégorie *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none bg-white text-slate-900"
                                    required
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.slug}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Sous-catégorie</label>
                                <input
                                    type="text"
                                    value={formData.subCategory}
                                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                                    placeholder="Ex: Bazin, Wax, Getzner..."
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none text-slate-900 placeholder-slate-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none text-slate-900 placeholder-slate-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Images</label>
                            
                            {/* Existing Images Grid */}
                            {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                                <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {editingProduct.images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                            <Image 
                                                src={img} 
                                                alt={`Image ${idx + 1}`} 
                                                fill 
                                                className="object-cover"
                                                unoptimized
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        if (confirm('Supprimer cette image ?')) {
                                                            const newImages = editingProduct.images.filter((_, i) => i !== idx);
                                                            // Optimistic update
                                                            setEditingProduct({ ...editingProduct, images: newImages });
                                                            // Server update
                                                            await updateProduct(editingProduct.id, { images: newImages });
                                                        }
                                                    }}
                                                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* New Images Preview */}
                            {imageFiles.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm text-slate-500 mb-2">Nouvelles images à ajouter :</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {imageFiles.map((file, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-amber-200 bg-amber-50 group">
                                                <img 
                                                    src={URL.createObjectURL(file)} 
                                                    alt={`New ${idx}`} 
                                                    className="w-full h-full object-cover opacity-80"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-amber-500 transition-colors cursor-pointer relative bg-slate-50">
                                <div className="space-y-1 text-center">
                                    <PhotoIcon className="mx-auto h-12 w-12 text-slate-400" />
                                    <div className="flex text-sm text-slate-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500">
                                            <span>Ajouter des images</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => {
                                                    const newFiles = Array.from(e.target.files || []);
                                                    setImageFiles(prev => [...prev, ...newFiles]);
                                                }}
                                            />
                                        </label>
                                        <p className="pl-1">ou glisser-déposer</p>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        PNG, JPG, GIF jusqu'à 10MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.inStock}
                                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                    className="mr-2 h-4 w-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                                />
                                <span className="text-sm font-medium text-slate-700">En stock</span>
                            </label>

                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="mr-2 h-4 w-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                                />
                                <span className="text-sm font-medium text-slate-700">Produit vedette</span>
                            </label>
                        </div>

                        {/* Upload Progress Bar */}
                        {uploading && uploadProgress.totalFiles > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-700">
                                        Upload en cours: Image {uploadProgress.currentFile}/{uploadProgress.totalFiles}
                                    </span>
                                    <span className="font-bold text-amber-600">
                                        {Math.round(uploadProgress.percentage)}%
                                    </span>
                                </div>

                                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500 transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress.percentage}%` }}
                                    >
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="px-6 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50 shadow-sm"
                            >
                                {uploading ? 'Enregistrement...' : editingProduct ? 'Mettre à jour' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <div className="relative flex-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 leading-5 placeholder-slate-500 focus:border-amber-500 focus:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:text-sm text-slate-900"
                                placeholder="Rechercher un produit..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // Reset page on search
                                }}
                            />
                        </div>
                        <div className="relative min-w-[200px]">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <FunnelIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                            </div>
                            <select
                                className="block w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 leading-5 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:text-sm appearance-none bg-white text-slate-900"
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value);
                                    setCurrentPage(1); // Reset page on filter
                                }}
                            >
                                <option value="">Toutes les catégories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.slug}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Produit
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Prix
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Catégorie
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <ShoppingBagIcon className="h-12 w-12 text-slate-300 mb-2" />
                                                    <p className="text-slate-500 text-sm">Aucun produit trouvé</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((product) => (
                                            <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0 relative rounded overflow-hidden bg-slate-100 border border-slate-200">
                                                            {product.images[0] ? (
                                                                <Image
                                                                    src={product.images[0]}
                                                                    alt={product.name}
                                                                    fill
                                                                    className="object-cover"
                                                                    unoptimized
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center">
                                                                    <PhotoIcon className="h-5 w-5 text-slate-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-slate-900">{product.name}</div>
                                                            <div className="text-sm text-slate-500 truncate max-w-[200px]">{product.description}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-amber-600">{formatPrice(product.price)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                        {categories.find(c => c.slug === product.category)?.name || product.category}
                                                    </span>
                                                    {product.subCategory && (
                                                        <span className="ml-2 text-xs text-slate-500">
                                                            {product.subCategory}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {product.inStock ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            En stock
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            Rupture
                                                        </span>
                                                    )}
                                                    {product.featured && (
                                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                            ★ Vedette
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                                                            title="Modifier"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                                                            title="Supprimer"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination Footer */}
                        {totalPages > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200 sm:px-6">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-slate-700">
                                            Affichage de <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> à <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}</span> sur <span className="font-medium">{totalCount}</span> résultats
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="sr-only">Précédent</span>
                                                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                            
                                            {[...Array(totalPages)].map((_, i) => {
                                                const page = i + 1;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            currentPage === page
                                                                ? 'z-10 bg-amber-50 border-amber-500 text-amber-600'
                                                                : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="sr-only">Suivant</span>
                                                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
