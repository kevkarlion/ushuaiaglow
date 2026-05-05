import { Product, CreateProductInput, UpdateProductInput } from '../../../domain/entities/Product';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { ProductModel } from '../../../infrastructure/database/schemas/ProductSchema';
import { ProductMapper, ProductDoc } from '../../../application/mappers/ProductMapper';

export class ProductRepositoryMongo implements IProductRepository {
  async findAll(): Promise<Product[]> {
    const docs = await ProductModel.find().exec();
    return docs.map((doc) => ProductMapper.fromDocument(doc as unknown as ProductDoc));
  }

  async findById(id: string): Promise<Product | null> {
    const doc = await ProductModel.findById(id).exec();
    return doc ? ProductMapper.fromDocument(doc as unknown as ProductDoc) : null;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const doc = await ProductModel.create({
      title: input.title,
      slug: input.slug,
      description: input.description,
      price: input.price,
      originalPrice: input.originalPrice,
      discount: input.discount,
      category: input.category,
      brand: input.brand,
      stock: input.stock,
      images: input.images || [],
      ingredients: input.ingredients,
      howToUse: input.howToUse,
      warnings: input.warnings,
      weight: input.weight,
      isCombo: input.isCombo,
      productsIncluded: input.productsIncluded,
      // Nuevos campos
      tagline: input.tagline,
      queEs: input.queEs,
      commercialDescription: input.commercialDescription,
      benefits: input.benefits,
      featuredReview: input.featuredReview,
      rating: input.rating,
    });
    return ProductMapper.fromDocument(doc as unknown as ProductDoc);
  }

  async update(id: string, input: UpdateProductInput): Promise<Product | null> {
    const doc = await ProductModel.findByIdAndUpdate(id, input, { new: true }).exec();
    return doc ? ProductMapper.fromDocument(doc as unknown as ProductDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async addImages(id: string, images: string[]): Promise<Product | null> {
    const doc = await ProductModel.findByIdAndUpdate(
      id,
      { $push: { images: { $each: images } } },
      { new: true }
    ).exec();
    return doc ? ProductMapper.fromDocument(doc as unknown as ProductDoc) : null;
  }
}