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

    // DEBUG: Log del producto para verificar campos
    console.log('=== DEBUG STOCK ADJUSTMENT ===');
    console.log('Product title:', product.title);
    console.log('Product isCombo:', product.isCombo, typeof product.isCombo);
    console.log('Product productsIncluded:', product.productsIncluded, typeof product.productsIncluded);
    console.log('Operation:', operation, 'Quantity:', qty);

    // Calculate new stock
    const currentStock = product.stock || 0;
    let newStock: number;
    
    // Inventory log collection
    const inventoryLog = mongoClient.db('ushuaia').collection('inventoryLog');

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
      let comboProducts: string[] = [];
      
      // Manejar ambos formatos: array o string JSON
      if (Array.isArray(product.productsIncluded)) {
        comboProducts = product.productsIncluded;
      } else if (typeof product.productsIncluded === 'string' && product.productsIncluded) {
        try {
          comboProducts = JSON.parse(product.productsIncluded);
        } catch (e) {
          // Maybe comma-separated string
          comboProducts = product.productsIncluded.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
      
      console.log('Parsed comboProducts:', comboProducts);
      
      if (comboProducts.length === 0) {
        console.log('WARNING: Combo sin productsIncluded configurados');
      }
      
      // Si es combo y tiene productos incluidos, descontar también los individuales
      if (product.isCombo === true && comboProducts.length > 0) {
        
        // Los productos están guardados por NOMBRE, no por ID - buscar por nombre
        // Usar búsqueda más flexible (contiene, no exacta)
        const individualProducts = [];
        for (const prodName of comboProducts) {
          // Escapar caracteres especiales del regex
          const escapedName = prodName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          
          // Primero intentar búsqueda exacta
          let found = await collection.findOne({ 
            title: { $regex: new RegExp('^' + escapedName + '$', 'i') }
          });
          
          // Si no encuentra, buscar por coincidencia parcial
          if (!found) {
            found = await collection.findOne({ 
              title: { $regex: new RegExp(escapedName, 'i') }
            });
          }
          
          // Última instancia: buscar cualquier producto que CONTENGA el nombre
          if (!found) {
            const partialName = prodName.toLowerCase().split(' ')[0]; // Primer palabra
            found = await collection.findOne({ 
              title: { $regex: new RegExp(partialName, 'i') }
            });
            console.log(`Fallback search for first word "${partialName}" -> found: ${found?.title || 'NOT FOUND'}`);
          }
          
          console.log(`Searching for: "${prodName}" -> found: ${found?.title || 'NOT FOUND'}`);
          
          if (found) {
            individualProducts.push(found);
          } else {
            console.log('WARNING: No se encontró producto:', prodName);
          }
        }
        
        console.log('Found individual products:', individualProducts.map(p => p.title));

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
          const previousStock = indProd.stock || 0;
          const result = await collection.updateOne(
            { _id: indProd._id },
            { 
              $inc: { stock: -qty },
              $set: { updatedAt: new Date() }
            }
          );
          
          console.log(`UPDATE ${indProd.title}: ${previousStock} -> ${previousStock - qty}, matched: ${result.matchedCount}, modified: ${result.modifiedCount}`);

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
    console.error('Error updating stock:', error);
    return NextResponse.json({ error: 'Error updating stock' }, { status: 500 });
  }
}