'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Truck, ShieldCheck, Sparkles, Timer, Zap, Star } from 'lucide-react';

export default function Hero() {
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
        {/* Gradient overlay - lighter on mobile to show more content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent md:via-black/30" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-[80vh] md:min-h-[90vh] flex flex-col justify-start md:justify-center px-4 md:px-8 lg:px-12 pt-24 md:pt-0 pb-8">
        
        {/* Main Content */}
        <div className="max-w-2xl">
          
          {/* URGENCY + OFERTA - Badges verdes solo mobile */}
          <div className="md:hidden flex items-center gap-2 mb-4">
            {/* 25% OFF */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#35de80] rounded-full shadow-lg shadow-green-500/30">
              <Zap className="w-4 h-4 text-black" strokeWidth={2} />
              <span className="text-black text-xs font-bold">25% OFF</span>
            </div>
            
            {/* Stock limitado */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#35de80] rounded-full shadow-lg shadow-green-500/30 animate-pulse">
              <Timer className="w-4 h-4 text-black" strokeWidth={2} />
              <span className="text-black text-xs font-bold">Stock</span>
            </div>
          </div>
          
          {/* Desktop: Badges verdes */}
          <div className="hidden md:flex flex-wrap gap-2 md:gap-3 mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-[#35de80] text-black text-sm md:text-base font-bold rounded-xl shadow-lg shadow-green-500/30">
              <Zap className="w-4 h-4" strokeWidth={2} />
              Hasta 25% OFF
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-[#35de80] text-black text-sm md:text-base font-semibold rounded-xl shadow-lg shadow-green-500/30 animate-pulse">
              <Timer className="w-4 h-4" strokeWidth={2} />
              Stock limitado
            </span>
          </div>

          {/* Headline - Resultado + Beneficio claro */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] md:leading-[1.1] tracking-tight mb-3">
            Piel más luminosa,{' '}
            <span className="text-primary">sin complicaciones</span>
          </h1>

          {/* Subheadline - Claridad + reducción de fricción */}
          <p className="text-base md:text-lg lg:text-xl text-white/80 leading-relaxed mb-6 max-w-md md:max-w-xl">
            Productos diseñados por expertos para transformar tu piel con rutinas simples que{' '}
            <span className="text-white">dan resultados desde la primera semana.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {/* Primary CTA - Emocional */}
            <Link
              href="/productos"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-primary hover:bg-primary/90 text-black text-base md:text-lg font-bold rounded-lg transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              Empezar mi rutina
              <Sparkles className="w-5 h-5" />
            </Link>
            {/* Secondary CTA */}
            <Link
              href="/combos"
              className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-transparent border-2 border-white/30 hover:border-white text-white text-base md:text-lg font-medium rounded-lg transition-all duration-300"
            >
              Ver descuentos
            </Link>
          </div>

          {/* Trust Indicators - Refuerzo de confianza (RESALTADOS) */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm md:text-base">
            {/* Envío gratis - Más visible */}
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/10">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-white font-semibold">Envío gratis</p>
                <p className="text-white/50 text-xs">A todo el país</p>
              </div>
            </div>
            
            {/* Testeado dermatológicamente */}
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/10">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-semibold">Testeado</p>
                <p className="text-white/50 text-xs">Dermatológicamente</p>
              </div>
            </div>
            
            {/* Compra segura */}
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/10">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-semibold">Compra segura</p>
                <p className="text-white/50 text-xs">100% protegida</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}