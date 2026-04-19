import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'ushuaia-secret-change-in-production';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  console.log('🔍 Middleware:', pathname);
  console.log('🍪 Token:', token ? 'YES' : 'NO');

  // Rutas públicas del admin
  const publicPaths = ['/admin/login', '/admin/register'];
  if (publicPaths.includes(pathname)) {
    console.log('✅ Public path');
    return NextResponse.next();
  }

  // /admin va directo al panel (no redirigir)

  // Proteger rutas /admin/*
  if (pathname.startsWith('/admin')) {
    if (!token) {
      console.log('❌ No token, redirect login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      console.log('✅ Token valid');
      return NextResponse.next();
    } catch (err) {
      console.log('❌ Token invalid:', err);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|og-image.png).*)',
  ],
};