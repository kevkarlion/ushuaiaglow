import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'ushuaia-secret-change-in-production';

// GET /api/auth/me
export async function GET(request: Request) {
  // Primero cookie
  const cookieStore = await cookies();
  let token = cookieStore.get('auth-token')?.value;

  // Luego header
  if (!token) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; rol: string };
    return NextResponse.json({
      authenticated: true,
      user: { id: decoded.id, email: decoded.email, rol: decoded.rol },
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}