'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { trackViewItemList, buildGA4Item } from '@/lib/ga4-ecommerce';
import { Search, Star, Package, Check, ArrowRight } from 'lucide-react';

interface ComboDisplay extends Product {
  products: { name: string; displayName: string; image: string }[];
  tagline?: string;
  rating?: number;
}

export default function CombosPage() {
  const [combos, setCombos] = useState<ComboDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
            
            const productsWithImages = productsArr.map((name: string) => {
              const productName = name.trim().toLowerCase();
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
              tagline: (c as any).tagline || c.description || '',
              rating: (c as any).rating,
            };
          });
        
        setCombos(filteredCombos);
        
        // Track analytics
        if (filteredCombos.length > 0) {
          trackViewItemList({
            item_list_id: 'combos_list',
            item_list_name: 'Combos',
            items: filteredCombos.map(c => 
              buildGA4Item(c.id, c.title, c.price, 1, 'combo', c.brand)
            )
          });
        }
      } catch (error) {
        console.error('Error fetching combos:', error);
        setCombos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCombos();
  }, []);

  // Filtrar combos
  const filteredCombos = combos.filter(c => 
    !searchQuery || 
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tagline?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ordenar por precio (menor a mayor)
  const sortedCombos = [...filteredCombos].sort((a, b) => a.price - b.price);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white leading-[1.1] tracking-tight">
                Combos <span className="text-primary">Especiales</span>
              </h1>
              <p className="text-white/40 text-sm mt-1">
                {sortedCombos.length} {sortedCombos.length === 1 ? 'combo' : 'combos'} con descuento
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Buscar combos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-darker border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Combos Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface-darker/50 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-white/5"></div>
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-white/5 rounded w-1/3"></div>
                  <div className="h-5 bg-white/5 rounded w-2/3"></div>
                  <div className="h-10 bg-white/5 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedCombos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCombos.map((combo) => {
              const comboSlug = combo.slug || combo.id;
              const savings = (combo.originalPrice || 0) - (combo.price || 0);
              
              return (
                <Link 
                  key={combo.id} 
                  href={`/combos/${comboSlug}`}
                  className="group bg-surface-darker/50 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/40 transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative aspect-video bg-surface-darker overflow-hidden">
                    <Image
                      src={combo.images?.[0]?.startsWith('/') || combo.images?.[0]?.startsWith('http') 
                        ? combo.images[0] 
                        : '/productos/combo-full.jpeg'}
                      alt={combo.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badge descuento */}
                    <div className="absolute top-3 left-3 bg-accent text-white text-sm font-bold px-3 py-1 rounded-full">
                      -{combo.discount || Math.round((1 - combo.price / (combo.originalPrice || combo.price)) * 100)}%
                    </div>

                    {/* Rating */}
                    {combo.rating && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-[10px] text-white font-medium">{combo.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Tagline */}
                    {combo.tagline && (
                      <p className="text-xs text-primary mb-1">{combo.tagline}</p>
                    )}
                    
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                      {combo.title}
                    </h3>

                    {/* Products included */}
                    <div className="flex items-center gap-2 mt-3 mb-4">
                      <div className="flex -space-x-2">
                        {combo.products.slice(0, 4).map((p, idx) => (
                          <div 
                            key={idx} 
                            className="w-7 h-7 rounded-full bg-surface-darker border-2 border-surface-darker/50 overflow-hidden relative"
                            title={p.displayName || p.name}
                          >
                            {p.image ? (
                              <Image src={p.image} alt={p.displayName || p.name} fill sizes="28px" className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-3 h-3 text-white/40" />
                              </div>
                            )}
                          </div>
                        ))}
                        {combo.products.length > 4 && (
                          <div className="w-7 h-7 rounded-full bg-surface-darker border-2 border-surface-darker/50 flex items-center justify-center text-[10px] text-white/60">
                            +{combo.products.length - 4}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-white/40">
                        {combo.products.length} {combo.products.length === 1 ? 'producto' : 'productos'}
                      </span>
                    </div>

                    {/* Price + CTA */}
                    <div className="mt-auto">
                      {/* Ahorro */}
                      {savings > 0 && (
                        <p className="text-xs text-green-400 mb-2 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Ahorrás ${savings.toLocaleString('es-AR')}
                        </p>
                      )}
                      
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          {combo.originalPrice && combo.originalPrice > combo.price && (
                            <span className="text-sm text-white/40 line-through">
                              ${(combo.originalPrice || 0).toLocaleString('es-AR')}
                            </span>
                          )}
                          <span className="text-2xl font-bold text-white block">
                            ${(combo.price || 0).toLocaleString('es-AR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-primary text-sm group-hover:translate-x-1 transition-transform">
                          Ver <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-surface-darker rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/40 mb-2">No se encontraron combos</p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-primary hover:text-primary/80 text-sm"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-surface-darker/30 border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            ¿Querés crear tu propio combo?
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Escribinos y armamos un combo personalizado vos eligiendo los productos.
          </p>
          <Link
            href="/contacto"
            className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/20"
          >
            Contactanos
          </Link>
        </div>
      </div>
    </div>
  );
}