import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';

export default function HomePage() {
  return (
    <>
      <Hero />
      
      {/* Combos CTA Section - después del Hero */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full mb-4">
              Nuevos
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-surface-darker leading-[1.1] tracking-tight mb-3">
              Combos <span className="text-primary">Exclusivos</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Paquetes de productos con hasta 25% de descuento. 
              Ideales para iniciar tu rutina de cuidado.
            </p>
            <a
              href="/combos"
              className="inline-flex items-center justify-center px-6 py-3 bg-surface-darker hover:bg-primary text-white font-normal rounded-lg transition-colors"
            >
              Ver Combos
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