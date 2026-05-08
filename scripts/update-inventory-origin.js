const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://kriquelme10_db_user:dN7Qy5ImrD5dZgsZ@cluster0.qhauxb0.mongodb.net/ushuaia?appName=Cluster0';

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('ushuaia');
  const inventoryLog = db.collection('inventoryLog');
  
  console.log('=== ACTUALIZANDO LOGS EXISTENTES ===\n');
  
  // Agregar origen 'inicial' a todas las entradas sin origen
  const entradaResult = await inventoryLog.updateMany(
    { tipo: 'entrada', origen: { $exists: false } },
    { $set: { origen: 'inicial' } }
  );
  console.log(`Entradas actualizadas: ${entradaResult.modifiedCount}`);
  
  // Agregar origen 'compra' a todas las salidas sin origen
  const salidaResult = await inventoryLog.updateMany(
    { tipo: 'salida', origen: { $exists: false } },
    { $set: { origen: 'compra' } }
  );
  console.log(`Salidas actualizadas: ${salidaResult.modifiedCount}`);
  
  // Verificar logs
  const logs = await inventoryLog.find().limit(5).toArray();
  console.log('\nLogs actuales:');
  logs.forEach(l => console.log(`  - ${l.tipo}: ${l.productTitle} (origen: ${l.origen || 'sin origen'})`));
  
  console.log('\n✅ Listo!');
  await client.close();
}

main().catch(console.error);