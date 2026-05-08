/**
 * RecentSalesTable Component
 * Admin Analytics Dashboard - Phase 4
 * Displays recent sales with date, customer, total, and status
 */

import type { RecentSale } from '@/types/analytics';

interface RecentSalesTableProps {
  /** Array of recent sales to display */
  sales: RecentSale[];
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Format date as DD/MM
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}

/**
 * Format amount as Argentine currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get status badge styling based on sale status
 */
function getStatusStyles(status: string): { bg: string; text: string; label: string } {
  switch (status) {
    case 'paid':
      return {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        label: 'Pagado',
      };
    case 'pending':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        label: 'Pendiente',
      };
    case 'failed':
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        label: 'Fallido',
      };
    case 'cancelled':
      return {
        bg: 'bg-gray-500/10',
        text: 'text-gray-400',
        label: 'Cancelado',
      };
    case 'refunded':
      return {
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        label: 'Reembolsado',
      };
    default:
      return {
        bg: 'bg-white/5',
        text: 'text-white/60',
        label: status,
      };
  }
}

/**
 * Loading skeleton for the table
 */
function TableSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 p-4 border-b border-white/5">
        <div className="h-4 w-16 bg-white/10 rounded" />
        <div className="h-4 w-20 bg-white/10 rounded" />
        <div className="h-4 w-14 bg-white/10 rounded" />
        <div className="h-4 w-16 bg-white/10 rounded" />
      </div>
      {/* Rows */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="grid grid-cols-4 gap-4 p-4 border-b border-white/5"
        >
          <div className="h-4 w-12 bg-white/10 rounded" />
          <div className="h-4 w-24 bg-white/10 rounded" />
          <div className="h-4 w-16 bg-white/10 rounded" />
          <div className="h-6 w-16 bg-white/10 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function RecentSalesTable({ sales, isLoading }: RecentSalesTableProps) {
  if (isLoading) {
    return (
      <div className="bg-surface-darker/50 rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="h-5 w-32 bg-white/10 rounded" />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  if (!sales || sales.length === 0) {
    return (
      <div className="bg-surface-darker/50 rounded-2xl border border-white/5 p-8 text-center">
        <p className="text-white/40">No hay ventas recientes</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-darker/50 rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <h3 className="text-lg font-semibold text-white">Ventas Recientes</h3>
      </div>

      {/* Table - responsive horizontal scroll on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          {/* Column headers */}
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {sales.map((sale) => {
              const statusStyles = getStatusStyles(sale.status);
              return (
                <tr
                  key={sale.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-white/80">
                    {formatDate(sale.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {sale.buyer}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-white">
                    {formatCurrency(sale.total)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`
                        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                        ${statusStyles.bg} ${statusStyles.text}
                      `}
                    >
                      {statusStyles.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}