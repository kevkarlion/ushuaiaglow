'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import ProductDetail from '@/components/ProductDetail';
import ProductDetailSkeleton from '@/components/ProductDetailSkeleton';
import { trackViewItem, buildGA4Item } from '@/lib/ga4-ecommerce';
import { trackViewContent } from '@/lib/meta-pixel';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function fetchProduct() {
      try {
        const { id } = await params;
        
        // Intentar primero como slug, luego como id antiguo
        let url = `/api/products/${id}`;
        let res = await fetch(url);
        
        // Fallback para slugs
        if (!res.ok) {
          const allRes = await fetch('/api/products');
          const allData = await allRes.json();
          if (!mounted) return;
          
          const found = (allData as Product[]).find(
            p => p.slug === id || p.id === id || (p as any)._id === id
          );
          
          if (found) {
            setProduct(found);
            
            // Track analytics
            trackViewItem({
              currency: 'ARS',
              value: found.price,
              items: [buildGA4Item(found.id, found.title, found.price, 1, found.category, found.brand)]
            });
            trackViewContent(found.id, found.title, found.price);
            
            // Cargar productos relacionados (misma categoría)
            const related = (allData as Product[]).filter(
              p => p.category === found.category && p.id !== found.id
            ).slice(0, 4);
            setRelatedProducts(related);
            
            setLoading(false);
            return;
          }
          
          setProduct(null);
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        if (!mounted) return;
        setProduct(data);
        
        // Track analytics
        trackViewItem({
          currency: 'ARS',
          value: data.price,
          items: [buildGA4Item(data.id, data.title, data.price, 1, data.category, data.brand)]
        });
        trackViewContent(data.id, data.title, data.price);
        
        // Cargar productos relacionados (misma categoría)
        const allRes = await fetch('/api/products');
        const allData = await allRes.json();
        const related = (allData as Product[]).filter(
          p => p.category === data.category && p.id !== data.id
        ).slice(0, 4);
        setRelatedProducts(related);
        
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    fetchProduct();
    return () => { mounted = false; };
  }, [params]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-sm">
            <svg className="w-10 h-10 text-[#222222]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-[#222222] mb-3">Producto no encontrado</h1>
          <p className="text-[#222222]/40 mb-6">El producto que buscas no existe o fue removido.</p>
          <a 
            href="/productos" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            ← Ver productos
          </a>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}