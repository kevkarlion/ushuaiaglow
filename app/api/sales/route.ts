import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

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

// GET - Fetch sales/orders
export async function GET() {
  try {
    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('sales');
    
    const sales = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    
    // Also fetch pending buyers for reference
    const buyersCollection = mongoClient.db('ushuaia').collection('buyers');
    const buyers = await buyersCollection.find({}).toArray();
    const buyersMap = new Map(buyers.map(b => [b._id.toString(), b]));
    
    // Enrich sales with buyer info
    const enrichedSales = sales.map(sale => ({
      ...sale,
      id: sale._id.toString(),
      buyer: sale.buyerId ? buyersMap.get(sale.buyerId.toString()) : null,
    }));
    
    return NextResponse.json(enrichedSales);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error fetching sales' }, { status: 500 });
  }
}