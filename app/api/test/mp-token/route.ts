import { NextResponse } from 'next/server';

// GET /api/test/mp-token - Verifica si el token de MP funciona
export async function GET() {
  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json({ configured: false, error: 'MP_ACCESS_TOKEN no está configurado' });
  }

  // Intentar obtener info de un pago de prueba (va a dar error pero sabemos si el token sirve)
  try {
    const testPaymentId = '1234567890'; // Payment que no existe, solo para probar el token
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${testPaymentId}`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      }
    );

    const data = await response.json();
    const status = response.status;

    // Si el token es inválido, MP devuelve 401 o 403
    if (status === 401 || status === 403) {
      return NextResponse.json({
        configured: false,
        error: 'Token inválido o expirado',
        status,
        response: data,
      });
    }

    // Si el token es válido pero el pago no existe, devuelve 404
    if (status === 404) {
      return NextResponse.json({
        configured: true,
        message: 'Token válido ✓',
        status,
        paymentNotFound: true, // Esto es normal para un payment fake
        response: data,
      });
    }

    // Token podría ser válido
    return NextResponse.json({
      configured: true,
      status,
      response: data,
    });
  } catch (error) {
    return NextResponse.json({
      configured: false,
      error: String(error),
    });
  }
}