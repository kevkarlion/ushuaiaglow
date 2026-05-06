'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Package, Users, BarChart3, Settings, Home, LogOut, Menu, ChevronLeft, X } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ nombre: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/sales', icon: ShoppingCart, label: 'Pedidos' },
    { href: '/admin/stock', icon: Package, label: 'Productos' },
    { href: '/admin/buyers', icon: Users, label: 'Usuarios' },
    { href: '/admin/estadisticas', icon: BarChart3, label: 'Estadísticas' },
    { href: '/admin/configuracion', icon: Settings, label: 'Configuración' },
  ];

  // Skip auth check on login/register pages
  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/register';

  useEffect(() => {
    // Skip auth check on login/register pages
    if (pathname === '/admin/login' || pathname === '/admin/register') return;

    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='));
    
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Get user info
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token.split('=')[1]}` },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [router, pathname]);

  const handleLogout = () => {
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-black flex">
      {/* Mobile sidebar backdrop */}
      {!isAuthPage && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - responsive */}
      {!isAuthPage && (
        <aside className={`
          fixed lg:relative z-50 lg:z-0
          w-64 h-screen bg-surface-darker border-r border-white/10 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Logo */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white" onClick={closeSidebar}>
              Ushuaia <span className="text-primary">Admin</span>
            </Link>
            <button 
              onClick={closeSidebar}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" strokeWidth={1.5} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t border-white/10">
            {user && (
              <p className="text-gray-400 text-sm mb-3">Hola, {user.nombre}</p>
            )}
            <div className="space-y-2">
              <Link
                href="/"
                onClick={closeSidebar}
                className="block text-center px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                ← Ver tienda
              </Link>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        {!isAuthPage && (
          <header className="lg:hidden bg-surface-darker border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-30">
            <Link href="/" className="text-lg font-bold text-white">
              Ushuaia <span className="text-primary">Admin</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </header>
        )}

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}