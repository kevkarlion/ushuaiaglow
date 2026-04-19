import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

const initialProducts = [
  {
    id: '1',
    title: 'Crema Hidratante Intensiva with Hyaluronic Acid',
    description: 'Crema facial hydrating with 2% hyaluronic acid for deep hydration. Suitable for all skin types. Dermatologically tested.',
    price: 34.90,
    category: 'Cuidado Facial',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop'],
  },
  {
    id: '2',
    title: 'Sérum Reparador con Vitamina C',
    description: 'Sérum with 15% pure Vitamin C for brightening and unify skin tone. With ferulic acid and vitamin E.',
    price: 48.90,
    category: 'Cuidado Facial',
    stock: 8,
    images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&h=800&fit=crop'],
  },
  {
    id: '3',
    title: 'Crema Corporal with Honey & Shea Butter',
    description: 'Rich body cream with organic honey and shea butter. Intense hydration for dry skin. Vegan formula.',
    price: 28.90,
    category: 'Cuidado Corporal',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba9fccd1?w=800&h=800&fit=crop'],
  },
  {
    id: '4',
    title: 'Oil Limpiador Bifásico',
    description: 'Biphasic cleansing oil with jojoba oil and rosehip. Removes waterproof makeup gently.',
    price: 22.90,
    category: 'Cuidado Facial',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1556228720-195a672e96a5?w=800&h=800&fit=crop'],
  },
  {
    id: '5',
    title: 'Mascarilla Sheet Mask Glow',
    description: 'Radiance boosting sheet mask with gold particles and collagen. Instant glow effect.',
    price: 8.90,
    category: 'Cuidado Facial',
    stock: 3,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop'],
  },
  {
    id: '6',
    title: 'Crema de Ojos with Caffeine',
    description: 'Eye cream with green coffee caffeine and peptides. Reduces dark circles and puffiness.',
    price: 38.90,
    category: 'Cuidado Facial',
    stock: 10,
    images: ['https://images.unsplash.com/photo-1571781348782-92c8893ffc45?w=800&h=800&fit=crop'],
  },
  {
    id: '7',
    title: 'Body Oil with Argan & Rose',
    description: 'Fast-absorbing body oil with argan oil and rose fragrance. For silky smooth skin.',
    price: 32.90,
    category: 'Cuidado Corporal',
    stock: 7,
    images: ['https://images.unsplash.com/photo-1617897903246-719242758650?w=800&h=800&fit=crop'],
  },
  {
    id: '8',
    title: 'Champú Reparador with Keratin',
    description: 'Repairing shampoo with hydrolyzed keratin and argan oil. For damaged hair.',
    price: 19.90,
    category: 'Cuidado Capilar',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1585232351009-3137e5e60941?w=800&h=800&fit=crop'],
  },
];

async function getCollection() {
  const client = new MongoClient(uri);
  await client.connect();
  return client.db('ushuaia').collection('products');
}

export async function POST() {
  try {
    const collection = await getCollection();
    
    // Clear existing products
    await collection.deleteMany({});
    
    // Insert initial products
    await collection.insertMany(initialProducts);
    
    await new MongoClient(uri).close();
    
    return NextResponse.json({
      success: true,
      count: initialProducts.length,
    });
  } catch (error) {
    console.error('Error seeding:', error);
    return NextResponse.json({ error: 'Error seeding' }, { status: 500 });
  }
}