'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';

interface ComboDisplay extends Product {
  products: { name: string; displayName: string; image: string }[];
  benefits?: string[];
  fullDescription?: string;
}

// Función simple para posición de imagen
function getImagePosition(slug: string): string {
  return 'object-cover';
}

export default function CombosPage() {
  const [combos, setCombos] = useState<ComboDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCombos() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          setCombos([]);
          setLoading(false);
          return;
        }
        const allProducts = await res.json();
        
        const filteredCombos = (Array.isArray(allProducts) ? allProducts : [])
          .filter((p: Product) => p.isCombo === true || p.category?.toLowerCase() === 'combo')
          .map((c: Product): ComboDisplay => {
            let productsArr: string[] = [];
            const pi = c.productsIncluded as any;
            
            if (Array.isArray(pi)) {
              productsArr = pi;
            } else if (typeof pi === 'string' && pi) {
              try {
                productsArr = JSON.parse(pi);
              } catch {
                productsArr = pi.split(',');
              }
            }
            
            // Buscar cada producto para obtener su imagen (búsqueda flexible)
            const productsWithImages = productsArr.map((name: string) => {
              const productName = name.trim().toLowerCase();
              // Normalizar acentos
              const normalizedName = productName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              
              const matched = (allProducts as Product[]).find(p => {
                const titleLower = p.title?.toLowerCase() || '';
                const normalizedTitle = titleLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                
                const nameWords = normalizedName.split(/\s+/);
                const titleWords = normalizedTitle.split(/\s+/);
                
                const hasCommonWord = nameWords.some(nw => 
                  titleWords.some(tw => tw.length > 2 && (nw.includes(tw) || tw.includes(nw)))
                );
                
                return normalizedTitle.includes(normalizedName) || 
                       normalizedName.includes(normalizedTitle) ||
                       hasCommonWord;
              });
              
              // Obtener imagen válida
              let image = '';
              if (matched?.images && matched.images.length > 0) {
                const firstImage = matched.images[0];
                if (typeof firstImage === 'string' && (firstImage.startsWith('/') || firstImage.startsWith('http'))) {
                  image = firstImage;
                }
              }
              
              return {
                name: productName,
                displayName: productName.charAt(0).toUpperCase() + productName.slice(1),
                image,
              };
            });
            
            return {
              ...c,
              products: productsWithImages,
              benefits: (c as any).benefits || [],
              fullDescription: (c as any).fullDescription || c.description || '',
            };
          });
        
        setCombos(filteredCombos);
      } catch (error) {
        console.error('Error fetching combos:', error);
        setCombos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCombos();
  }, []);

  // Default combos (para cuando no hay combos en la DB)
  const defaultCombos: ComboDisplay[] = [
    {
      id: '1',
      slug: 'basico',
      title: 'Básico Glow',
      description: 'Dúo hidratante que equilibra, suaviza e ilumina la piel.',
      fullDescription: 'Dúo hidratante que equilibra, suaviza e ilumina la piel en pocos pasos. Combina sérum antioxidante y gel hidratante para una rutina liviana que deja el rostro fresco, uniforme y saludable todos los días.',
      benefits: ['Hidratación profunda', 'Ilumina la piel', 'Textura suave', 'Rutina rápida'],
      price: 24500,
      originalPrice: 30000,
      discount: 18,
      category: 'Combo',
      brand: 'Ushuaia',
      stock: 10,
      images: ['/productos/combo-full.jpeg'],
      products: [
        { name: 'serum', displayName: 'Sérum', image: '/productos/serum.jpeg' },
        { name: 'gel', displayName: 'Gel Hidratante', image: '/productos/gel.jpeg' },
      ],
      isCombo: true,
      productsIncluded: [],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '2',
      slug: 'proteccion-total',
      title: 'Protección Total',
      description: 'Dúo que protege e ilumina la piel todos los días.',
      fullDescription: 'Dúo esencial que protege e ilumina la piel todos los días. Combina sérum antioxidante con vitamina C y protector solar para prevenir manchas, cuidar frente a los rayos UV y mantener un rostro más luminoso y saludable.',
      benefits: ['Protección UV', 'Previene manchas', 'Antioxidante', 'Piel luminosa'],
      price: 30500,
      originalPrice: 38000,
      discount: 20,
      category: 'Combo',
      brand: 'Ushuaia',
      stock: 10,
      images: ['/productos/combo2-ok.jpeg'],
      products: [
        { name: 'protector solar', displayName: 'Protector Solar', image: '/productos/protector-solar.jpeg' },
        { name: 'serum', displayName: 'Sérum', image: '/productos/serum.jpeg' },
      ],
      isCombo: true,
      productsIncluded: [],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '3',
      slug: 'rutina-completa',
      title: 'Rutina Completa',
      description: 'Combo básico que hidrata, ilumina y revitaliza.',
      fullDescription: 'Combo básico de skincare que hidrata, ilumina y revitaliza la piel en una rutina simple y efectiva. Incluye sérum antioxidante, gel hidratante y mascarilla nutritiva para lograr una piel más suave, fresca y luminosa todos los días.',
      benefits: ['Hidratación intensa', 'Revitaliza', 'Piel suave', 'Resultados visibles'],
      price: 28500,
      originalPrice: 35000,
      discount: 19,
      category: 'Combo',
      brand: 'Ushuaia',
      stock: 10,
      images: ['/productos/combo-full.jpeg'],
      products: [
        { name: 'serum', displayName: 'Sérum', image: '/productos/serum.jpeg' },
        { name: 'gel', displayName: 'Gel Hidratante', image: '/productos/gel.jpeg' },
        { name: 'mascarilla', displayName: 'Mascarilla Facial', image: '/productos/mascarilla.jpeg' },
      ],
      isCombo: true,
      productsIncluded: [],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '4',
      slug: 'spa-en-casa',
      title: 'Spa en Casa',
      description: 'Combo esencial que hidrata, ilumina y revitaliza.',
      fullDescription: 'Combo esencial de skincare que hidrata, ilumina y revitaliza la piel en pocos pasos. Incluye sérum antioxidante, gel hidratante, mascarilla nutritiva y vincha para una rutina cómoda y efectiva. Ideal para lograr una piel más fresca, suave y luminosa todos los días.',
      benefits: ['Hidratación profunda', 'Ilumina e hidrata', 'Aplicación cómoda', 'Rutina completa'],
      price: 36500,
      originalPrice: 45000,
      discount: 19,
      category: 'Combo',
      brand: 'Ushuaia',
      stock: 10,
      images: ['/productos/combo2.jpeg'],
      products: [
        { name: 'serum', displayName: 'Sérum', image: '/productos/serum.jpeg' },
        { name: 'gel', displayName: 'Gel Hidratante', image: '/productos/gel.jpeg' },
        { name: 'mascarilla', displayName: 'Mascarilla Facial', image: '/productos/mascarilla.jpeg' },
        { name: 'vincha', displayName: 'Vincha Spa', image: '/productos/vincha.jpeg' },
      ],
      isCombo: true,
      productsIncluded: [],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '6',
      slug: 'full',
      title: 'Combo Full',
      description: 'Combo completo que limpia, hidrata, protege e ilumina.',
      fullDescription: 'Combo completo de skincare que limpia, hidrata, protege e ilumina la piel en una rutina simple y efectiva. Incluye sérum antioxidante, gel hidratante, protector solar, mascarilla revitalizante y vincha para una aplicación cómoda. Ideal para lograr una piel más luminosa, fresca y saludable todos los días.',
      benefits: ['Protección solar', 'Hidratación total', 'Antioxidante', 'Acción múltiple'],
      price: 46500,
      originalPrice: 58000,
      discount: 20,
      category: 'Combo',
      brand: 'Ushuaia',
      stock: 10,
      images: ['/productos/combo-full.jpeg'],
      products: [
        { name: 'serum', displayName: 'Sérum', image: '/productos/serum.jpeg' },
        { name: 'gel', displayName: 'Gel Hidratante', image: '/productos/gel.jpeg' },
        { name: 'vincha', displayName: 'Vincha Spa', image: '/productos/vincha.jpeg' },
        { name: 'protector solar', displayName: 'Protector Solar', image: '/productos/protector-solar.jpeg' },
        { name: 'mascarilla', displayName: 'Mascarilla Facial', image: '/productos/mascarilla.jpeg' },
      ],
      isCombo: true,
      productsIncluded: [],
      createdAt: '',
      updatedAt: '',
    },
  ];

  // Combos: primero los de DB, luego los hardcodeados
  const displayCombos = combos;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-surface-darker/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-white leading-[1.1] tracking-tight">
            Combos <span className="text-primary">Exclusivos</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Paquetes especiales con descuento
          </p>
        </div>
      </div>

      {/* Combos Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface-darker/30 rounded-xl overflow-hidden border border-white/5">
                <div className="aspect-video bg-surface-light animate-pulse"></div>
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-surface-light rounded w-1/2 animate-pulse"></div>
                  <div className="h-4 bg-surface-light rounded w-3/4 animate-pulse"></div>
                  <div className="h-8 bg-surface-light rounded w-1/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayCombos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No hay combos disponibles</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCombos.map((combo) => {
            // Usar slug si está disponible, si no usar id
            const comboSlug = combo.slug || combo.id;
            return (
            <Link 
              key={combo.id} 
              href={`/combos/${comboSlug}`}
              className="group bg-surface-darker/30 rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col"
            >
              {/* Mobile: Title + description first */}
              <div className="p-4 pb-2 md:hidden">
                <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                  {combo.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{combo.description}</p>
              </div>

              {/* Combo Image */}
              <div className="relative aspect-video bg-surface-light overflow-hidden flex-shrink-0 ">
                <Image
                  src={combo.images?.[0]?.startsWith('/') || combo.images?.[0]?.startsWith('http') ? combo.images[0] : '/productos/combo-full.jpeg'}
                  alt={combo.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={`${getImagePosition(comboSlug)}  group-hover:scale-105 transition-transform duration-500`}
                />
                <div className="absolute top-3 right-3 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                  -{combo.discount || 0}%
                </div>
              </div>

              {/* Content - Desktop: title inline, Mobile: stacked */}
              <div className="p-4 flex flex-col flex-1">
                {/* Desktop: Title + Price inline */}
                <div className="hidden md:flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                      {combo.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{combo.description}</p>
                  </div>
                  {/* Price - inline */}
                  <div className="relative bg-surface-darker/80 border border-white/10 rounded-lg px-3 py-2 text-right flex-shrink-0">
                    {combo.discount && combo.discount > 0 && (
                      <div className="absolute -top-2 right-2">
                        <span className="bg-primary text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                          -{combo.discount}%
                        </span>
                      </div>
                    )}
                    <span className="text-xl font-bold text-white block">
                      ${(combo.price || 0).toLocaleString('es-AR')}
                    </span>
                    {combo.originalPrice && combo.originalPrice > combo.price && (
                      <span className="text-xs text-white/40 line-through block">
                        ${(combo.originalPrice || 0).toLocaleString('es-AR')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Desktop: Products included */}
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-xs text-gray-500">Incluye:</span>
                  <div className="flex -space-x-2">
                    {combo.products.map((p, idx) => (
                      <div 
                        key={idx} 
                        className="w-8 h-8 rounded-full bg-surface-darker border-2 border-black overflow-hidden relative"
                        title={p.displayName || p.name}
                      >
                        {p.image && (p.image.startsWith('/') || p.image.startsWith('http')) ? (
                          <Image src={p.image} alt={p.displayName || p.name} fill sizes="32px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({combo.products.length} productos)
                  </span>
                </div>

                {/* Mobile: Products included + Price */}
                <div className="md:hidden space-y-3 mt-2">
                  {/* Products included */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500">Incluye:</span>
                    <div className="flex -space-x-2">
                      {combo.products.map((p, idx) => (
                        <div 
                          key={idx} 
                          className="w-8 h-8 rounded-full bg-surface-darker border-2 border-black overflow-hidden relative"
                          title={p.displayName || p.name}
                        >
                          {p.image && (p.image.startsWith('/') || p.image.startsWith('http')) ? (
                            <Image src={p.image} alt={p.displayName || p.name} fill sizes="32px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
                              {idx + 1}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({combo.products.length} productos)
                    </span>
                  </div>
                  
                  {/* Price + CTA */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-green-400">
                        💰 Ahorrás ${((combo.originalPrice || 0) - (combo.price || 0)).toLocaleString('es-AR')}
                      </p>
                      <p className="text-sm text-primary">Ver detalle →</p>
                    </div>
                    <div className="relative bg-surface-darker/80 border border-white/10 rounded-lg px-3 py-2 text-right flex-shrink-0">
                      {combo.discount && combo.discount > 0 && (
                        <div className="absolute -top-2 right-2">
                          <span className="bg-primary text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                            -{combo.discount}%
                          </span>
                        </div>
                      )}
                      <span className="text-xl font-bold text-white block">
                        ${(combo.price || 0).toLocaleString('es-AR')}
                      </span>
                      {combo.originalPrice && combo.originalPrice > combo.price && (
                        <span className="text-xs text-white/40 line-through block">
                          ${(combo.originalPrice || 0).toLocaleString('es-AR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop CTA */}
                <p className="hidden md:block text-sm text-primary group-hover:translate-x-1 transition-transform mt-auto pt-3">Ver detalle →</p>
              </div>
            </Link>
          );
          })}
        </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-surface-darker/30 border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            ¿Querés crear tu propio combo?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Escribinos y armamos un combo personalizado vos eligiendo los productos.
          </p>
          <Link
            href="/contacto"
            className="inline-block px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Contactanos
          </Link>
        </div>
      </div>
    </div>
  );
}