'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        
        if (!res.ok) {
          console.error('API error:', res.status, res.statusText);
          setProducts([]);
          setLoading(false);
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

  const categorySet = new Set(products.map(p => p.category).filter((c): c is string => !!c));
  const categories = ['all', ...Array.from(categorySet)];
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-surface-light">
      {/* Header - Apple style */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-surface-darker leading-[1.1] tracking-tight">
            Todos los productos
          </h1>
          <p className="text-gray-500 mt-1">
            {filteredProducts.length} productos disponibles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Apple style */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 sticky top-20">
              <h3 className="text-xs font-semibold text-surface-darker mb-3">Categorías</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedCategory === category
                        ? 'bg-surface-light text-surface-darker font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category === 'all' ? 'Todos' : category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay productos en esta categoría</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}