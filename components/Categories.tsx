import Link from 'next/link';

const categories = [
  { name: 'Electrónica', image: 'M9.75 17L9 20l-1 1h8l-1-1-.75m-.75 3h-2.5a2.25 2.25 0 110-4.5h1.5a2.25 2.25 0 012.25 2.25v.5m-6 0a2.25 2.25 0 102.25 2.25h.5a2.25 2.25 0 002.25-2.25v-.5m-6 0V6.75A2.25 2.25 0 017.5 4.5h2.25a2.25 2.25 0 012.25 2.25V9', slug: 'electronics' },
  { name: 'Ropa', image: 'M12 16v-4m0-4V8a2 2 0 112 0v4m0-4v4M4 16v-3a4 4 0 014-4h8a4 4 0 014 4v3M4 16h16', slug: 'clothing' },
  { name: 'Hogar', image: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', slug: 'home' },
  { name: 'Deportes', image: 'M13 10V3L4 14h7v7l9-11h-7', slug: 'sports' },
];

export default function Categories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Categorías
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explorar por categoría
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group relative aspect-square bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-300 group-hover:text-primary-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d={category.image}
                  />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white font-semibold text-center">{category.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}