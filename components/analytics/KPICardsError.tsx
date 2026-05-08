/**
 * KPICardsError Component
 * Admin Analytics Dashboard - Phase 2
 * Error state for KPI cards section
 */

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface KPICardsErrorProps {
  /** Error message to display */
  message?: string;
  /** Callback function to retry loading data */
  onRetry?: () => void;
}

export default function KPICardsError({
  message = 'No se pudieron cargar las métricas',
  onRetry,
}: KPICardsErrorProps) {
  return (
    <div className="bg-surface-darker/50 rounded-2xl border border-red-500/20 p-8">
      <div className="flex flex-col items-center justify-center text-center gap-4">
        {/* Error Icon */}
        <div className="p-4 bg-red-500/10 rounded-full">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        {/* Error Message */}
        <div className="space-y-1">
          <p className="text-white font-medium">Error al cargar métricas</p>
          <p className="text-sm text-white/50">{message}</p>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
