import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

export async function POST() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const collection = client.db('ushuaia').collection('products');
    
    // Combos para cargar
    const combos = [
      {
        title: 'Básico',
        slug: 'basico',
        description: 'Serum + Gel. Rutina diaria básica de limpieza e hidratación.',
        price: 24500,
        originalPrice: 30000,
        discount: 18,
        category: 'Combos',
        stock: 10,
        images: ['/productos/combo-full.jpeg'],
        isCombo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Protección + Tratamiento',
        slug: 'proteccion-tratamiento',
        description: 'Protector + Serum. Cuidado diario con protección solar.',
        price: 30500,
        originalPrice: 38000,
        discount: 20,
        category: 'Combos',
        stock: 10,
        images: ['/productos/combo2.jpeg'],
        isCombo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Hidratación Intensiva',
        slug: 'hidratacion-intensiva',
        description: 'Serum + Gel + Mascarilla. Tratamiento completo.',
        price: 28500,
        originalPrice: 35000,
        discount: 19,
        category: 'Combos',
        stock: 10,
        images: ['/productos/combo-full.jpeg'],
        isCombo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Spa en Casa',
        slug: 'spa-en-casa',
        description: 'Serum + Gel + Mascarilla + Vincha. Kit de relajación completo.',
        price: 36500,
        originalPrice: 45000,
        discount: 19,
        category: 'Combos',
        stock: 10,
        images: ['/productos/combo2.jpeg'],
        isCombo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Premium',
        slug: 'premium',
        description: 'Serum + Gel + Vincha + Protector + Mascarilla. El kit completo.',
        price: 46500,
        originalPrice: 58000,
        discount: 20,
        category: 'Combos',
        stock: 10,
        images: ['/productos/combo-full.jpeg'],
        isCombo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    // Verificar si ya existen combos
    const existingCombos = await collection.find({ isCombo: true }).toArray();
    
    if (existingCombos.length > 0) {
      // Ya hay combos, no duplicar
      await client.close();
      return NextResponse.json({
        success: true,
        message: `Ya existen ${existingCombos.length} combos en la DB`,
        combos: existingCombos,
      });
    }
    
    // Insertar combos
    const result = await collection.insertMany(combos);
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      message: `${result.insertedCount} combos cargados`,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error cargando combos' }, { status: 500 });
  }
}