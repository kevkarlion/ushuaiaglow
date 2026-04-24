import { NextResponse } from 'next/server';

const COOKIE_NAME = 'auth-token';

// GET /api/auth/set-cookie?token=xxx - setea cookie y redirect a /admin
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
  }

  // Create response with redirect
  const response = NextResponse.redirect(new URL('/admin', request.url));
  
  // Set cookie on this response - THIS IS THE KEY
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  console.log('🍪 Cookie set, redirecting to /admin');
  return response;
}