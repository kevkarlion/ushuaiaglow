'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Play,
  Clock,
  Sparkles,
  Droplets,
  Sun,
  Moon,
  Star,
  Shield,
  Package,
  Info,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Palette,
  Layers,
  Timer,
  Scale,
  Eye
} from 'lucide-react';

// =====================
// ANIMATIONS
// =====================
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

// =====================
// DATA - COMBOS REALES DE LA TIENDA
// =====================
const combos = [
  {
    id: 'basico',
    name: 'Básico',
    tagline: 'Rutina diaria básica de limpieza e hidratación',
    products: ['Sérum Vit C', 'Gel Hidratante'],
    forSkin: 'Piel normal a mixta',
    duration: '30-40 días',
    intensity: 'suave',
    intensityValue: 30,
    whenUse: 'Mañana y noche',
    whatExpect: 'Luminosidad gradual e hidratación diaria',
    howItWorks: 'El Sérum vitamina C proporciona antioxidantes y luminosidad. El Gel hidratante mantiene la barrera cutánea y la piel suave.',
    image: '/combos/combo-1-ok.webp'
  },
  {
    id: 'proteccion-tratamiento',
    name: 'Protección + Tratamiento',
    tagline: 'Cuidado diario con protección solar',
    products: ['Protector Solar SPF50', 'Sérum Vit C'],
    forSkin: 'Todo tipo de piel',
    duration: '30-45 días',
    intensity: 'media',
    intensityValue: 50,
    whenUse: 'Mañana',
    whatExpect: 'Protección UV + luminosidad + prevención de envejecimiento',
    howItWorks: 'El protector solar protege del daño UV mientras el Sérum vitamina C combate la oxidación celular y unifica el tono.',
    image: '/combos/combo-2-ok.webp'
  },
  {
    id: 'hidratacion-intensiva',
    name: 'Hidratación Intensiva',
    tagline: 'Tratamiento completo de hidratación',
    products: ['Sérum Vit C', 'Gel Hidratante', 'Mascarilla Hidratante'],
    forSkin: 'Piel seca o deshidratada',
    duration: '25-30 días',
    intensity: 'alta',
    intensityValue: 75,
    whenUse: 'Noche',
    whatExpect: 'Hidratación profunda, piel suave y sedosa',
    howItWorks: 'La mascarilla proporciona hidratación intensiva, el gel mantiene la humedad y el sérum nutre con antioxidantes.',
    image: '/combos/combo-3.webp'
  },
  {
    id: 'spa-en-casa',
    name: 'Spa en Casa',
    tagline: 'Kit de relajación completo',
    products: ['Sérum Vit C', 'Gel Hidratante', 'Mascarilla Hidratante', 'Vincha'],
    forSkin: 'Todo tipo de piel',
    duration: '20-25 días',
    intensity: 'alta',
    intensityValue: 80,
    whenUse: 'Noche (1-2 por semana)',
    whatExpect: 'Experiencia spa en casa, hidratación profunda y relajación',
    howItWorks: 'La vincha facilita la aplicación de mascarilla, que junto con el sérum y gel proporciona máxima hidratación.',
    image: '/combos/combo-4-ok.webp'
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'El kit completo para el cuidado máximo',
    products: ['Sérum Vit C', 'Gel Hidratante', 'Vincha', 'Protector Solar SPF50', 'Mascarilla Hidratante'],
    forSkin: 'Todo tipo de piel',
    duration: '20-30 días',
    intensity: 'máxima',
    intensityValue: 100,
    whenUse: 'Mañana y noche',
    whatExpect: 'Rutina completa: protección, tratamiento e hidratación',
    howItWorks: 'La rutina más completa combina protector solar de día con activos tratamientos de noche para resultados óptimos.',
    image: '/combos/combo-5.webp'
  }
];

// =====================
// DATA - GUÍA DE APLICACIÓN
// =====================
const applicationSteps = {
  antes: {
    title: 'Antes de aplicar',
    description: 'La preparación es clave para que el producto funcione correctamente.',
    steps: [
      {
        title: 'Limpia tu rostro',
        description: 'Usa el gel limpiador con agua tibia. No uses agua caliente porque elimina aceites naturales.',
        tip: 'Duración del lavado: 60 segundos'
      },
      {
        title: 'Seca suavemente',
        description: 'Toca con una toalla limpia, sin frotar. La piel debe estar ligeramente húmeda.',
        tip: 'Deja secar 2-3 minutos'
      },
      {
        title: 'Exfoliación (opcional)',
        description: '1-2 veces por semana, usa un exfoliante suave.',
        tip: 'No exfolies si usaste retinol recientemente'
      }
    ]
  },
  durante: {
    title: 'Durante la aplicación',
    description: 'La forma de aplicar influye en el resultado final.',
    steps: [
      {
        title: 'Cantidad correcta',
        description: 'Un guisante del tamaño de un botón para rostro y cuello.',
        tip: 'Menos = más efectivo, evita obstruir los poros'
      },
      {
        title: 'Técnica de aplicación',
        description: 'Masajea con movimientos ascendentes. Evita la zona de ojos.',
        tip: 'No frotes, solo masajea'
      },
      {
        title: 'Tiempo de espera',
        description: 'Esperá 2-3 minutos entre capas para que se absorba.',
        tip: 'Siguiente producto = após 3 min mínimo'
      }
    ]
  },
  despues: {
    title: 'Después de aplicar',
    description: 'Los pasos finales consolidan el resultado.',
    steps: [
      {
        title: 'Dejá absorber',
        description: 'No tocarte la cara durante 5-10 minutos.',
        tip: 'Evitá celular y apoyar cara en superficies'
      },
      {
        title: 'Hidratá si es necesario',
        description: 'Si sentís tirante, aplicá gel hidratante.',
        tip: 'El exceso puede reducir efectividad de activos'
      },
      {
        title: 'Protegé del sol',
        description: 'El protector solar es OBLIGATORIO de día.',
        tip: 'Reaplicar cada 2-3 horas si estás al sol'
      }
    ]
  }
};

// =====================
// DATA - ERRORES COMUNES
// =====================
const commonMistakes = [
  {
    mistake: 'Aplicar demasiado producto',
    whyWrong: 'Obstruye los poros, puede causar grano, reduce efectividad',
    solution: 'Usá la cantidad de un guisante. Menos es más.'
  },
  {
    mistake: 'Mezclar activos incompatibles',
    whyWrong: 'Vitamina C + Retinol puede irritar. Ácidos + Retinol = irritación',
    solution: 'Usá Vit C de día y Retinol de noche. No mezcles ácidos con retinol.'
  },
  {
    mistake: 'Saltar el protector solar',
    whyWrong: 'Sin protección, los activos se oxidan y causán más daño que beneficio',
    solution: 'SPF 50 todos los días, incluso en invierno.'
  },
  {
    mistake: 'No dar tiempo de adaptación',
    whyWrong: 'El retinol necesita semanas para que la piel se adapte',
    solution: 'Empezá 2-3 veces por semana, aumentá gradualmente.'
  }
];

// =====================
// DATA - RESULTADOS
// =====================
const resultsData = [
  {
    timeframe: 'Primeras 48 horas',
    title: 'Efecto inmediato',
    description: 'La piel se siente más suave e hidratada. El protector solar proporciona un acabado luminoso sutil.',
    visual: 'Textura suave al tacto'
  },
  {
    timeframe: '7-14 días',
    title: 'Adaptación inicial',
    description: 'La piel comienza a adaptarse. Podés notar mayor sensibilidad o leve descamación con retinol.',
    visual: 'Tono más uniforme'
  },
  {
    timeframe: '30 días',
    title: 'Resultados visibles',
    description: 'Luminosidad notable, textura mejorada, líneas de expresión menos profundas.',
    visual: 'Glow natural'
  },
  {
    timeframe: '60+ días',
    title: 'Transformación completa',
    description: 'Piel renovadas, tono uniforme, reducción de manchas solares.',
    visual: 'Piel radiante'
  }
];

// =====================
// DATA - ELEGI SEGÚN TU PIEL
// =====================
const skinTypes = [
  {
    type: 'Piel clara',
    description: 'Tono muy claro, se quema fácil',
    recommendation: 'Protección + Tratamiento',
    tip: 'SPF 50 obligatorio. Vitaminas + protección solar.',
    intensity: 'media',
    gradient: 'from-amber-100 to-orange-200'
  },
  {
    type: 'Piel intermedia',
    description: 'Tono medio, se broncea',
    recommendation: 'Básico o Protección + Tratamiento',
    tip: 'Cualquiera funciona. Básico para diario.',
    intensity: 'suave',
    gradient: 'from-amber-300 to-orange-400'
  },
  {
    type: 'Piel oscura',
    description: 'Tono oscuro, se broncea rápido',
    recommendation: 'Básico o Hidratación Intensiva',
    tip: 'Evitá productos muy fuertes. Enfocá en hidratación.',
    intensity: 'media',
    gradient: 'from-amber-600 to-orange-700'
  },
  {
    type: 'Piel seca',
    description: 'Tirante, descamada, sin brillo',
    recommendation: 'Hidratación Intensiva',
    tip: 'Mascarilla + sérum + gel para máxima hidratación.',
    intensity: 'alta',
    gradient: 'from-blue-100 to-cyan-200'
  },
  {
    type: 'Piel mixta/grasa',
    description: 'Zona T brillante, mejillas normales',
    recommendation: 'Básico',
    tip: 'Gel ligero, no heavy creams. Sérum para equilibrar.',
    intensity: 'suave',
    gradient: 'from-green-100 to-emerald-200'
  }
];

// =====================
// DATA - FAQ
// =====================
const faqs = [
  {
    question: '¿El producto mancha la ropa?',
    answer: 'No, se absorbe completamente en 3-5 minutos. Podés vestirte después. En casos muy raros, si aplicás exceso, puede dejar residuo aceitoso. La solución: meno cantidad, esperar más tiempo antes de vestirte.'
  },
  {
    question: '¿Qué pasa si aplico demasiado?',
    answer: 'Aplicar demasiado no da mejores resultados. Al contrario: puede obstruir los poros, causar granos, irritación y reducir la efectividad. La cantidad correcta = un guisante del tamaño de un botón para todo el rostro.'
  },
  {
    question: '¿Cómo evito manchas en la piel?',
    answer: '3 reglas: 1) Siempre protector solar SPF 50, 2) No aplicar retinol y Vit C juntos, 3) Si notás manchas, reducí frecuencia de activos fuertes. Las manchas existentes necesitan tiempo: 60+ días para ver mejora.'
  },
  {
    question: '¿Cuánto dura el efecto?',
    answer: 'El efecto de una aplicación dura todo el día (8-12 horas). Para resultados acumulativos, usá diariamente. Si dejás de usarlo, la piel vuelve a su estado anterior en 2-4 semanas.'
  },
  {
    question: '¿Puedo usarlo todos los días?',
    answer: 'Depende del producto: Protector solar = sí, diario, mañana. Gel hidratante = sí, diario. Sérum Vit C = sí, diario. Retinol = empezar 2-3 veces por semana, aumentar gradualmente. Exfoliante = máximo 2 veces por semana.'
  }
];

// =====================
// COMPONENTS
// =====================

function StarRating({ size = 14 }: { size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={size} className="fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

function AccordionItem({ item, isOpen, onToggle }: { item: typeof faqs[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="text-sm md:text-base text-white font-medium group-hover:text-primary transition-colors pr-4">
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-white/40 flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm md:text-base text-white/70 leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Accordion({ items }: { items: typeof faqs }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-white/10">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}

function ComboCard({ combo, index }: { combo: typeof combos[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-gradient-to-b from-surface-darker/60 to-surface-darker/40 rounded-3xl border border-white/10 overflow-hidden group"
    >
      {/* Imagen del combo - estilo producto */}
      <div className="relative h-40 md:h-44 overflow-hidden bg-surface-darker">
        <Image
          src={combo.image}
          alt={combo.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        
        {/* Overlay con opacidad para que se vea la imagen pero sea legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Badge de duración */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <Clock className="w-3.5 h-3.5 text-pink-300" />
          <span className="text-xs text-white/90 font-medium">{combo.duration}</span>
        </div>
        
        {/* Texto superpuesto sobre la imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-1.5">
            {index === 0 && (
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                TOP VENDIDO
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-white drop-shadow-lg">{combo.name}</h3>
          <p className="text-sm text-white/80 drop-shadow">{combo.tagline}</p>
        </div>
      </div>

      {/* Header del dropdown - solo el chevron */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3 flex items-center justify-center text-left hover:bg-white/5 transition-colors border-t border-white/5"
      >
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-white/40"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/10 pt-4 space-y-4">
              {/* Products */}
              <div>
                <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Incluye</p>
                <div className="flex flex-wrap gap-2">
                  {combo.products.map((p, i) => (
                    <span key={i} className="text-xs bg-white/10 text-white/80 px-3 py-1.5 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-white/50 mb-1">Para piel</p>
                  <p className="text-sm text-white font-medium">{combo.forSkin}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-white/50 mb-1">Cuándo</p>
                  <p className="text-sm text-white font-medium">{combo.whenUse}</p>
                </div>
              </div>

              {/* What expect */}
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-white/50 mb-1">Qué esperar</p>
                <p className="text-sm text-white/80">{combo.whatExpect}</p>
              </div>

              {/* How it works */}
              <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                <p className="text-xs text-primary mb-1">Cómo funciona</p>
                <p className="text-sm text-white/80">{combo.howItWorks}</p>
              </div>

              {/* CTA */}
              <Link
                href="/combos"
                className="inline-flex items-center justify-center w-full py-3 bg-primary hover:bg-primary/90 text-black font-bold text-sm rounded-xl transition-all"
              >
                Ver Combo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ApplicationPhase({ 
  phase, 
  icon: Icon,
  color,
  isOpen,
  onToggle
}: { 
  phase: typeof applicationSteps.antes; 
  icon: any;
  color: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const expanded = isOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-surface-darker/30 rounded-2xl border border-white/5 overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-rose-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white">{phase.title}</h3>
          <p className="text-xs text-white/50">{phase.description}</p>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          className="text-white/40"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/10 pt-3 space-y-3">
              {phase.steps.map((step, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-white/30">0{i + 1}</span>
                    <h4 className="text-sm font-medium text-white">{step.title}</h4>
                  </div>
                  <p className="text-xs text-white/70 mb-2">{step.description}</p>
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <AlertCircle className="w-3 h-3" />
                    <span>{step.tip}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MistakeCard({ mistake, index }: { mistake: typeof commonMistakes[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-6 border border-white/10 hover:border-pink-300/30 transition-all duration-500"
    >
      {/* Icono */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-rose-100/10">
        <AlertCircle className="w-6 h-6 text-rose-400" />
      </div>

      {/* Error */}
      <h4 className="font-semibold text-white text-lg mb-3 group-hover:text-rose-200 transition-colors">
        {mistake.mistake}
      </h4>

      {/* Por qué está mal */}
      <p className="text-sm text-white/50 mb-5 leading-relaxed">
        {mistake.whyWrong}
      </p>

      {/* Solución */}
      <div className="flex items-start gap-3 bg-gradient-to-r from-emerald-50/10 to-teal-50/10 rounded-2xl p-4 border border-emerald-200/10">
        <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-0.5 flex-shrink-0" />
        <span className="text-sm text-white/70 leading-relaxed">{mistake.solution}</span>
      </div>
    </motion.div>
  );
}

function ResultCard({ result, index }: { result: typeof resultsData[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="relative"
    >
      {/* Timeline dot */}
      <div className="absolute -left-4 top-4 w-3 h-3 rounded-full bg-pink-300 shadow-lg shadow-pink-200/50" />
      {index < resultsData.length - 1 && (
        <div className="absolute -left-1.5 top-7 bottom-0 w-0.5 bg-white/10" />
      )}
      
      <div className="pl-6 pb-8">
        <span className="text-xs text-pink-200 font-medium mb-1 block">{result.timeframe}</span>
        <h4 className="text-base font-semibold text-white mb-2">{result.title}</h4>
        <p className="text-sm text-white/50 mb-3">{result.description}</p>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-rose-500/10 px-3 py-2 rounded-xl border border-pink-200/10">
          <Eye className="w-3 h-3 text-pink-300" />
          <span className="text-xs text-white/60">{result.visual}</span>
        </div>
      </div>
    </motion.div>
  );
}

function SkinTypeCard({ skin, index }: { skin: typeof skinTypes[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-surface-darker/30 rounded-2xl border border-white/5 p-4 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${skin.gradient}`} />
        <div>
          <h4 className="font-bold text-white">{skin.type}</h4>
          <p className="text-xs text-white/50">{skin.description}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="text-sm text-white/80">{skin.recommendation}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs text-white/60">{skin.tip}</span>
        </div>
        
        {/* Intensity bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-white/40 mb-1">
            <span>Intensidad</span>
            <span className="capitalize">{skin.intensity}</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${skin.intensity === 'suave' ? 30 : skin.intensity === 'media' ? 60 : 80}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// =====================
// MAIN PAGE
// =====================
export default function ComoFuncionaPage() {
  const [antesExpanded, setAntesExpanded] = useState(false);
  const [duranteExpanded, setDuranteExpanded] = useState(false);
  const [despuesExpanded, setDespuesExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      {/* =====================
        1. HERO EDUCATIVO
      ===================== */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-surface-darker/50 to-black">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Info className="w-4 h-4" />
                Guía completa
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
            >
              Cómo usar <span className="text-primary">Ushuaia Glow</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-white/70 max-w-xl mx-auto"
            >
              Aprendé paso a paso cómo aplicar cada producto y elegir el combo ideal para tu piel.
            </motion.p>

            {/* Quick nav */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center gap-3 mt-8"
            >
              <a href="#combos" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded-full transition-colors">
                Ver combos
              </a>
              <a href="#aplicar" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded-full transition-colors">
                Cómo aplicar
              </a>
              <a href="#elegir" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded-full transition-colors">
                Elegir según tu piel
              </a>
              <a href="#errores" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded-full transition-colors">
                Errores a evitar
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================
        2. EXPLICACIÓN REAL DE CADA COMBO
      ===================== */}
      <section id="combos" className="py-12 md:py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Conoce cada combo
            </h2>
            <p className="text-white/60 text-sm md:text-base">
              Tocá cada card para ver qué incluye, para quién es y qué esperar
            </p>
          </motion.div>

          <div className="space-y-4">
            {combos.map((combo, index) => (
              <ComboCard key={combo.id} combo={combo} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================
        3. GUÍA REAL DE APLICACIÓN
      ===================== */}
      <section id="aplicar" className="py-12 md:py-20 bg-surface-darker/20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Guía de aplicación
            </h2>
            <p className="text-white/60 text-sm md:text-base">
              Los 3 momentos clave para que funcione correctamente
            </p>
          </motion.div>

          {/* Guía de aplicación - 3 fases */}
          {[
            { phase: applicationSteps.antes, icon: Palette, color: 'from-rose-100 to-pink-100', open: antesExpanded, setOpen: setAntesExpanded },
            { phase: applicationSteps.durante, icon: Layers, color: 'from-violet-100 to-purple-100', open: duranteExpanded, setOpen: setDuranteExpanded },
            { phase: applicationSteps.despues, icon: Droplets, color: 'from-cyan-100 to-sky-100', open: despuesExpanded, setOpen: setDespuesExpanded }
          ].map((item, idx) => (
            <ApplicationPhase
              key={idx}
              phase={item.phase}
              icon={item.icon}
              color={`bg-gradient-to-br ${item.color}`}
              isOpen={item.open}
              onToggle={() => {
                if (item.open) {
                  item.setOpen(false);
                } else {
                  setAntesExpanded(false);
                  setDuranteExpanded(false);
                  setDespuesExpanded(false);
                  item.setOpen(true);
                }
              }}
            />
          ))}
        </div>
      </section>

      {/* =====================
        4. ERRORES COMUNES
      ===================== */}
      <section id="errores" className="py-12 md:py-20 bg-black">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-300 px-4 py-1.5 rounded-full text-xs font-medium mb-4">
              <AlertCircle className="w-3 h-3" />
              Evita estos errores
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              Lo que podría estar<br className="md:hidden" /> rompiendo tu rutina
            </h2>
            <p className="text-white/50 text-sm md:text-base max-w-md mx-auto">
              Estos errores son más comunes de lo que pensás. Evitalos para mejores resultados.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonMistakes.map((mistake, index) => (
              <MistakeCard key={index} mistake={mistake} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================
        5. RESULTADOS ESPERADOS
      ===================== */}
      <section className="py-12 md:py-20 bg-surface-darker/20">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Cuándo verás resultados
            </h2>
            <p className="text-white/60 text-sm md:text-base">
              Expectativas realistas según el tiempo de uso
            </p>
          </motion.div>

          <div className="relative pl-6">
            {resultsData.map((result, index) => (
              <ResultCard key={index} result={result} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================
        6. ELEGÍ SEGÚN TU PIEL
      ===================== */}
      <section id="elegir" className="py-12 md:py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Elegí según tu piel
            </h2>
            <p className="text-white/60 text-sm md:text-base">
              Cada piel es diferente. Encontrá el combo ideal para vos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skinTypes.map((skin, index) => (
              <SkinTypeCard key={index} skin={skin} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================
        7. FAQ ÚTIL
      ===================== */}
      <section className="py-12 md:py-20 bg-surface-darker/20">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Preguntas frecuentes
            </h2>
            <p className="text-white/60 text-sm md:text-base">
              Respondemos las dudas más comunes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-surface-darker/40 rounded-2xl border border-white/5 p-4 md:p-6"
          >
            <Accordion items={faqs} />
          </motion.div>
        </div>
      </section>

      {/* =====================
        8. CTA FINAL
      ===================== */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-surface-darker/30 to-black">
        <div className="max-w-xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¿Ya sabés cuál elegir?
            </h2>
            <p className="text-white/60 mb-6">
              Encontrá el combo ideal para tu tipo de piel y empezá a ver resultados reales.
            </p>
            
            <Link
              href="/combos"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl transition-all hover:shadow-xl hover:shadow-primary/20"
            >
              Ver todos los combos
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-8 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Testeado dermatológicamente
              </span>
              <span className="flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                Envío gratis
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}