'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: 'Productos',
    href: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4m0 0l-8 4m8-4m-8 8m0 0l8-4m-8 4l8 4m0 0l-8 4" />
      </svg>
    ),
  },
  {
    name: 'Stock',
    href: '/admin/stock',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012 2h2a2 2 0 012-2" />
      </svg>
    ),
  },
  {
    name: 'Compradores',
    href: '/admin/buyers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    name: 'Ventas',
    href: '/admin/sales',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ nombre: string } | null>(null);

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

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-darker border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <Link href="/" className="text-xl font-bold text-white">
            Ushuaia <span className="text-primary">Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
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

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}