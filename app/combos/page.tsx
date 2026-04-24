'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';

interface ComboDisplay extends Product {
  products: { name: string; image: string }[];
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
            
            // Buscar cada producto para obtener su imagen
            const productsWithImages = productsArr.map((name: string) => {
              const productName = name.trim();
              const matched = (allProducts as Product[]).find(
                p => p.title?.toLowerCase() === productName.toLowerCase()
              );
              return {
                name: productName,
                image: matched?.images?.[0] || '',
              };
            });
            
            return {
              ...c,
              products: productsWithImages,
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

  // Combos hardcodeados (nuevos valores - precios en pesos argentinos)
  const defaultCombos: ComboDisplay[] = [
    {
      id: '1',
      slug: 'basico',
      title: 'Básico',
      description: 'Serum + Gel. Rutina diaria básica de limpieza e hidratación.',
      price: 24500,
      originalPrice: 30000,
      discount: 18,
      category: 'Combo',
      brand: 'Ushuaia',
      stock: 10,
      images: ['/productos/combo-full.jpeg'],
      products: [
        { name: 'Serum', image: '/productos/serum.jpeg' },
        { name: 'Gel', image: '/productos/gel.jpeg' },
      ],
      isCombo: true,
      productsIncluded: [],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '2',
      slug: 'proteccion-tratamiento',
      title: 'Protección + Tratamiento',
      description: 'Protector + Serum. Cuidado diario con protección solar.',
      price: 30500,
      originalPrice: 38000,
      discount: 20,
      category: 'Combo',
      brand: 'Ushuaia',
      stock: 10,
      images: ['/productos/combo2.jpeg'],
      products: [
        { name: 'Protector Solar', image: '/productos/protector-solar.jpeg' },
        { name: 'Sérum', image: '/productos/serum.jpeg' },
      ],
      isCombo: true,
      productsIncluded: [],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '3',
      slug: 'hidratacion-intensiva',
      title: 'Hidratación Intensiva',
      description: 'Serum + Gel + Mascarilla. Tratamiento completo.',
      price: 28500,
      originalPrice: 35000,
      discount: 19,
      category: 'Combo',
      brand: 'Ushuaia',
      stock: 10,
      images: ['/productos/combo-full.jpeg'],
      products: [
        { name: 'Sérum', image: '/productos/serum.jpeg' },
        { name: 'Gel', image: '/productos/gel.jpeg' },
        { name: 'Mascarilla', image: '/productos/mascarilla.jpeg' },
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
      description: 'Serum + Gel + Mascarilla + Vincha. Kit de relajación completo.',
      price: 36500,
      originalPrice: 45000,
      discount: 19,
      category: 'Combo',
      brand: 'Ushuaia',
      stock: 10,
      images: ['/productos/combo2.jpeg'],
      products: [
        { name: 'Sérum', image: '/productos/serum.jpeg' },
        { name: 'Gel', image: '/productos/gel.jpeg' },
        { name: 'Mascarilla', image: '/productos/mascarilla.jpeg' },
        { name: 'Vincha', image: '/productos/vincha.jpeg' },
      ],
      isCombo: true,
      productsIncluded: [],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '6',
      slug: 'premium',
      title: 'Premium',
      description: 'Serum + Gel + Vincha + Protector + Mascarilla. El kit completo.',
      price: 46500,
      originalPrice: 58000,
      discount: 20,
      category: 'Combo',
      brand: 'Ushuaia',
      stock: 10,
      images: ['/productos/combo-full.jpeg'],
      products: [
        { name: 'Sérum', image: '/productos/serum.jpeg' },
        { name: 'Gel', image: '/productos/gel.jpeg' },
        { name: 'Vincha', image: '/productos/vincha.jpeg' },
        { name: 'Protector Solar', image: '/productos/protector-solar.jpeg' },
        { name: 'Mascarilla', image: '/productos/mascarilla.jpeg' },
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
              className="group bg-surface-darker/30 rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all block"
            >
              {/* Combo Image */}
              <div className="relative aspect-video bg-surface-light">
                <Image
                  src={combo.images?.[0]?.startsWith('/') || combo.images?.[0]?.startsWith('http') ? combo.images[0] : '/productos/combo-full.jpeg'}
                  alt={combo.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute top-3 right-3 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{combo.discount || 0}%
                </div>
              </div>

              {/* Combo Info */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                    {combo.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{combo.description}</p>
                </div>

                {/* Products included */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Incluye:</span>
                  <div className="flex -space-x-2">
                    {combo.products.map((p, idx) => (
                      <div 
                        key={idx} 
                        className="w-8 h-8 rounded-full bg-surface-light border-2 border-surface-darker overflow-hidden relative"
                        title={p.name}
                      >
                        {p.image ? (
                          <Image src={p.image} alt={p.name} fill sizes="32px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
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

                {/* Price */}
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-white">${(combo.price || 0).toLocaleString('es-AR')}</span>
                  {combo.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">${(combo.originalPrice || 0).toLocaleString('es-AR')}</span>
                  )}
                </div>

                {/* Click to see details */}
                <p className="text-sm text-primary">Ver detalle →</p>
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