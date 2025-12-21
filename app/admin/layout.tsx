'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`flex-shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
        <AdminSidebar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
            collapsed={isSidebarCollapsed}
        />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 h-16 shadow-sm">
            <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden lg:flex p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                title={isSidebarCollapsed ? "Déplier le menu" : "Replier le menu"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
            </button>
            
            {/* Mobile Toggle & Right Header Content */}
            <div className="flex flex-1 items-center justify-between lg:justify-end">
                <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
