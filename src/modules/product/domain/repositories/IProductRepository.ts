import { Product, CreateProductInput, UpdateProductInput } from '../entities/Product';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
  addImages(id: string, images: string[]): Promise<Product | null>;
}