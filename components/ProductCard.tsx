'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.price > 100; // Demo: simulate discount for items > 100

  return (
    <div className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded">
              -20%
            </span>
          )}
          {product.stock < 5 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              ¡Últimas!
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
        )}

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-500 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
          )}
        </div>

        {/* Stock */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-500">
            {product.stock > 0 ? `${product.stock} unidades` : 'Sin stock'}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          disabled={product.stock === 0}
          className="w-full py-3 bg-gray-900 hover:bg-primary-500 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {product.stock === 0 ? 'Sin stock' : 'Añadir al carrito'}
        </button>
      </div>
    </div>
  );
}