'use client';

import Image from 'next/image';
import Link from 'next/link';
import { 
  LucideCheck, 
  LucideDollarSign, 
  LucideUsers, 
  LucideMapPin,
  LucideMessageCircle as WhatsAppIcon,
  LucideMail as MailIcon,
  LucideArrowRight as ArrowIcon
} from 'lucide-react';

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-surface-darker/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-white leading-[1.1] tracking-tight">
            Nosotros
          </h1>
          <p className="text-gray-400 mt-2">
            Conocenos un poco más
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Historia */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
              Nacimos en la Patagonia
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Somos una empresa ubicada en la ciudad de General Roca, Provincia de Río Negro, en el corazón de la Patagonia argentina. 
              Vivimos rodeados de paisajes únicos y gente noble, y eso se refleja en nuestra forma de trabajar: con honestidad, 
              compromiso y atención personalizada.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Creemos que el cuidado personal no tiene por qué ser complicado. Por eso seleccionamos productos de belleza 
              y cuidado corporal de calidad, simplicidad en las rutinas y resultados reales que se ven y sienten.
            </p>
          </div>
          <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-surface-darker">
            <Image
              src="/us-logo-final.png"
              alt="Ushuaia - Cuidado Natural"
              fill
              className="object-contain p-8"
            />
          </div>
        </div>

        {/* Valores */}
        <div className="mb-16">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-8 text-center">
            Nuestros pilares
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-darker/30 p-6 rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <LucideCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-white font-semibold mb-2">Calidad</h3>
              <p className="text-gray-400 text-sm">
                Solo productos seleccionados que realmente funcionan.
              </p>
            </div>
            <div className="bg-surface-darker/30 p-6 rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <LucideDollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-white font-semibold mb-2">Precios justos</h3>
              <p className="text-gray-400 text-sm">
                Belleza accesible para todos.
              </p>
            </div>
            <div className="bg-surface-darker/30 p-6 rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <LucideUsers className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-white font-semibold mb-2">Atención cercana</h3>
              <p className="text-gray-400 text-sm">
                Te asesoramos personalmente.
              </p>
            </div>
            <div className="bg-surface-darker/30 p-6 rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <LucideMapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-white font-semibold mb-2">Patagonia</h3>
              <p className="text-gray-400 text-sm">
                Orgullosos de notre tierra.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
            ¿Querés saber más?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Escribinos por WhatsApp o email. Estamos para ayudarte.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="https://wa.me/5492984210435"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-white font-medium rounded-lg transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              WhatsApp
            </Link>
            <Link
              href="mailto:info@ushuaiaglow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
            >
              <MailIcon className="w-5 h-5" />
              Email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}