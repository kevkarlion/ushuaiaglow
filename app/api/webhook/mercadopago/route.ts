import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { sendEmail } from '@/lib/email';
import { trackPurchase } from '@/lib/meta-pixel';

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
  const buyersCollection = mongoClient.db('ushuaia').collection('buyers');
  
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

  // Descontar stock - handles combos y productos individuales
  const productsCollection = mongoClient.db('ushuaia').collection('products');
  const inventoryLogCollection = mongoClient.db('ushuaia').collection('inventoryLog');
  const stockDeduction: string[] = [];
  const stockErrors: string[] = [];

  for (const item of pendingCheckout.items) {
    try {
      const productIdStr = item.productId?.toString() || '';
      const itemTitle = item.title?.trim() || '';
      
      // 1. Detectar si es un combo (por ID que empieza con "combo-" o por buscar el producto)
      let isCombo = false;
      let comboProduct = null;
      
      // Buscar por ID o por título
      if (/^[a-f0-9]{24}$/i.test(productIdStr)) {
        comboProduct = await productsCollection.findOne({ _id: new ObjectId(productIdStr) });
      }
      if (!comboProduct && itemTitle) {
        comboProduct = await productsCollection.findOne({ title: itemTitle });
      }
      if (!comboProduct && itemTitle) {
        const slug = itemTitle.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        comboProduct = await productsCollection.findOne({ slug });
      }
      
      // Verificar si es combo
      if (comboProduct?.isCombo === true || productIdStr.startsWith('combo-')) {
        isCombo = true;
      }
      
      // 2. Si es COMBO: descontar cada producto incluido
      if (isCombo && comboProduct?.productsIncluded) {
        const productsInCombo = Array.isArray(comboProduct.productsIncluded) 
          ? comboProduct.productsIncluded 
          : JSON.parse(comboProduct.productsIncluded);
        
        for (const includedName of productsInCombo) {
          const includedNameTrim = includedName.trim();
          
          // Buscar cada producto del combo por nombre (exact o fuzzy)
          let individualProduct = await productsCollection.findOne({ 
            title: { $regex: new RegExp(`^${includedNameTrim}$`, 'i') }
          });
          
          // Si no encuentra exact, buscar fuzzy (partial match)
          if (!individualProduct) {
            const fuzzySearch = includedNameTrim.toLowerCase().replace(/\s+/g, ' ').trim();
            individualProduct = await productsCollection.findOne({
              title: { $regex: new RegExp(fuzzySearch, 'i') }
            });
          }
          
          if (individualProduct) {
            const newStock = Math.max(0, (individualProduct.stock || 0) - item.quantity);
            await productsCollection.updateOne(
              { _id: individualProduct._id },
              { $set: { stock: newStock, updatedAt: new Date() } }
            );
            // Log de inventario
            await inventoryLogCollection.insertOne({
              tipo: 'salida',
              origen: 'compra',
              productId: individualProduct._id.toString(),
              productTitle: individualProduct.title,
              cantidad: item.quantity,
              stockAnterior: individualProduct.stock || 0,
              stockNuevo: newStock,
              motivo: `Venta: ${itemTitle} (combo)`,
              orderId: externalReference,
              createdAt: new Date(),
            });
            stockDeduction.push(`${individualProduct.title} (-1)`);
          } else {
            stockErrors.push(`No encontrado en combo: ${includedName}`);
          }
        }
        stockDeduction.push(`[COMBO] ${itemTitle}`);
      } 
      // 3. Si es producto individual: descontar normalmente
      else if (comboProduct) {
        const newStock = Math.max(0, (comboProduct.stock || 0) - item.quantity);
        await productsCollection.updateOne(
          { _id: comboProduct._id },
          { $set: { stock: newStock, updatedAt: new Date() } }
        );
        // Log de inventario
        await inventoryLogCollection.insertOne({
          tipo: 'salida',
          origen: 'compra',
          productId: comboProduct._id.toString(),
          productTitle: comboProduct.title,
          cantidad: item.quantity,
          stockAnterior: comboProduct.stock || 0,
          stockNuevo: newStock,
          motivo: `Venta: ${itemTitle}`,
          orderId: externalReference,
          createdAt: new Date(),
        });
        stockDeduction.push(itemTitle);
      } else {
        stockErrors.push(`No encontrado: ${itemTitle}`);
      }
    } catch (err) {
      stockErrors.push(`Error: ${item.title} - ${err}`);
    }
  }

  // Crear venta en sales
  const saleResult = await salesCollection.insertOne({
    buyerId: pendingCheckout.buyerId,
    buyerNombre: pendingCheckout.buyerNombre,
    buyerEmail: pendingCheckout.buyerEmail,
    buyerTelefono: pendingCheckout.buyerTelefono || '',
    buyerDireccion: pendingCheckout.buyerDireccion || '',
    buyerCodigoPostal: pendingCheckout.buyerCodigoPostal || '',
    buyerProvincia: pendingCheckout.buyerProvincia || '',
    buyerLocalidad: (pendingCheckout as any).buyerLocalidad || '',
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

  // 🎯 Meta Pixel - Purchase event
  const contentIds = pendingCheckout.items.map((item: any) => item.productId || item.title);
  const numItems = pendingCheckout.items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
  trackPurchase(pendingCheckout.total, externalReference, contentIds);
  console.log('✅ Pixel Purchase enviado:', { value: pendingCheckout.total, transactionId: externalReference, numItems });

  // Actualizar contador de compras del buyer
  if (pendingCheckout.buyerId) {
    await buyersCollection.updateOne(
      { _id: new ObjectId(pendingCheckout.buyerId) },
      { 
        $inc: { purchaseCount: 1 },
        $set: { updatedAt: new Date() }
      }
    );
  } else if (pendingCheckout.buyerEmail) {
    // Si no hay buyerId (backward compatibility), buscar por email
    await buyersCollection.updateOne(
      { email: pendingCheckout.buyerEmail },
      { 
        $inc: { purchaseCount: 1 },
        $set: { updatedAt: new Date() }
      }
    );
  }

  // 1. Enviar email al comprador
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
    console.error('Error sending confirmation email to buyer:', emailError);
  }

  // 2. Enviar email al admin (nueva venta)
  try {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@ushuaiaglow.com';
    await sendEmail('payment_success', {
      buyerEmail: ADMIN_EMAIL,
      buyerName: 'Admin',
      orderId: `NUEVA VENTA: ${externalReference}`,
      total: pendingCheckout.total,
      items: pendingCheckout.items,
      paymentId: paymentId.toString(),
    });
  } catch (emailError) {
    console.error('Error sending notification to admin:', emailError);
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
          if (mp.status === 'approved' && mp.id) {
            const payId = mp.id.toString();
            console.log('💳 Procesando pago:', payId);
            
            const result = await processPayment(payId, mongoClient);
            console.log('📝 Result:', result);
          }
        }
      }

      return NextResponse.json({ success: true, topic, processed: true });
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