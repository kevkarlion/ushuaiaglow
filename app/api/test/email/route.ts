import { NextResponse } from 'next/server';
import { sendEmail, checkEmailConfig } from '@/lib/email';

// GET - Check SMTP config
export async function GET() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS ? '*** configurado ***' : 'NO CONFIGURADO';
  const smtpFrom = process.env.SMTP_FROM;

  return NextResponse.json({
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    smtpFrom,
    baseUrl: process.env.NEXT_PUBLIC_URL,
  });
}

// POST - Send test email
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };

    const testEmail = email || 'info@ushuaiaglow.com';

    const result = await sendEmail('payment_success', {
      buyerEmail: testEmail,
      buyerName: 'Test User',
      orderId: `test-${Date.now()}`,
      total: 1000,
      items: [
        { title: 'Producto de Prueba x1', quantity: 1, price: 1000 }
      ],
      paymentId: 'test-payment-123',
    });

    return NextResponse.json({ 
      success: result, 
      message: result ? 'Email enviado' : 'Email falló',
      testEmail: testEmail 
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      error: String(error) 
    }, { status: 500 });
  }
}