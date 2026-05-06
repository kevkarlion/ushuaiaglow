'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImage, getOrderedImages } from '@/types/product';

interface ProductImageGalleryProps {
  images: ProductImage[] | string[] | undefined;
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Obtener URLs ordenadas
  const imageUrls = getOrderedImages(images);
  
  // No mostrar thumbnails si solo hay 1 imagen
  const showThumbnails = imageUrls.length > 1;
  
  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setSelectedIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };
  
  // Edge case: sin imágenes
  if (imageUrls.length === 0) {
    return (
      <div className="relative aspect-square bg-surface-darker rounded-2xl flex items-center justify-center">
        <span className="text-white/40">Sin imagen</span>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Thumbnails - vertical en mobile, vertical en desktop */}
      {showThumbnails && (
        <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {imageUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                selectedIndex === index
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-black'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={url}
                alt={`${productName} - imagen ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Imagen principal */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-darker flex-1 order-1 md:order-2">
        <Image
          src={imageUrls[selectedIndex]}
          alt={`${productName} - imagen principal`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        
        {/* Navegación con flechas - solo si hay más de 1 imagen */}
        {showThumbnails && (
          <>
            {/* Botón anterior */}
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Botón siguiente */}
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            {/* Indicadores de posición */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {imageUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    selectedIndex === index
                      ? 'bg-primary w-4'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Ver imagen ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}