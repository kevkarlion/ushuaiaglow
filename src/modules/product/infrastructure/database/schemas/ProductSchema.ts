import mongoose, { Schema, Document } from 'mongoose';

export interface IProductDocument extends Document {
  title: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    title: { type: String, required: true, minlength: 1, maxlength: 200 },
    description: { type: String, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, maxlength: 50 },
    stock: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = mongoose.model<IProductDocument>('Product', ProductSchema);