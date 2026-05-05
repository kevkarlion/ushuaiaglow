import mongoose, { Schema, Document } from 'mongoose';

export interface IProductDocument extends Document {
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

const ProductSchema = new Schema<IProductDocument>(
  {
    title: { type: String, required: true, minlength: 1, maxlength: 200 },
    slug: { type: String, maxlength: 200 },
    description: { type: String, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 100 },
    category: { type: String, maxlength: 50 },
    brand: { type: String, maxlength: 50 },
    stock: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    ingredients: { type: String, maxlength: 1000 },
    howToUse: { type: String, maxlength: 1000 },
    warnings: { type: String, maxlength: 500 },
    weight: { type: String, maxlength: 50 },
    isCombo: { type: Boolean, default: false },
    productsIncluded: { type: [String], default: [] },
    // Nuevos campos
    tagline: { type: String, maxlength: 200 },
    queEs: { type: String, maxlength: 500 },
    commercialDescription: { type: String, maxlength: 2000 },
    benefits: { type: [String], default: [] },
    featuredReview: {
      text: { type: String, maxlength: 500 },
      author: { type: String, maxlength: 100 },
    },
    rating: { type: Number, min: 0, max: 5 },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = mongoose.model<IProductDocument>('Product', ProductSchema);