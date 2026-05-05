import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

const newProductData = [
  {
    slug: 'serum-vitamina-c',
    updates: {
      tagline: "El boost de energía que tu rostro necesita cada mañana.",
      queEs: "Sérum iluminador con Vitamina C pura y activos antioxidantes.",
      commercialDescription: "Este sérum no solo hidrata, sino que actúa como un escudo invisible contra la contaminación y el estrés diario. Su fórmula liviana penetra profundamente para despertar el brillo natural de tu piel.",
      benefits: [
        "Adiós a la piel opaca: Brinda luz instantánea.",
        "Textura de seda: Se absorbe en segundos sin dejar brillo graso.",
        "Antioxidante real: Combate manchas y previene líneas de expresión."
      ],
      featuredReview: {
        text: "¡Es el favorito de quienes buscan resultados rápidos! Lo que más aman los usuarios es que realmente cumple el efecto 'glow' sin ser pesado. Ideal para usar antes del maquillaje.",
        author: "Usuario verificado"
      },
      rating: 4.5,
      brand: "City Girl",
      weight: "50ml"
    }
  },
  {
    slug: 'protector-solar-sundream-fps-45',
    updates: {
      tagline: "Protección invisible, hidratación real.",
      queEs: "Protector solar facial de amplio espectro con FPS 45.",
      commercialDescription: "Olvidate de los protectores pastosos y blancos. Sundream está diseñado para ser parte de tu rutina diaria, ofreciendo una capa ultra ligera que protege mientras deja que tu piel respire.",
      benefits: [
        "Acabado Invisible: No deja rastro blanco ni efecto 'mimo'.",
        "Toque Seco: Perfecto para climas húmedos o pieles que sudan fácil.",
        "Doble función: Protege del sol y previene el fotoenvejecimiento."
      ],
      featuredReview: {
        text: "La mayoría de las reseñas coinciden en lo mismo: 'No parece un protector solar'. Sorprende por lo liviano que es, y muchos usuarios lo eligen porque no irrita los ojos.",
        author: "Usuario verificado"
      },
      rating: 4.6,
      brand: "City Girl",
      weight: "50ml"
    }
  },
  {
    slug: 'mascarilla-iluminadora',
    updates: {
      tagline: "Un spa de 15 minutos en la comodidad de tu casa.",
      queEs: "Sheet mask de tela impregnada en suero revitalizante de alta concentración.",
      commercialDescription: "Es el rescate de emergencia para tu piel. Esta mascarilla baña tu rostro en suero iluminador, borrando los signos de cansancio y falta de sueño de inmediato.",
      benefits: [
        "Efecto 'Buena Cara' al instante: Piel radiante y descansada.",
        "Bombazo de hidratación: El sobre trae tanto suero que podés hidratar cuello y escote.",
        "Práctica y efectiva: Ideal para usar antes de un evento o tras un día largo."
      ],
      featuredReview: {
        text: "Es la 'joya oculta' de la marca. Quienes la prueban destacan que el material de la tela se ajusta perfecto al rostro y que la sensación de frescura dura horas.",
        author: "Usuario verificado"
      },
      rating: 4.8,
      brand: "City Girl",
      weight: "25ml / 12 pcs"
    }
  },
  {
    slug: 'gel-hidratante',
    updates: {
      tagline: "Control de poros y frescura total en un solo paso.",
      queEs: "Gel hidratante reparador para control de oleosidad y textura.",
      commercialDescription: "El equilibrio perfecto para pieles mixtas a grasas. La Niacinamida calma y reduce poros, mientras la Vitamina E repara la barrera cutánea sin aportar una gota de aceite.",
      benefits: [
        "Piel mate pero hidratada: Controla el brillo excesivo.",
        "Adiós imperfecciones: Ayuda a mejorar la textura de la piel con poros abiertos.",
        "Sensación de agua: Al aplicarlo se siente como una ráfaga de aire fresco."
      ],
      featuredReview: {
        text: "Los usuarios con piel grasa lo adoran porque 'se siente como si no tuvieras nada puesto'. Es muy recomendado por su capacidad para calmar rojeces.",
        author: "Usuario verificado"
      },
      rating: 4.4,
      brand: "City Girl",
      weight: "50gr"
    }
  },
  {
    slug: 'vincha-skincare',
    updates: {
      tagline: "Tu mejor aliada para una rutina cómoda y prolija.",
      queEs: "Vincha elástica de microfibra premium.",
      commercialDescription: "El accesorio que no sabías que necesitabas hasta que lo probás. Mantiene tu pelo seco y fuera del rostro para que puedas disfrutar de tu limpieza facial sin complicaciones.",
      benefits: [
        "Ultra suave: No corta ni marca el cabello.",
        "Resistente: Lavable y de larga duración.",
        "Versátil: Ideal para limpieza facial, maquillaje o aplicar mascarillas."
      ],
      featuredReview: {
        text: "Es el complemento perfecto para cualquier kit de regalo. Los clientes destacan que no aprieta la cabeza y que los colores son vibrantes y estéticos.",
        author: "Usuario verificado"
      },
      rating: 4.9,
      brand: "City Girl",
      weight: "PAQx12PCS"
    }
  }
];

async function updateProducts() {
  if (!uri || uri.includes('your_password') || uri.length < 20) {
    console.error('MongoDB no configurada. Asegúrate de tener MONGODB_URI en tu .env');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('ushuaia');
    const collection = db.collection('products');
    
    console.log('🔄 Actualizando productos...\n');
    
    for (const item of newProductData) {
      const result = await collection.updateOne(
        { slug: item.slug },
        { 
          $set: {
            ...item.updates,
            updatedAt: new Date()
          }
        }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✅ Actualizado: ${item.slug} (${result.modifiedCount} modificación)`);
      } else {
        console.log(`❌ No encontrado: ${item.slug}`);
      }
    }
    
    console.log('\n✨ Actualización completada!');
    
    // Mostrar productos actualizados
    console.log('\n📋 Productos en DB después de actualizar:');
    const products = await collection.find({}).toArray();
    products.forEach(p => {
      console.log(`- ${p.title} (${p.slug})`);
      console.log(`  tagline: ${p.tagline || 'sin tagline'}`);
      console.log(`  rating: ${p.rating || 'sin rating'}`);
      console.log(`  benefits: ${p.benefits?.length || 0} beneficios`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateProducts();