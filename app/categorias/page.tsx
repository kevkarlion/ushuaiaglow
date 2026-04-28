import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categorías',
  description: 'Explorar por categoría',
  keywords: ['categorías skincare', 'cuidado facial', 'accesorios belleza'],
};

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

      {/* Categories Grid - 3 centered cards, bigger on desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
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
              
              {/* Hover */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300"></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}