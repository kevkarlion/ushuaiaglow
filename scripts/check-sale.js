const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://kriquelme10_db_user:dN7Qy5ImrD5dZgsZ@cluster0.qhauxb0.mongodb.net/ushuaia?appName=Cluster0';

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('ushuaia');
  
  // 1. Buscar venta de Camila
  console.log('=== BUSCANDO VENTA ===');
  const sale = await db.collection('sales').findOne({ 
    $or: [{ buyerEmail: 'camilabelenfigueroa@hotmail.com' }, { buyerNombre: /Camila/i }] 
  });
  
  if (sale) {
    console.log('Venta encontrada:');
    console.log('- Buyer:', sale.buyerNombre);
    console.log('- Email:', sale.buyerEmail);
    console.log('- Items:', JSON.stringify(sale.items, null, 2));
    console.log('- Status:', sale.status);
    console.log('- CreatedAt:', sale.createdAt);
  } else {
    console.log('NO se encontró venta para Camila');
    // mostrar últimas ventas
    const lastSales = await db.collection('sales').find().sort({ createdAt: -1 }).limit(5).toArray();
    console.log('Últimas 5 ventas:', lastSales.map(s => ({ nombre: s.buyerNombre, email: s.buyerEmail, items: s.items?.map(i => i.title) })));
  }
  
  // 2. Ver stock actual
  console.log('\n=== STOCK ACTUAL ===');
  const products = await db.collection('products').find({ category: { $ne: 'combo' } }).limit(10).toArray();
  products.forEach(p => console.log(`- ${p.title}: ${p.stock}`));
  
  // 3. Ver combos
  console.log('\n=== COMBOS ===');
  const combos = await db.collection('products').find({ isCombo: true }).limit(5).toArray();
  combos.forEach(c => {
    console.log(`- ${c.title}:`);
    console.log(`  productsIncluded: ${c.productsIncluded}`);
  });
  
  await client.close();
}

main().catch(console.error);