'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/categories';
import { Category } from '@/lib/types';
import { uploadImage } from '@/lib/storage';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, PhotoIcon, TagIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function AdminCategoriesPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [uploading, setUploading] = useState(false);
    
    
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const ITEMS_PER_PAGE = 5; 

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    setUser(session.user);
                    loadCategories();
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


    useEffect(() => {
        if (user) {
            loadCategories();
        }
    }, [currentPage, searchTerm]);

    const loadCategories = async () => {
        const { data, count } = await getCategories({
            searchTerm: searchTerm || undefined,
            page: currentPage,
            limit: ITEMS_PER_PAGE
        });
        setCategories(data);
        setTotalCount(count);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrl = editingCategory?.image;
            
            if (imageFile) {
                const timestamp = Date.now();
                const path = `categories/${timestamp}_${imageFile.name}`;
                imageUrl = await uploadImage(imageFile, path);
            }

            const categoryData = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                image: imageUrl,
            };

            if (editingCategory) {
                await updateCategory(editingCategory.id, categoryData);
            } else {
                await addCategory(categoryData);
            }

            // Reset form
            setFormData({
                name: '',
                slug: '',
                description: '',
            });
            setImageFile(null);
            setShowForm(false);
            setEditingCategory(null);
            loadCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Erreur lors de l\'enregistrement de la catégorie');
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            await deleteCategory(id);
            loadCategories();
        }
    };

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
                <h1 className="font-serif text-3xl font-bold text-slate-900">Catégories</h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingCategory(null);
                        setFormData({
                            name: '',
                            slug: '',
                            description: '',
                        });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow-sm"
                >
                    <PlusIcon className="h-5 w-5" />
                    {showForm ? 'Annuler' : 'Nouvelle Catégorie'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in slide-in-from-top-4 duration-200">
                    <h2 className="text-xl font-bold mb-6 text-slate-800">
                        {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Nom de la catégorie *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none text-slate-900 placeholder-slate-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700">Slug (URL) *</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none bg-slate-50 text-slate-900 placeholder-slate-400"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none text-slate-900 placeholder-slate-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Image</label>
                            
                            {/* Existing Image Preview */}
                            {editingCategory && editingCategory.image && !imageFile && (
                                <div className="mb-4 relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200 group">
                                    <img 
                                        src={editingCategory.image} 
                                        alt={editingCategory.name} 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white text-xs font-medium">Image actuelle</p>
                                    </div>
                                </div>
                            )}

                            {/* New Image Preview */}
                            {imageFile && (
                                <div className="mb-4 relative w-32 h-32 rounded-lg overflow-hidden border border-amber-200 bg-amber-50 group">
                                    <img 
                                        src={URL.createObjectURL(imageFile)} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setImageFile(null)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-amber-500 transition-colors cursor-pointer relative bg-slate-50">
                                <div className="space-y-1 text-center">
                                    <PhotoIcon className="mx-auto h-12 w-12 text-slate-400" />
                                    <div className="flex text-sm text-slate-600">
                                        <label htmlFor="category-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500">
                                            <span>{imageFile ? 'Changer l\'image' : 'Télécharger une image'}</span>
                                            <input
                                                id="category-image-upload"
                                                name="category-image-upload"
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="px-6 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50 shadow-sm"
                            >
                                {uploading ? 'Enregistrement...' : editingCategory ? 'Mettre à jour' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="relative max-w-md">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 leading-5 placeholder-slate-500 focus:border-amber-500 focus:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:text-sm text-slate-900"
                        placeholder="Rechercher une catégorie..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Catégorie
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <TagIcon className="h-12 w-12 text-slate-300 mb-2" />
                                            <p className="text-slate-500 text-sm">Aucune catégorie trouvée</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 relative rounded overflow-hidden bg-slate-100 border border-slate-200">
                                                    {category.image ? (
                                                        <img
                                                            src={category.image}
                                                            alt={category.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <PhotoIcon className="h-5 w-5 text-slate-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900">{category.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 font-mono">
                                                {category.slug}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-500 line-clamp-1 max-w-md">{category.description || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                                                    title="Modifier"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
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
                {totalPages >= 1 && (
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
        </div>
    );
}
