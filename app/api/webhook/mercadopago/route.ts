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

// Función para procesar un pago
async function processPayment(paymentId: string, mongoClient: any) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('MP_ACCESS_TOKEN no configurado');
  }

  // Obtener datos del pago desde MP
  const mpResponse = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    }
  );

  if (!mpResponse.ok) {
    const errorText = await mpResponse.text();
    throw new Error(`MP error: ${mpResponse.status} - ${errorText}`);
  }

  const payment = await mpResponse.json();

  // Solo procesar pagos aprobados
  if (payment.status !== 'approved') {
    console.log(`⏳ Payment ${paymentId} status: ${payment.status} - no aprobado`);
    return { skipped: true, status: payment.status };
  }

  const preferenceId = payment.preference_id;
  const externalReference = payment.external_reference;

  console.log('✅ Pago aprobado:', { paymentId, preferenceId, externalReference });

  // Buscar checkout pendiente en pending_checkouts
  const pendingCollection = mongoClient.db('ushuaia').collection('pending_checkouts');
  const salesCollection = mongoClient.db('ushuaia').collection('sales');
  
  let pendingCheckout = await pendingCollection.findOne({ externalRef: externalReference });
  
  if (!pendingCheckout && preferenceId) {
    pendingCheckout = await pendingCollection.findOne({ externalRef: preferenceId });
  }
  
  if (!pendingCheckout) {
    pendingCheckout = await pendingCollection.findOne({ 
      externalRef: { $regex: externalReference, $options: 'i' } 
    });
  }

  if (!pendingCheckout) {
    let existingSale = await salesCollection.findOne({ preferenceId: externalReference });
    if (!existingSale && preferenceId) {
      existingSale = await salesCollection.findOne({ preferenceId: preferenceId });
    }
    
    if (existingSale) {
      console.log('✅ Venta existente (backward compat):', existingSale._id);
      if (existingSale.status === 'paid') {
        return { skipped: true, reason: 'already_paid' };
      }
      pendingCheckout = existingSale;
    } else {
      console.error('❌ Checkout pendiente no encontrado:', { externalReference, preferenceId });
      return { error: 'Checkout not found', externalReference, preferenceId };
    }
  }
  
  if (pendingCheckout.status === 'paid') {
    return { skipped: true, reason: 'already_paid' };
  }

  // Descontar stock
  const productsCollection = mongoClient.db('ushuaia').collection('products');
  const stockDeduction: string[] = [];
  const stockErrors: string[] = [];

  for (const item of pendingCheckout.items) {
    try {
      let product;
      const productIdStr = item.productId?.toString() || '';
      const itemTitle = item.title?.trim() || '';
      
      if (/^[a-f0-9]{24}$/i.test(productIdStr)) {
        product = await productsCollection.findOne({ _id: new ObjectId(productIdStr) });
      }
      if (!product && itemTitle) {
        product = await productsCollection.findOne({ title: itemTitle });
      }
      if (!product && itemTitle) {
        const slug = itemTitle.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        product = await productsCollection.findOne({ slug });
      }

      if (product) {
        const newStock = Math.max(0, (product.stock || 0) - item.quantity);
        await productsCollection.updateOne(
          { _id: product._id },
          { $set: { stock: newStock, updatedAt: new Date() } }
        );
        stockDeduction.push(itemTitle);
      } else {
        stockErrors.push(`No encontrado: ${itemTitle}`);
      }
    } catch (err) {
      stockErrors.push(`Error: ${item.title}`);
    }
  }

  // Crear venta en sales
  const saleResult = await salesCollection.insertOne({
    buyerId: pendingCheckout.buyerId,
    buyerNombre: pendingCheckout.buyerNombre,
    buyerEmail: pendingCheckout.buyerEmail,
    items: pendingCheckout.items,
    total: pendingCheckout.total,
    preferenceId: externalReference,
    status: 'paid',
    paymentId: paymentId.toString(),
    paidAt: new Date(),
    createdAt: new Date(),
  });

  await pendingCollection.deleteOne({ _id: pendingCheckout._id });
  console.log('✅ Venta creada en sales:', saleResult.insertedId);

  // Enviar email
  try {
    await sendEmail('payment_success', {
      buyerEmail: pendingCheckout.buyerEmail,
      buyerName: pendingCheckout.buyerNombre,
      orderId: externalReference,
      total: pendingCheckout.total,
      items: pendingCheckout.items,
      paymentId: paymentId.toString(),
    });
  } catch (emailError) {
    console.error('Error sending confirmation email:', emailError);
  }

  return {
    success: true,
    saleId: saleResult.insertedId.toString(),
    stockDeducted: stockDeduction.length,
    emailSent: true,
  };
}

// POST /api/webhook/mercadopago
export async function POST(request: Request) {
  let mongoClient = null;
  
  try {
    // Soportar tanto topic como type (MP envía ambos)
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic');
    const body = await request.json();
    const { type, data, id } = body;

    console.log('🔔 Webhook recibido:', { topic, type, bodyKeys: Object.keys(body) });

    let paymentId: string | null = null;

    // Caso 1: topic=merchant_order (nuevo formato)
    if (topic === 'merchant_order') {
      const merchantOrderId = data?.id || id;
      if (!merchantOrderId) {
        return NextResponse.json({ message: 'No merchant_order ID' }, { status: 400 });
      }

      // Obtener la merchant order para encontrar los pagos
      const accessToken = process.env.MP_ACCESS_TOKEN;
      if (!accessToken) {
        return NextResponse.json({ error: 'MP no configurado' }, { status: 500 });
      }

      const moResponse = await fetch(
        `https://api.mercadopago.com/merchant_orders/${merchantOrderId}`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );

      if (!moResponse.ok) {
        console.error('❌ Error merchant_order:', moResponse.status);
        return NextResponse.json({ message: 'Merchant order error' }, { status: 500 });
      }

      const merchantOrder = await moResponse.json();
      console.log('📦 Merchant order:', { id: merchantOrder.id, status: merchantOrder.status, payments: merchantOrder.payments?.length });

      // Procesar cada pago en la merchant order
      if (merchantOrder.payments && merchantOrder.payments.length > 0) {
        mongoClient = await getClient();
        
        for (const mp of merchantOrder.payments) {
          if (mp.status === 'approved') {
            paymentId = mp.id;
            console.log('💳 Procesando pago:', paymentId);
            
            const result = await processPayment(paymentId, mongoClient);
            console.log('📝 Result:', result);
          }
        }
      }

      return NextResponse.json({ success: true, topic, processed: !!paymentId });
    }

    // Caso 2: type=payment (formato legacy)
    if (type === 'payment') {
      paymentId = data?.id;
      if (!paymentId) {
        return NextResponse.json({ message: 'No payment ID' }, { status: 400 });
      }

      mongoClient = await getClient();
      const result = await processPayment(paymentId, mongoClient);
      
      return NextResponse.json(result);
    }

    // Ignorar otros tipos
    return NextResponse.json({ message: 'Ignored', topic, type });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Webhook error', details: errorMessage }, { status: 200 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'webhook/mercadopago' });
}