'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          setProducts([]);
          return;
        }
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.08 } }
  };

  const featuredProducts = products.slice(0, 8);

  return (
    <section className="py-24 bg-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Apple style tight line-height */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-surface-darker leading-[1.1] tracking-tight mb-3">
            Productos <span className="text-primary">Destacados</span>
          </h2>
          <p className="text-white/50 text-sm max-w-2xl mx-auto">
            Descubrí nuestra selección de productos premium para el cuidado de tu piel
          </p>
        </motion.div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/[0.04] rounded-xl p-4 animate-pulse">
                <div className="aspect-square bg-white/10 rounded-lg mb-4"></div>
                <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
                <div className="h-5 bg-white/10 rounded w-2/3 mb-2"></div>
                <div className="h-10 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/40">No hay productos disponibles</p>
          </div>
        )}

        {/* View All - Apple pill style */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-12">
          <Link
            href="/productos"
            className="inline-flex items-center justify-center px-6 py-3 text-primary font-medium rounded-xl hover:bg-primary/10 transition-all duration-500 ease-premium group"
          >
            Ver todos los productos
            <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300 ease-premium">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}