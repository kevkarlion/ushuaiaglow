import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

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

// GET - Obtener logs de inventario
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const tipo = searchParams.get('tipo'); // 'entrada', 'salida', o null para todos
    
    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('inventoryLog');
    
    const query: Record<string, unknown> = {};
    if (tipo) {
      query.tipo = tipo;
    }
    
    const logs = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    
    // Obtener productos únicos para mostrar info adicional
    const productosCollection = mongoClient.db('ushuaia').collection('products');
    const productoIds = [...new Set(
      logs.map(l => l.productId).filter(Boolean)
    )];
    
    const productosMap: Record<string, { title: string }> = {};
    if (productoIds.length > 0) {
      const productos = await productosCollection.find({
        _id: { $in: productoIds.map(id => new ObjectId(id)) }
      }).toArray();
      productos.forEach(p => {
        productosMap[p._id.toString()] = { title: p.title };
      });
    }
    
    return NextResponse.json({
      logs: logs.map(log => ({
        ...log,
        productoTitle: productosMap[log.productId?.toString()]?.title || log.productTitle || 'Unknown'
      }))
    });
  } catch (error) {
    console.error('Error getting inventory logs:', error);
    return NextResponse.json({ error: 'Error al obtener logs' }, { status: 500 });
  }
}

// POST - Registrar entrada de inventario (reposición)
export async function POST(request: Request) {
  try {
    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('inventoryLog');
    const productosCollection = mongoClient.db('ushuaia').collection('products');
    
    const body = await request.json();
    const { productId, cantidad, nota, adminId } = body;
    
    if (!productId || !cantidad) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }
    
    // Obtener producto
    const producto = await productosCollection.findOne({ _id: new ObjectId(productId) });
    if (!producto) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    
    // Calcular nuevo stock
    const nuevoStock = (producto.stock || 0) + cantidad;
    
    // Actualizar stock del producto
    await productosCollection.updateOne(
      { _id: producto._id },
      { $set: { stock: nuevoStock, updatedAt: new Date() } }
    );
    
    // Registrar en log
    const logEntry = {
      tipo: 'entrada',
      origen: 'manual',
      productId: producto._id.toString(),
      productTitle: producto.title,
      cantidad: cantidad,
      stockAnterior: producto.stock || 0,
      stockNuevo: nuevoStock,
      nota: nota || 'Reposición',
      adminId: adminId || 'system',
      createdAt: new Date(),
    };
    
    await collection.insertOne(logEntry);
    
    return NextResponse.json({ 
      success: true, 
      log: logEntry,
      stock: nuevoStock
    });
  } catch (error) {
    console.error('Error en inventory log:', error);
    return NextResponse.json({ error: 'Error al registrar' }, { status: 500 });
  }
}