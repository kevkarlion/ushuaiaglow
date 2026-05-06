// Imagen individual con orden
export interface ProductImage {
  url: string;
  order: number; // 0 = imagen principal
}

// Función helper para obtener imagen principal
export function getMainImage(images: ProductImage[] | string[] | undefined): string {
  if (!images || images.length === 0) return '/productos/placeholder.png';
  
  // Si es array de strings (formato antiguo), usar el primero
  if (typeof images[0] === 'string') {
    return (images as string[])[0];
  }
  
  // Si es array de ProductImage, ordenar por order
  const sorted = [...(images as ProductImage[])].sort((a, b) => a.order - b.order);
  return sorted[0]?.url || '/productos/placeholder.png';
}

// Función helper para obtener todas las URLs ordenadas
export function getOrderedImages(images: ProductImage[] | string[] | undefined): string[] {
  if (!images || images.length === 0) return ['/productos/placeholder.png'];
  
  if (typeof images[0] === 'string') {
    return images as string[];
  }
  
  return [...(images as ProductImage[])].sort((a, b) => a.order - b.order).map(img => img.url);
}

export interface Product {
  id: string;
  title: string;
  slug?: string;         // URL amigable (ej: "vitamina" en vez de "69e3c4b322fa...")
  description?: string;
  price: number;           // Precio de venta (salePrice)
  originalPrice?: number; // Precio original tachado
  discount?: number;       // Descuento en % (ej: 20)
  category?: string;
  brand?: string;
  stock: number;
  images: ProductImage[]; // Nuevo formato con orden
  ingredients?: string;
  howToUse?: string;
  warnings?: string;
  weight?: string;
  isCombo?: boolean;       // true si es un combo
  productsIncluded?: string[]; // IDs de productos incluidos en el combo
  // Nuevos campos para ProductDetail
  tagline?: string;       // Beneficio principal (ej: "El boost de energía que tu rostro necesita")
  queEs?: string;        // Qué es el producto
  commercialDescription?: string; // Descripción comercial
  benefits?: string[];   // Array de beneficios
  featuredReview?: {     // Reseña destacada
    text: string;
    author: string;
  };
  rating?: number;       // Puntuación (ej: 4.5)
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category?: string;
  brand?: string;
  stock: number;
  images?: ProductImage[];
  ingredients?: string;
  howToUse?: string;
  warnings?: string;
  weight?: string;
  isCombo?: boolean;
  productsIncluded?: string[];
  // Nuevos campos
  tagline?: string;
  queEs?: string;
  commercialDescription?: string;
  benefits?: string[];
  featuredReview?: { text: string; author: string };
  rating?: number;
}