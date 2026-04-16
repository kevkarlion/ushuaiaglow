import { z } from 'zod';

export const CreateProductDTOSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  price: z.number().positive('Price must be greater than 0'),
  category: z.string().max(50).optional(),
  stock: z.number().int().min(0, 'Stock must be 0 or more'),
  images: z.array(z.string()).optional(),
});

export type CreateProductDTO = z.infer<typeof CreateProductDTOSchema>;