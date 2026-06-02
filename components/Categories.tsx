'use client';

import { motion } from 'framer-motion';
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function Categories() {
  return (
    <section className="bg-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Section Header */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-surface-darker leading-[1.1] tracking-tight mb-3">
            Categorías
          </h2>
          <p className="text-white/50 text-sm">
            Encontrá todo lo que necesitás para tu rutina de belleza
          </p>
        </motion.div>

        {/* Categories Grid - 3 centered cards, bigger on desktop */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category) => (
            <motion.div key={category.slug} variants={fadeUp}>
              <Link
                href={`/categorias/${category.slug}`}
                className="group relative aspect-[3/2] md:aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-primary/50 transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5"
              >
                {/* Background */}
                <div className={`absolute inset-0 ${category.bg} group-hover:bg-primary transition-colors duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 md:p-10">
                  <h3 className="text-2xl md:text-4xl font-semibold text-white leading-[1.14] tracking-tight">{category.name}</h3>
                  <p className="text-sm md:text-lg text-white/50 mt-2">{category.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}