import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { sendEmail } from '@/lib/email';

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

// POST /api/webhook/mercadopago - procesar pagos
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Solo procesar payments
    if (type !== 'payment') {
      return NextResponse.json({ message: 'Ignored' });
    }

    const paymentId = data.id;
    const mongoClient = await getClient();

    // 1. Obtener datos del pago desde MP
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('MP_ACCESS_TOKEN no configurado');
      return NextResponse.json({ error: 'MP no configurado' }, { status: 500 });
    }

    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      }
    );

    if (!mpResponse.ok) {
      console.error('Error fetching payment from MP');
      return NextResponse.json({ error: 'Error MP' }, { status: 500 });
    }

    const payment = await mpResponse.json();

    // Solo procesar pagos aprobados
    if (payment.status !== 'approved') {
      console.log(`Payment ${paymentId} status: ${payment.status}`);
      return NextResponse.json({ message: 'Not approved' });
    }

    const preferenceId = payment.preference_id;
    const externalReference = payment.external_reference;

    // 2. Buscar la venta por preferenceId
    const salesCollection = mongoClient.db('ushuaia').collection('sales');
    const sale = await salesCollection.findOne({ preferenceId });

    if (!sale) {
      console.error('Sale not found for preference:', preferenceId);
      // Maybe it's a new sale - create it from payment
      return NextResponse.json({ 
        message: 'Sale not found', 
        preferenceId,
        externalReference 
      });
    }

    // 3. Si ya pagada, skip
    if (sale.status === 'paid') {
      return NextResponse.json({ message: 'Already paid' });
    }

    // 4. Descontar stock de cada item
    const productsCollection = mongoClient.db('ushuaia').collection('products');
    const stockDeduction: string[] = [];

    for (const item of sale.items) {
      try {
        // Buscar el producto por título o por ID
        let product;
        const productIdStr = item.productId?.toString() || '';
        
        // Si es un ObjectId válido (24 hex), buscar por _id
        if (/^[a-f0-9]{24}$/i.test(productIdStr)) {
          product = await productsCollection.findOne({ _id: new ObjectId(productIdStr) });
        }
        
        // Si no se encuentra por ID, buscar por título
        if (!product && item.title) {
          product = await productsCollection.findOne({ title: item.title });
        }
        
        // También buscar por slug
        if (!product && item.title) {
          const slug = item.title.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          product = await productsCollection.findOne({ slug });
        }

        if (product) {
          const newStock = Math.max(0, (product.stock || 0) - item.quantity);
          await productsCollection.updateOne(
            { _id: product._id },
            { $set: { stock: newStock, updatedAt: new Date() } }
          );
          stockDeduction.push(item.title);
        } else {
          console.log('Product not found for:', item.productId, item.title);
        }
      } catch (err) {
        console.error('Error deducing stock for:', item.productId, err);
      }
    }

    // 5. Actualizar status de la venta
    await salesCollection.updateOne(
      { _id: sale._id },
      { 
        $set: { 
          status: 'paid',
          paymentId: paymentId.toString(),
          paidAt: new Date(),
        } 
      }
    );

    // 6. Enviar email de confirmación
    try {
      await sendEmail('payment_success', {
        buyerEmail: sale.buyerEmail,
        buyerName: sale.buyerNombre,
        orderId: sale.preferenceId,
        total: sale.total,
        items: sale.items,
        paymentId: paymentId.toString(),
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    console.log(`Payment ${paymentId} processed. Stock deducted:`, stockDeduction);

    return NextResponse.json({
      success: true,
      paymentId,
      status: 'paid',
      stockDeducted: stockDeduction.length,
      items: stockDeduction,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'webhook/mercadopago' });
}