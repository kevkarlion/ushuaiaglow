'use client';

import { useEffect, useState } from 'react';
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

  const featuredProducts = products.slice(0, 8);

  return (
    <section className="py-20 bg-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Apple style tight line-height */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-surface-darker leading-[1.1] tracking-tight mb-3">
            Productos <span className="text-primary">Destacados</span>
          </h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            Descubrí nuestra selección de productos premium para el cuidado de tu piel
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay productos disponibles</p>
          </div>
        )}

        {/* View All - Apple pill style */}
        <div className="text-center mt-12">
          <Link
            href="/productos"
            className="inline-flex items-center justify-center px-6 py-3 text-primary font-normal hover:underline underline-offset-4 transition-all"
          >
            Ver todos los productos
            <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}