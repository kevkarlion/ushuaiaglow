'use client';

import Link from 'next/link';
import { MessageCircle as WhatsAppIcon, Mail as MailIcon, MapPin as PinIcon, ArrowRight as ArrowIcon } from 'lucide-react';

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
                    <a href="https://wa.me/5492984210435" className="text-white font-medium hover:text-primary transition-colors text-lg block">
                      +54 9 2984-210435
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <MailIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <a href="mailto:info@ushuaiaglow.com" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-primary transition-colors text-lg block">
                      info@ushuaiaglow.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <PinIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Dirección</p>
                    <p className="text-white font-medium">General Roca, Río Negro, Argentina</p>
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
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="18" cy="6" r="1" fill="currentColor" />
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
                <a href="https://wa.me/5492984210435" 
                  className="flex items-center justify-center gap-3 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors">
                  <WhatsAppIcon className="w-5 h-5" />
                  Escribir por WhatsApp
                </a>
                <a href="mailto:info@ushuaiaglow.com" 
                  target="_blank" rel="noopener noreferrer"
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