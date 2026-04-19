'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasDiscount = product.price > 100;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Validar que la URL de imagen sea válida (absoluta o path relativo)
  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url || url.trim() === '') return false;
    
    // Si es un path relativo (empieza con /), es válido
    if (url.startsWith('/')) return true;
    
    // Si es URL absoluta, validar que sea válida
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const productImage = product.images?.[0] || '';

  const handleProductClick = () => {
    router.push(`/products/${product.id}`);
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
    
    setTimeout(() => setIsAdding(false), 500);
  };

  if (!mounted) return null;

  return (
    <div className="group bg-white rounded-lg overflow-hidden hover:shadow-apple transition-all duration-300">
      {/* Image - clickable div */}
      <div 
        onClick={handleProductClick}
        className="block relative aspect-square bg-surface-light overflow-hidden cursor-pointer"
      >
        {product.images && product.images.length > 0 && isValidImageUrl(product.images[0]) ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-2 bg-primary/20 rounded-full"></div>
              <p className="text-xs text-gray-400">Producto</p>
            </div>
          </div>
        )}
        
{/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount && product.discount > 0 && (
            <span className="bg-accent text-white text-[10px] font-semibold px-2 py-1 rounded">
              -{product.discount}%
            </span>
          )}
          {product.isCombo && (
            <span className="bg-primary text-white text-[10px] font-semibold px-2 py-1 rounded">
              COMBO
            </span>
          )}
          {product.stock < 5 && (
            <span className="bg-orange-500 text-white text-[10px] font-semibold px-2 py-1 rounded">
              Ultimas
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Category + Brand */}
        <div className="flex items-center justify-between text-[10px]">
          {product.category && (
            <span className="text-gray-400 uppercase tracking-wider">{product.category}</span>
          )}
          {product.brand && (
            <span className="text-primary font-medium">{product.brand}</span>
          )}
        </div>

        <h3 
          onClick={handleProductClick}
          className="font-semibold text-sm text-surface-darker leading-[1.19] group-hover:text-primary transition-colors line-clamp-2 cursor-pointer"
        >
          {product.title}
        </h3>

        {/* Quick info */}
        {product.weight && (
          <p className="text-xs text-gray-500">{product.weight}</p>
        )}
        {product.ingredients && (
          <p className="text-xs text-gray-400 line-clamp-1">{product.ingredients}</p>
        )}

        <div className="flex items-center gap-2 pt-1">
          {product.discount && product.discount > 0 && (
            <span className="text-sm font-semibold text-accent">{product.discount}% OFF</span>
          )}
          <span className="text-lg font-semibold text-surface-darker">${product.price.toFixed(2)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className={`w-full py-2.5 bg-surface-darker hover:bg-primary disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-sm font-normal rounded-lg transition-colors duration-200 ${
            isAdding ? 'bg-primary' : ''
          }`}
        >
          {isAdding ? 'Agregado' : product.stock === 0 ? 'Sin stock' : 'Añadir'}
        </button>
      </div>
    </div>
  );
}