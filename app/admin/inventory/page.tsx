'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, ArrowUpDown, Package, Filter, Download } from 'lucide-react';

interface InventoryLog {
  _id: string;
  tipo: 'entrada' | 'salida';
  origen?: 'compra' | 'manual' | 'inicial';
  productId: string;
  productTitle: string;
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  motivo?: string;
  nota?: string;
  orderId?: string;
  createdAt: string;
}

interface Product {
  _id: string;
  title: string;
  stock: number;
}

export default function InventoryPage() {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'entrada' | 'salida' | 'salida-compra' | 'salida-manual'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [addQuantity, setAddQuantity] = useState<number>(1);
  const [addNote, setAddNote] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [logsRes, productsRes] = await Promise.all([
        fetch('/api/inventory'),
        fetch('/api/products'),
      ]);
      const logsData = await logsRes.json();
      const productsData = await productsRes.json();
      
      setLogs(logsData.logs || []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Error fetching:', error);
    }
    setLoading(false);
  }

  async function handleAddStock() {
    if (!selectedProduct || addQuantity <= 0) return;
    
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct,
          cantidad: parseInt(addQuantity.toString()),
          nota: addNote,
        }),
      });
      
      if (res.ok) {
        setShowAddModal(false);
        setSelectedProduct('');
        setAddQuantity(1);
        setAddNote('');
        fetchData();
      }
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  }

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'entrada') return log.tipo === 'entrada';
    if (filter === 'salida') return log.tipo === 'salida';
    if (filter === 'salida-compra') return log.tipo === 'salida' && log.origen === 'compra';
    if (filter === 'salida-manual') return log.tipo === 'salida' && log.origen === 'manual';
    return true;
  });

  const totalEntradas = logs.filter(l => l.tipo === 'entrada').reduce((sum, l) => sum + l.cantidad, 0);
  const totalSalidas = logs.filter(l => l.tipo === 'salida').reduce((sum, l) => sum + l.cantidad, 0);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Control de Inventario</h1>
            <p className="text-gray-400">Registro de entradas y salidas</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Agregar Stock
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface-darker rounded-xl p-6">
            <p className="text-gray-400 text-base">Total Movimientos</p>
            <p className="text-3xl font-bold">{logs.length}</p>
          </div>
          <div className="bg-surface-darker rounded-xl p-6">
            <p className="text-gray-400 text-base">Entradas</p>
            <p className="text-3xl font-bold text-green-400">+{totalEntradas}</p>
          </div>
          <div className="bg-surface-darker rounded-xl p-6">
            <p className="text-gray-400 text-base">Salidas</p>
            <p className="text-3xl font-bold text-red-400">-{totalSalidas}</p>
          </div>
        </div>

        {/* Filters - scrollable on mobile */}
        <div className="flex gap-2 mb-6 flex-nowrap overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-3 rounded-lg text-base font-medium whitespace-nowrap ${
              filter === 'all' ? 'bg-white text-black' : 'bg-surface-darker text-gray-400'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('entrada')}
            className={`px-5 py-3 rounded-lg text-base font-medium whitespace-nowrap ${
              filter === 'entrada' ? 'bg-green-500 text-black' : 'bg-surface-darker text-gray-400'
            }`}
          >
            Entradas
          </button>
          <button
            onClick={() => setFilter('salida')}
            className={`px-5 py-3 rounded-lg text-base font-medium whitespace-nowrap ${
              filter === 'salida' ? 'bg-red-500 text-black' : 'bg-surface-darker text-gray-400'
            }`}
          >
            Salidas
          </button>
          <button
            onClick={() => setFilter('salida-compra')}
            className={`px-5 py-3 rounded-lg text-base font-medium whitespace-nowrap ${
              filter === 'salida-compra' ? 'bg-blue-500 text-black' : 'bg-surface-darker text-gray-400'
            }`}
          >
            Por compra
          </button>
          <button
            onClick={() => setFilter('salida-manual')}
            className={`px-5 py-3 rounded-lg text-base font-medium whitespace-nowrap ${
              filter === 'salida-manual' ? 'bg-orange-500 text-black' : 'bg-surface-darker text-gray-400'
            }`}
          >
            Manual
          </button>
        </div>

        {/* Logs - Card layout for mobile */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No hay movimientos registrados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div 
                key={log._id} 
                className="bg-surface-darker rounded-xl p-4 border border-white/5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${
                      log.tipo === 'entrada' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {log.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                    </span>
                    {log.tipo === 'salida' && (
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${
                        log.origen === 'compra' 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {log.origen === 'compra' ? 'Por compra' : 'Manual'}
                      </span>
                    )}
                  </div>
                  <span className="text-base text-gray-500">
                    {new Date(log.createdAt).toLocaleString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">{log.productTitle}</h3>
                
                <div className="flex items-center gap-6 text-base">
                  <div>
                    <span className="text-gray-500 block text-sm">Cantidad</span>
                    <span className={log.tipo === 'entrada' ? 'text-green-400 text-xl font-bold' : 'text-red-400 text-xl font-bold'}>
                      {log.tipo === 'entrada' ? '+' : '-'}{log.cantidad}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-sm">Stock</span>
                    <span className="text-white text-xl font-bold">{log.stockAnterior} → {log.stockNuevo}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-500 block text-sm">Motivo</span>
                    <span className="text-gray-300 text-base">{log.motivo || log.nota || '-'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-surface-darker rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Agregar Stock</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Producto</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white"
                >
                  <option value="">Seleccionar producto...</option>
                  {products.filter((p: any) => !p.isCombo).map((p: any) => (
                    <option key={p._id} value={p._id}>
                      {p.title} (stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Cantidad a agregar</label>
                <input
                  type="number"
                  min="1"
                  value={addQuantity}
                  onChange={(e) => setAddQuantity(parseInt(e.target.value) || 0)}
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nota (opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Reposición, ingreso manual, etc."
                  value={addNote}
                  onChange={(e) => setAddNote(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-white/10 text-white rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddStock}
                disabled={!selectedProduct || addQuantity <= 0}
                className="flex-1 py-3 bg-primary text-black font-medium rounded-lg disabled:opacity-50"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}