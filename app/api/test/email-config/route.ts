import { NextResponse } from 'next/server';
import { checkEmailConfig } from '@/lib/email';

// GET /api/test/email-config - Verifica la config SMTP
export async function GET() {
  try {
    const config = await checkEmailConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { configured: false, error: String(error) },
      { status: 500 }
    );
  }
}