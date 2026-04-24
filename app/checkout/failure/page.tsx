'use client';

import Link from 'next/link';
import { LucideXCircle, LucideRefreshCw, LucideArrowRight, LucideHelpCircle } from 'lucide-react';

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        {/* Failure Icon */}
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <LucideXCircle className="w-10 h-10 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          El pago no fue aprobado
        </h1>

        {/* Message */}
        <p className="text-gray-400 mb-8">
          Hubo un problema al procesar tu pago. Podez intentar nuevamente o contactarnos.
        </p>

        {/* Tips */}
        <div className="bg-surface-darker/30 rounded-xl p-6 border border-white/10 mb-8 text-left">
          <h2 className="text-white font-semibold mb-4">¿Queres intentarlo de nuevo?</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              Verifica que los datos de tu tarjeta sean correctos
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              Asegurate de tener saldo disponible
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              Prueba con otro medio de pago
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/cart"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
          >
            <LucideRefreshCw className="w-5 h-5" />
            Intentar nuevamente
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
          >
            <LucideHelpCircle className="w-5 h-5" />
            Contactarnos
          </Link>
        </div>
      </div>
    </div>
  );
}