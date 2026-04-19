import Link from 'next/link';

const categories = [
  { 
    name: 'Cuidado Facial', 
    slug: 'facial',
    description: 'Cremas, sérums y máscaras',
    bg: 'bg-surface-light',
  },
  { 
    name: 'Cuidado Corporal', 
    slug: 'body',
    description: 'Cremas y aceites',
    bg: 'bg-black',
  },
  { 
    name: 'Cuidado Capilar', 
    slug: 'hair',
    description: 'Shampoo y tratamientos',
    bg: 'bg-surface-light',
  },
  { 
    name: 'Maquillaje', 
    slug: 'makeup',
    description: 'Bases y labiales',
    bg: 'bg-black',
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-surface-darker/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-white leading-[1.1] tracking-tight">
            Categorías
          </h1>
          <p className="text-gray-500 mt-1">
            Explorar por categoría
          </p>
        </div>
      </div>

      {/* Categories Grid - Apple 2x2 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group relative aspect-square rounded-lg overflow-hidden"
            >
              {/* Background */}
              <div className={`absolute inset-0 ${category.bg}`}></div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                <h3 className="text-lg font-semibold text-white leading-[1.14]">{category.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{category.description}</p>
              </div>
              
              {/* Hover */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300"></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}