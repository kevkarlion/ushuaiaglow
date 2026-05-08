const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://kriquelme10_db_user:dN7Qy5ImrD5dZgsZ@cluster0.qhauxb0.mongodb.net/ushuaia?appName=Cluster0';

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('ushuaia');
  
  // Buscar todos los productos que tengan "protector" o "sundream"
  const products = await db.collection('products').find({ 
    title: { $regex: /protector|sundream/i }
  }).toArray();
  
  console.log('=== PRODUCTOS CON "PROTECTOR" O "SUNDREAM" ===');
  products.forEach(p => console.log(`- ${p.title} (stock: ${p.stock})`));
  
  await client.close();
}

main().catch(console.error);