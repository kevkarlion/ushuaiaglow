import { Product, CreateProductInput, UpdateProductInput } from '../../domain/entities/Product';
import { CreateProductDTO } from '../dtos/CreateProductDTO';
import { UpdateProductDTO } from '../dtos/UpdateProductDTO';

export interface ProductDoc {
  _id: unknown;
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
  // Nuevos campos
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

export class ProductMapper {
  static toEntity(dto: CreateProductDTO): CreateProductInput {
    return {
      title: dto.title,
      slug: dto.slug,
      description: dto.description,
      price: dto.price,
      originalPrice: dto.originalPrice,
      discount: dto.discount,
      category: dto.category,
      brand: dto.brand,
      stock: dto.stock,
      images: dto.images,
      ingredients: dto.ingredients,
      howToUse: dto.howToUse,
      warnings: dto.warnings,
      weight: dto.weight,
      isCombo: dto.isCombo,
      productsIncluded: dto.productsIncluded,
      // Nuevos campos
      tagline: dto.tagline,
      queEs: dto.queEs,
      commercialDescription: dto.commercialDescription,
      benefits: dto.benefits,
      featuredReview: dto.featuredReview,
      rating: dto.rating,
    };
  }

  static toEntityFromUpdate(dto: UpdateProductDTO): UpdateProductInput {
    return {
      title: dto.title,
      slug: dto.slug,
      description: dto.description,
      price: dto.price,
      originalPrice: dto.originalPrice,
      discount: dto.discount,
      category: dto.category,
      brand: dto.brand,
      stock: dto.stock,
      images: dto.images,
      ingredients: dto.ingredients,
      howToUse: dto.howToUse,
      warnings: dto.warnings,
      weight: dto.weight,
      isCombo: dto.isCombo,
      productsIncluded: dto.productsIncluded,
      // Nuevos campos
      tagline: dto.tagline,
      queEs: dto.queEs,
      commercialDescription: dto.commercialDescription,
      benefits: dto.benefits,
      featuredReview: dto.featuredReview,
      rating: dto.rating,
    };
  }

  static fromDocument(doc: ProductDoc): Product {
    return {
      id: String(doc._id),
      title: doc.title,
      slug: doc.slug,
      description: doc.description,
      price: doc.price,
      originalPrice: doc.originalPrice,
      discount: doc.discount,
      category: doc.category,
      brand: doc.brand,
      stock: doc.stock,
      images: doc.images || [],
      ingredients: doc.ingredients,
      howToUse: doc.howToUse,
      warnings: doc.warnings,
      weight: doc.weight,
      isCombo: doc.isCombo,
      productsIncluded: doc.productsIncluded,
      // Nuevos campos
      tagline: doc.tagline,
      queEs: doc.queEs,
      commercialDescription: doc.commercialDescription,
      benefits: doc.benefits,
      featuredReview: doc.featuredReview,
      rating: doc.rating,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}