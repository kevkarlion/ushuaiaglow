'use client';

import Link from 'next/link';
import { LucideClock, LucideArrowRight, LucideHelpCircle, LucideFileText } from 'lucide-react';

export default function CheckoutPendingPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        {/* Pending Icon */}
        <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <LucideClock className="w-10 h-10 text-yellow-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Pago en proceso
        </h1>

        {/* Message */}
        <p className="text-gray-400 mb-8">
          Tu pago está siendo procesado. Te notificaremos cuando sea confirmado.
        </p>

        {/* Info */}
        <div className="bg-surface-darker/30 rounded-xl p-6 border border-white/10 mb-8 text-left">
          <div className="flex gap-3">
            <LucideFileText className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <h2 className="text-white font-medium mb-2">¿Cómo继续?</h2>
              <p className="text-gray-400 text-sm">
                depending on the payment method you chose, you'll receive instructions via email or you can view them in your Mercado Pago account.
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-surface-darker/30 rounded-xl p-6 border border-white/10 mb-8 text-left">
          <h2 className="text-white font-semibold mb-3">Métodos de pago comunes</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <strong>Efectivo:</strong> tenés 48hs para pagar en Rapipago o PagoFácil
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <strong>Transferencia:</strong> se acredita en 24-48hs hábiles
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <strong>Tarjeta:</strong> puede demorar unos minutos en aprobarse
            </li>
          </ul>
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
            <LucideHelpCircle className="w-5 h-5" />
            ¿Necesitás ayuda?
          </Link>
        </div>
      </div>
    </div>
  );
}