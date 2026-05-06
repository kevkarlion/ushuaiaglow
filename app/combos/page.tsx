'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { trackViewItemList, buildGA4Item } from '@/lib/ga4-ecommerce';
import { Search, Package, Check, ArrowRight, Flame, Timer, Lock, CreditCard, Truck, ShieldCheck, Sparkles } from 'lucide-react';

// Custom Star Component - Diseño personalizado
function StarRating({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

// Helper para obtener mensaje de resultado basado en el combo
function getComboResultMessage(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('glow') || t.includes('lumino')) return 'Piel luminosa y radiante en días';
  if (t.includes('hidra') || t.includes('moist')) return 'Hidratación profunda 24h';
  if (t.includes('anti') || t.includes('edad')) return 'Reduce líneas de expresión';
  if (t.includes('limpie') || t.includes('pure')) return 'Piel limpia y libre de impurezas';
  if (t.includes('sensible') || t.includes('delic')) return 'Calma y repara piel sensible';
  if (t.includes('oil') || t.includes('grasa')) return 'Control de brillo y poros';
  return 'Transforma tu piel con rutina completa';
}

// Helper para obtener para quién es
function getComboForWho(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('sensible') || t.includes('delic')) return 'Ideal para piel sensible';
  if (t.includes('grasa') || t.includes('oil')) return 'Perfecto para piel mixta/grasa';
  if (t.includes('seca') || t.includes('dry')) return 'Para piel seca que necesita hidratación';
  if (t.includes('anti') || t.includes('edad')) return 'A partir de los 25 años';
  return 'Para todo tipo de piel';
}

// Helper para obtener beneficios
function getComboBenefits(title: string): string[] {
  const t = title.toLowerCase();
  if (t.includes('glow') || t.includes('lumino')) {
    return ['Ilumina y unifica el tono', 'Efecto glow instantáneo', 'Vitaminas Antioxidantes'];
  }
  if (t.includes('hidra') || t.includes('moist')) {
    return ['Hidratación profunda', 'Piel suave y sedosa', 'Efecto barrera protectora'];
  }
  if (t.includes('anti') || t.includes('edad')) {
    return ['Reduce arrugas finas', 'Firmeza visible', 'Previene envejecimiento'];
  }
  return ['Limpia en profundidad', 'Equilibra la piel', 'Mejora textura'];
}

// Helper para badge de diferenciación
function getComboBadge(index: number, title: string): { text: string; type: 'best-seller' | 'recommended' | 'new' } | null {
  if (index === 0) return { text: 'MÁS VENDIDO', type: 'best-seller' };
  if (index === 1) return { text: 'RECOMENDADO', type: 'recommended' };
  if (title.toLowerCase().includes('nuevo') || title.toLowerCase().includes('new')) {
    return { text: 'NUEVO', type: 'new' };
  }
  return null;
}

// Helper para CTA personalizado
function getComboCTA(index: number): string {
  if (index === 0) return 'Aprovechar Oferta';
  if (index === 1) return 'Quiero Este Combo';
  return 'Comprar Ahora';
}

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
      {/* HERO SECTION - CRO Optimization */}
      <div className="relative overflow-hidden bg-gradient-to-b from-surface-darker/80 to-black border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col gap-6">
            {/* Headline - Clear Value Proposition */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                Tu Rutina de{' '}
                <span className="text-primary">Piel Perfecta</span>
                <br className="md:hidden" /> en Un Solo Click
              </h1>
              
              {/* Subheadline - Emotional reinforcement */}
              <p className="text-lg md:text-xl text-white/60 max-w-xl">
                Combos skincare diseñados por expertos.{' '}
                <span className="text-white/80">Resultados visibles desde la primera semana.</span>
              </p>
            </div>

            {/* CTA - Visible & Direct */}
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <button 
                onClick={() => {
                  const element = document.getElementById('combos-grid');
                  if (element) {
                    const offset = 80; // offset para el navbar
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                      top: elementPosition - offset,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-black font-bold text-base rounded-xl transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                Ver Combos
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-white/40 flex items-center gap-2 pt-2">
                <span className="flex items-center gap-1">
                  <StarRating size={12} className="text-yellow-400" />
                  4.9/5
                </span>
                • +500 clientas satisfechas
              </p>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* SOCIAL PROOF - Below Hero */}
      <div className="bg-surface-darker/30 border-y border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarRating key={i} size={16} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-white/80">"Me cambió la piel en 7 días"</p>
              <p className="text-xs text-white/40 mt-1">- María, Buenos Aires</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarRating key={i} size={16} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-white/80">"El mejor precio del mercado"</p>
              <p className="text-xs text-white/40 mt-1">- Carolina, Córdoba</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarRating key={i} size={16} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-white/80">"Envío rápido y packaging premium"</p>
              <p className="text-xs text-white/40 mt-1">- Luciana, Mendoza</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarRating key={i} size={16} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-white/80">"Volvería a comprar 100 veces"</p>
              <p className="text-xs text-white/40 mt-1">- Antonella, Rosario</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header & Search - Simplified */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white">
                {sortedCombos.length} {sortedCombos.length === 1 ? 'Combo' : 'Combos'} Disponibles
              </h2>
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
          <div id="combos-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCombos.map((combo, index) => {
              const comboSlug = combo.slug || combo.id;
              const savings = (combo.originalPrice || 0) - (combo.price || 0);
              const isBestSeller = index === 0;
              
              // CRO: Mensajes dinámicos
              const resultMessage = getComboResultMessage(combo.title);
              const forWho = getComboForWho(combo.title);
              const benefits = getComboBenefits(combo.title);
              const badge = getComboBadge(index, combo.title);
              const ctaText = getComboCTA(index);
              
              return (
                <Link 
                  key={combo.id} 
                  href={`/combos/${comboSlug}`}
                  className={`group bg-surface-darker/50 rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
                    isBestSeller 
                      ? 'border-primary/50 shadow-lg shadow-primary/10' 
                      : 'border-white/5 hover:border-primary/40'
                  }`}
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
                    
                    {/* BADGE de diferenciación */}
                    {badge && (
                      <div className={`absolute top-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 ${
                        badge.type === 'best-seller' 
                          ? 'bg-primary text-black animate-pulse' 
                          : badge.type === 'recommended'
                            ? 'bg-purple-500 text-white'
                            : 'bg-blue-500 text-white'
                      }`}>
                        {badge.type === 'best-seller' && <Flame className="w-3 h-3" />}
                        {badge.type === 'recommended' && <Sparkles className="w-3 h-3" />}
                        {badge.type === 'new' && <Sparkles className="w-3 h-3" />}
                        {badge.text}
                      </div>
                    )}
                    
                    {/* Badge descuento (solo si no hay badge) */}
                    {!badge && (
                      <div className="absolute top-3 left-3 bg-accent text-white text-sm font-bold px-3 py-1 rounded-full">
                        -{combo.discount || Math.round((1 - combo.price / (combo.originalPrice || combo.price)) * 100)}%
                      </div>
                    )}

                    {/* URGENCY: Últimas unidades (solo best seller) */}
                    {isBestSeller && (
                      <div className="absolute bottom-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        Últimas unidades
                      </div>
                    )}

                    {/* Rating */}
                    {combo.rating && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                        <StarRating size={12} className="text-yellow-400" />
                        <span className="text-[10px] text-white font-medium">{combo.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Content - Jerarquía Visual CRO */}
                  <div className="p-5 flex flex-col flex-1">
                    
                    {/* 1. RESULTADO (emocional) - Lo primero que se ve */}
                    <p className="text-sm text-primary font-medium mb-1 leading-tight">
                      ✨ {resultMessage}
                    </p>
                    
                    {/* 2. Title - Nombre del combo */}
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-1">
                      {combo.title}
                    </h3>
                    
                    {/* 3. CONTEXTO: Para quién es */}
                    <p className="text-xs text-white/50 mb-3">
                      {forWho}
                    </p>

                    {/* 4. BENEFICIOS CONCRETOS */}
                    <div className="space-y-1 mb-4">
                      {benefits.slice(0, 3).map((benefit, i) => (
                        <p key={i} className="text-xs text-white/70 flex items-start gap-1.5">
                          <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </p>
                      ))}
                    </div>

                    {/* Products included */}
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
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
                        {combo.products.length} productos
                      </span>
                    </div>

                    {/* 5. Precio + Ahorro emocional + CTA */}
                    <div className="mt-auto">
                      {/* AHORRO EMOCIONAL */}
                      {savings > 0 && (
                        <p className="text-xs font-medium text-green-400 mb-2 flex items-center gap-1.5">
                          <Flame className="w-3 h-3" />
                          ¡Ahorrás ${savings.toLocaleString('es-AR')} con este combo!
                        </p>
                      )}
                      
                      {/* Confianza rápida */}
                      <div className="flex items-center gap-2 text-[10px] text-white/40 mb-3">
                        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Compra segura</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Envío gratis</span>
                      </div>
                      
                      {/* Precio + CTA */}
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
                        
                        {/* CTA PERSUASIVO */}
                        <button 
                          className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-all hover:shadow-lg active:scale-95 ${
                            isBestSeller 
                              ? 'bg-primary hover:bg-primary/90 text-black hover:shadow-primary/20' 
                              : 'bg-primary/90 hover:bg-primary text-black'
                          }`}
                          onClick={(e) => e.preventDefault()}
                        >
                          {ctaText}
                        </button>
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

      {/* CTA Final Section - CRO Optimized */}
      <div className="bg-surface-darker/30 border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          {/* Urgency message */}
          <div className="inline-flex items-center gap-2 bg-[#35de80] px-4 py-2 rounded-full mb-6 shadow-lg shadow-green-500/30">
            <Timer className="w-4 h-4 text-black" strokeWidth={2} />
            <span className="text-black text-sm font-bold">¡Promo por tiempo limitado!</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            ¿No Encontraste lo que buscabas?
          </h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Armamos un combo personalizado con los productos que vos elijas.
          </p>
          
          {/* Confidence badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-xs text-white/50">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Compra 100% segura</span>
            <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> Pagos con MercadoPago</span>
            <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Envíos a todo el país</span>
          </div>
          
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Crear Mi Combo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}