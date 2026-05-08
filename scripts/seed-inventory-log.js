/**
 * Script para poblar el log de inventario con datos históricos
 * Uso: node scripts/seed-inventory-log.js
 */

const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb+srv://kriquelme10_db_user:dN7Qy5ImrD5dZgsZ@cluster0.qhauxb0.mongodb.net/ushuaia?appName=Cluster0';

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('ushuaia');
  const inventoryLog = db.collection('inventoryLog');
  const productsCollection = db.collection('products');
  
  console.log('=== POBLANDO LOG DE INVENTARIO ===\n');
  
  // Verificar si ya hay datos
  const existingLogs = await inventoryLog.countDocuments();
  if (existingLogs > 0) {
    console.log(`Ya existen ${existingLogs} logs. Omitiendo...`);
    await client.close();
    return;
  }
  
  // Obtener productos
  const productos = await productsCollection.find({ 
    category: { $ne: 'combo' },
    isCombo: { $ne: true }
  }).toArray();
  
  // Crear logs históricos de entradas (stock inicial + reposiciones)
  const logs = [];
  
  for (const producto of productos.slice(0, 8)) {
    // Stock inicial
    if (producto.stock > 0) {
      logs.push({
        tipo: 'entrada',
        origen: 'inicial',
        productId: producto._id.toString(),
        productTitle: producto.title,
        cantidad: producto.stock,
        stockAnterior: 0,
        stockNuevo: producto.stock,
        motivo: 'Stock inicial',
        adminId: 'system',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
      });
    }
  }
  
  // Agregar la venta de Camila como salida
  const serum = productos.find(p => p.title?.includes('Sérum'));
  const gel = productos.find(p => p.title?.includes('Gel'));
  const protector = productos.find(p => p.title?.includes('Protector'));
  
  if (serum) {
    logs.push({
      tipo: 'salida',
      origen: 'compra',
      productId: serum._id.toString(),
      productTitle: serum.title,
      cantidad: 1,
      stockAnterior: 9,
      stockNuevo: 8,
      motivo: 'Venta: Combo Triple Acción',
      orderId: 'Camila-Figueroa',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
    });
  }
  
  if (gel) {
    logs.push({
      tipo: 'salida',
      origen: 'compra',
      productId: gel._id.toString(),
      productTitle: gel.title,
      cantidad: 1,
      stockAnterior: 9,
      stockNuevo: 8,
      motivo: 'Venta: Combo Triple Acción',
      orderId: 'Camila-Figueroa',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });
  }
  
  if (protector) {
    logs.push({
      tipo: 'salida',
      origen: 'compra',
      productId: protector._id.toString(),
      productTitle: protector.title,
      cantidad: 1,
      stockAnterior: 6,
      stockNuevo: 5,
      motivo: 'Venta: Combo Triple Acción',
      orderId: 'Camila-Figueroa',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });
  }
  
  if (logs.length > 0) {
    await inventoryLog.insertMany(logs);
    console.log(`Insertados ${logs.length} logs:`);
    logs.forEach(l => console.log(`  - ${l.tipo}: ${l.productTitle} ${l.cantidad > 0 ? '+' : '-'}${l.cantidad} (${l.motivo})`));
  }
  
  console.log('\n✅ Listo!');
  await client.close();
}

main().catch(console.error);