import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'ushuaia-secret-change-in-production';
const COOKIE_NAME = 'auth-token';

// POST /api/auth/login
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y password son requeridos' },
        { status: 400 }
      );
    }

    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('users');

    const user = await collection.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, rol: user.rol || 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Login OK, token:', token.substring(0, 20) + '...');

    // Return JSON with token - client will handle redirect
    return NextResponse.json({
      success: true,
      token: token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error en el login' }, { status: 500 });
  }
}