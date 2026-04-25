'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

interface ProductStock {
  id: string;
  title: string;
  stock: number;
  price: number;
  category: string;
  image: string | null;
}

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  imageUrl: string;
}

const initialForm: ProductFormData = {
  title: '',
  description: '',
  price: '',
  stock: '',
  category: 'Cuidado Facial',
  imageUrl: '',
};

const LOW_STOCK_THRESHOLD = 5;

export default function StockPage() {
  const [products, setProducts] = useState<ProductStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState('');
  const [message, setMessage] = useState('');
  const [importing, setImporting] = useState(false);
  const [form, setForm] = useState<ProductFormData>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/products', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{
          id: editingId,
          title: form.title,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          category: form.category,
          images: form.imageUrl ? [form.imageUrl] : [],
        }]),
      });

      const data = await res.json();
      if (data.success || res.ok) {
        setMessage(editingId ? 'Producto actualizado' : 'Producto creada');
        setForm(initialForm);
        setEditingId(null);
        fetchStock();
      } else {
        setMessage(data.error || 'Error al guardar');
      }
    } catch (error) {
      setMessage('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setMessage('');

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const products = (jsonData as any[]).map((row: any) => ({
        title: row.title || row.Title || '',
        price: row.price || row.Price || 0,
        stock: row.stock || row.Stock || 0,
        category: row.category || row.Category || 'Cuidado Facial',
        images: row.images || row.Images || row.url || row.URL ? [row.images?.[0] || row.images || row.url || row.URL] : [],
      })).filter(p => p.title);

      if (products.length === 0) {
        setMessage('No se encontraron productos válidos');
        setImporting(false);
        return;
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products),
      });

      const result = await res.json();
      if (result.success) {
        setMessage(`Importados ${result.count} productos`);
        fetchStock();
      } else {
        setMessage('Error al importar');
      }
    } catch (error) {
      setMessage('Error al procesar archivo');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      category: product.category || 'Cuidado Facial',
      imageUrl: product.images?.[0] || '',
    });
  };

  const handleAdjustment = async (productId: string) => {
    const adj = adjustments[productId];
    if (!adj || adj.quantity <= 0) return;

    // Find product name
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    setSaving(true);
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
      setSaving(false);
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
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-white">Gestión de Stock</h1>
            <p className="text-gray-400 text-sm">Agregar o descontar productos</p>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          <div className="bg-surface-darker/30 rounded-lg p-3 lg:p-4">
            <p className="text-gray-400 text-xs lg:text-sm">Total Productos</p>
            <p className="text-xl lg:text-2xl text-white">{totalProducts}</p>
          </div>
          <div className="bg-surface-darker/30 rounded-lg p-3 lg:p-4">
            <p className="text-gray-400 text-xs lg:text-sm">Stock Total</p>
            <p className="text-xl lg:text-2xl text-white">{totalStock}</p>
          </div>
          <div className="bg-surface-darker/30 rounded-lg p-3 lg:p-4">
            <p className="text-gray-400 text-xs lg:text-sm">Bajo Stock (&lt;{LOW_STOCK_THRESHOLD})</p>
            <p className="text-xl lg:text-2xl text-orange-400">{lowStockProducts.length}</p>
          </div>
          <div className="bg-surface-darker/30 rounded-lg p-3 lg:p-4">
            <p className="text-gray-400 text-xs lg:text-sm">Stock Crítico (&lt;3)</p>
            <p className="text-xl lg:text-2xl text-red-400">{products.filter(p => p.stock < 3).length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 flex-1"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-black"
          >
            <option value="">Todas</option>
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
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-black rounded-lg"
          >
            ↻
          </button>
        </div>

        {/* Importar desde Excel */}
        <div className="bg-surface-darker/30 rounded-lg p-4 mb-6">
          <h3 className="text-white font-medium mb-3">Importar desde Excel</h3>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileImport}
            className="hidden"
            id="excel-import-stock"
          />
          <label
            htmlFor="excel-import-stock"
            className="inline-block px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-black rounded-lg cursor-pointer"
          >
            {importing ? 'Importando...' : 'Seleccionar Excel'}
          </label>
        </div>

        {/* Form - Agregar Producto */}
        <div className="bg-surface-darker/30 rounded-lg p-4 mb-6">
          <h3 className="text-white font-medium mb-4">{editingId ? 'Editar Producto' : 'Agregar Producto'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Título</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Categoría</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="Cuidado Facial">Cuidado Facial</option>
                  <option value="Cuidado Corporal">Cuidado Corporal</option>
                  <option value="Cuidado Capilar">Cuidado Capilar</option>
                  <option value="Maquillaje">Maquillaje</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">URL Imagen</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary hover:bg-primary/90 disabled:bg-white/20 text-white rounded-lg"
              >
                {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Guardar'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table - cards on mobile, grid on desktop */}
        {loading ? (
          <p className="text-gray-400">Cargando...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-400">No hay productos</p>
        ) : (
          <div className="space-y-3 md:space-y-0 md:bg-surface-darker/30 md:rounded-lg md:overflow-hidden">
            {/* Desktop header - grid */}
            <div className="hidden md:grid md:grid-cols-5 md:gap-4 md:p-4 bg-white/5 text-gray-400 text-sm">
              <div>Producto</div>
              <div>Categoría</div>
              <div className="text-right">Stock</div>
              <div className="text-right">Precio</div>
              <div className="text-center">Acción</div>
            </div>
            
            {filteredProducts.map((product) => {
              const isLow = product.stock < LOW_STOCK_THRESHOLD;
              const adj = adjustments[product.id];
              const isSaving = saving;
              
              return (
                <div 
                  key={product.id}
                  className={`p-4 rounded-lg md:rounded-none md:border-t md:border-white/5 ${isLow ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-surface-darker/30 border border-white/5'}`}
                >
                  {/* Desktop - grid layout */}
                  <div className="hidden md:grid md:grid-cols-5 md:gap-4 md:items-center">
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img src={product.image} alt={product.title} className="w-10 h-10 rounded object-cover" />
                      )}
                      <div>
                        <p className="text-white">{product.title}</p>
                        {isLow && <p className="text-orange-400 text-xs">⚠️ Bajo stock</p>}
                      </div>
                    </div>
                    <div className="text-gray-400">{product.category}</div>
                    <div className="text-right">
                      <span className={isLow ? 'text-orange-400 font-semibold' : 'text-white'}>
                        {product.stock}
                      </span>
                    </div>
                    <div className="text-right text-gray-400">
                      ${(product.price || 0).toLocaleString('es-AR')}
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <select
                        value={adj?.operation || 'add'}
                        onChange={(e) => updateAdjustment(product.id, adj?.quantity || 1, e.target.value as 'add' | 'subtract')}
                        className="px-2 py-1 bg-white border border-gray-300 rounded text-black text-sm"
                      >
                        <option value="add">+</option>
                        <option value="subtract">−</option>
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={adj?.quantity || 1}
                        onChange={(e) => updateAdjustment(product.id, parseInt(e.target.value) || 1, adj?.operation || 'add')}
                        className="w-14 px-2 py-1 bg-white border border-gray-300 rounded text-black text-sm text-center"
                      />
                      <button
                        onClick={() => handleAdjustment(product.id)}
                        disabled={isSaving}
                        className="px-3 py-1 bg-primary hover:bg-primary/90 text-white text-sm rounded"
                      >
                        {isSaving ? '...' : '✓'}
                      </button>
                    </div>
                  </div>

                  {/* Mobile - card */}
                  <div className="md:hidden">
                    <div className="flex items-start gap-3 mb-3">
                      {product.image && (
                        <img src={product.image} alt={product.title} className="w-20 h-20 rounded-lg object-cover" />
                      )}
                      <div className="flex-1">
                        <p className="text-white font-medium">{product.title}</p>
                        <p className="text-gray-400 text-xs">{product.category}</p>
                        {isLow && <p className="text-orange-400 text-xs">⚠️ Bajo stock</p>}
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${isLow ? 'text-orange-400' : 'text-white'}`}>{product.stock}</p>
                        <p className="text-gray-400 text-xs">${(product.price || 0).toLocaleString('es-AR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={adj?.operation || 'add'}
                        onChange={(e) => updateAdjustment(product.id, adj?.quantity || 1, e.target.value as 'add' | 'subtract')}
                        className="px-3 py-2 bg-white border border-gray-300 rounded text-black text-base font-medium"
                      >
                        <option value="add">+</option>
                        <option value="subtract">−</option>
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={adj?.quantity || 1}
                        onChange={(e) => updateAdjustment(product.id, parseInt(e.target.value) || 1, adj?.operation || 'add')}
                        className="w-20 px-3 py-2 bg-white border border-gray-300 rounded text-black text-base text-center"
                      />
                      <button
                        onClick={() => handleAdjustment(product.id)}
                        disabled={isSaving}
                        className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                      >
                        {isSaving ? '...' : '✓'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}