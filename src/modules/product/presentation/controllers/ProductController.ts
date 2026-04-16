import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../../application/services/ProductService';
import { CreateProductDTOSchema } from '../../application/dtos/CreateProductDTO';
import { UpdateProductDTOSchema } from '../../application/dtos/UpdateProductDTO';
import { ProductMapper } from '../../application/mappers/ProductMapper';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = CreateProductDTOSchema.parse(req.body);
      const input = ProductMapper.toEntity(parsed);
      const product = await this.productService.createProduct(input);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = UpdateProductDTOSchema.parse(req.body);
      const input = ProductMapper.toEntityFromUpdate(parsed);
      const product = await this.productService.updateProduct(req.params.id, input);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.productService.deleteProduct(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async uploadImages(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      const imagePaths = files.map((file) => `/uploads/products/${file.filename}`);
      const product = await this.productService.addImages(req.params.id, imagePaths);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
}