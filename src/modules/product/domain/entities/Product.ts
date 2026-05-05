export interface Product {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category?: string;
  brand?: string;
  stock: number;
  images: string[];
  ingredients?: string;
  howToUse?: string;
  warnings?: string;
  weight?: string;
  isCombo?: boolean;
  productsIncluded?: string[];
  // Nuevos campos para ProductDetail
  tagline?: string;
  queEs?: string;
  commercialDescription?: string;
  benefits?: string[];
  featuredReview?: {
    text: string;
    author: string;
  };
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProductInput = Pick<Product, 'title' | 'price' | 'stock'> &
  Partial<Pick<Product, 
    | 'slug'
    | 'description' 
    | 'originalPrice' 
    | 'discount'
    | 'category'
    | 'brand' 
    | 'images'
    | 'ingredients'
    | 'howToUse'
    | 'warnings'
    | 'weight'
    | 'isCombo'
    | 'productsIncluded'
    | 'tagline'
    | 'queEs'
    | 'commercialDescription'
    | 'benefits'
    | 'featuredReview'
    | 'rating'
  >>;

export type UpdateProductInput = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>;