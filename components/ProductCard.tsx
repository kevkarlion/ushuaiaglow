'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product, getMainImage } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { trackSelectItem, buildGA4Item } from '@/lib/ga4-ecommerce';
import { trackAddToCart } from '@/lib/meta-pixel';
import { Star, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url || url.trim() === '') return false;
    return true;
  };

  const productImage = getMainImage(product.images);
  const productSlug = product.slug || product.id;

  const handleProductClick = () => {
    trackSelectItem({
      item_list_id: 'products_list',
      item_list_name: 'Todos los productos',
      items: [buildGA4Item(product.id, product.title, product.price, 1, product.category, product.brand)]
    });
    router.push(`/productos/${productSlug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setIsAdding(true);
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || '',
    });
    
    trackAddToCart(product.id, product.title, product.price);
    
    setTimeout(() => setIsAdding(false), 1000);
  };

  if (!mounted) return null;

  return (
    <div 
      onClick={handleProductClick}
      className="group bg-surface-darker/50 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/40 transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square bg-surface-darker overflow-hidden">
{product.images && product.images.length > 0 ? (
          <Image 
            src={getMainImage(product.images)}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-primary/40" />
            </div>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount && product.discount > 0 && (
            <span className="bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
          {product.isCombo && (
            <span className="bg-primary text-black text-[10px] font-bold px-2.5 py-1 rounded-full">
              COMBO
            </span>
          )}
          {product.stock > 0 && product.stock < 5 && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              Ultimas
            </span>
          )}
        </div>

        {/* Rating badge */}
        {product.rating && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] text-white font-medium">{product.rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category + Brand */}
        <div className="flex items-center justify-between text-[10px]">
          {product.category && (
            <span className="text-white/40 uppercase tracking-wider">{product.category}</span>
          )}
          {product.brand && (
            <span className="text-primary font-medium">{product.brand}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm text-white leading-[1.2] line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        {/* Tagline (nuevo campo) */}
        {product.tagline && (
          <p className="text-xs text-white/50 line-clamp-1">
            {product.tagline}
          </p>
        )}

        {/* Weight */}
        {product.weight && (
          <p className="text-xs text-white/40">{product.weight}</p>
        )}

        {/* Price */}
        <div className="space-y-0.5 pt-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            {product.discount && product.discount > 0 && (
              <span className="text-xs font-semibold text-accent">{product.discount}% OFF</span>
            )}
            <span className="text-lg font-bold text-white">
              ${(product.price || 0).toLocaleString('es-AR')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-white/40 line-through">
                ${(product.originalPrice || 0).toLocaleString('es-AR')}
              </span>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className={`w-full py-3 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
            product.stock === 0 
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : isAdding
                ? 'bg-green-500 text-white'
                : 'bg-primary hover:bg-primary/90 text-black'
          }`}
        >
          {isAdding ? (
            <>
              <Check className="w-4 h-4" />
              Agregado
            </>
          ) : product.stock === 0 ? (
            'Sin stock'
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              Agregar
            </>
          )}
        </button>
      </div>
    </div>
  );
}