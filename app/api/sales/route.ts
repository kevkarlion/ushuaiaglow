import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

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

// GET /api/sales - listar ventas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const buyerId = searchParams.get('buyerId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('sales');
    
    // Build filter
    const filter: Record<string, unknown> = {};
    if (status) {
      filter.status = status;
    }
    if (buyerId) {
      filter.buyerId = buyerId;
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        (filter.createdAt as Record<string, unknown>).$gte = new Date(startDate);
      }
      if (endDate) {
        (filter.createdAt as Record<string, unknown>).$lte = new Date(endDate);
      }
    }
    
    const sales = await collection.find(filter).sort({ createdAt: -1 }).toArray();
    
    const formatted = sales.map(s => ({
      id: s._id.toString(),
      buyerId: s.buyerId,
      buyerNombre: s.buyerNombre,
      buyerEmail: s.buyerEmail,
      items: s.items,
      total: s.total,
      preferenceId: s.preferenceId,
      paymentId: s.paymentId,
      status: s.status,
      createdAt: s.createdAt,
      paidAt: s.paidAt,
    }));
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json({ error: 'Error fetching sales' }, { status: 500 });
  }
}

// POST /api/sales - crear venta
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { buyerId, buyerNombre, buyerEmail, items, total, preferenceId, status = 'pending' } = body;

    // Validate required
    if (!buyerId || !items || items.length === 0 || !total) {
      return NextResponse.json(
        { error: 'buyerId, items y total son requeridos' },
        { status: 400 }
      );
    }

    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('sales');
    
    const result = await collection.insertOne({
      buyerId,
      buyerNombre: buyerNombre || 'Sin nombre',
      buyerEmail: buyerEmail || '',
      items,
      total,
      preferenceId,
      status,
      createdAt: new Date(),
      paidAt: status === 'paid' ? new Date() : null,
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      status,
    });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json({ error: 'Error creating sale' }, { status: 500 });
  }
}