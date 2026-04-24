import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

// Helper: generar slug desde título
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^a-z0-9\s-]/g, '') // quitar caracteres especiales
    .replace(/\s+/g, '-') // espacios a guiones
    .replace(/-+/g, '-') // múltiples guiones a uno
    .replace(/^-|-$/g, '') // quitar guiones al inicio/final
    .trim();
}

export async function POST() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const collection = client.db('ushuaia').collection('products');
    
    // Buscar todos los productos sin slug
    const products = await collection.find({}).toArray();
    
    let updated = 0;
    for (const product of products) {
      if (!product.slug && product.title) {
        const slug = generateSlug(product.title);
        await collection.updateOne(
          { _id: product._id },
          { $set: { slug } }
        );
        updated++;
        console.log(`✅ ${product.title} → ${slug}`);
      }
    }
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      message: `${updated} productos actualizados con slugs`,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error migration' }, { status: 500 });
  }
}