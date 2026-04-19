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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Compradores</h1>
            <p className="text-gray-400 text-sm">{buyers.length} registrados</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/admin')}
              className="text-primary hover:underline"
            >
              ← Admin
            </button>
            <button 
              onClick={handleLogout}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-400 text-sm rounded"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white w-64"
          />
          <button
            onClick={fetchBuyers}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
          >
            🔄 Actualizar
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-400">Cargando...</p>
        ) : buyers.length === 0 ? (
          <p className="text-gray-400">No hay compradores</p>
        ) : (
          <div className="bg-surface-darker/30 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Nombre</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Email</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Teléfono</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Ubicación</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Registrado</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((buyer) => (
                  <tr 
                    key={buyer.id} 
                    className="border-t border-white/5 hover:bg-white/5 cursor-pointer"
                    onClick={() => setSelectedBuyer(buyer)}
                  >
                    <td className="px-4 py-3 text-white">{buyer.nombreCompleto}</td>
                    <td className="px-4 py-3 text-gray-400">{buyer.email}</td>
                    <td className="px-4 py-3 text-gray-400">{buyer.telefono}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {buyer.direccion && (
                        <span>{buyer.direccion}, {buyer.codigoPostal}, {buyer.provincia}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{formatDate(buyer.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {selectedBuyer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-surface-darker rounded-lg p-6 max-w-lg w-full">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl text-white">{selectedBuyer.nombreCompleto}</h2>
                <button 
                  onClick={() => setSelectedBuyer(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{selectedBuyer.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Teléfono</p>
                  <p className="text-white">{selectedBuyer.telefono}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Dirección</p>
                  <p className="text-white">
                    {selectedBuyer.direccion || 'No registrada'}
                    {selectedBuyer.codigoPostal && `, CP: ${selectedBuyer.codigoPostal}`}
                    {selectedBuyer.provincia && `, ${selectedBuyer.provincia}`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Registrado desde</p>
                  <p className="text-white">{formatDate(selectedBuyer.createdAt)}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedBuyer(null)}
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