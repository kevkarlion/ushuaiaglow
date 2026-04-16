import { Product, CreateProductInput, UpdateProductInput } from '../../domain/entities/Product';
import { CreateProductDTO } from '../dtos/CreateProductDTO';
import { UpdateProductDTO } from '../dtos/UpdateProductDTO';

export interface ProductDoc {
  _id: unknown;
  title: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class ProductMapper {
  static toEntity(dto: CreateProductDTO): CreateProductInput {
    return {
      title: dto.title,
      description: dto.description,
      price: dto.price,
      category: dto.category,
      stock: dto.stock,
    };
  }

  static toEntityFromUpdate(dto: UpdateProductDTO): UpdateProductInput {
    return {
      title: dto.title,
      description: dto.description,
      price: dto.price,
      category: dto.category,
      stock: dto.stock,
      images: dto.images,
    };
  }

  static fromDocument(doc: ProductDoc): Product {
    return {
      id: String(doc._id),
      title: doc.title,
      description: doc.description,
      price: doc.price,
      category: doc.category,
      stock: doc.stock,
      images: doc.images || [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}