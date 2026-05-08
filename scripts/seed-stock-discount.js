/**
 * Script para ejecutar descuento de stock de una venta existente
 * Uso: node scripts/seed-stock-discount.js
 */

const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb+srv://kriquelme10_db_user:dN7Qy5ImrD5dZgsZ@cluster0.qhauxb0.mongodb.net/ushuaia?appName=Cluster0';

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('ushuaia');
  const productsCollection = db.collection('products');
  
  console.log('=== DESCUENTO DE STOCK PARA COMPRA DE CAMILA ===\n');
  
  // 1. Buscar la venta
  const sale = await db.collection('sales').findOne({ 
    buyerEmail: 'camilabelenfigueroa@hotmail.com' 
  });
  
  if (!sale) {
    console.log('❌ Venta no encontrada');
    await client.close();
    return;
  }
  
  console.log('Venta:', sale.buyerNombre);
  console.log('Items:', sale.items.map(i => `${i.title} x${i.quantity}`));
  console.log('');
  
  const stockDeduction = [];
  const stockErrors = [];
  
  // 2. Procesar cada item (misma lógica que el webhook)
  for (const item of sale.items) {
    const productIdStr = item.productId?.toString() || '';
    const itemTitle = item.title?.trim() || '';
    
    console.log(`Procesando: ${itemTitle}`);
    
    // Buscar producto
    let comboProduct = null;
    if (/^[a-f0-9]{24}$/i.test(productIdStr)) {
      comboProduct = await productsCollection.findOne({ _id: new ObjectId(productIdStr) });
    }
    if (!comboProduct && itemTitle) {
      comboProduct = await productsCollection.findOne({ title: itemTitle });
    }
    
    // Detectar si es combo
    const isCombo = comboProduct?.isCombo === true || productIdStr.startsWith('combo-');
    console.log(`  - ¿Es combo?: ${isCombo}`);
    
    if (isCombo && comboProduct?.productsIncluded) {
      const productsInCombo = Array.isArray(comboProduct.productsIncluded) 
        ? comboProduct.productsIncluded 
        : JSON.parse(comboProduct.productsIncluded);
      
      console.log(`  - Productos incluidos: ${productsInCombo.join(', ')}`);
      
      // Descontar cada producto
      for (const includedName of productsInCombo) {
        const includedNameTrim = includedName.trim();
        
        // Ver stock ANTES
        const beforeProduct = await productsCollection.findOne({ 
          title: { $regex: new RegExp(`^${includedNameTrim}$`, 'i') }
        });
        
        if (!beforeProduct) {
          // Buscar fuzzy
          const fuzzy = await productsCollection.findOne({
            title: { $regex: new RegExp(includedNameTrim, 'i') }
          });
          if (fuzzy) {
            const newStock = Math.max(0, (fuzzy.stock || 0) - item.quantity);
            await productsCollection.updateOne(
              { _id: fuzzy._id },
              { $set: { stock: newStock, updatedAt: new Date() } }
            );
            console.log(`    ✓ ${fuzzy.title}: ${fuzzy.stock} → ${newStock}`);
            stockDeduction.push(`${fuzzy.title} (-1)`);
          } else {
            console.log(`    ✗ No encontrado: ${includedName}`);
            stockErrors.push(`No encontrado: ${includedName}`);
          }
        } else {
          const newStock = Math.max(0, (beforeProduct.stock || 0) - item.quantity);
          await productsCollection.updateOne(
            { _id: beforeProduct._id },
            { $set: { stock: newStock, updatedAt: new Date() } }
          );
          console.log(`    ✓ ${beforeProduct.title}: ${beforeProduct.stock} → ${newStock}`);
          stockDeduction.push(`${beforeProduct.title} (-1)`);
        }
      }
      stockDeduction.push(`[COMBO] ${itemTitle}`);
    } 
    else if (comboProduct) {
      // Producto individual
      const newStock = Math.max(0, (comboProduct.stock || 0) - item.quantity);
      await productsCollection.updateOne(
        { _id: comboProduct._id },
        { $set: { stock: newStock, updatedAt: new Date() } }
      );
      console.log(`  ✓ ${comboProduct.title}: ${comboProduct.stock} → ${newStock}`);
      stockDeduction.push(itemTitle);
    } else {
      console.log(`  ✗ No encontrado`);
      stockErrors.push(`No encontrado: ${itemTitle}`);
    }
  }
  
  console.log('\n=== RESUMEN ===');
  console.log('Stock deducido:', stockDeduction);
  if (stockErrors.length) console.log('Errores:', stockErrors);
  
  // 3. Mostrar stock final
  console.log('\n=== STOCK ACTUAL (luego del descuento) ===');
  const products = await productsCollection.find({ 
    title: { $in: ['Sérum Vitamina C', 'Gel Hidratante', 'Protector Solar FPS 45'] }
  }).toArray();
  products.forEach(p => console.log(`- ${p.title}: ${p.stock}`));
  
  await client.close();
  console.log('\n✅ Listo!');
}

main().catch(console.error);