'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProductStock {
  id: string;
  title: string;
  stock: number;
  price: number;
  category: string;
  image: string | null;
}

const LOW_STOCK_THRESHOLD = 5;

export default function StockPage() {
  const [products, setProducts] = useState<ProductStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  // Stock adjustment state
  const [adjustments, setAdjustments] = useState<Record<string, { quantity: number; operation: 'add' | 'subtract' }>>({});

  useEffect(() => {
    fetchStock();
  }, [category, lowStockFilter]);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (lowStockFilter) {
        if (lowStockFilter === 'low') params.set('lowStock', 'true');
        if (lowStockFilter === 'critical') params.set('stock', '0,2');
      }
      
      const res = await fetch(`/api/stock?${params}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustment = async (productId: string) => {
    const adj = adjustments[productId];
    if (!adj || adj.quantity <= 0) return;

    // Find product name
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    setSaving(productId);
    setMessage('');

    try {
      const res = await fetch(`/api/stock/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: adj.operation,
          quantity: adj.quantity,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Stock actualizado: ${prod.title} (${adj.operation} ${adj.quantity})`);
        // Clear adjustment
        setAdjustments(prev => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
        fetchStock();
      } else {
        setMessage(data.error || 'Error');
      }
    } catch (error) {
      setMessage('Error al actualizar');
    } finally {
      setSaving(null);
    }
  };

  const updateAdjustment = (productId: string, quantity: number, operation: 'add' | 'subtract') => {
    setAdjustments(prev => ({
      ...prev,
      [productId]: { quantity, operation },
    }));
  };

  // Normalize text: remove accents and convert to lowercase
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove accents
  };

  // Filter products by search (case-insensitive, accent-insensitive)
  const filteredProducts = products.filter(p => 
    !search || normalizeText(p.title).includes(normalizeText(search))
  );

  // Stats
  const lowStockProducts = products.filter(p => p.stock < LOW_STOCK_THRESHOLD);
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Gestión de Stock</h1>
            <p className="text-gray-400 text-sm">Agregar o descontar productos</p>
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

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            {message}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-surface-darker/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Productos</p>
            <p className="text-2xl text-white">{totalProducts}</p>
          </div>
          <div className="bg-surface-darker/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Stock Total</p>
            <p className="text-2xl text-white">{totalStock}</p>
          </div>
          <div className="bg-surface-darker/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Bajo Stock (&lt;{LOW_STOCK_THRESHOLD})</p>
            <p className="text-2xl text-orange-400">{lowStockProducts.length}</p>
          </div>
          <div className="bg-surface-darker/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Stock Crítico (&lt;3)</p>
            <p className="text-2xl text-red-400">{products.filter(p => p.stock < 3).length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-black w-64"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-black"
          >
            <option value="">Todas las categorías</option>
            <option value="Cuidado Facial">Cuidado Facial</option>
            <option value="Cuidado Corporal">Cuidado Corporal</option>
            <option value="Cuidado Capilar">Cuidado Capilar</option>
            <option value="Maquillaje">Maquillaje</option>
          </select>
          <select
            value={lowStockFilter}
            onChange={(e) => setLowStockFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-black"
          >
            <option value="">Todo el stock</option>
            <option value="low">Bajo stock (&lt;5)</option>
            <option value="critical">Stock crítico (&lt;3)</option>
          </select>
          <button
            onClick={fetchStock}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-lg"
          >
            🔄 Actualizar
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-400">Cargando...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-400">No hay productos</p>
        ) : (
          <div className="bg-surface-darker/30 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Producto</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">Categoría</th>
                  <th className="px-4 py-3 text-right text-gray-400 text-sm">Stock</th>
                  <th className="px-4 py-3 text-right text-gray-400 text-sm">Precio</th>
                  <th className="px-4 py-3 text-center text-gray-400 text-sm">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const isLow = product.stock < LOW_STOCK_THRESHOLD;
                  const adj = adjustments[product.id];
                  const isSaving = saving === product.id;
                  
                  return (
                    <tr 
                      key={product.id} 
                      className={`border-t border-white/5 ${isLow ? 'bg-orange-500/5' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <img 
                              src={product.image} 
                              alt={product.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="text-white">{product.title}</p>
                            {isLow && (
                              <p className="text-orange-400 text-xs">⚠️ Bajo stock</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{product.category}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`${isLow ? 'text-orange-400 font-semibold' : 'text-white'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400">
                        ${(product.price || 0).toLocaleString('es-AR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-center">
                          <select
                            value={adj?.operation || 'add'}
                            onChange={(e) => updateAdjustment(
                              product.id, 
                              adj?.quantity || 1, 
                              e.target.value as 'add' | 'subtract'
                            )}
                            className="px-2 py-1 bg-white border border-gray-300 rounded text-black text-sm"
                          >
                            <option value="add">+</option>
                            <option value="subtract">−</option>
                          </select>
                          <input
                            type="number"
                            min="1"
                            value={adj?.quantity || 1}
                            onChange={(e) => updateAdjustment(
                              product.id,
                              parseInt(e.target.value) || 1,
                              adj?.operation || 'add'
                            )}
                            className="w-16 px-2 py-1 bg-white border border-gray-300 rounded text-black text-sm text-center"
                          />
                          <button
                            onClick={() => handleAdjustment(product.id)}
                            disabled={isSaving}
                            className="px-3 py-1 bg-primary hover:bg-primary/90 disabled:bg-white/20 text-white text-sm rounded"
                          >
                            {isSaving ? '...' : 'Aplicar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}