export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProductInput = Pick<Product, 'title' | 'price' | 'stock'> &
  Partial<Pick<Product, 'description' | 'category'>>;

export type UpdateProductInput = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>;