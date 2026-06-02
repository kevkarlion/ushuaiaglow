'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Sparkles, Timer, Zap, Star } from 'lucide-react';

export default function Hero() {
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.08 } }
  };

  return (
    <section className="relative min-h-[100vh] md:min-h-[100vh] bg-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bottom-10 md:bottom-[-65]">
        <Image
          src="/hero-1.png"
          alt="Ushuaia beauty natural"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay - más profundo en desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 md:via-black/40" />
      </div>

      {/* Content Container */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}>
      <div className="relative z-10 min-h-[80vh] md:min-h-[90vh] flex flex-col justify-start md:justify-center px-4 md:px-8 lg:px-12 pt-28 md:pt-0 pb-8">
        
        {/* Main Content */}
        <div className="max-w-2xl">
          
          {/* URGENCY + OFERTA - Badges verdes solo mobile */}
          <div className="md:hidden flex items-center gap-2 mb-5">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#35de80] rounded-full shadow-lg shadow-green-500/30">
              <Zap className="w-4 h-4 text-black" strokeWidth={2} />
              <span className="text-black text-xs font-bold">25% OFF</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#35de80] rounded-full shadow-lg shadow-green-500/30 animate-pulse">
              <Timer className="w-4 h-4 text-black" strokeWidth={2} />
              <span className="text-black text-xs font-bold">Stock</span>
            </div>
          </div>
          
          {/* Desktop: Badges verdes */}
          <div className="hidden md:flex flex-wrap gap-2 md:gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-[#35de80] text-black text-sm md:text-base font-bold rounded-full shadow-lg shadow-green-500/30">
              <Zap className="w-4 h-4" strokeWidth={2} />
              Hasta 25% OFF
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-[#35de80] text-black text-sm md:text-base font-semibold rounded-full shadow-lg shadow-green-500/30 animate-pulse">
              <Timer className="w-4 h-4" strokeWidth={2} />
              Stock limitado
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] md:leading-[1.05] tracking-tight mb-4">
            Piel más luminosa,{' '}
            <span className="text-primary">sin complicaciones</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg lg:text-xl text-white/70 leading-relaxed mb-8 max-w-md md:max-w-xl">
            Productos diseñados por expertos para transformar tu piel con rutinas simples que{' '}
            <span className="text-white font-medium">dan resultados desde la primera semana.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/productos"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 md:px-10 md:py-5 bg-primary hover:bg-primary/90 text-black text-base md:text-lg font-bold rounded-xl transition-all duration-500 ease-premium shadow-lg shadow-primary/20 hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              Empezar mi rutina
              <Sparkles className="w-5 h-5" />
            </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/combos"
              className="inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 bg-white/[0.04] hover:bg-white/[0.08] text-white text-base md:text-lg font-medium rounded-xl border border-white/10 hover:border-white/25 transition-all duration-500 ease-premium"
            >
              Ver descuentos
            </Link>
            </motion.div>
          </div>

          {/* Trust Indicators */}
          <motion.div variants={stagger} initial="hidden" animate="visible">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <motion.div variants={fadeUp}>
            <div className="flex items-center gap-3 bg-white/[0.04] backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/[0.06] hover:bg-white/[0.06] transition-colors duration-300">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Envío gratis</p>
                <p className="text-white/40 text-xs">A todo el país</p>
              </div>
            </div>
            </motion.div>
            
            <motion.div variants={fadeUp}>
            <div className="flex items-center gap-3 bg-white/[0.04] backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/[0.06] hover:bg-white/[0.06] transition-colors duration-300">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Testeado</p>
                <p className="text-white/40 text-xs">Dermatológicamente</p>
              </div>
            </div>
            </motion.div>
            
            <motion.div variants={fadeUp}>
            <div className="flex items-center gap-3 bg-white/[0.04] backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/[0.06] hover:bg-white/[0.06] transition-colors duration-300">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Compra segura</p>
                <p className="text-white/40 text-xs">100% protegida</p>
              </div>
            </div>
            </motion.div>
          </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
    </section>
  );
}