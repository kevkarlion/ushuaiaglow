import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

// POST /api/test/email - Envía un email de prueba
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, type } = body;

    const testEmail = email || 'test@example.com';
    const emailType = type || 'payment_success';

    console.log('📧 Enviando email de prueba:', { testEmail, emailType });

    // Datos de prueba
    const testData = {
      buyerEmail: testEmail,
      buyerName: 'Cliente de Prueba',
      orderId: `test-${Date.now()}`,
      total: 15000,
      items: [
        { title: 'Producto de Prueba x1', quantity: 1, price: 15000 }
      ],
      paymentId: 'TEST-' + Date.now(),
    };

    const result = await sendEmail(emailType, testData);

    return NextResponse.json({
      success: result,
      message: result ? 'Email enviado exitosamente' : 'Error al enviar email',
      email: testEmail,
      type: emailType,
    });
  } catch (error) {
    console.error('❌ Error en test/email:', error);
    return NextResponse.json(
      { error: 'Error enviando email', details: String(error) },
      { status: 500 }
    );
  }
}

// GET /api/test/email - Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'test/email' });
}