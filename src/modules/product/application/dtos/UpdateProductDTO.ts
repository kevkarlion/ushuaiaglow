import { z } from 'zod';

export const UpdateProductDTOSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  price: z.number().positive().optional(),
  category: z.string().max(50).optional(),
  stock: z.number().int().min(0).optional(),
  images: z.array(z.string()).optional(),
});

export type UpdateProductDTO = z.infer<typeof UpdateProductDTOSchema>;