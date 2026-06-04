'use client';

import { useState, useEffect } from 'react';
import { Product, getMainImage } from '@/types/product';
import ComboDetail from '@/components/ComboDetail';
import { trackViewItem, buildGA4Item } from '@/lib/ga4-ecommerce';
import { trackViewContent } from '@/lib/meta-pixel';

interface ComboProduct {
  name: string;
  description: string;
  image: string;
  benefit: string;
}

interface Combo {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  benefits: string[];
  price: number;
  originalPrice: number;
  discount: number;
  products: ComboProduct[];
  image: string;
  stock: number;
  // Nuevos campos
  tagline?: string;
  queEs?: string;
  commercialDescription?: string;
  featuredReview?: {
    text: string;
    author: string;
  };
  rating?: number;
  // Datos adicionales
  howToUse?: string;
  ingredients?: string;
  warnings?: string;
  weight?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ComboDetailPage({ params }: PageProps) {
  const [combo, setCombo] = useState<Combo | null>(null);
  const [relatedCombos, setRelatedCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function fetchCombo() {
      try {
        const { id } = await params;
        
        const res = await fetch('/api/products');
        const allProducts = await res.json();
        
        if (!mounted) return;
        
        const found = (allProducts as Product[]).find(
          p => (p.id === id || p.slug === id) && (p.isCombo === true || p.category?.toLowerCase() === 'combo')
        );
        
        if (!found) {
          setCombo(null);
          setLoading(false);
          return;
        }
        
        // Obtener los nombres de productos incluidos
        const includedNames: string[] = [];
        // Primero intentar productsIncluded
        const pi = found.productsIncluded as string | undefined;
        if (Array.isArray(pi)) {
          includedNames.push(...pi);
        } else if (typeof pi === 'string' && pi) {
          try {
            const parsed = JSON.parse(pi);
            if (Array.isArray(parsed)) includedNames.push(...parsed);
          } catch {
            includedNames.push(...pi.split(','));
          }
        }
        
        // Si no hay productos, intentar con ingredients
        if (includedNames.length === 0 && found.ingredients) {
          const ing = found.ingredients;
          try {
            const parsed = JSON.parse(ing);
            if (Array.isArray(parsed)) includedNames.push(...parsed);
          } catch {
            // ingredients puede ser texto separated by commas or newlines
            includedNames.push(...ing.split(/[,\n]/).map(s => s.trim()).filter(Boolean));
          }
        }
        
        // Buscar cada producto incluido para obtener su imagen
        const comboProducts: ComboProduct[] = includedNames.map((name: string) => {
          const productName = name.trim().toLowerCase();
          const normalizedProductName = productName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          
          // Palabras a ignorar en la búsqueda
          const stopWords = ['de', 'la', 'el', 'en', 'ml', 'gr', '150ml', '250ml', '50ml', '100ml', 'para', 'facial', 'corp'];
          
          // Limpiar el nombre de producto
          const cleanNameWords = normalizedProductName
            .split(/\s+/)
            .filter(w => w.length > 2 && !stopWords.includes(w));
          
          // Buscar coincidencia exacta por título o slug
          let matched = (allProducts as Product[]).find(p => {
            const titleLower = p.title?.toLowerCase() || '';
            const slugLower = p.slug?.toLowerCase() || '';
            const normalizedTitle = titleLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const normalizedSlug = slugLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            
            return normalizedTitle === normalizedProductName || 
                   normalizedSlug === normalizedProductName ||
                   normalizedProductName === normalizedTitle ||
                   normalizedProductName === normalizedSlug;
          });
          
          // Si no hay coincidencia exacta, buscar por palabras clave principales
          if (!matched && cleanNameWords.length > 0) {
            // Ordenar productos por relevancia: priorizar los que tienen más palabras coincidentes
            const scoredProducts = (allProducts as Product[]).map(p => {
              const titleLower = p.title?.toLowerCase() || '';
              const slugLower = p.slug?.toLowerCase() || '';
              const normalizedTitle = titleLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              const normalizedSlug = slugLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              
              const titleWords = normalizedTitle.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));
              const slugWords = normalizedSlug.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));
              
              // Contar cuántas palabras clave coinciden
              const matchesInTitle = cleanNameWords.filter(nw => 
                titleWords.some(tw => tw.includes(nw) || nw.includes(tw))
              ).length;
              
              const matchesInSlug = cleanNameWords.filter(nw => 
                slugWords.some(tw => tw.includes(nw) || nw.includes(tw))
              ).length;
              
              return { product: p, score: Math.max(matchesInTitle, matchesInSlug) };
            });
            
            // Ordenar por score descendente y tomar el mejor si tiene al menos 1 coincidencia
            scoredProducts.sort((a, b) => b.score - a.score);
            if (scoredProducts[0]?.score >= 1) {
              matched = scoredProducts[0].product;
            }
          }
          
          // Si encontró un match pero el score es muy bajo, no usar imagen
          if (!matched) {
            // Buscar de nuevo con lógica más permisiva solo para mostrar en consola
            console.log(`Combo product not found: "${productName}"`);
          }
          
          let image = '';
          if (matched?.images && matched.images.length > 0) {
            const firstImage = matched.images[0];
            // Handle both string and ProductImage formats
            const url = typeof firstImage === 'string' ? firstImage : (firstImage as any)?.url;
            if (url && (url.startsWith('/') || url.startsWith('http'))) {
              image = url;
            }
          }
          
          return {
            name: productName,
            description: matched?.description || '',
            image,
            benefit: matched?.category || 'Incluido',
          };
        });
        
        const comboData: Combo = {
          id: found.id,
          slug: found.slug || found.id,
          title: found.title,
          subtitle: found.brand || 'Combo Especial',
          description: found.description || '',
          fullDescription: (found as any).fullDescription || found.commercialDescription || '',
          benefits: (found as any).benefits || [],
          price: found.price,
          originalPrice: found.originalPrice || found.price * 1.3,
          discount: found.discount || Math.round((1 - found.price / (found.originalPrice || found.price * 1.3)) * 100),
          image: (found.images?.[0] && typeof found.images[0] === 'string' ? found.images[0] : (found.images?.[0] as any)?.url) || '/productos/combo-full.jpeg',
          products: comboProducts,
          stock: found.stock || 10,
          // Nuevos campos
          tagline: found.tagline || '',
          queEs: found.queEs || '',
          commercialDescription: found.commercialDescription || '',
          featuredReview: found.featuredReview || undefined,
          rating: found.rating || undefined,
          // Datos adicionales
          howToUse: found.howToUse || '',
          ingredients: found.ingredients || '',
          warnings: found.warnings || '',
          weight: found.weight || '',
        };
        
        // Agregar benefits y fullDescription según el slug/título
        const titleLower = found.title?.toLowerCase() || '';
        const slugLower = found.slug?.toLowerCase() || '';
        
        const comboBenefitsMap: Record<string, { benefits: string[]; fullDescription: string }> = {
          'basico': {
            fullDescription: 'Dúo hidratante que equilibra, suaviza e ilumina la piel en pocos pasos.',
            benefits: ['Hidratación profunda', 'Ilumina la piel', 'Textura suave', 'Rutina rápida']
          },
          'proteccion': {
            fullDescription: 'Dúo esencial que protege e ilumina la piel todos los días.',
            benefits: ['Protección UV', 'Previene manchas', 'Antioxidante', 'Piel luminosa']
          },
          'rutina': {
            fullDescription: 'Combo básico de skincare que hidrata, ilumina y revitaliza la piel.',
            benefits: ['Hidratación intensa', 'Revitaliza', 'Piel suave', 'Resultados visibles']
          },
          'spa': {
            fullDescription: 'Combo esencial que hidrata, ilumina y revitaliza en pocos pasos.',
            benefits: ['Hidratación profunda', 'Ilumina e hidrata', 'Aplicación cómoda', 'Rutina completa']
          },
          'full': {
            fullDescription: 'Combo completo que limpia, hidrata, protege e ilumina la piel.',
            benefits: ['Protección solar', 'Hidratación total', 'Antioxidante', 'Acción múltiple']
          },
        };
        
        for (const [key, value] of Object.entries(comboBenefitsMap)) {
          if (slugLower.includes(key) || titleLower.includes(key)) {
            if (!comboData.fullDescription) comboData.fullDescription = value.fullDescription;
            if (comboData.benefits.length === 0) comboData.benefits = value.benefits;
            break;
          }
        }
        
        setCombo(comboData);
        
        // Track analytics
        trackViewItem({
          currency: 'ARS',
          value: found.price,
          items: [buildGA4Item(found.id, found.title, found.price, 1, 'combo', found.brand)]
        });
        trackViewContent(found.id, found.title, found.price);
        
        // Cargar combos relacionados
        const related = (allProducts as Product[]).filter(
          p => (p.isCombo === true || p.category?.toLowerCase() === 'combo') && p.id !== found.id
        ).slice(0, 4).map(p => ({
          id: p.id,
          slug: p.slug || p.id,
          title: p.title,
          subtitle: p.brand || 'Combo',
          description: p.description || '',
          fullDescription: '',
          benefits: [],
          price: p.price,
          originalPrice: p.originalPrice || p.price * 1.3,
          discount: p.discount || 0,
          products: [],
          image: getMainImage(p.images) || '/productos/combo-full.jpeg',
          stock: p.stock || 10,
        }));
        setRelatedCombos(related);
        
      } catch (error) {
        console.error('Error:', error);
        setCombo(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    fetchCombo();
    return () => { mounted = false; };
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#222222]/40 text-sm">Cargando combo...</p>
        </div>
      </div>
    );
  }

  if (!combo) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center border border-black/[0.06]">
            <svg className="w-10 h-10 text-[#222222]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-[#222222] mb-3">Combo no encontrado</h1>
          <p className="text-[#222222]/40 mb-6">El combo que buscas no existe o fue removido.</p>
          <a 
            href="/combos" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            ← Ver combos
          </a>
        </div>
      </div>
    );
  }

  return <ComboDetail combo={combo} relatedCombos={relatedCombos} />;
}