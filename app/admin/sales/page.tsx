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
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-surface-darker/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Transacciones</p>
            <p className="text-2xl text-white">{totalSales}</p>
          </div>
          <div className="bg-surface-darker/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Ingresos Totales</p>
            <p className="text-2xl text-green-400">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-surface-darker/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Pagadas</p>
            <p className="text-2xl text-green-400">{paidCount}</p>
          </div>
          <div className="bg-surface-darker/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Pendientes</p>
            <p className="text-2xl text-yellow-400">{pendingCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="">Todos los estados</option>
            <option value="paid">Pagadas</option>
            <option value="pending">Pendientes</option>
            <option value="failed">Fallidas</option>
          </select>
          <button
            onClick={fetchSales}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
          >
            🔄 Actualizar
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-400">Cargando...</p>
        ) : sales.length === 0 ? (
          <p className="text-gray-400">No hay ventas</p>
        ) : (
          <div className="bg-surface-darker/30 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">ID</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Fecha</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Comprador</th>
                  <th className="px-4 py-3 text-right text-gray-400 text-sm">Total</th>
                  <th className="px-4 py-3 text-center text-gray-400 text-sm">Estado</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr 
                    key={sale.id} 
                    className="border-t border-white/5 hover:bg-white/5 cursor-pointer"
                    onClick={() => setSelectedSale(sale)}
                  >
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {sale.id.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {formatDate(sale.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-white">
                      <p>{sale.buyerNombre}</p>
                      <p className="text-gray-500 text-sm">{sale.buyerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-right text-white font-medium">
                      ${sale.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(sale.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {selectedSale && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-surface-darker rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl text-white">Venta {selectedSale.id.substring(0, 8)}...</h2>
                  <p className="text-gray-400 text-sm">{formatDate(selectedSale.createdAt)}</p>
                </div>
                <button 
                  onClick={() => setSelectedSale(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm">Estado</p>
                {getStatusBadge(selectedSale.status)}
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm">Comprador</p>
                <p className="text-white">{selectedSale.buyerNombre}</p>
                <p className="text-gray-400 text-sm">{selectedSale.buyerEmail}</p>
                {selectedSale.buyerTelefono && (
                  <p className="text-gray-400 text-sm">Tel: {selectedSale.buyerTelefono}</p>
                )}
              </div>

              {(selectedSale.buyerDireccion || selectedSale.buyerCodigoPostal || selectedSale.buyerProvincia) && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Dirección de envío</p>
                  {selectedSale.buyerDireccion && <p className="text-white">{selectedSale.buyerDireccion}</p>}
                  {selectedSale.buyerCodigoPostal && <p className="text-white">CP: {selectedSale.buyerCodigoPostal}</p>}
                  {selectedSale.buyerProvincia && <p className="text-white">{selectedSale.buyerProvincia}</p>}
                </div>
              )}

              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Items</p>
                <div className="space-y-2">
                  {selectedSale.items.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex justify-between items-center bg-white/5 rounded p-3"
                    >
                      <div>
                        <p className="text-white">{item.title}</p>
                        <p className="text-gray-400 text-sm">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-white font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400">Total</p>
                  <p className="text-xl text-white font-semibold">
                    ${selectedSale.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {selectedSale.paidAt && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-sm">Pagado el {formatDate(selectedSale.paidAt)}</p>
                </div>
              )}

              <button 
                onClick={() => setSelectedSale(null)}
                className="mt-6 w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
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