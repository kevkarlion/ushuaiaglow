const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = 'ushuaia';

async function generateProductSitemap() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');

    const db = client.db(DB_NAME);
    const products = await db.collection('products').find({}).toArray();

    console.log(`📦 ${products.length} productos encontrados`);

    // Generar slug desde el título
    const urls = products.map(product => {
      const slug = product.title
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar acentos
        .replace(/[^a-z0-9]+/g, '-') // Espacios a guiones
        .replace(/^-|-$/g, ''); // Quitar guiones al inicio/fin

      return `  <url>
    <loc>https://www.ushuaiaglow.com/productos/${slug}</loc>
    <lastmod>${new Date(product.updatedAt || product.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    const outputPath = path.join(__dirname, '..', 'public', 'sitemap-products.xml');
    fs.writeFileSync(outputPath, sitemap);

    console.log(`✅ sitemap-products.xml generado con ${products.length} URLs`);
    console.log(`📁 Guardado en: ${outputPath}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

generateProductSitemap();