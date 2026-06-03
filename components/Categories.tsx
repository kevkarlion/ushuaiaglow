'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  { name: 'Combos', slug: 'combos', description: 'La Vedet - packs exclusivos' },
  { name: 'Cuidado Facial', slug: 'facial', description: 'Cremas, sérums y máscaras' },
  { name: 'Accesorios', slug: 'accesorios', description: 'Todo para tu rutina' },
];

const categoryColors: Record<string, string> = {
  combos: 'from-amber-500 to-amber-800',
  facial: 'from-rose-500 to-rose-800',
  accesorios: 'from-violet-500 to-violet-800',
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function Categories() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Section Header */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
          <h2 className="text-[32px] md:text-[48px] font-bold text-[#222222] leading-[1.1] tracking-tight mb-3">
            Categorías
          </h2>
          <p className="text-[#888888] text-sm">
            Encontrá todo lo que necesitás para tu rutina de belleza
          </p>
        </motion.div>

        {/* Categories Grid - 3 centered cards, bigger on desktop */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category) => (
            <motion.div key={category.slug} variants={fadeUp}>
              <Link
                href={`/categorias/${category.slug}`}
                className={`relative aspect-[3/2] md:aspect-[4/3] rounded-2xl overflow-hidden border border-white/30 shadow-2xl bg-gradient-to-br ${categoryColors[category.slug]} flex flex-col items-center justify-center p-6 md:p-10`}
              >
                  <h3 className="text-2xl md:text-4xl font-bold text-white leading-[1.14] tracking-tight">{category.name}</h3>
                  <p className="text-sm md:text-lg text-white/60 mt-2">{category.description}</p>
                </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}