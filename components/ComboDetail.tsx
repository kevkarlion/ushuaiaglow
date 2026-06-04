'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, getMainImage } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { trackAddToCart } from '@/lib/meta-pixel';
import { motion } from 'framer-motion';
import { 
  Star, 
  Truck, 
  Lock, 
  RotateCcw, 
  Sparkles, 
  Package, 
  Check,
  X,
  ZoomIn,
  CreditCard
} from 'lucide-react';

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
  stock?: number;
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

interface ComboDetailProps {
  combo: Combo;
  relatedCombos?: Combo[];
}

export default function ComboDetail({ combo, relatedCombos = [] }: ComboDetailProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
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

  // Reviews - datos reales del combo o defaults
  const reviews = {
    rating: combo.rating || 4.9,
    count: 84, // Por ahora hardcodeado hasta tener sistema de reviews real
    featured: combo.featuredReview 
      ? [combo.featuredReview] 
      : [
          { text: "El combo perfecto, me duró 2 meses", author: "Julieta M." },
          { text: "Mi piel cambió completamente en 3 semanas", author: "Ana L." },
          { text: "Rutina completa, muy práctico para usar en casa", author: "Camila R." },
        ]
  };

  const trustItems = [
    { icon: Truck, text: "Envío gratis +24h", color: "text-primary" },
    { icon: Lock, text: "Compra segura", color: "text-[#222222]/60" },
    { icon: Star, text: `${reviews.rating}/5 clientes`, color: "text-yellow-400" },
    { icon: RotateCcw, text: "Devolución 30 días", color: "text-[#222222]/60" },
  ];

  const handleAddToCart = () => {
    addItem({
      productId: `combo-${combo.id}`,
      title: combo.title,
      price: combo.price,
      image: combo.image,
    }, quantity);
    
    trackAddToCart(combo.id, combo.title, combo.price);
    
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    touchStart.current = null;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Breadcrumb */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
      <div className="md:hidden px-4 py-3 border-b border-black/[0.06] bg-white">
        <nav className="flex items-center gap-2 text-xs text-[#222222]/40">
          <Link href="/" className="hover:text-[#222222]">Inicio</Link>
          <span>/</span>
          <Link href="/combos" className="hover:text-[#222222]">Combos</Link>
        </nav>
      </div>
      </motion.div>

      {/* DESKTOP */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}>
          <div className="space-y-4">
            <div 
              className="aspect-square bg-white rounded-2xl shadow-premium hover:shadow-premium transition-shadow duration-500 ease-premium overflow-hidden relative cursor-zoom-in border border-black/[0.06]"
              onClick={() => setIsImageZoomed(true)}
            >
              <Image
                src={combo.image || '/productos/combo-full.jpeg'}
                alt={combo.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-full text-xs text-white flex items-center gap-1.5 border border-black/[0.06]">
                <ZoomIn className="w-3.5 h-3.5" />
                Toca para zoom
              </div>
              
              {/* Badge */}
              {combo.discount > 0 && (
                <div className="absolute top-4 left-4 bg-primary text-black text-sm font-bold px-4 py-1.5 rounded-full">
                  -{combo.discount}% OFF
                </div>
              )}
            </div>
          </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 }}>
          <div className="space-y-7">
            {/* Badge + Category */}
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full font-medium">COMBO</span>
              {combo.subtitle && <span className="text-[#222222]/40">•</span>}
              {combo.subtitle && <span className="text-[#222222]/60">{combo.subtitle}</span>}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-[#222222] leading-[1.15] tracking-tight">
              {combo.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(reviews.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-[#222222]/20'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#222222]/60">{reviews.rating}</span>
              <span className="text-sm text-[#222222]/40">({reviews.count} reseñas)</span>
            </div>

            {/* Full Description */}
            {combo.fullDescription && (
              <p className="text-lg text-[#222222]/70 font-light leading-relaxed">
                {combo.fullDescription}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-[#222222]">
                ${(combo.price || 0).toLocaleString('es-AR')}
              </span>
              {combo.originalPrice > combo.price && (
                <>
                  <span className="text-xl text-[#222222]/40 line-through">
                    ${(combo.originalPrice || 0).toLocaleString('es-AR')}
                  </span>
                  <span className="bg-accent text-white text-sm font-semibold px-3 py-1 rounded-full">
                    -{combo.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Products included - moved above for visibility */}
            {combo.products.length > 0 && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="bg-white rounded-2xl p-6 border border-black/[0.06] hover:border-black/[0.12] transition-all duration-300 ease-premium">
                <div className="flex items-center gap-2 text-[#222222] font-bold mb-4">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="text-lg">Productos incluidos ({combo.products.length})</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {combo.products.map((product, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-[#f5f5f5] rounded-xl p-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden relative flex-shrink-0 bg-gray-100">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} fill sizes="64px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#222222]/30">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#222222]">{product.name}</p>
                        <p className="text-xs text-[#222222]/50">{product.benefit}</p>
                      </div>
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
              </motion.div>
            )}
          </div>
          </motion.div>
        </div>

        {/* Descripcion y Modo de uso - ancho completo */}
        {(combo.description || combo.queEs || combo.howToUse) && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Descripcion / Que es */}
              {(combo.description || combo.queEs) && (
                <div className="bg-white rounded-2xl p-8 border border-black/[0.06]">
                  <h2 className="text-2xl font-semibold text-[#222222] mb-4">
                    {combo.queEs ? 'Que es?' : 'Descripcion'}
                  </h2>
                  <p className="text-[#222222]/80 leading-relaxed text-lg">
                    {combo.queEs || combo.description}
                  </p>
                </div>
              )}

              {/* Modo de uso */}
              {combo.howToUse && (
                <div className="bg-white rounded-2xl p-8 border border-black/[0.06]">
                  <h2 className="text-2xl font-semibold text-[#222222] mb-4">Modo de uso</h2>
                  <p className="text-[#222222]/80 leading-relaxed text-lg whitespace-pre-line">
                    {combo.howToUse}
                  </p>
                </div>
              )}
            </div>
          </div>
          </motion.div>
        )}

        {/* Ingredientes - ancho completo */}
        {combo.ingredients && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="bg-white rounded-2xl p-8 border border-black/[0.06]">
              <h2 className="text-2xl font-semibold text-[#222222] mb-4">Ingredientes</h2>
              <p className="text-[#222222]/70 text-sm leading-relaxed whitespace-pre-line">
                {combo.ingredients}
              </p>
            </div>
          </div>
          </motion.div>
        )}

        {/* Reviews Desktop */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#222222]">Reseñas destacadas</h2>
            <span className="text-[#222222]/40 text-sm">({reviews.count} reviews)</span>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="grid md:grid-cols-3 gap-4">
            {reviews.featured.map((review, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}>
              <div className="bg-white rounded-xl p-5 border border-black/[0.06]">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-[#222222]/80 mb-3 italic">"{review.text}"</p>
                <p className="text-xs text-primary font-medium">— {review.author}</p>
              </div>
              </motion.div>
            ))}
          </div>
          </motion.div>
        </section>
        </motion.div>

        {/* Related Desktop */}
        {relatedCombos.length > 0 && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <section className="mt-16">
            <h2 className="text-2xl font-semibold text-[#222222] mb-6">Otros combos</h2>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedCombos.slice(0, 4).map((c) => (
                <motion.div key={c.id} variants={fadeUp} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                <Link 
                  href={`/combos/${c.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-black/[0.06] hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                    <Image
                      src={c.image || '/productos/combo-full.jpeg'}
                      alt={c.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs text-[#222222] font-medium line-clamp-2 mb-1">
                      {c.title}
                    </h3>
                    <span className="text-sm font-bold text-primary">
                      ${(c.price || 0).toLocaleString('es-AR')}
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
          className="relative aspect-square bg-white"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={combo.image || '/productos/combo-full.jpeg'}
            alt={combo.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />

          {/* Badge */}
          {combo.discount > 0 && (
            <div className="absolute top-4 left-4 bg-primary text-black text-xs font-bold px-3 py-1.5 rounded-full">
              -{combo.discount}% OFF
            </div>
          )}
        </div>

        {/* Info clave */}
        <div className="px-4 py-5 space-y-4 bg-white">
          {/* Badge + Category */}
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-primary/20 text-primary px-2.5 py-1 rounded-full font-medium">COMBO</span>
            {combo.subtitle && <span className="text-[#222222]/40">{combo.subtitle}</span>}
          </div>

          <h1 className="text-2xl font-bold text-[#222222] leading-tight">
            {combo.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < Math.floor(reviews.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-[#222222]/20'}`}
                />
              ))}
            </div>
            <span className="text-sm text-[#222222]/60">{reviews.rating}</span>
            <span className="text-sm text-[#222222]/40">({reviews.count})</span>
          </div>

          {/* Full Description */}
          {combo.fullDescription && (
            <p className="text-base text-[#222222]/60 font-light">
              {combo.fullDescription}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#222222]">
              ${(combo.price || 0).toLocaleString('es-AR')}
            </span>
            {combo.originalPrice > combo.price && (
              <span className="text-lg text-[#222222]/40 line-through">
                ${(combo.originalPrice || 0).toLocaleString('es-AR')}
              </span>
            )}
          </div>

          {/* Cuotas - Financiación dinámica mobile */}
          <div className="flex items-center gap-2 text-[#222222]/60 bg-[#f5f5f5] px-3 py-2 rounded-lg w-fit">
            <CreditCard className="w-4 h-4" />
            <span className="text-sm">Pagá en cuotas</span>
          </div>
        </div>

        {/* Products included */}
        {combo.products.length > 0 && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="px-4 py-6 border-t border-black/[0.06] bg-white">
            <div className="flex items-center gap-2 text-[#222222] font-medium mb-4">
              <Package className="w-4 h-4 text-primary" />
              <h3 className="text-lg">Productos incluidos ({combo.products.length})</h3>
            </div>
            <div className="space-y-3">
              {combo.products.map((product, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#f5f5f5] rounded-xl p-3 border border-black/[0.06]">
                  <div className="w-14 h-14 rounded-lg overflow-hidden relative flex-shrink-0 bg-gray-100">
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill sizes="56px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#222222]/30">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#222222]">{product.name}</p>
                    <p className="text-xs text-[#222222]/50">{product.benefit}</p>
                  </div>
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
          </motion.div>
        )}

        {/* Benefits */}
        {combo.benefits.length > 0 && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="px-4 py-6 border-t border-black/[0.06] bg-white">
            <h2 className="text-lg font-semibold text-[#222222] mb-4">Beneficios</h2>
            <div className="grid grid-cols-2 gap-3">
              {combo.benefits.map((benefit, i) => (
                <div 
                  key={i} 
                  className="bg-[#f5f5f5] rounded-xl p-3 border border-black/[0.06] text-center"
                >
                  <Sparkles className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-[#222222]/80">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          </motion.div>
        )}

        {/* Descripcion / Que es - Mobile */}
        {(combo.description || combo.queEs) && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="px-4 py-6 border-t border-black/[0.06] bg-white">
            <h2 className="text-lg font-semibold text-[#222222] mb-4">
              {combo.queEs ? 'Que es?' : 'Descripcion'}
            </h2>
            <p className="text-sm text-[#222222]/80 leading-relaxed">
              {combo.queEs || combo.description}
            </p>
          </div>
          </motion.div>
        )}

        {/* Modo de uso - Mobile */}
        {combo.howToUse && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="px-4 py-6 border-t border-black/[0.06] bg-white">
            <h2 className="text-lg font-semibold text-[#222222] mb-4">Modo de uso</h2>
            <p className="text-sm text-[#222222]/80 leading-relaxed whitespace-pre-line">
              {combo.howToUse}
            </p>
          </div>
          </motion.div>
        )}

        {/* Ingredientes - Mobile */}
        {combo.ingredients && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="px-4 py-6 border-t border-black/[0.06] bg-white">
            <h2 className="text-lg font-semibold text-[#222222] mb-4">Ingredientes</h2>
            <p className="text-xs text-[#222222]/70 leading-relaxed whitespace-pre-line">
              {combo.ingredients}
            </p>
          </div>
          </motion.div>
        )}

        {/* Reviews */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <div className="px-4 py-6 border-t border-black/[0.06] bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#222222]">Reseñas</h2>
            <span className="text-xs text-[#222222]/40">({reviews.count})</span>
          </div>
          
          <div className="space-y-3">
            {reviews.featured.map((review, i) => (
              <div 
                key={i} 
                className="bg-[#f5f5f5] rounded-xl p-4 border border-black/[0.06]"
              >
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-[#222222]/80 mb-1">"{review.text}"</p>
                <p className="text-xs text-primary">— {review.author}</p>
              </div>
            ))}
          </div>
        </div>
        </motion.div>

        {/* Trust */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <div className="px-4 py-6 border-t border-black/[0.06] bg-white">
          <div className="grid grid-cols-2 gap-3">
            {trustItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div 
                  key={i} 
                  className="flex items-center gap-2.5 text-xs text-[#222222]/50 bg-[#f5f5f5] py-2.5 px-3 rounded-lg"
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
        </motion.div>

        {/* Related - Mobile Carrusel */}
        {relatedCombos.length > 0 && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="px-4 py-6 border-t border-black/[0.06] bg-white">
            <h2 className="text-lg font-semibold text-[#222222] mb-4">Otros combos</h2>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
              {relatedCombos.slice(0, 4).map((c) => (
                <Link 
                  key={c.id} 
                  href={`/combos/${c.slug}`}
                  className="flex-shrink-0 w-44 bg-white rounded-xl overflow-hidden border border-black/[0.06] snap-start"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={c.image || '/productos/combo-full.jpeg'}
                      alt={c.title}
                      fill
                      sizes="176px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs text-[#222222] font-medium line-clamp-2 mb-1">
                      {c.title}
                    </h3>
                    <span className="text-sm font-bold text-primary">
                      ${(c.price || 0).toLocaleString('es-AR')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {/* Indicador de scroll */}
            <div className="flex justify-center gap-1.5 mt-2">
              {[...Array(Math.min(relatedCombos.length, 4))].map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#222222]/20" />
              ))}
            </div>
          </div>
          </motion.div>
        )}

        <div className="h-24"></div>
      </div>

      {/* Sticky CTA Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-black/[0.06] px-4 py-4 z-40 shadow-premium">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#f5f5f5] border border-black/[0.06] rounded-xl">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))} 
              className="px-3 py-2 text-[#222222]/60 hover:text-[#222222] transition-all duration-300 ease-premium"
            >
              −
            </button>
            <span className="px-3 py-2 text-sm font-semibold text-[#222222] min-w-[30px] text-center">
              {quantity}
            </span>
            <button 
              onClick={() => setQuantity(quantity + 1)} 
              className="px-3 py-2 text-[#222222]/60 hover:text-[#222222] transition-all duration-300 ease-premium"
            >
              +
            </button>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex-1 py-3.5 text-base font-semibold rounded-xl transition-all duration-500 ease-premium active:scale-[0.98] hover:shadow-glow-lg ${
              isAdding 
                ? 'bg-green-500 text-white'
                : 'bg-primary hover:bg-primary/90 text-black shadow-lg shadow-primary/30'
            }`}
          >
            {isAdding ? '✓ Agregado' : 'Agregar combo'}
          </button>
        </div>
        
        <p className="text-center text-[10px] text-[#222222]/30 mt-2 flex items-center justify-center gap-1">
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
              src={combo.image || '/productos/combo-full.jpeg'}
              alt={combo.title}
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

      {/* Estilos para scrollbar hide */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}