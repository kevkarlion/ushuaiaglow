import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

// Singleton client - no closing!
let client: MongoClient | null = null;

async function getClient() {
  const mongoUri = process.env.MONGODB_URI || '';
  if (!mongoUri || mongoUri.includes('your_password') || mongoUri.length < 20) {
    throw new Error('MongoDB no configurada');
  }
  if (!client) {
    client = new MongoClient(mongoUri);
    await client.connect();
  }
  return client;
}

// Mock data para desarrollo cuando MongoDB no está disponible
const MOCK_PRODUCTS = [
  { _id: '1', name: 'Remera Algodón', price: 2500, category: 'ropa', images: ['https://picsum.photos/seed/prod1/400'] },
  { _id: '2', name: 'Pantalón Jean', price: 8500, category: 'ropa', images: ['https://picsum.photos/seed/prod2/400'] },
  { _id: '3', name: 'Zapatillas Urbanas', price: 12000, category: 'calzado', images: ['https://picsum.photos/seed/prod3/400'] },
  { _id: '4', name: 'Gorra Baseball', price: 1800, category: 'accesorios', images: ['https://picsum.photos/seed/prod4/400'] },
  { _id: '5', name: 'Buzo Corderito', price: 6500, category: 'ropa', images: ['https://picsum.photos/seed/prod5/400'] },
];

// GET all products
export async function GET() {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri || uri.includes('your_password') || uri.length < 20) {
      console.warn('⚠️ MongoDB no configurada, usando datos mock');
      return NextResponse.json(MOCK_PRODUCTS.map(p => ({
        ...p,
        id: p._id,
        category: p.category.charAt(0).toUpperCase() + p.category.slice(1),
      })));
    }
    
    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('products');
    const products = await collection.find({}).toArray();
    
    // Filter and transform: exclude products with bad images, capitalize category
    const formattedProducts = products
      .filter((p) => p.category?.toLowerCase() !== 'electronics')
      .filter((p) => !p.images?.[0]?.includes('unsplash.com')) // solo picsum
      .map((p) => ({
        ...p,
        id: p._id.toString(),
        category: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1).toLowerCase() : '',
      }));
    
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}

// POST new product or bulk import
export async function POST(request: Request) {
  try {
    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('products');
    
    const body = await request.json();
    
    // Check if it's a bulk import (array of products)
    if (Array.isArray(body)) {
      if (body.length === 0) {
        return NextResponse.json({ error: 'Array vacío' }, { status: 400 });
      }
      
      const products = body.map((p) => {
        // Parsear productsIncluded si viene como string (del Excel)
        let productsIncludedArr: string[] = [];
        if (p.productsIncluded) {
          if (Array.isArray(p.productsIncluded)) {
            productsIncludedArr = p.productsIncluded;
          } else if (typeof p.productsIncluded === 'string') {
            try {
              productsIncludedArr = JSON.parse(p.productsIncluded);
            } catch {
              productsIncludedArr = [];
            }
          }
        }
        
        return {
          title: p.title || p.name || '',
          description: p.description || '',
          price: Number(p.price) || 0,
          originalPrice: p.originalPrice || p.priceOriginal || p.original_price || undefined,
          discount: p.discount || p.descuento ? Number(p.discount || p.descuento) : undefined,
          category: p.category || 'General',
          brand: p.brand || '',
          stock: Number(p.stock) || 0,
          images: Array.isArray(p.images) ? p.images : p.images || p.imageUrl ? [p.images?.[0] || p.imageUrl] : [],
          ingredients: p.ingredients || '',
          howToUse: p.howToUse || p.modoDeUso || '',
          warnings: p.warnings || p.advertencias || '',
          weight: p.weight || p.peso || '',
          isCombo: p.isCombo || p.is_combo || p.combo === 'true' || p.combo === true ? true : false,
          productsIncluded: productsIncludedArr,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
      
      const result = await collection.insertMany(products);
      
      return NextResponse.json({
        success: true,
        count: result.insertedCount,
        message: `${result.insertedCount} productos importados`,
      });
    }
    
    // Single product
    const product = {
      ...body,
      images: body.images || [`https://picsum.photos/seed/${Date.now()}/400`],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await collection.insertOne(product);
    
    return NextResponse.json({
      success: true,
      id: result.insertedId,
      product: { ...product, _id: result.insertedId },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
}