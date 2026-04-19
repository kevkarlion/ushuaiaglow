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

  useEffect(() => {
    async function fetchCombos() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          setCombos([]);
          return;
        }
        const data = await res.json();
        
        // Filtrar solo los productos que son combos (isCombo = true o category = 'Combo')
        const filteredCombos = (Array.isArray(data) ? data : [])
          .filter((p: Product) => p.isCombo === true || p.category?.toLowerCase() === 'combo')
          .map((c: Product): ComboDisplay => {
            // Parsear productsIncluded - puede ser string, array, o undefined
            let productsArr: string[] = [];
            const pi = c.productsIncluded as any;
            
            if (Array.isArray(pi)) {
              productsArr = pi;
            } else if (typeof pi === 'string' && pi) {
              try {
                productsArr = JSON.parse(pi);
              } catch {
                productsArr = [];
              }
            }
            
            return {
              ...c,
              products: productsArr.map((id: string) => ({ name: 'Producto', image: '' })),
            };
          });
        
        setCombos(filteredCombos);
      } catch (error) {
        console.error('Error fetching combos:', error);
        setCombos([]);
      }
    }
    fetchCombos();
  }, []);

  // Combos hardcodeados (fallback si no hay datos en DB)
  const defaultCombos: ComboDisplay[] = [
    {
      id: '1',
      title: 'Rutina Facial Básica',
      description: 'Todo lo que necesitás para una rutina diaria de limpieza e hidratación.',
      price: 15990,
      originalPrice: 21900,
      discount: 27,
      category: 'Combo',
      brand: 'Ushuaia',
      stock: 10,
      images: ['/productos/combo-full.jpeg'],
      products: [
        { name: 'Mascarilla Arcilla', image: '/productos/mascarilla.jpeg' },
        { name: 'Protector Solar', image: '/productos/protector-solar.jpeg' },
      ],
      isCombo: true,
      productsIncluded: [],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '2',
      title: 'Beauty Glow',
      description: 'Sérum de vitaminas + protector solar para un glow natural.',
      price: 18990,
      originalPrice: 25900,
      discount: 27,
      category: 'Combo',
      brand: 'Ushuaia',
      stock: 10,
      images: ['/productos/combo2.jpeg'],
      products: [
        { name: 'Sérum Vit C', image: '/productos/serum.jpeg' },
        { name: 'Protector SPF 50', image: '/productos/protector-solar.jpeg' },
      ],
      isCombo: true,
      productsIncluded: [],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '3',
      title: 'Hidratación Total',
      description: 'Tratamiento intensivo para piel seca y deshidratada.',
      price: 22990,
      originalPrice: 31900,
      discount: 28,
      category: 'Combo',
      brand: 'Ushuaia',
      stock: 10,
      images: ['/productos/combo-full.jpeg'],
      products: [
        { name: 'Mascarilla', image: '/productos/mascarilla.jpeg' },
        { name: 'Sérum', image: '/productos/serum.jpeg' },
        { name: 'Protector', image: '/productos/protector-solar.jpeg' },
      ],
      isCombo: true,
      productsIncluded: [],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '4',
      title: 'Anti-Aging Premium',
      description: 'Los favoritos para combatir los signos del tiempo.',
      price: 27990,
      originalPrice: 38900,
      discount: 28,
      category: 'Combo',
      brand: 'Ushuaia',
      stock: 10,
      images: ['/productos/combo2.jpeg'],
      products: [
        { name: 'Sérum C', image: '/productos/serum.jpeg' },
        { name: 'Protector', image: '/productos/protector-solar.jpeg' },
        { name: 'Vincha', image: '/productos/vincha.jpeg' },
      ],
      isCombo: true,
      productsIncluded: [],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '5',
      title: 'Spa en Casa',
      description: 'Kit completo para un momento de relax y autocuidado.',
      price: 14990,
      originalPrice: 19900,
      discount: 25,
      category: 'Combo',
      brand: 'Ushuaia',
      stock: 10,
      images: ['/productos/combo-full.jpeg'],
      products: [
        { name: 'Mascarilla Arcilla', image: '/productos/mascarilla.jpeg' },
        { name: 'Vincha', image: '/productos/vincha.jpeg' },
      ],
      isCombo: true,
      productsIncluded: [],
      createdAt: '',
      updatedAt: '',
    },
  ];

  // Combos: primero los de DB, luego los hardcodeados
  const displayCombos = [...combos, ...defaultCombos];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCombos.map((combo) => (
            <Link 
              key={combo.id} 
              href={`/combos/${combo.id}`}
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
                  <span className="text-xl font-bold text-white">${combo.price.toLocaleString('es-AR')}</span>
                  {combo.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">${combo.originalPrice.toLocaleString('es-AR')}</span>
                  )}
                </div>

                {/* Click to see details */}
                <p className="text-sm text-primary">Ver detalle →</p>
              </div>
            </Link>
          ))}
        </div>
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
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Contactanos
          </Link>
        </div>
      </div>
    </div>
  );
}