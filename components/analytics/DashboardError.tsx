/**
 * DashboardError Component
 * Admin Analytics Dashboard - Phase 4
 * Full page error state with retry button
 */

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DashboardErrorProps {
  /** Error message to display */
  message?: string;
  /** Callback to retry fetching data */
  onRetry?: () => void;
  /** Whether retry is in progress */
  isRetrying?: boolean;
}

export default function DashboardError({
  message = 'Error al cargar los datos',
  onRetry,
  isRetrying = false,
}: DashboardErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="bg-surface-darker/50 rounded-2xl border border-white/5 p-8 max-w-md w-full text-center">
        {/* Error icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        {/* Error message */}
        <h3 className="text-lg font-semibold text-white mb-2">
          Algo salió mal
        </h3>
        <p className="text-white/60 mb-6">
          {message}
        </p>

        {/* Retry button */}
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="
              inline-flex items-center gap-2 px-5 py-2.5
              bg-primary hover:bg-primary/90
              text-white font-medium rounded-lg
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:shadow-lg hover:shadow-primary/25
            "
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Reintentando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Reintentar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}