'use client';

// Force dynamic rendering for searchParams
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { LucideCheckCircle, LucideArrowRight, LucidePackage, LucideMail } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const { items, clearCart, isLoading } = useCart();
  const [cleaned, setCleaned] = useState(false);
  
  // Limpiar el carrito al montar el componente
  useEffect(() => {
    if (!cleaned && !isLoading && items.length > 0) {
      console.log('🧹 Limpiando carrito en checkout/success');
      clearCart();
      setCleaned(true);
    }
  }, [cleaned, isLoading, items, clearCart]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <LucideCheckCircle className="w-10 h-10 text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          ¡Gracias por tu compra!
        </h1>

        {/* Message */}
        <p className="text-gray-400 mb-8">
          Tu pedido fue confirmada y está siendo procesado. Te enviamos un email con los detalles.
        </p>

        {/* Order Info */}
        <div className="bg-surface-darker/30 rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-center gap-2 text-primary mb-2">
            <LucidePackage className="w-5 h-5" />
            <span className="font-medium">Pedido confirmado</span>
          </div>
          <p className="text-gray-500 text-sm">
            N° de pedido: <span className="font-mono text-white">CPT01-XXXXX</span>
          </p>
        </div>

        {/* What happens next */}
        <div className="text-left space-y-4 mb-8">
          <h2 className="text-white font-semibold">¿Qué sigue?</h2>
          <div className="flex gap-3">
            <LucideMail className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-gray-400 text-sm">
              Te enviamos un email de confirmación con los datos de tu pedido.
            </p>
          </div>
          <div className="flex gap-3">
            <LucidePackage className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-gray-400 text-sm">
              Preparamos tu pedido en 24-48hs hábiles y te avisamos cuando esté enviado.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/productos"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
          >
            Seguir comprando
            <LucideArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
          >
            ¿Necesitás ayuda?
          </Link>
        </div>
      </div>
    </div>
  );
}