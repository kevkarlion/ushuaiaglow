const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://kriquelme10_db_user:dN7Qy5ImrD5dZgsZ@cluster0.qhauxb0.mongodb.net/ushuaia?appName=Cluster0';

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('ushuaia');
  
  // Buscar combo Triple Acción
  const combo = await db.collection('products').findOne({ title: 'Combo Triple Acción' });
  console.log('=== COMBO TRIPLE ACCIÓN ===');
  console.log('ID:', combo._id);
  console.log('Title:', combo.title);
  console.log('isCombo:', combo.isCombo);
  console.log('productsIncluded:', combo.productsIncluded);
  
  await client.close();
}

main().catch(console.error);