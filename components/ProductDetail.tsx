'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, getOrderedImages, getMainImage } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { trackAddToCart } from '@/lib/meta-pixel';
import { motion } from 'framer-motion';

// Lucide icons
import { 
  Droplets, 
  Sparkles, 
  Shield, 
  Leaf,
  Truck, 
  Lock, 
  Star, 
  RotateCcw, 
  FileText, 
  CreditCard, 
  X, 
  Check,
  ZoomIn,
  Package
} from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  relatedProducts?: Product[];
}

export default function ProductDetail({ product, relatedProducts = [] }: ProductDetailProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.08 } }
  };
  
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Imágenes ordenadas (primera = principal)
  const imageUrls = getOrderedImages(product.images);

  // Datos del producto (reales desde la API)
  const benefitText = product.tagline || "Ilumina y unifica el tono de tu piel";
  
  // Reviews - datos reales del producto o defaults
  const reviews = {
    rating: product.rating || 4.8,
    count: 127, // Por ahora hardcodeado hasta tener sistema de reviews
    featured: product.featuredReview 
      ? [product.featuredReview] 
      : [
          { text: "Mi piel nunca se vio tan radiante", author: "María L." },
          { text: "Textura ligera, absorbe instantáneamente", author: "Carolina R." },
          { text: "Resultados visibles en 2 semanas", author: "Sofia M." },
        ]
  };

  // Benefits - datos reales del producto
  const benefits = product.benefits && product.benefits.length > 0
    ? product.benefits.map((benefit, i) => {
        // Asignar icono según el contenido del beneficio
        const lower = benefit.toLowerCase();
        if (lower.includes('hidrat')) return { icon: Droplets, text: benefit, color: 'text-blue-400' };
        if (lower.includes('lumino') || lower.includes('brillo') || lower.includes('glow')) return { icon: Sparkles, text: benefit, color: 'text-yellow-400' };
        if (lower.includes('protección') || lower.includes('antioxidante')) return { icon: Shield, text: benefit, color: 'text-green-400' };
        if (lower.includes('textura') || lower.includes('ligera')) return { icon: Leaf, text: benefit, color: 'text-emerald-400' };
        return { icon: Sparkles, text: benefit, color: 'text-primary' };
      })
    : [
        { icon: Droplets, text: "Hidratación profunda", color: "text-blue-400" },
        { icon: Sparkles, text: "Efecto luminoso", color: "text-yellow-400" },
        { icon: Shield, text: "Protección antioxidante", color: "text-green-400" },
        { icon: Leaf, text: "Textura ligera", color: "text-emerald-400" },
      ];

  const trustItems = [
    { icon: Truck, text: "Envío gratis +24h", color: "text-primary" },
    { icon: Lock, text: "Compra segura", color: "text-white/60" },
    { icon: Star, text: `${reviews.rating}/5 clientes`, color: "text-yellow-400" },
    { icon: RotateCcw, text: "Devolución 30 días", color: "text-white/60" },
  ];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: imageUrls[0],
    }, quantity);
    
    trackAddToCart(product.id, product.title, product.price);
    
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const diffX = touchStart.current.x - touchEnd.x;
    const diffY = touchStart.current.y - touchEnd.y;
    
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0 && activeImage < imageUrls.length - 1) {
        setActiveImage(activeImage + 1);
      } else if (diffX < 0 && activeImage > 0) {
        setActiveImage(activeImage - 1);
      }
    }
    
    touchStart.current = null;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      {/* Breadcrumb */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
      <div className="md:hidden px-4 py-3 border-b border-white/[0.06]">
        <nav className="flex items-center gap-2 text-xs text-white/40">
          <Link href="/" className="hover:text-white">Inicio</Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-white">Productos</Link>
        </nav>
      </div>
      </motion.div>

      {/* DESKTOP */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}>
          <div className="space-y-4">
            <div 
              className="aspect-square bg-surface-darker rounded-2xl shadow-premium hover:shadow-premium transition-shadow duration-500 ease-premium overflow-hidden relative cursor-zoom-in"
              onClick={() => setIsImageZoomed(true)}
            >
              <Image
                src={imageUrls[activeImage]}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-xl px-3 py-1.5 rounded-full text-xs text-white/80 flex items-center gap-1.5 border border-white/[0.06]">
                <ZoomIn className="w-3.5 h-3.5" />
                Toca para zoom
              </div>
            </div>
            
            {imageUrls.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {imageUrls.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden relative border-2 transition-all duration-500 ease-premium ${
                      activeImage === idx 
                        ? 'border-primary shadow-lg shadow-primary/20' 
                        : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`${product.title} - imagen ${idx + 1}`}
                      fill 
                      sizes="80px" 
                      className="object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 }}>
          <div className="space-y-7">
            {/* Category + Brand */}
            <div className="flex items-center gap-3 text-xs">
              {product.category && (
                <span className="text-white/50 uppercase tracking-[0.2em]">{product.category}</span>
              )}
              {product.brand && (
                <>
                  {product.category && <span className="text-white/20">•</span>}
                  <span className="text-primary font-medium">{product.brand}</span>
                </>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-semibold text-white leading-[1.15] tracking-tight">
              {product.title}
            </h1>

            {/* Tagline / Beneficio principal */}
            <p className="text-lg text-white/70 font-light leading-relaxed">
              {benefitText}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(reviews.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-white/60">{reviews.rating}</span>
              <span className="text-sm text-white/40">({reviews.count} reseñas)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-white">
                ${(product.price || 0).toLocaleString('es-AR')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-white/40 line-through">
                    ${(product.originalPrice || 0).toLocaleString('es-AR')}
                  </span>
                  <span className="bg-accent text-white text-sm font-semibold px-3 py-1 rounded-full">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Cuotas - Financiación dinámica */}
            <div className="flex items-center gap-2 text-white/60 bg-white/[0.04] px-4 py-2 rounded-xl w-fit border border-white/[0.06]">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm">Pagá en cuotas con Mercado Pago</span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 py-2">
              <label className="text-sm text-white/60">Cantidad:</label>
              <div className="flex items-center bg-surface-darker border border-white/[0.06] rounded-xl">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="px-5 py-3 text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 ease-premium text-lg font-medium"
                >
                  −
                </button>
                <span className="px-6 py-3 text-base font-semibold text-white min-w-[50px] text-center border-x border-white/[0.06]">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} 
                  className="px-5 py-3 text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 ease-premium text-lg font-medium"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA */}
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-500 ease-premium active:scale-[0.98] hover:shadow-glow-lg ${
                product.stock === 0 
                  ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                  : isAdding 
                    ? 'bg-green-500 text-white'
                    : 'bg-primary hover:bg-primary/90 text-black shadow-lg shadow-primary/30'
              }`}
            >
              {isAdding ? <><Check className="w-5 h-5 inline mr-2" />Agregado al carrito</> : product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
              {trustItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 text-xs text-white/50">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
          </motion.div>
        </div>

        {/* Description sections */}
        <div className="mt-16 space-y-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <section className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6">Descripción</h2>
            
            {/* Descripción comercial */}
            {(product.commercialDescription || product.description) && (
              <p className="text-white/70 leading-relaxed mb-6">
                {product.commercialDescription || product.description}
              </p>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Qué es */}
              {product.queEs && (
                <div className="bg-surface-darker/50 rounded-xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 ease-premium">
                  <div className="flex items-center gap-2.5 text-white font-medium mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h3>Qué es</h3>
                  </div>
                  <p className="text-sm text-white/60">{product.queEs}</p>
                </div>
              )}
              
              {/* Cómo usar */}
              {product.howToUse && (
                <div className="bg-surface-darker/50 rounded-xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 ease-premium">
                  <div className="flex items-center gap-2.5 text-white font-medium mb-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <h3>Cómo usar</h3>
                  </div>
                  <p className="text-sm text-white/60">{product.howToUse}</p>
                </div>
              )}
              
              {/* Ingredientes */}
              {product.ingredients && (
                <div className="bg-surface-darker/50 rounded-xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 ease-premium md:col-span-2">
                  <div className="flex items-center gap-2.5 text-white font-medium mb-2">
                    <Package className="w-4 h-4 text-primary" />
                    <h3>Ingredientes</h3>
                  </div>
                  <p className="text-sm text-white/60">{product.ingredients}</p>
                </div>
              )}
            </div>
          </section>
          </motion.div>

          {/* Benefits */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Beneficios</h2>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}>
                  <div 
                    className="bg-gradient-to-b from-surface-darker to-black rounded-xl p-5 border border-white/[0.06] text-center"
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-3 ${benefit.color}`} />
                    <p className="text-sm text-white/80 font-medium">{benefit.text}</p>
                  </div>
                  </motion.div>
                );
              })}
            </div>
            </motion.div>
          </section>
          </motion.div>

          {/* Reviews */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Reseñas</h2>
              <span className="text-white/40 text-sm">({reviews.count} reviews)</span>
            </div>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="grid md:grid-cols-3 gap-4">
              {reviews.featured.map((review, i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}>
                <div 
                  className="bg-surface-darker/30 rounded-xl p-5 border border-white/[0.06]"
                >
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-3 italic">"{review.text}"</p>
                  <p className="text-xs text-primary font-medium">— {review.author}</p>
                </div>
                </motion.div>
              ))}
            </div>
            </motion.div>
          </section>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <section className="mt-16">
            <h2 className="text-2xl font-semibold text-white mb-6">También te puede gustar</h2>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 4).map((p) => (
                <motion.div key={p.id} variants={fadeUp} whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}>
                <Link 
                  href={`/productos/${p.slug || p.id}`}
                  className="bg-surface-darker/30 rounded-xl overflow-hidden border border-white/[0.06]"
                >
                  <div className="p-4">
                    <h3 className="text-sm text-white font-medium line-clamp-2 mb-2">
                      {p.title}
                    </h3>
                    <span className="text-lg font-bold text-white">
                      ${(p.price || 0).toLocaleString('es-AR')}
                    </span>
                  </div>
                </Link>
                </motion.div>
              ))}
            </div>
            </motion.div>
          </section>
          </motion.div>
        )}
      </div>

      {/* MOBILE */}
      <div className="md:hidden">
        {/* Hero Image */}
        <div 
          ref={carouselRef}
          className="relative aspect-square bg-surface-darker"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={imageUrls[activeImage]}
            alt={product.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          
          {imageUrls.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {imageUrls.map((_, idx) => (
                <span 
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeImage ? 'bg-white w-6' : 'bg-white/40 w-1.5'
                  }`}
                />
              ))}
            </div>
          )}

          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </div>
          )}
        </div>

        {/* Info clave */}
        <div className="px-4 py-5 space-y-4">
          <div className="flex items-center gap-2 text-xs">
            {product.category && (
              <span className="text-white/40 uppercase tracking-wider">{product.category}</span>
            )}
            {product.brand && (
              <>
                {product.category && <span className="text-white/20">•</span>}
                <span className="text-primary font-medium">{product.brand}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl font-semibold text-white leading-tight">
            {product.title}
          </h1>

          <p className="text-base text-white/60 font-light">
            {benefitText}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < Math.floor(reviews.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                />
              ))}
            </div>
            <span className="text-sm text-white/60">{reviews.rating}</span>
            <span className="text-sm text-white/40">({reviews.count})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-white">
              ${(product.price || 0).toLocaleString('es-AR')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-white/40 line-through">
                ${(product.originalPrice || 0).toLocaleString('es-AR')}
              </span>
            )}
          </div>

          {/* Cuotas - Financiación dinámica mobile */}
          <div className="flex items-center gap-2 text-white/60 bg-surface-darker/30 px-3 py-2 rounded-lg w-fit">
            <CreditCard className="w-4 h-4" />
            <span className="text-sm">Pagá en cuotas</span>
          </div>
        </div>

        {/* Descripción */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <div className="px-4 py-6 border-t border-white/[0.06]">
          <h2 className="text-lg font-semibold text-white mb-4">Descripción</h2>
          
          {(product.commercialDescription || product.description) && (
            <p className="text-sm text-white/70 leading-relaxed mb-5">
              {product.commercialDescription || product.description}
            </p>
          )}

          <div className="space-y-3">
            {/* Qué es */}
            {product.queEs && (
              <div className="bg-surface-darker/40 rounded-xl p-4 border border-white/[0.06]">
                <div className="flex items-center gap-2 text-white font-medium text-sm mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3>Qué es</h3>
                </div>
                <p className="text-xs text-white/60">{product.queEs}</p>
              </div>
            )}

            {/* Beneficios */}
            <div className="grid grid-cols-2 gap-3">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div 
                    key={i} 
                    className="bg-surface-darker/40 rounded-xl p-3 border border-white/[0.06] text-center"
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${benefit.color}`} />
                    <p className="text-xs text-white/80">{benefit.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Cómo usar */}
            {product.howToUse && (
              <div className="bg-surface-darker/40 rounded-xl p-4 border border-white/[0.06]">
                <div className="flex items-center gap-2 text-white font-medium text-sm mb-1">
                  <FileText className="w-4 h-4 text-primary" />
                  <h3>Cómo usar</h3>
                </div>
                <p className="text-xs text-white/60">{product.howToUse}</p>
              </div>
            )}

            {/* Ingredientes */}
            {product.ingredients && (
              <div className="bg-surface-darker/40 rounded-xl p-4 border border-white/[0.06]">
                <div className="flex items-center gap-2 text-white font-medium text-sm mb-1">
                  <Package className="w-4 h-4 text-primary" />
                  <h3>Ingredientes</h3>
                </div>
                <p className="text-xs text-white/60">{product.ingredients}</p>
              </div>
            )}
          </div>
        </div>
        </motion.div>

        {/* Reseñas */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <div className="px-4 py-6 border-t border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Reseñas</h2>
            <span className="text-xs text-white/40">({reviews.count})</span>
          </div>
          
          <div className="space-y-3">
            {reviews.featured.map((review, i) => (
              <div 
                key={i} 
                className="bg-surface-darker/30 rounded-xl p-4 border border-white/[0.06]"
              >
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-white/80 mb-1">"{review.text}"</p>
                <p className="text-xs text-primary">— {review.author}</p>
              </div>
            ))}
          </div>
        </div>
        </motion.div>

        {/* Confianza */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <div className="px-4 py-6 border-t border-white/[0.06]">
          <div className="grid grid-cols-2 gap-3">
            {trustItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div 
                  key={i} 
                  className="flex items-center gap-2.5 text-xs text-white/50 bg-surface-darker/30 py-2.5 px-3 rounded-lg"
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
        </motion.div>

        {/* Relacionados */}
        {relatedProducts.length > 0 && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="px-4 py-6 border-t border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-4">También te puede gustar</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {relatedProducts.slice(0, 4).map((p) => (
                <Link 
                  key={p.id} 
                  href={`/productos/${p.slug || p.id}`}
                  className="flex-shrink-0 w-40 bg-surface-darker/30 rounded-xl overflow-hidden border border-white/[0.06]"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={getMainImage(p.images) || '/placeholder.png'}
                      alt={p.title}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs text-white font-medium line-clamp-2 mb-1">
                      {p.title}
                    </h3>
                    <span className="text-sm font-bold text-white">
                      ${(p.price || 0).toLocaleString('es-AR')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          </motion.div>
        )}

        <div className="h-24"></div>
      </div>

      {/* Sticky CTA Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/[0.06] px-4 py-4 z-40 shadow-premium">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-darker border border-white/[0.06] rounded-xl">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))} 
              className="px-3 py-2 text-white/60 hover:text-white transition-all duration-300 ease-premium"
            >
              −
            </button>
            <span className="px-3 py-2 text-sm font-semibold text-white min-w-[30px] text-center">
              {quantity}
            </span>
            <button 
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} 
              className="px-3 py-2 text-white/60 hover:text-white transition-all duration-300 ease-premium"
            >
              +
            </button>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className={`flex-1 py-3.5 text-base font-semibold rounded-xl transition-all duration-500 ease-premium active:scale-[0.98] hover:shadow-glow-lg ${
              product.stock === 0 
                ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                : isAdding 
                  ? 'bg-green-500 text-white'
                  : 'bg-primary hover:bg-primary/90 text-black shadow-lg shadow-primary/30'
            }`}
          >
            {isAdding ? '✓ Agregado' : product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </button>
        </div>
        
        <p className="text-center text-[10px] text-white/30 mt-2 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          Compra segura 
          <span className="mx-2">•</span>
          <Truck className="w-3 h-3" />
          Envío gratis
        </p>
      </div>

      {/* Zoom Modal */}
      {isImageZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-8 cursor-zoom-out"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
            <Image
              src={imageUrls[activeImage]}
              alt={product.title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button 
            className="absolute top-4 right-4 text-white/60 hover:text-white p-2"
            onClick={() => setIsImageZoomed(false)}
          >
            <X className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}