export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  title: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
  images?: string[];
}