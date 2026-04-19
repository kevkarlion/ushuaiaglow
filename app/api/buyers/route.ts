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

// GET /api/buyers - listar compradores
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const search = searchParams.get('search');
    
    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('buyers');
    
    // Build filter
    const filter: Record<string, unknown> = {};
    if (email) {
      filter.email = email;
    }
    if (search) {
      filter.$or = [
        { nombreCompleto: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    const buyers = await collection.find(filter).sort({ createdAt: -1 }).toArray();
    
    const formatted = buyers.map(b => ({
      id: b._id.toString(),
      nombreCompleto: b.nombreCompleto,
      email: b.email,
      telefono: b.telefono,
      direccion: b.direccion,
      codigoPostal: b.codigoPostal,
      provincia: b.provincia,
      createdAt: b.createdAt,
    }));
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching buyers:', error);
    return NextResponse.json({ error: 'Error fetching buyers' }, { status: 500 });
  }
}

// POST /api/buyers - crear comprador
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombreCompleto, email, telefono, direccion, codigoPostal, provincia } = body;

    // Validate required
    if (!nombreCompleto || !email) {
      return NextResponse.json(
        { error: 'Nombre completo y email son requeridos' },
        { status: 400 }
      );
    }

    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('buyers');
    
    // Check if buyer exists by email
    const existing = await collection.findOne({ email: email.toLowerCase() });
    let buyerId: string;
    let isNew = false;

    if (existing) {
      // Update existing buyer
      await collection.updateOne(
        { _id: existing._id },
        { 
          $set: { 
            nombreCompleto,
            telefono,
            direccion,
            codigoPostal,
            provincia,
            updatedAt: new Date(),
          } 
        }
      );
      buyerId = existing._id.toString();
    } else {
      // Create new buyer
      const result = await collection.insertOne({
        nombreCompleto,
        email: email.toLowerCase(),
        telefono,
        direccion,
        codigoPostal,
        provincia,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      buyerId = result.insertedId.toString();
      isNew = true;
    }

    return NextResponse.json({
      success: true,
      id: buyerId,
      isNew,
      message: isNew ? 'Comprador creado' : 'Comprador actualizado',
    });
  } catch (error) {
    console.error('Error creating buyer:', error);
    return NextResponse.json({ error: 'Error creating buyer' }, { status: 500 });
  }
}