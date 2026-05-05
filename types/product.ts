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
  images: string[];
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
  images?: string[];
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