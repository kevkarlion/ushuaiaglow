const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://kriquelme10_db_user:dN7Qy5ImrD5dZgsZ@cluster0.qhauxb0.mongodb.net/ushuaia?appName=Cluster0';

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('ushuaia');
  
  // Ver stock de Protector Solar
  const protector = await db.collection('products').findOne({ title: { $regex: /Protector/i } });
  console.log('=== STOCK ACTUAL ===');
  console.log(`${protector.title}: ${protector.stock}`);
  
  // Ver logs recientes
  console.log('\n=== LOGS RECIENTES ===');
  const logs = await db.collection('inventoryLog')
    .find({ productTitle: { $regex: /protector/i } })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();
  
  logs.forEach(l => console.log(`- ${l.tipo} ${l.productTitle}: ${l.stockAnterior} → ${l.stockNuevo} (${l.origen})`));
  
  await client.close();
}

main().catch(console.error);