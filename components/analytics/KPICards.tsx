/**
 * KPICards Container Component
 * Admin Analytics Dashboard - Phase 2
 * Responsive grid layout for KPI cards
 */

import { KPIMetrics } from '@/types/analytics';
import KPICard from './KPICard';
import { DollarSign, ShoppingCart, Ticket, Clock } from 'lucide-react';

interface KPICardsProps {
  /** KPI metrics data from analytics API */
  kpis: KPIMetrics;
}

/**
 * Format currency value for display
 */
function formatAOV(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format order count for display
 */
function formatCount(value: number): string {
  return new Intl.NumberFormat('es-AR').format(value);
}

export default function KPICards({ kpis }: KPICardsProps) {
  const cards = [
    {
      icon: DollarSign,
      label: 'Ingresos totales',
      value: kpis.totalRevenue,
      subtext: 'este período',
      previousValue: kpis.previousTotalRevenue,
      format: 'currency' as const,
      iconColor: 'bg-green-500/10 text-green-400',
    },
    {
      icon: ShoppingCart,
      label: 'Pedidos pagados',
      value: kpis.paidOrders,
      subtext: 'completados',
      previousValue: kpis.previousPaidOrders,
      format: 'number' as const,
      iconColor: 'bg-primary/10 text-primary',
    },
    {
      icon: Ticket,
      label: 'Ticket promedio',
      value: kpis.aov,
      subtext: 'por pedido',
      previousValue: kpis.previousAov,
      format: 'currency' as const,
      iconColor: 'bg-purple-500/10 text-purple-400',
    },
    {
      icon: Clock,
      label: 'Pedidos pendientes',
      value: kpis.pendingOrders,
      subtext: 'en espera',
      format: 'number' as const,
      iconColor: 'bg-yellow-500/10 text-yellow-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <KPICard key={card.label} {...card} />
      ))}
    </div>
  );
}
