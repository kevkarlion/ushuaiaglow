import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

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

// POST /api/auth/register - crear usuario admin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, nombre, rol = 'admin' } = body;

    // Validate required
    if (!email || !password || !nombre) {
      return NextResponse.json(
        { error: 'Email, password y nombre son requeridos' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('users');

    // Check if user exists
    const existing = await collection.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await collection.insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      nombre,
      rol,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario creado correctamente',
      userId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 });
  }
}