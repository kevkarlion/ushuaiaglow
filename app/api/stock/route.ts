import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

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

// GET /api/stock - obtener todos los productos con su stock
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const lowStock = searchParams.get('lowStock');
    const stock = searchParams.get('stock'); // For ranges like "0,2"
    
    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('products');
    
    // Build filter
    const filter: Record<string, unknown> = {};
    if (category) {
      filter.category = category;
    }
    if (lowStock === 'true') {
      filter.stock = { $lt: 5, $gte: 0 };
    }
    if (stock) {
      const [min, max] = stock.split(',').map(Number);
      if (!isNaN(min)) {
        if (!isNaN(max)) {
          filter.stock = { $gte: min, $lte: max };
        } else {
          filter.stock = { $gte: min };
        }
      }
    }
    
    const products = await collection.find(filter).toArray();
    
    const formatted = products.map(p => ({
      id: p._id.toString(),
      title: p.title,
      stock: p.stock || 0,
      price: p.price,
      category: p.category,
      image: p.images?.[0] || null,
    }));
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json({ error: 'Error fetching stock' }, { status: 500 });
  }
}