import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

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

// PUT /api/stock/[id] - agregar o descontar stock
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { operation, quantity } = body;

    // Validate inputs
    if (!operation || !['add', 'subtract'].includes(operation.toLowerCase())) {
      return NextResponse.json(
        { error: 'Operación inválida. Usar: add o subtract' },
        { status: 400 }
      );
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json(
        { error: 'Cantidad debe ser mayor a 0' },
        { status: 400 }
      );
    }

    // Find product first
    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('products');
    
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const product = await collection.findOne({ _id: objectId });
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Calculate new stock
    const currentStock = product.stock || 0;
    let newStock: number;

    if (operation.toLowerCase() === 'add') {
      newStock = currentStock + qty;
    } else {
      newStock = currentStock - qty;
      // Prevent negative stock
      if (newStock < 0) {
        return NextResponse.json(
          { error: `Stock insuficiente. Stock actual: ${currentStock}` },
          { status: 400 }
        );
      }

      // Si es un combo, descontar también los productos individuales
      if (product.isCombo === true && product.productsIncluded && Array.isArray(product.productsIncluded)) {
        const comboProducts = product.productsIncluded;
        
        // Obtener los productos individuales para verificar stock
        const individualProducts = await collection.find({
          _id: { $in: comboProducts.map((id: string) => {
            try { return new ObjectId(id); } catch { return null; }
          }).filter(Boolean) }
        }).toArray();

        // Verificar stock suficiente en todos los productos individuales
        for (const indProd of individualProducts) {
          const indStock = indProd.stock || 0;
          if (indStock < qty) {
            return NextResponse.json(
              { error: `Stock insuficiente en producto individual: ${indProd.title}. Stock actual: ${indStock}` },
              { status: 400 }
            );
          }
        }

        // Descontar stock de cada producto individual
        for (const indProd of individualProducts) {
          await collection.updateOne(
            { _id: indProd._id },
            { 
              $inc: { stock: -qty },
              $set: { updatedAt: new Date() }
            }
          );

          // Log para cada producto individual
          await inventoryLog.insertOne({
            tipo: 'salida',
            origen: 'combo',
            productId: indProd._id.toString(),
            productTitle: `${product.title} → ${indProd.title}`,
            cantidad: qty,
            stockAnterior: indProd.stock,
            stockNuevo: indProd.stock - qty,
            motivo: `Descontado por combo: ${product.title}`,
            adminId: 'admin',
            createdAt: new Date(),
          });
        }
      }
    }

    // Update main product (combo)
    await collection.updateOne(
      { _id: objectId },
      { 
        $set: { 
          stock: newStock,
          updatedAt: new Date()
        } 
      }
    );

    // Register in inventory log
    const inventoryLog = mongoClient.db('ushuaia').collection('inventoryLog');
    await inventoryLog.insertOne({
      tipo: operation.toLowerCase() === 'add' ? 'entrada' : 'salida',
      origen: 'manual',
      productId: product._id.toString(),
      productTitle: product.title,
      cantidad: qty,
      stockAnterior: currentStock,
      stockNuevo: newStock,
      motivo: `Ajuste manual: ${operation.toLowerCase() === 'add' ? 'agregar' : 'descontar'}`,
      adminId: 'admin',
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: product._id.toString(),
      title: product.title,
      previousStock: currentStock,
      newStock,
      operation: operation.toLowerCase(),
      quantity: qty,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating stock' }, { status: 500 });
  }
}