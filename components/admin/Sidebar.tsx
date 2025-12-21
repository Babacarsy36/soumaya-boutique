'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    Squares2X2Icon, 
    ShoppingBagIcon, 
    TagIcon, 
    ArrowLeftOnRectangleIcon,
    Cog6ToothIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Squares2X2Icon },
    { name: 'Produits', href: '/admin/products', icon: ShoppingBagIcon },
    { name: 'Catégories', href: '/admin/categories', icon: TagIcon },
    { name: 'Paramètres', href: '/admin/settings', icon: Cog6ToothIcon },
];

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    collapsed: boolean;
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, collapsed }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm lg:hidden" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-slate-900 text-white shadow-xl transition-all duration-300 ease-in-out lg:static ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } ${collapsed ? 'w-20' : 'w-72'}`}>
                
                {/* Logo & Close Button */}
                <div className={`flex h-16 items-center border-b border-slate-800 bg-slate-900 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                    {!collapsed ? (
                        <h1 className="font-serif text-xl font-bold tracking-wider text-amber-500 whitespace-nowrap overflow-hidden">
                            SOUMAYA
                            <span className="block text-xs font-sans text-slate-400 font-normal">ADMINISTRATION</span>
                        </h1>
                    ) : (
                        <span className="font-serif text-2xl font-bold text-amber-500">S</span>
                    )}
                    <button 
                        onClick={() => setSidebarOpen(false)} 
                        className="lg:hidden text-slate-400 hover:text-white"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto custom-scrollbar">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={collapsed ? item.name : undefined}
                                className={`group flex items-center rounded-lg py-3 text-sm font-medium transition-all ${
                                    collapsed ? 'justify-center px-2' : 'px-3'
                                } ${
                                    isActive
                                        ? 'bg-amber-600 text-white shadow-md'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <item.icon
                                    className={`h-6 w-6 flex-shrink-0 transition-colors ${
                                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                                    } ${!collapsed && 'mr-3'}`}
                                    aria-hidden="true"
                                />
                                {!collapsed && <span className="whitespace-nowrap overflow-hidden">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="border-t border-slate-800 p-4">
                    <button
                        onClick={handleLogout}
                        title={collapsed ? 'Déconnexion' : undefined}
                        className={`group flex w-full items-center rounded-lg py-3 text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors ${
                            collapsed ? 'justify-center px-2' : 'px-3'
                        }`}
                    >
                        <ArrowLeftOnRectangleIcon
                            className={`h-6 w-6 flex-shrink-0 text-red-400 group-hover:text-red-300 ${!collapsed && 'mr-3'}`}
                            aria-hidden="true"
                        />
                        {!collapsed && <span>Déconnexion</span>}
                    </button>
                </div>
            </div>
        </>
    );
}
