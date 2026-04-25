'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Buyer {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  direccion: string;
  codigoPostal: string;
  provincia: string;
  purchaseCount: number;
  createdAt: string;
}

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  useEffect(() => {
    fetchBuyers();
  }, [search]);

  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      
      const res = await fetch(`/api/buyers?${params}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setBuyers(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-white">Compradores</h1>
            <p className="text-gray-400 text-sm">{buyers.length} registrados</p>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => router.push('/admin')}
              className="text-primary hover:underline text-sm"
            >
              ← Admin
            </button>
            <button 
              onClick={handleLogout}
              className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-100 text-black text-sm rounded"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 flex-1"
          />
          <button
            onClick={fetchBuyers}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-black rounded-lg"
          >
            ↻
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-400">Cargando...</p>
        ) : buyers.length === 0 ? (
          <p className="text-gray-400">No hay compradores</p>
        ) : (
          <div className="space-y-2 md:table md:space-y-0 md:bg-surface-darker/30 md:rounded-lg md:overflow-hidden">
            {/* Desktop header */}
            <div className="hidden md:table-header-group">
              <div className="table-row bg-white/5">
                <div className="table-cell px-4 py-3 text-left text-gray-400 text-sm">Nombre</div>
                <div className="table-cell px-4 py-3 text-left text-gray-400 text-sm">Email</div>
                <div className="table-cell px-4 py-3 text-left text-gray-400 text-sm">Teléfono</div>
                <div className="table-cell px-4 py-3 text-left text-gray-400 text-sm">Ubicación</div>
                <div className="table-cell px-4 py-3 text-left text-gray-400 text-sm">Compras</div>
                <div className="table-cell px-4 py-3 text-left text-gray-400 text-sm">Registrado</div>
              </div>
            </div>
            
            {/* Mobile cards / Desktop rows */}
            <div className="md:table-row-group">
              {buyers.map((buyer) => (
                <div
                  key={buyer.id}
                  className="md:table-row border-t border-white/5 hover:bg-white/5 cursor-pointer mb-3 md:mb-0 md:border-0 p-4 md:p-0 bg-surface-darker/30 md:bg-transparent rounded-lg md:rounded-none"
                  onClick={() => setSelectedBuyer(buyer)}
                >
                  {/* Mobile view */}
                  <div className="md:hidden flex flex-col gap-2">
                    <p className="text-white text-lg font-semibold">{buyer.nombreCompleto}</p>
                    <p className="text-gray-300 text-base">{buyer.email}</p>
                    {buyer.telefono && <p className="text-gray-400 text-base">📞 {buyer.telefono}</p>}
                    <div className="text-gray-500 text-sm mt-1">
                      {buyer.direccion && <span>{buyer.direccion}, {buyer.codigoPostal}, {buyer.provincia}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-primary/20 text-primary text-sm rounded">
                        {buyer.purchaseCount || 0} compra{buyer.purchaseCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  {/* Desktop view */}
                  <div className="hidden md:table-cell px-4 py-3 text-white">{buyer.nombreCompleto}</div>
                  <div className="hidden md:table-cell px-4 py-3 text-gray-400">{buyer.email}</div>
                  <div className="hidden md:table-cell px-4 py-3 text-gray-400">{buyer.telefono}</div>
                  <div className="hidden md:table-cell px-4 py-3 text-gray-400">
                    {buyer.direccion && (
                      <span>{buyer.direccion}, {buyer.codigoPostal}, {buyer.provincia}</span>
                    )}
                  </div>
                  <div className="hidden md:table-cell px-4 py-3">
                    <span className="px-2 py-1 bg-primary/20 text-primary text-sm rounded">
                      {buyer.purchaseCount || 0}
                    </span>
                  </div>
                  <div className="hidden md:table-cell px-4 py-3 text-gray-400">{formatDate(buyer.createdAt)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        {selectedBuyer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-surface-darker rounded-lg p-5 md:p-6 max-w-lg w-full">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedBuyer.nombreCompleto}</h2>
                <button 
                  onClick={() => setSelectedBuyer(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-base mb-1">Email</p>
                  <p className="text-white text-lg">{selectedBuyer.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-base mb-1">Teléfono</p>
                  <p className="text-white text-lg">{selectedBuyer.telefono || 'No registrado'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-base mb-1">Dirección</p>
                  <p className="text-white text-lg">
                    {selectedBuyer.direccion || 'No registrada'}
                    {selectedBuyer.codigoPostal && `, CP: ${selectedBuyer.codigoPostal}`}
                    {selectedBuyer.provincia && `, ${selectedBuyer.provincia}`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-base mb-1">Cantidad de compras</p>
                  <p className="text-white text-lg">{selectedBuyer.purchaseCount || 0}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-base mb-1">Registrado desde</p>
                  <p className="text-white text-lg">{formatDate(selectedBuyer.createdAt)}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedBuyer(null)}
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