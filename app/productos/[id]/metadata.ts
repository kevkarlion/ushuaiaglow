import { Metadata } from 'next';

// Fetch producto para metadata
async function getProduct(id: string) {
  try {
    const { MongoClient, ObjectId } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
    const db = client.db('ushuaia');
    
    // Buscar primero por slug (URL limpia), luego por _id
    let query: any = { slug: id };
    
    // Si no tiene slug, intentar como _id
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      // No es ObjectId válido, buscar por slug o title
    }
    
    const product = await db.collection('products').findOne(query) 
      || await db.collection('products').findOne({ title: { $regex: new RegExp(id, 'i') } });
    
    await client.close();
    return product;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }
  
  const title = `${product.title} | UshuaiaGlow`;
  const price = product.price?.toLocaleString('es-AR');
  const description = `${product.title} - ${product.description || 'Comprá en UshuaiaGlow'}. $${price}. Envío gratis a todo Argentina.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description: product.description || `Comprá ${product.title} en UshuaiaGlow`,
    },
  };
}