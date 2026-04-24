import Link from 'next/link';

const categories = [
  { 
    name: 'Combos', 
    slug: 'combos',
    description: 'La Vedet - packs exclusivos',
    bg: 'bg-surface-darker',
  },
  { 
    name: 'Cuidado Facial', 
    slug: 'facial',
    description: 'Cremas, sérums y máscaras',
    bg: 'bg-surface-darker',
  },
  { 
    name: 'Accesorios', 
    slug: 'accesorios',
    description: 'Todo para tu rutina',
    bg: 'bg-surface-darker',
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

        {/* Categories Grid - 3 centered cards, bigger on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categorias/${category.slug}`}
              className="group relative aspect-[3/2] md:aspect-[4/3] rounded-lg overflow-hidden border border-white/10 hover:border-primary transition-all"
            >
              {/* Background */}
              <div className={`absolute inset-0 ${category.bg} group-hover:bg-primary transition-colors duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 md:p-10">
                <h3 className="text-2xl md:text-4xl font-semibold text-white leading-[1.14]">{category.name}</h3>
                <p className="text-sm md:text-lg text-white/60 mt-3">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}