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
      description: input.description,
      price: input.price,
      category: input.category,
      stock: input.stock,
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