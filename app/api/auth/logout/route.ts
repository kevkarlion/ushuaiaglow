import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'auth-token';

// POST /api/auth/logout
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  
  return NextResponse.json({ success: true, message: 'Logout exitoso' });
}

// GET /api/auth/logout - redirect al login
export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  
  return NextResponse.redirect(new URL('/admin/login', 'http://localhost:3000'));
}