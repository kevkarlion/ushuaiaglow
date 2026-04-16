import { Product, CreateProductInput, UpdateProductInput } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IProductService } from '../../domain/interfaces/IProductService';

export class ProductService implements IProductService {
  constructor(private readonly productRepository: IProductRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    return this.productRepository.create(input);
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product | null> {
    return this.productRepository.update(id, input);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }

  async addImages(id: string, images: string[]): Promise<Product | null> {
    return this.productRepository.addImages(id, images);
  }
}