'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { trackViewItem, buildGA4Item } from '@/lib/ga4-ecommerce';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    async function fetchProduct() {
      try {
        const { id } = await params;
        
        // Intentar primero como slug (URL amigable), luego como id antiguo
        let url = `/api/products/${id}`;
        let res = await fetch(url);
        
        // Si no encuentra, intentar buscar en la lista general (fallback para slugs)
        if (!res.ok) {
          const allRes = await fetch('/api/products');
          const allData = await allRes.json();
          if (!mounted) return;
          
          // Buscar por slug or id in list
          const found = (allData as any[]).find(
            p => p.slug === id || p.id === id || p._id === id
          );
          
          if (found) {
            setProduct(found);
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
        
        // Track view_item event
        trackViewItem({
          currency: 'ARS',
          value: data.price,
          items: [buildGA4Item(data.id, data.title, data.price, 1, data.category, data.brand)]
        });
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
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-surface-darker rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-6 bg-surface-darker rounded w-1/4"></div>
              <div className="h-10 bg-surface-darker rounded w-1/3"></div>
              <div className="h-24 bg-surface-darker rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">Producto no encontrado</h1>
          <Link href="/productos" className="text-primary hover:text-primary/80">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  // Validar imágenes - filtrar URLs inválidas
  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url || url.trim() === '') return false;
    if (url.startsWith('/')) return true;
    if (url.startsWith('http://') || url.startsWith('https://')) return true;
    return false;
  };
  
  const validImages = (product.images || [])
    .filter(isValidImageUrl);
  
  const images = validImages.length > 0 
    ? validImages 
    : ['/productos/combo-full.jpeg'];

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <div className="bg-surface-darker/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs">
            <Link href="/" className="text-white/40 hover:text-white">Inicio</Link>
            <span className="text-white/20">/</span>
            <Link href="/productos" className="text-white/40 hover:text-white">Productos</Link>
            <span className="text-white/20">/</span>
            <span className="text-white/60">{product.title}</span>
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
                src={images[activeImage]}
                alt={`${product.title} - imagen ${activeImage + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden relative border-2 transition-all ${
                      activeImage === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image 
                      src={img || '/productos/combo-full.jpeg'} 
                      alt={`Thumbnail ${idx + 1}`} 
                      fill 
                      sizes="64px" 
                      className="object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Category + Brand */}
            <div className="flex items-center gap-3 text-xs">
              {product.category && (
                <span className="text-white/40 uppercase tracking-widest">{product.category}</span>
              )}
              {product.brand && (
                <>
                  {product.category && <span className="text-white/20">•</span>}
                  <span className="text-primary font-medium">{product.brand}</span>
                </>
              )}
            </div>

            {/* Title + Price inline */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-semibold text-white leading-[1.1] tracking-tight">
                {product.title}
              </h1>

              {/* Price inline */}
              <div className="relative bg-surface-darker/40 border border-white/10 rounded-xl p-4 text-right flex-shrink-0">
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="absolute -top-2.5 right-4">
                    <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
                <span className="text-3xl font-bold text-white block">
                  ${(product.price || 0).toLocaleString('es-AR')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-white/40 line-through">
                      ${(product.originalPrice || 0).toLocaleString('es-AR')}
                    </span>
                    <span className="text-sm text-green-400 font-medium block">
                      Ahorrás ${((product.originalPrice || 0) - (product.price || 0)).toLocaleString('es-AR')}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-white/60">
                {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Sin stock'}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="text-sm text-white/70 leading-relaxed border-l-2 border-primary/30 pl-4">
                {product.description}
              </div>
            )}

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10">
              {product.weight && (
                <div>
                  <p className="text-xs text-white/40">Contenido</p>
                  <p className="text-sm text-white">{product.weight}</p>
                </div>
              )}
              {product.category && (
                <div>
                  <p className="text-xs text-white/40">Categoría</p>
                  <p className="text-sm text-white">{product.category}</p>
                </div>
              )}
            </div>

            {/* Ingredients */}
            {product.ingredients && (
              <div>
                <p className="text-xs text-white/40 mb-1">Ingredientes principales</p>
                <p className="text-sm text-white/70">{product.ingredients}</p>
              </div>
            )}

            {/* How to use */}
            {product.howToUse && (
              <div>
                <p className="text-xs text-white/40 mb-1">Modo de uso</p>
                <p className="text-sm text-white/70">{product.howToUse}</p>
              </div>
            )}

            {/* Warnings */}
            {product.warnings && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-xs text-yellow-400 mb-1">Advertencias</p>
                <p className="text-sm text-yellow-200/80">{product.warnings}</p>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <label className="text-sm text-white/60">Cantidad:</label>
                <div className="flex items-center border border-white/20 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-white min-w-[40px] text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} 
                    className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={() => {
                  addItem({
                    productId: product.id,
                    title: product.title,
                    price: product.price,
                    image: images[0],
                  }, quantity);
                  setIsAdding(true);
                  setTimeout(() => setIsAdding(false), 1000);
                }}
                disabled={product.stock === 0 || isAdding} 
                className="w-full py-3.5 bg-primary hover:bg-primary/90 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all active:scale-[0.98]"
              >
                {isAdding ? '✓ Agregado al carrito' : product.stock === 0 ? 'Sin stock' : 'Añadir al carrito'}
              </button>
            </div>

            {/* Shipping info */}
            <div className="border-t border-white/10 pt-6 space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <p className="text-xs text-white/50">Envío gratis a todo el país</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}