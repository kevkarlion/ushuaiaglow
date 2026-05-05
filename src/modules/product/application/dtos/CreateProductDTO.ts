import { z } from 'zod';

export const CreateProductDTOSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  price: z.number().positive('Price must be greater than 0'),
  originalPrice: z.number().positive().optional(),
  discount: z.number().min(0).max(100).optional(),
  category: z.string().max(50).optional(),
  brand: z.string().max(50).optional(),
  stock: z.number().int().min(0, 'Stock must be 0 or more'),
  images: z.array(z.string()).optional(),
  ingredients: z.string().max(1000).optional(),
  howToUse: z.string().max(1000).optional(),
  warnings: z.string().max(500).optional(),
  weight: z.string().max(50).optional(),
  isCombo: z.boolean().optional(),
  productsIncluded: z.array(z.string()).optional(),
  // Nuevos campos
  tagline: z.string().max(200).optional(),
  queEs: z.string().max(500).optional(),
  commercialDescription: z.string().max(2000).optional(),
  benefits: z.array(z.string()).optional(),
  featuredReview: z.object({
    text: z.string().max(500),
    author: z.string().max(100),
  }).optional(),
  rating: z.number().min(0).max(5).optional(),
});

export type CreateProductDTO = z.infer<typeof CreateProductDTOSchema>;