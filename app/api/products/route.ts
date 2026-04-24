import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

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

function generateSlug(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim();
}

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri || mongoUri.includes('your_password') || mongoUri.length < 20) {
      return NextResponse.json({ error: 'MongoDB no configurada' }, { status: 500 });
    }
    
    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('products');
    const products = await collection.find({}).toArray();
    
    const validProducts = products.filter(p => p.title && p.title.trim() !== '');
    
    const formattedProducts = validProducts.map((p) => {
      const cat = p.category || '';
      let normalizedCat = '';
      if (cat) {
        normalizedCat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
      }
      return {
        ...p,
        id: p._id.toString(),
        slug: p.slug || generateSlug(p.title),
        category: normalizedCat,
      };
    });
    
    return NextResponse.json(formattedProducts);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('products');
    
    const body = await request.json();
    
    if (Array.isArray(body)) {
      if (body.length === 0) {
        return NextResponse.json({ error: 'Array vacío' }, { status: 400 });
      }
      
      const products = body.map((p) => {
        const title = p.title || p.name || '';
        return {
          title,
          description: p.description || '',
          price: Number(p.price) || 0,
          originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
          discount: p.discount ? Number(p.discount) : undefined,
          category: p.category || 'General',
          brand: p.brand || '',
          stock: Number(p.stock) || 0,
          images: p.images || [],
          ingredients: p.ingredients || '',
          howToUse: p.howToUse || '',
          warnings: p.warnings || '',
          weight: p.weight || '',
          isCombo: p.isCombo === true || p.category?.toLowerCase() === 'combo',
          productsIncluded: p.productsIncluded || [],
          slug: generateSlug(title),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
      
      const result = await collection.insertMany(products);
      
      return NextResponse.json({
        success: true,
        count: result.insertedCount,
        message: `${result.insertedCount} productos importados`,
      });
    }
    
    const title = body.title || '';
    const product = {
      ...body,
      title,
      slug: generateSlug(title),
      images: body.images || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await collection.insertOne(product);
    
    return NextResponse.json({
      success: true,
      id: result.insertedId,
      slug: product.slug,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const mongoClient = await getClient();
    const collection = mongoClient.db('ushuaia').collection('products');
    
    const result = await collection.deleteMany({});
    
    return NextResponse.json({
      success: true,
      deleted: result.deletedCount,
      message: `${result.deletedCount} productos eliminados`,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al borrar' }, { status: 500 });
  }
}