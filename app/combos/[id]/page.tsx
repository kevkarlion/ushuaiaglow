'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';

interface ComboProduct {
  name: string;
  description: string;
  image: string;
  benefit: string;
}

interface Combo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  price: number;
  originalPrice: number;
  discount: number;
  products: ComboProduct[];
  image: string;
  includes: string[];
}

export default function ComboDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [combo, setCombo] = useState<Combo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    
    async function fetchCombo() {
      try {
        // Fetch all products from API
        const res = await fetch('/api/products');
        const data = await res.json();
        
        if (!mounted) return;
        
        // Find the combo by ID
        const found = (data as Product[]).find(
          p => p.id === resolvedParams.id && (p.isCombo === true || p.category?.toLowerCase() === 'combo')
        );
        
        if (!found) {
          setCombo(null);
          setLoading(false);
          return;
        }

        // Transform product data to Combo format
        const comboData: Combo = {
          id: found.id,
          title: found.title,
          subtitle: found.brand || 'Combo Especial',
          description: found.description || '',
          benefits: found.ingredients ? found.ingredients.split(',').map(i => i.trim()) : ['Especial'],
          price: found.price,
          originalPrice: found.originalPrice || found.price * 1.3,
          discount: found.discount || Math.round((1 - found.price / (found.originalPrice || found.price * 1.3)) * 100),
          image: found.images?.[0] || '/productos/combo-full.jpeg',
          products: found.productsIncluded 
            ? (Array.isArray(found.productsIncluded) ? found.productsIncluded : JSON.parse(found.productsIncluded as string)).map((id: string, idx: number) => ({
                name: `Producto ${idx + 1}`,
                description: '',
                image: '',
                benefit: 'Incluido',
              }))
            : [],
          includes: found.weight ? [found.weight] : ['Combo especial'],
        };
        
        setCombo(comboData);
      } catch (error) {
        console.error('Error:', error);
        setCombo(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    fetchCombo();
    return () => { mounted = false; };
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-surface-darker rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-6 bg-surface-darker rounded w-1/4"></div>
              <div className="h-10 bg-surface-darker rounded w-1/2"></div>
              <div className="h-24 bg-surface-darker rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!combo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">Combo no encontrado</h1>
          <Link href="/combos" className="text-primary hover:text-primary/80">
            Volver a combos
          </Link>
        </div>
      </div>
    );
  }

  // Ensure image path is valid
  const mainImage = combo.image?.startsWith('/') || combo.image?.startsWith('http') 
    ? combo.image 
    : '/productos/combo-full.jpeg';
    
  const allImages = [mainImage, ...combo.products.map(p => p.image?.startsWith('/') || p.image?.startsWith('http') ? p.image : '/productos/combo-full.jpeg')].filter((img, i, arr) => arr.indexOf(img) === i);

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <div className="bg-surface-darker/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs">
            <Link href="/" className="text-white/40 hover:text-white">Inicio</Link>
            <span className="text-white/20">/</span>
            <Link href="/combos" className="text-white/40 hover:text-white">Combos</Link>
            <span className="text-white/20">/</span>
            <span className="text-white/60">{combo.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-surface-light rounded-lg overflow-hidden relative">
              <Image
                src={allImages[activeImage] || '/productos/combo-full.jpeg'}
                alt={activeImage === 0 ? combo.title : `Producto ${activeImage}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden relative border-2 transition-all ${
                      activeImage === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img || '/productos/combo-full.jpeg'} alt={idx === 0 ? 'Combo' : `Thumbnail ${idx}`} fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Category + Discount */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-primary font-medium bg-primary/20 px-3 py-1 rounded-full">
                -{combo.discount || 0}% OFF
              </span>
              <span className="text-xs text-white/40 uppercase tracking-widest">Combo</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-white leading-[1.1] tracking-tight">
              {combo.title}
            </h1>
            
            <p className="text-lg text-primary font-medium">{combo.subtitle}</p>

            {/* Benefits */}
            {combo.benefits.length > 0 && (
              <div className="bg-surface-darker/30 rounded-lg p-4">
                <p className="text-xs text-white/40 mb-3">BENEFICIOS</p>
                <ul className="space-y-2">
                  {combo.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            {combo.description && (
              <p className="text-white/70 leading-relaxed">{combo.description}</p>
            )}

            {/* What's Included */}
            {combo.includes.length > 0 && (
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-white/40 mb-2">INCLUYE</p>
                <ul className="space-y-1">
                  {combo.includes.map((item, idx) => (
                    <li key={idx} className="text-sm text-white/70">• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Individual Products */}
            {combo.products.length > 0 && (
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-white/40 mb-3">PRODUCTOS DEL COMBO</p>
                <div className="space-y-3">
                  {combo.products.map((product, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-surface-darker/20 rounded-lg p-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0 bg-surface-light">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">{idx + 1}</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.benefit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-white">${combo.price.toLocaleString('es-AR')}</span>
              {combo.originalPrice > combo.price && (
                <span className="text-lg text-white/40 line-through">${combo.originalPrice.toLocaleString('es-AR')}</span>
              )}
              {combo.originalPrice > combo.price && (
                <span className="text-sm text-green-400">Ahorrás ${(combo.originalPrice - combo.price).toLocaleString('es-AR')}</span>
              )}
            </div>

            {/* Add Button */}
            <button 
              onClick={() => {
                addItem({
                  productId: `combo-${combo.id}`,
                  title: combo.title,
                  price: combo.price,
                  image: mainImage,
                });
                setIsAdding(true);
                setTimeout(() => setIsAdding(false), 1000);
              }}
              disabled={isAdding} 
              className="w-full py-3.5 bg-primary hover:bg-primary/90 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all active:scale-[0.98]"
            >
              {isAdding ? '✓ Agregado al carrito' : 'Añadir Combo al carrito'}
            </button>

            {/* Shipping info */}
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
                </svg>
                Envío gratis a partir de $50.000
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2h8.117m-8.117a4 4 0 00-4 4v5h5.582" />
                </svg>
                30 días para devoluciones
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}