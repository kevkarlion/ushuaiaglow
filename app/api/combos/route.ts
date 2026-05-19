import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

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

// PUT /api/combos - populate productsIncluded for existing combos
export async function PUT() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const productsCollection = client.db('ushuaia').collection('products');
    
    // Buscar productos individuales por nombre (búsqueda más flexible)
    const allProducts = await productsCollection.find({ isCombo: { $ne: true } }).toArray();
    
    const serum = allProducts.find(p => /serum|vitamina|boost/i.test(p.title));
    const gel = allProducts.find(p => /gel|limpiador|clean/i.test(p.title));
    const protector = allProducts.find(p => /protector|solar|spf/i.test(p.title));
    const mascarilla = allProducts.find(p => /mascarilla|mask/i.test(p.title));
    const vincha = allProducts.find(p => /vincha|headband/i.test(p.title));
    
    console.log('Found products:', { serum: serum?.title, gel: gel?.title, protector: protector?.title, mascarilla: mascarilla?.title, vincha: vincha?.title });
    
    if (!serum || !gel) {
      await client.close();
      return NextResponse.json({ error: 'No se encontraron productos base (serum/gel)' }, { status: 400 });
    }
    
    // Map of products by keyword
    const productsMap: Record<string, ObjectId[]> = {
      'Básico': [serum._id, gel._id],
      'Protección + Tratamiento': protector ? [protector._id, serum._id] : [serum._id],
      'Hidratación Intensiva': [serum._id, gel._id, mascarilla?._id].filter(Boolean) as ObjectId[],
      'Spa en Casa': [serum._id, gel._id, mascarilla?._id, vincha?._id].filter(Boolean) as ObjectId[],
      'Premium': [serum._id, gel._id, vincha?._id, protector?._id, mascarilla?._id].filter(Boolean) as ObjectId[],
    };
    
    // Actualizar cada combo con sus productos
    let updated = 0;
    for (const [title, productIds] of Object.entries(productsMap)) {
      const result = await productsCollection.updateOne(
        { title: { $regex: title, $options: 'i' }, isCombo: true },
        { $set: { productsIncluded: productIds.map(id => id.toString()) } }
      );
      if (result.modifiedCount > 0) updated++;
    }
    
    // Also check for "Triple Acción" or similar combo
    const tripleAccion = await productsCollection.findOne({ 
      $or: [
        { title: /triple.*acci/i },
        { title: /triple.*protec/i }
      ],
      isCombo: true 
    });
    
    if (tripleAccion && serum && gel && protector) {
      await productsCollection.updateOne(
        { _id: tripleAccion._id },
        { $set: { productsIncluded: [serum._id.toString(), gel._id.toString(), protector._id.toString()] } }
      );
      updated++;
      console.log('Updated Triple Acción combo');
    }
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      message: `${updated} combos actualizados con productsIncluded`,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error actualizando combos' }, { status: 500 });
  }
}