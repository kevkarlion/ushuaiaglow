'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] bg-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-1.png"
          alt="Ushuaia beauty natural"
          fill
          className="object-cover md:object-[center_15%]"
          priority
        />
        {/* Gradient overlay - lighter on mobile to show more content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent md:via-black/30" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-[80vh] md:min-h-[90vh] flex flex-col justify-start md:justify-center px-4 md:px-8 lg:px-12 pt-24 md:pt-0 pb-8">
        
        {/* Main Content */}
        <div className="max-w-2xl">
          
          {/* Top Badges */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
            {/* Main discount badge */}
            <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-primary text-white text-xs md:text-sm font-semibold rounded-full">
              20% OFF en productos seleccionados
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] md:leading-[1.1] tracking-tight mb-3">
            Transformá tu piel{' '}
            <span className="text-primary">desde la primera semana</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg lg:text-xl text-white/80 leading-relaxed mb-6 max-w-md md:max-w-xl">
            Rutinas simples, resultados visibles. Cuidado real para tu piel.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Primary CTA */}
            <Link
              href="/productos"
              className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-primary hover:bg-primary/90 text-white text-base md:text-lg font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-primary/20"
            >
              Comprar ahora
            </Link>
            {/* Secondary CTA */}
            <Link
              href="/combos"
              className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-transparent border-2 border-white/30 hover:border-white text-white text-base md:text-lg font-medium rounded-lg transition-all duration-300"
            >
              Ver combos
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-3 md:gap-5 text-xs md:text-sm text-white/60">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Envíos a todo el país</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Dermatológicamente testeado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Aprovecha nuestros combos</span>
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