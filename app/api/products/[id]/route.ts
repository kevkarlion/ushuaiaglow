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

// GET single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    
    return NextResponse.json({
      ...product,
      id: product._id.toString(),
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error fetching product' }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('products');
    
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    // Build update object (only include fields that are provided)
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice ? Number(body.originalPrice) : null;
    if (body.discount !== undefined) updateData.discount = body.discount ? Number(body.discount) : null;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.brand !== undefined) updateData.brand = body.brand;
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.images !== undefined) updateData.images = body.images;
    if (body.ingredients !== undefined) updateData.ingredients = body.ingredients;
    if (body.howToUse !== undefined) updateData.howToUse = body.howToUse;
    if (body.warnings !== undefined) updateData.warnings = body.warnings;
    if (body.weight !== undefined) updateData.weight = body.weight;
    if (body.isCombo !== undefined) updateData.isCombo = body.isCombo;
    if (body.productsIncluded !== undefined) updateData.productsIncluded = body.productsIncluded;
    
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Producto actualizado' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('products');
    
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    await collection.deleteOne({ _id: objectId });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error deleting product' }, { status: 500 });
  }
}