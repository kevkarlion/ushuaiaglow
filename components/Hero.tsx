import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1 bg-primary-100 text-primary-600 text-sm font-semibold rounded-full">
                ✨ Nueva colección 2026
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Productos <span className="text-primary-500">premium</span> para tu estilo
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Descubrí nuestra colección exclusiva. Calidad superior, diseño moderno y los mejores precios del mercado.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25"
              >
                Ver Productos
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold border border-gray-200 rounded-lg transition-all duration-200"
              >
                Explorar Categorías
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">500+</span>
                <span className="text-sm text-gray-500">Productos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">4.9</span>
                <span className="text-sm text-gray-500">★ Valoración</span>
              </div>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative">
            <div className="aspect-square lg:aspect-[4/5] bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4l-8-4m8 4l8-4" />
                  </svg>
                </div>
                <p className="text-primary-600 font-medium">Imagen Principal</p>
                <p className="text-sm text-primary-400">700x700px</p>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white px-6 py-3 rounded-lg shadow-lg">
              <p className="text-sm text-gray-500">Envío</p>
              <p className="font-bold text-gray-900">Gratis +50€</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}