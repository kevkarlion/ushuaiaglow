import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://kriquelme10_db_user:dN7Qy5ImrD5dZgsZ@cluster0.qhauxb0.mongodb.net/ushuaia?appName=Cluster0";

const comboData = [
  {
    slug: 'combo-basico-glow',
    updates: {
      tagline: "Todo lo que necesitás para una rutina diaria radiance en un solo combo.",
      queEs: "Duo hidratante que equilibra, suaviza e ilumina la piel en pocos pasos.",
      commercialDescription: "Este combo incluye todo lo que necesitás para tu rutina diaria de skincare. El sérum antioxidante y el gel hidratante trabajan juntos para dar luz, hidratación y protección a tu piel cada día.",
      benefits: [
        "Rutina completa en 2 pasos",
        "Hidratación que dura todo el día",
        "Textura ligera de absorción inmediata",
        "Perfecto para antes del maquillaje"
      ],
      featuredReview: {
        text: "Increíble relación precio-calidad. Llevo 3 meses usándolo y mi piel nunca se vio tan luminosa.",
        author: "Laura K."
      },
      rating: 4.7,
    }
  },
  {
    slug: 'combo-proteccion-total',
    updates: {
      tagline: "Protección solar + tratamiento en un solo paso.",
      queEs: "Duo esencial que protege e ilumina la piel todos los días.",
      commercialDescription: "La combinación perfecta de tratamiento y protección. El sérum con vitamina C potencia la luminosidad mientras el protector solar FPS 45 previene el fotoenvejecimiento.",
      benefits: [
        "Protección SPF 45 de amplio espectro",
        "Previene manchas y líneas de expresión",
        "Antioxidante más protección solar",
        "Acabado invisible sin residue"
      ],
      featuredReview: {
        text: "No deja white cast y se siente superligero. Es el único protector que uso diario.",
        author: "Martina R."
      },
      rating: 4.8,
    }
  },
  {
    slug: 'combo-rutina-completa',
    updates: {
      tagline: "Todo necesario para una piel radiante y saludable.",
      queEs: "Sérum + Gel + Mascarilla para una rutina completa.",
      commercialDescription: "Tu rutina de skincare completa en un solo combo. Incluye los 3 pasos esenciales: tratamiento con sérum, hidratación con gel y boost de luminosidad con mascarilla.",
      benefits: [
        "3 pasos para resultados visibles",
        "Hidratación intensiva",
        "Efecto glow instantáneo",
        "Ideal para rutina de weekends"
      ],
      featuredReview: {
        text: "El combo que me salvó antes de cada evento. Piel perfecta al instante.",
        author: "Sofia T."
      },
      rating: 4.6,
    }
  },
  {
    slug: 'combo-spa-en-casa',
    updates: {
      tagline: "Tu spa de lujo en la comodidad de tu hogar.",
      queEs: "Sérum + Gel + Mascarilla + Vincha para una experiencia spa completa.",
      commercialDescription: "La experiencia spa definitiva en casa. Incluye todos los productos para una rutina completa más la vincha premium que hace que la aplicación sea cómoda y efectiva.",
      benefits: [
        "Vincha premium suave y resistente",
        "Aplicación prolija sin messes",
        "Rutina de spa en casa",
        "Regalo perfecto"
      ],
      featuredReview: {
        text: "Me siento como en spa. La vincha es de primera y los productos funcionan muy bien.",
        author: "Valentina P."
      },
      rating: 4.9,
    }
  },
  {
    slug: 'combo-full-skincare',
    updates: {
      tagline: "La rutina más completa para una piel luminosity definitiva.",
      queEs: "Kit premium con 5 productos para el skincare completo.",
      commercialDescription: "El combo más completo de la línea. Incluye sérum, gel hidratante, mascarilla, protector solar y vincha para una rutina de skincare profesional en casa.",
      benefits: [
        "5 productos premium",
        "Protección solar más tratamiento",
        "Rutina de spa diariamente",
        "Máxima luminosidad"
      ],
      featuredReview: {
        text: "Inversión que vale la pena. Piel luminosa todos los días con mínimo esfuerzo.",
        author: "Isabella M."
      },
      rating: 4.9,
    }
  }
];

async function updateCombos() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('ushuaia');
    const collection = db.collection('products');
    
    console.log('🔄 Actualizando combos...\n');
    
    for (const item of comboData) {
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
    
    console.log('\n✨ Actualización de combos completada!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateCombos();