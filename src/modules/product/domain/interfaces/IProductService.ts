import { Product, CreateProductInput, UpdateProductInput } from '../entities/Product';

export interface IProductService {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(input: CreateProductInput): Promise<Product>;
  updateProduct(id: string, input: UpdateProductInput): Promise<Product | null>;
  deleteProduct(id: string): Promise<boolean>;
  addImages(id: string, images: string[]): Promise<Product | null>;
}