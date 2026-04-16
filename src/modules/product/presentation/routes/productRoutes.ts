import { Router, Request, Response, NextFunction } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '../../application/services/ProductService';
import { ProductRepositoryMongo } from '../../infrastructure/database/repositories/ProductRepositoryMongo';
import { upload } from '../../infrastructure/storage/storageConfig';

const productRepository = new ProductRepositoryMongo();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => productController.create(req, res, next));
router.get('/', (req: Request, res: Response, next: NextFunction) => productController.getAll(req, res, next));
router.get('/:id', (req: Request, res: Response, next: NextFunction) => productController.getById(req, res, next));
router.put('/:id', (req: Request, res: Response, next: NextFunction) => productController.update(req, res, next));
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => productController.delete(req, res, next));
router.post('/:id/images', upload.array('images', 10), (req: Request, res: Response, next: NextFunction) => productController.uploadImages(req, res, next));

export default router;