import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

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

interface Item {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface BuyerData {
  nombreCompleto: string;
  email: string;
  telefono: string;
  direccion: string;
  codigoPostal: string;
  provincia: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_URL || process.env.BASE_URL || 'http://localhost:3000';

console.log('🔍 BASE_URL para back_urls:', BASE_URL);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, buyer } = body as { items: Item[]; total: number; buyer?: BuyerData };
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No hay items en el carrito' },
        { status: 400 }
      );
    }

    if (!accessToken) {
      return NextResponse.json({
        demo: true,
        message: 'Configura MP_ACCESS_TOKEN',
      });
    }

    // External reference único
    const externalRef = `ushuaia-${Date.now()}`;

    // Si hay datos del buyer, guardarlo SOLO temporalmente en pending_checkouts (no en sales)
    let buyerId: string | null = null;
    if (buyer && buyer.email) {
      const mongoClient = await getClient();
      const buyersCollection = mongoClient.db('ushuaia').collection('buyers');

      // Buscar o crear buyer
      const existingBuyer = await buyersCollection.findOne({ email: buyer.email.toLowerCase() });
      
      if (existingBuyer) {
        buyerId = existingBuyer._id.toString();
        await buyersCollection.updateOne(
          { _id: existingBuyer._id },
          { 
            $set: { 
              nombreCompleto: buyer.nombreCompleto,
              telefono: buyer.telefono,
              direccion: buyer.direccion,
              codigoPostal: buyer.codigoPostal,
              provincia: buyer.provincia,
              updatedAt: new Date(),
            } 
          }
        );
      } else {
        const result = await buyersCollection.insertOne({
          nombreCompleto: buyer.nombreCompleto,
          email: buyer.email.toLowerCase(),
          telefono: buyer.telefono,
          direccion: buyer.direccion,
          codigoPostal: buyer.codigoPostal,
          provincia: buyer.provincia,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        buyerId = result.insertedId.toString();
      }

      // Guardar checkout pendiente SOLO para referencia (no crear venta a priori)
      const pendingCollection = mongoClient.db('ushuaia').collection('pending_checkouts');
      await pendingCollection.insertOne({
        buyerId,
        buyerNombre: buyer.nombreCompleto,
        buyerEmail: buyer.email.toLowerCase(),
        buyerTelefono: buyer.telefono,
        buyerDireccion: buyer.direccion,
        buyerCodigoPostal: buyer.codigoPostal,
        buyerProvincia: buyer.provincia,
        items: items.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        total,
        externalRef,
        createdAt: new Date(),
        // TTL: expire después de 24hs si no se paga
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    }

    // Separar nombre y apellido para MP
    const nameParts = (buyer?.nombreCompleto || 'Usuario').split(' ');
    const surname = nameParts.pop() || 'Comprador';
    const firstName = nameParts.join(' ') || 'Usuario';

    // Crear preferencia en Mercado Pago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items: items.map((item: Item) => ({
          id: item.id,
          title: item.title,
          description: item.title,
          unit_price: item.price,
          quantity: item.quantity,
          currency_id: 'ARS',
        })),
        payer: {
          name: firstName,
          surname: surname,
          email: buyer?.email || 'user@example.com',
        },
        back_urls: {
          success: `${BASE_URL}/checkout/success`,
          pending: `${BASE_URL}/checkout/pending`,
          failure: `${BASE_URL}/checkout/failure`,
        },
        auto_return: 'approved',
        external_reference: externalRef,
        notification_url: `${BASE_URL}/api/webhook/mercadopago`,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('MP error:', responseText);
      return NextResponse.json(
        { error: 'Error al crear preferencia', details: responseText },
        { status: 500 }
      );
    }

    const data = JSON.parse(responseText);

    return NextResponse.json({
      preferenceId: data.id,
      initPoint: data.init_point,
      buyerId,
      externalRef,
    });
  } catch (error) {
    console.error('Error creating preference:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pago', details: String(error) },
      { status: 500 }
    );
  }
}