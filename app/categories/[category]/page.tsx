'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorySlug, setCategorySlug] = useState('');

  useEffect(() => {
    async function fetchData() {
      const { category } = await params;
      setCategorySlug(category);
      
      try {
        const res = await fetch('http://localhost:3000/api/products');
        const data = await res.json();
        
        const categoryMap: Record<string, string> = {
          'face': 'Cuidado Facial',
          'facial': 'Cuidado Facial',
          'body': 'Cuidado Corporal',
          'corporal': 'Cuidado Corporal',
          'hair': 'Cuidado Capilar',
          'capilar': 'Cuidado Capilar',
          'makeup': 'Maquillaje',
        };
        
        const categoryName = categoryMap[category.toLowerCase()] || category;
        const filtered = data.filter((p: Product) => p.category === categoryName);
        setProducts(filtered);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params]);

  const categoryTitles: Record<string, string> = {
    'face': 'Cuidado Facial',
    'facial': 'Cuidado Facial',
    'body': 'Cuidado Corporal',
    'corporal': 'Cuidado Corporal',
    'hair': 'Cuidado Capilar',
    'capilar': 'Cuidado Capilar',
    'makeup': 'Maquillaje',
  };

  const categoryTitle = categoryTitles[categorySlug.toLowerCase()] || categorySlug;

  return (
    <div className="min-h-screen bg-surface-light">
      {/* Header - Apple style */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-surface-darker leading-[1.1] tracking-tight">
            {categoryTitle}
          </h1>
          <p className="text-gray-500 mt-1">
            {products.length} productos disponibles
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
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
  );
}