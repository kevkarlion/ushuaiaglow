export interface Product {
  id: string;
  title: string;
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
}