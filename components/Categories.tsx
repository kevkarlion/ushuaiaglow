import Link from 'next/link';

const categories = [
  { 
    name: 'Cuidado Facial', 
    slug: 'facial',
    description: 'Cremas, sérums y máscaras',
    bg: 'bg-black',
    light: true,
  },
  { 
    name: 'Cuidado Corporal', 
    slug: 'body',
    description: 'Cremas y aceites',
    bg: 'bg-black',
    light: false,
  },
  { 
    name: 'Cuidado Capilar', 
    slug: 'hair',
    description: 'Shampoo y tratamientos',
    bg: 'bg-black',
    light: true,
  },
  { 
    name: 'Maquillaje', 
    slug: 'makeup',
    description: 'Bases y labiales',
    bg: 'bg-black',
    light: false,
  },
];

export default function Categories() {
  return (
    <section className="bg-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-surface-darker leading-[1.1] tracking-tight mb-3">
            Categorías
          </h2>
          <p className="text-gray-500 text-sm">
            Encontrá todo lo que necesitás para tu rutina de belleza
          </p>
        </div>

        {/* Categories Grid - Apple 2x2 style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group relative aspect-square rounded-lg overflow-hidden"
            >
              {/* Background */}
              <div className={`absolute inset-0 ${category.bg} group-hover:bg-primary transition-colors duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                <h3 className="text-base font-semibold text-white leading-[1.14]">{category.name}</h3>
                <p className="text-xs text-white/50 mt-1">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}