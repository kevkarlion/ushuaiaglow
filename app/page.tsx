import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Categories />
      
      {/* Promotions Section */}
      <section className="py-16 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-4 py-1 bg-white/20 text-white text-sm font-semibold rounded-full mb-4">
              ⚡ Oferta Limitada
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Hasta 30% de descuento
            </h2>
            <p className="text-primary-100 max-w-2xl mx-auto mb-8">
              Aprovecha nuestras ofertas exclusivas. Stocks limitados.
            </p>
            <a
              href="/offers"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Ver Ofertas
            </a>
          </div>
        </div>
      </section>
    </>
  );
}