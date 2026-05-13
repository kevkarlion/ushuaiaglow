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
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-md saturate-180 border-b border-white/10' 
            : 'bg-black/40 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center py-2">
              <Image 
                src="/us-logo-final.png" 
                alt="Ushuaia" 
                width={80} 
                height={80} 
                className="h-10 w-auto object-contain md:h-12"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-normal text-white/80 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Cart & Menu */}
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="relative p-2 text-white/80 hover:text-white transition-colors">
                <span className="sr-only">Carrito</span>
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] min-w-[18px] h-4 px-1 rounded-full flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden p-2 text-white/80 hover:text-white z-50 relative"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Menu"
              >
                {isOpen ? (
                  <X className="w-6 h-6" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-6 h-6" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - fixed, covers entire screen */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Content - slides in from top */}
          <div className="relative pt-20 px-4 animate-slide-down">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block py-4 text-xl text-white/90 hover:text-white transition-colors font-normal border-b border-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            {/* Close button */}
            <button
              className="mt-8 w-full py-4 bg-primary text-white font-semibold rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Cerrar menú
            </button>
          </div>
        </div>
      )}

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
}