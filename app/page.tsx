import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';
import { ArrowRight, Zap, Timer } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Hero />
      
      {/* Combos CTA Section - optimizado CRO */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* 1. RESULTADO - Título persuasivo */}
            <h2 className="text-3xl md:text-4xl font-bold text-surface-darker leading-[1.1] tracking-tight mb-3">
              Tu rutina completa en un solo <span className="text-primary">combo</span>
            </h2>
            
            {/* 2. BENEFICIO - Subtexto emotivo */}
            <p className="text-gray-600 max-w-2xl mx-auto mb-4">
              Combos pensados para simplificar tu rutina y lograr resultados visibles sin complicaciones.
            </p>
            
            {/* 3. OFERTA + URGENCIA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#35de80] text-black font-bold rounded-full shadow-lg shadow-green-500/30">
                <Zap className="w-4 h-4" strokeWidth={2} />
                Ahorrá hasta 25%
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-orange-600 font-medium">
                <Timer className="w-4 h-4" />
                Stock limitado
              </span>
            </div>
            
            {/* 4. CTA - Persuasivo */}
            <a
              href="/combos"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface-darker hover:bg-primary text-white font-bold rounded-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Elegir mi rutina
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
      
      <FeaturedProducts />
      
      <Categories />
      
      {/* Promotions Section - Apple dark style */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-white/10 text-primary text-xs font-medium rounded-full mb-4">
              Oferta Limitada
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white leading-[1.1] tracking-tight mb-3">
              Hasta 25% de descuento
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Aprovechá nuestras ofertas exclusivas en productos seleccionados.
            </p>
            <a
              href="/productos"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-normal rounded-lg transition-colors"
            >
              Ver Ofertas
            </a>
          </div>
        </div>
      </section>
    </>
  );
}