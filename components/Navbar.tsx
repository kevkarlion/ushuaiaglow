'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, X, Menu } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Productos', href: '/productos' },
    { name: 'Combos', href: '/combos' },
    { name: 'Cómo Funciona', href: '/como-funciona' },
    { name: 'Categorías', href: '/categorias' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <>
      <nav 
        className={`sticky top-0 z-50 transition-all duration-500 ease-premium ${
          scrolled 
            ? 'bg-black/70 backdrop-blur-xl saturate-150 border-b border-white/[0.06] shadow-premium' 
            : 'bg-black/20 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center py-2 relative group">
              <Image 
                src="/us-logo-final.png" 
                alt="Ushuaia" 
                width={80} 
                height={80} 
                className="h-10 w-auto object-contain md:h-12 transition-transform duration-500 ease-premium group-hover:scale-[1.02]"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-normal text-white/70 hover:text-white transition-all duration-300 ease-premium rounded-lg hover:bg-white/[0.04]"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Cart & Menu */}
            <div className="flex items-center gap-2">
              <Link 
                href="/cart" 
                className="relative p-2.5 text-white/70 hover:text-white transition-all duration-300 ease-premium rounded-xl hover:bg-white/[0.04]"
              >
                <span className="sr-only">Carrito</span>
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-semibold shadow-glow">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden p-2.5 text-white/70 hover:text-white z-50 relative transition-all duration-300 ease-premium rounded-xl hover:bg-white/[0.04]"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Menu"
              >
                {isOpen ? (
                  <X className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-5 h-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative pt-24 px-6 animate-fade-in-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group flex items-center justify-between py-4 px-4 text-xl text-white/80 hover:text-white transition-all duration-300 ease-premium rounded-2xl hover:bg-white/[0.03]"
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span>{link.name}</span>
                  <span className="text-white/20 group-hover:text-primary/50 transition-colors duration-300">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}