'use client';

import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export default function AdminHeader({ sidebarOpen, setSidebarOpen }: AdminHeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
                type="button"
                className="-m-2.5 p-2.5 text-slate-700 hover:text-slate-900 lg:hidden"
                onClick={() => setSidebarOpen(true)}
            >
                <span className="sr-only">Ouvrir la barre latérale</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1"></div>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500">
                        <span className="sr-only">Voir les notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="h-6 w-px bg-slate-200" aria-hidden="true" />
                    
                    <div className="relative group">
                        <button className="flex items-center gap-x-4 p-1.5 text-sm font-semibold leading-6 text-slate-900 hover:bg-slate-50 rounded-full transition-colors">
                            <UserCircleIcon className="h-8 w-8 text-slate-400 bg-slate-50 rounded-full" />
                            <span className="hidden lg:flex lg:items-center">
                                <span className="ml-2 text-sm font-medium leading-6 text-slate-700 group-hover:text-slate-900" aria-hidden="true">Admin</span>
                            </span>
                        </button>
                        
                        {/* Dropdown simple pour déconnexion */}
                        <div className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-slate-900/5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform">
                            <button
                                onClick={handleLogout}
                                className="block w-full px-3 py-1 text-sm leading-6 text-slate-900 hover:bg-slate-50 text-left"
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
