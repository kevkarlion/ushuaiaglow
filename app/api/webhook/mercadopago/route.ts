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
  let mongoClient = null;
  
  try {
    const body = await request.json();
    const { type, data } = body;

    console.log('🔔 Webhook recibido:', { type, paymentId: data?.id, liveMode: body.live_mode });

    // Solo procesar payments
    if (type !== 'payment') {
      return NextResponse.json({ message: 'Ignored', type });
    }

    const paymentId = data?.id;
    if (!paymentId) {
      return NextResponse.json({ message: 'No payment ID' }, { status: 400 });
    }

    // Conectar a MongoDB
    try {
      mongoClient = await getClient();
    } catch (mongoError) {
      console.error('❌ Error conectando a MongoDB:', mongoError);
      return NextResponse.json({ error: 'MongoDB no configurada' }, { status: 500 });
    }

    // 1. Obtener datos del pago desde MP
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('❌ MP_ACCESS_TOKEN no configurado en env');
      return NextResponse.json({ error: 'MP no configurado' }, { status: 500 });
    }

    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      }
    );

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      console.error('❌ Error de MP:', mpResponse.status, errorText);
      return NextResponse.json({ error: 'Error MP', status: mpResponse.status }, { status: 500 });
    }

    const payment = await mpResponse.json();

    // Solo procesar pagos aprobados
    if (payment.status !== 'approved') {
      console.log(`⏳ Payment ${paymentId} status: ${payment.status} - no aprobado`);
      return NextResponse.json({ message: 'Not approved', status: payment.status });
    }

    const preferenceId = payment.preference_id;
    const externalReference = payment.external_reference;

    console.log('✅ Pago aprobado:', { paymentId, preferenceId, externalReference });

    // 2. Buscar checkout pendiente en pending_checkouts
    const pendingCollection = mongoClient.db('ushuaia').collection('pending_checkouts');
    const salesCollection = mongoClient.db('ushuaia').collection('sales');
    
    let pendingCheckout = await pendingCollection.findOne({ externalRef: externalReference });
    
    // Si no se encuentra por externalRef, buscar por preferenceId de MP
    if (!pendingCheckout && preferenceId) {
      pendingCheckout = await pendingCollection.findOne({ externalRef: preferenceId });
    }
    
    // Último intento: buscar por regex
    if (!pendingCheckout) {
      pendingCheckout = await pendingCollection.findOne({ 
        externalRef: { $regex: externalReference, $options: 'i' } 
      });
    }

    if (!pendingCheckout) {
      // Verificar si ya está en sales (backward compatibility)
      let existingSale = await salesCollection.findOne({ preferenceId: externalReference });
      if (!existingSale && preferenceId) {
        existingSale = await salesCollection.findOne({ preferenceId: preferenceId });
      }
      
      if (existingSale) {
        console.log('✅ Venta existente (backward compat):', existingSale._id);
        if (existingSale.status === 'paid') {
          return NextResponse.json({ message: 'Already paid' });
        }
        pendingCheckout = existingSale;
      } else {
        console.error('❌ Checkout pendiente no encontrado:', { externalReference, preferenceId });
        return NextResponse.json({ 
          message: 'Checkout not found', 
          externalReference,
          preferenceId
        });
      }
    } else {
      console.log('✅ Checkout pendiente encontrado:', pendingCheckout._id);
    }
    
    // 3. Si ya está en sales como paid, skip (backward compat)
    if (pendingCheckout.status === 'paid') {
      return NextResponse.json({ message: 'Already paid' });
    }

    // 4. Descontar stock de cada item
    const productsCollection = mongoClient.db('ushuaia').collection('products');
    const stockDeduction: string[] = [];
    const stockErrors: string[] = [];

    for (const item of pendingCheckout.items) {
      try {
        // Buscar el producto por ID, título o slug
        let product;
        const productIdStr = item.productId?.toString() || '';
        const itemTitle = item.title?.trim() || '';
        
        console.log('🔍 Buscando producto:', { productId: productIdStr, title: itemTitle });
        
        // 1. Si es un ObjectId válido (24 hex), buscar por _id
        if (/^[a-f0-9]{24}$/i.test(productIdStr)) {
          product = await productsCollection.findOne({ _id: new ObjectId(productIdStr) });
          if (product) console.log('✅ Encontrado por ObjectId:', product.title);
        }
        
        // 2. Si no se encuentra por ID, buscar por título exacto
        if (!product && itemTitle) {
          product = await productsCollection.findOne({ title: itemTitle });
          if (product) console.log('✅ Encontrado por título:', product.title);
        }
        
        // 3. Buscar por slug generado
        if (!product && itemTitle) {
          const slug = itemTitle.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          product = await productsCollection.findOne({ slug });
          if (product) console.log('✅ Encontrado por slug:', product.title);
        }

        // 4. Buscar por título que contenga parte del nombre (fallback)
        if (!product && itemTitle && itemTitle.length > 5) {
          const partialTitle = itemTitle.substring(0, 10); // Primeros 10 caracteres
          product = await productsCollection.findOne({ 
            title: { $regex: partialTitle, $options: 'i' } 
          });
          if (product) console.log('✅ Encontrado por regex parcial:', product.title);
        }

        if (product) {
          const newStock = Math.max(0, (product.stock || 0) - item.quantity);
          await productsCollection.updateOne(
            { _id: product._id },
            { $set: { stock: newStock, updatedAt: new Date() } }
          );
          stockDeduction.push(itemTitle);
          console.log(`✅ Stock descontado: ${itemTitle} (${product.stock} -> ${newStock})`);
        } else {
          const errorMsg = `Producto no encontrado: ${productIdStr || 'sin ID'} - "${itemTitle}"`;
          console.error('❌', errorMsg);
          stockErrors.push(errorMsg);
        }
      } catch (err) {
        console.error('❌ Error descontando stock para:', item.productId, err);
        stockErrors.push(`Error: ${item.title}`);
      }
    }

    // Log detallado del resultado
    if (stockErrors.length > 0) {
      console.error('❌ Errores de stock:', stockErrors);
    }

    // 5. Crear la venta en sales (como "paid")
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

    // 6. Eliminar de pending_checkouts
    await pendingCollection.deleteOne({ _id: pendingCheckout._id });
    console.log('✅ Venta creada en sales:', saleResult.insertedId);

    // 7. Enviar email de confirmación
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

    console.log(`Payment ${paymentId} processed. Sale created:`, saleResult.insertedId, 'Stock:', stockDeduction);

    return NextResponse.json({
      success: true,
      paymentId,
      status: 'paid',
      saleId: saleResult.insertedId.toString(),
      stockDeducted: stockDeduction.length,
      items: stockDeduction,
      stockErrors: stockErrors.length > 0 ? stockErrors : undefined,
    });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ 
      error: 'Webhook error', 
      details: errorMessage,
    }, { status: 200 }); // Devolver 200 para que MP no reintente infinitamente
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'webhook/mercadopago' });
}