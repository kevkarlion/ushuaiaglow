'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SaleItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

interface Sale {
  id: string;
  buyerId: string;
  buyerNombre: string;
  buyerEmail: string;
  buyerTelefono?: string;
  buyerDireccion?: string;
  buyerCodigoPostal?: string;
  buyerProvincia?: string;
  items: SaleItem[];
  total: number;
  preferenceId?: string;
  paymentId?: string;
  status: 'pending' | 'paid' | 'failed';
  createdAt: string;
  paidAt?: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchSales();
  }, [statusFilter]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      
      const res = await fetch(`/api/sales?${params}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSales(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      paid: 'bg-green-500/20 text-green-400',
      failed: 'bg-red-500/20 text-red-400',
    };
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      paid: 'Pagado',
      failed: 'Fallido',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${colors[status] || colors.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  // Stats
  const totalSales = sales.length;
  const totalRevenue = sales.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.total, 0);
  const paidCount = sales.filter(s => s.status === 'paid').length;
  const pendingCount = sales.filter(s => s.status === 'pending').length;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Ventas</h1>
            <p className="text-gray-400 text-sm">Historial de compras</p>
          </div>
          <button 
            onClick={() => router.push('/admin')}
            className="text-primary hover:underline"
          >
            ← Volver al Admin
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          <div className="bg-surface-darker/30 rounded-lg p-3 lg:p-4">
            <p className="text-gray-400 text-xs lg:text-sm">Total</p>
            <p className="text-xl lg:text-2xl text-white">{totalSales}</p>
          </div>
          <div className="bg-surface-darker/30 rounded-lg p-3 lg:p-4">
            <p className="text-gray-400 text-xs lg:text-sm">Ingresos</p>
            <p className="text-xl lg:text-2xl text-green-400">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-surface-darker/30 rounded-lg p-3 lg:p-4">
            <p className="text-gray-400 text-xs lg:text-sm">Pagadas</p>
            <p className="text-xl lg:text-2xl text-green-400">{paidCount}</p>
          </div>
          <div className="bg-surface-darker/30 rounded-lg p-3 lg:p-4">
            <p className="text-gray-400 text-xs lg:text-sm">Pendientes</p>
            <p className="text-xl lg:text-2xl text-yellow-400">{pendingCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-black"
          >
            <option value="">Todos los estados</option>
            <option value="paid">Pagadas</option>
            <option value="pending">Pendientes</option>
            <option value="failed">Fallidas</option>
          </select>
          <button
            onClick={fetchSales}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-black rounded-lg"
          >
            ↻
          </button>
        </div>

        {/* Table - desktop table, mobile cards */}
        {loading ? (
          <p className="text-gray-400">Cargando...</p>
        ) : sales.length === 0 ? (
          <p className="text-gray-400">No hay ventas</p>
        ) : (
          <div className="space-y-2 md:table md:space-y-0 md:bg-surface-darker/30 md:rounded-lg md:overflow-hidden">
            {/* Desktop header */}
            <div className="hidden md:table-header-group">
              <div className="table-row bg-white/5">
                <div className="table-cell px-4 py-3 text-left text-gray-400 text-sm">ID</div>
                <div className="table-cell px-4 py-3 text-left text-gray-400 text-sm">Fecha</div>
                <div className="table-cell px-4 py-3 text-left text-gray-400 text-sm">Comprador</div>
                <div className="table-cell px-4 py-3 text-right text-gray-400 text-sm">Total</div>
                <div className="table-cell px-4 py-3 text-center text-gray-400 text-sm">Estado</div>
              </div>
            </div>
            
            {/* Mobile cards / Desktop rows */}
            <div className="md:table-row-group">
              {sales.map((sale) => (
                <div 
                  key={sale.id}
                  className="md:table-row border-t border-white/5 hover:bg-white/5 cursor-pointer mb-2 md:mb-0 md:border-0 p-3 md:p-0 bg-surface-darker/30 md:bg-transparent rounded-lg md:rounded-none"
                  onClick={() => setSelectedSale(sale)}
                >
                  {/* Mobile view */}
                  <div className="md:hidden flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-medium">${sale.total.toFixed(2)}</p>
                      <p className="text-gray-400 text-xs">{formatDate(sale.createdAt)}</p>
                    </div>
                    {getStatusBadge(sale.status)}
                  </div>
                  <div className="md:hidden">
                    <p className="text-white text-sm">{sale.buyerNombre}</p>
                    <p className="text-gray-500 text-xs">{sale.buyerEmail}</p>
                  </div>
                  
                  {/* Desktop view */}
                  <div className="hidden md:table-cell px-4 py-3 text-gray-400 text-sm">
                    {sale.id.substring(0, 8)}...
                  </div>
                  <div className="hidden md:table-cell px-4 py-3 text-gray-400">
                    {formatDate(sale.createdAt)}
                  </div>
                  <div className="hidden md:table-cell px-4 py-3 text-white">
                    <p>{sale.buyerNombre}</p>
                    <p className="text-gray-500 text-sm">{sale.buyerEmail}</p>
                  </div>
                  <div className="hidden md:table-cell px-4 py-3 text-right text-white font-medium">
                    ${sale.total.toFixed(2)}
                  </div>
                  <div className="hidden md:table-cell px-4 py-3 text-center">
                    {getStatusBadge(sale.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        {selectedSale && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-surface-darker rounded-lg p-4 md:p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Venta</h2>
                  <p className="text-gray-400 text-lg mt-1">{formatDate(selectedSale.createdAt)}</p>
                </div>
                <button 
                  onClick={() => setSelectedSale(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-400 text-base mb-1">Estado</p>
                <div className="text-lg">{getStatusBadge(selectedSale.status)}</div>
              </div>

              <div className="mb-6">
                <p className="text-gray-400 text-base mb-1">Comprador</p>
                <p className="text-white text-xl font-semibold">{selectedSale.buyerNombre}</p>
                <p className="text-gray-300 text-lg mt-1">{selectedSale.buyerEmail}</p>
                {selectedSale.buyerTelefono && (
                  <p className="text-gray-300 text-lg mt-2">📞 {selectedSale.buyerTelefono}</p>
                )}
              </div>

              {(selectedSale.buyerDireccion || selectedSale.buyerCodigoPostal || selectedSale.buyerProvincia) && (
                <div className="mb-6">
                  <p className="text-gray-400 text-base mb-1">Dirección de envío</p>
                  {selectedSale.buyerDireccion && <p className="text-white text-lg">{selectedSale.buyerDireccion}</p>}
                  {selectedSale.buyerCodigoPostal && <p className="text-white text-lg">CP: {selectedSale.buyerCodigoPostal}</p>}
                  {selectedSale.buyerProvincia && <p className="text-white text-lg">{selectedSale.buyerProvincia}</p>}
                </div>
              )}

              <div className="mb-5">
                <p className="text-gray-400 text-sm mb-2">Productos</p>
                <div className="space-y-3">
                  {selectedSale.items.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex justify-between items-center bg-white/10 rounded-lg p-4"
                    >
                      <div>
                        <p className="text-white text-base">{item.title}</p>
                        <p className="text-gray-400 text-sm">
                          ${item.price.toLocaleString('es-AR')} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-white text-lg font-semibold">
                        ${(item.price * item.quantity).toLocaleString('es-AR')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400 text-lg">Total</p>
                  <p className="text-2xl text-white font-bold">
                    ${selectedSale.total.toLocaleString('es-AR')}
                  </p>
                </div>
              </div>

              {selectedSale.paidAt && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-base">Pagado: {formatDate(selectedSale.paidAt)}</p>
                </div>
              )}

              <button 
                onClick={() => setSelectedSale(null)}
                className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}