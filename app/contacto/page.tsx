'use client';

import Link from 'next/link';
import { LucideMessageCircle as WhatsAppIcon, LucideMail as MailIcon, LucideMapPin as PinIcon, ArrowBigRight as ArrowIcon } from 'lucide-react';

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-surface-darker/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-white leading-[1.1] tracking-tight">
            Contacto
          </h1>
          <p className="text-gray-400 mt-2">
            Estamos para ayudarte
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Info de contacto */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">
                Información de contacto
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <WhatsAppIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">WhatsApp</p>
                    <a href="https://wa.me/5491167667548" className="text-white font-medium hover:text-primary transition-colors text-lg block">
                      +54 9 11 6766-7548
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <MailIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <a href="mailto:hola@ushuaia.com.ar" className="text-white font-medium hover:text-primary transition-colors text-lg block">
                      hola@ushuaia.com.ar
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <PinIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Horario de atención</p>
                    <p className="text-white font-medium">Lunes a viernes de 9 a 18hs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Links rapidos */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">
                Links rápidos
              </h2>
              <div className="space-y-3">
                <Link href="/productos" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors">
                  <ArrowIcon className="w-4 h-4" />
                  <span>Ver todos los productos</span>
                </Link>
                <Link href="/combos" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors">
                  <ArrowIcon className="w-4 h-4" />
                  <span>Ver Combos Exclusivos</span>
                </Link>
                <Link href="/categorias" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors">
                  <ArrowIcon className="w-4 h-4" />
                  <span>Ver categorías</span>
                </Link>
                <Link href="/cart" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors">
                  <ArrowIcon className="w-4 h-4" />
                  <span>Mi carrito</span>
                </Link>
              </div>
            </div>

            {/* Redes sociales */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">
                Seguinos
              </h2>
              <div className="flex gap-4">
                <a href="https://instagram.com/ushuaia" target="_blank" rel="noopener noreferrer" 
                  className="p-3 bg-white/10 hover:bg-primary rounded-lg transition-colors text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://wa.me/5491167667548" target="_blank" rel="noopener noreferrer" 
                  className="p-3 bg-white/10 hover:bg-primary rounded-lg transition-colors text-white">
                  <WhatsAppIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Mensaje */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">
              Escribinos
            </h2>
            <div className="bg-surface-darker/30 rounded-xl p-8 border border-white/10">
              <p className="text-gray-400 mb-4">
                Escribinos por WhatsApp o mandanos un email. Preferimos WhatsApp por la rapidez en responder.
              </p>
              <div className="space-y-4">
                <a href="https://wa.me/5491167667548" 
                  className="flex items-center justify-center gap-3 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors">
                  <WhatsAppIcon className="w-5 h-5" />
                  Escribir por WhatsApp
                </a>
                <a href="mailto:hola@ushuaia.com.ar" 
                  className="flex items-center justify-center gap-3 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors">
                  <MailIcon className="w-5 h-5" />
                  Mandar email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}