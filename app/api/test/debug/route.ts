import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

async function getClient() {
  const mongoUri = process.env.MONGODB_URI || '';
  if (!mongoUri) throw new Error('MongoDB no configurada');
  const client = new MongoClient(mongoUri);
  await client.connect();
  return client;
}

export async function GET() {
  try {
    const client = await getClient();
    const salesCollection = client.db('ushuaia').collection('sales');
    const productsCollection = client.db('ushuaia').collection('products');
    
    // Get recent sales
    const recentSales = await salesCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    // Get recent products
    const recentProducts = await productsCollection
      .find({})
      .sort({ updatedAt: -1 })
      .limit(5)
      .project({ title: 1, stock: 1, createdAt: 1 })
      .toArray();
    
    return NextResponse.json({
      recentSales: recentSales.map(s => ({
        _id: s._id.toString(),
        preferenceId: s.preferenceId,
        status: s.status,
        items: s.items,
        total: s.total,
        createdAt: s.createdAt,
      })),
      recentProducts: recentProducts.map(p => ({
        _id: p._id.toString(),
        title: p.title,
        stock: p.stock,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}