'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import Pagination from '@/components/Pagination';
import { getMainImage } from '@/types/product';

interface ProductStock {
  id: string;
  title: string;
  stock: number;
  price: number;
  category: string;
  images: any[];
  isCombo?: boolean;
  productsIncluded?: string[];
}

// Parse price in Argentine format: "22,990" → 22990, "22,99" → 22.99, "1.500" → 1500
function parsePrice(val: string): number {
  // Remove all periods (thousands separator)
  let s = val.replace(/\./g, '');
  // If comma has exactly 2 digits after it and no more, it's decimal
  if (/,\d{2}$/.test(s)) {
    s = s.replace(',', '.');
  } else {
    s = s.replace(/,/g, '');
  }
  return parseFloat(s) || 0;
}

function getDisplayImage(images: any[]): string | null {
  if (!Array.isArray(images) || images.length === 0) return null;
  const first = images[0];
  return typeof first === 'string' ? first : first?.url || null;
}

interface ProductFormData {
  title: string;
  description: string;
  tagline: string;
  price: string;
  originalPrice: string;
  discount: string;
  category: string;
  stock: string;
  images: string[];
  ingredients: string;
  howToUse: string;
  warnings: string;
  weight: string;
  isCombo: boolean;
  productsIncluded: string;
}

const initialForm: ProductFormData = {
  title: '',
  description: '',
  tagline: '',
  price: '',
  originalPrice: '',
  discount: '',
  category: 'Cuidado Facial',
  stock: '',
  images: [] as string[],
  ingredients: '',
  howToUse: '',
  warnings: '',
  weight: '',
  isCombo: false,
  productsIncluded: '',
};

const LOW_STOCK_THRESHOLD = 5;
const ITEMS_PER_PAGE = 15;

export default function StockPage() {
  const [products, setProducts] = useState<ProductStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
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

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, lowStockFilter]);

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
          description: form.description,
          tagline: form.tagline,
          price: parsePrice(form.price),
          originalPrice: form.originalPrice ? parsePrice(form.originalPrice) : null,
          discount: form.discount ? parseInt(form.discount) : null,
          stock: parseInt(form.stock),
          category: form.category,
          images: form.images.length > 0 
  ? form.images.map((url, i) => ({ url, order: i })) 
  : [],
          ingredients: form.ingredients,
          howToUse: form.howToUse,
          warnings: form.warnings,
          weight: form.weight,
          isCombo: form.isCombo,
          productsIncluded: form.isCombo && form.productsIncluded 
            ? form.productsIncluded.split(',').map(s => s.trim()).filter(Boolean)
            : [],
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
        images: row.images || row.Images || row.imagen || row.Imagen || row.url || row.URL 
          ? [row.images?.[0] || row.images || row.imagen || row.Imagen || row.url || row.URL]
          : [],
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

  const handleEdit = async (product: any) => {
    setEditingId(product.id);
    // Fetch full product data
    let data = product;
    try {
      const res = await fetch(`/api/products/${product.id}`);
      if (res.ok) data = await res.json();
    } catch {}
    
    setForm({
      title: data.title || '',
      description: data.description || '',
      tagline: data.tagline || '',
      price: data.price?.toString() || '',
      originalPrice: data.originalPrice?.toString() || '',
      discount: data.discount?.toString() || '',
      stock: data.stock?.toString() || '',
      category: data.category || 'Cuidado Facial',
      images: Array.isArray(data.images) 
  ? data.images.map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean) 
  : [],
      ingredients: data.ingredients || '',
      howToUse: data.howToUse || '',
      warnings: data.warnings || '',
      weight: data.weight || '',
      isCombo: data.isCombo || false,
      productsIncluded: data.productsIncluded?.join(', ') || '',
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

  // Pagination
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

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
          <div className="bg-surface-darker/30 rounded-lg p-4 lg:p-5">
            <p className="text-gray-400 text-base lg:text-lg">Total Productos</p>
            <p className="text-2xl lg:text-3xl text-white">{totalProducts}</p>
          </div>
          <div className="bg-surface-darker/30 rounded-lg p-4 lg:p-5">
            <p className="text-gray-400 text-base lg:text-lg">Stock Total</p>
            <p className="text-2xl lg:text-3xl text-white">{totalStock}</p>
          </div>
          <div className="bg-surface-darker/30 rounded-lg p-4 lg:p-5">
            <p className="text-gray-400 text-base lg:text-lg">Bajo Stock (&lt;{LOW_STOCK_THRESHOLD})</p>
            <p className="text-2xl lg:text-3xl text-orange-400">{lowStockProducts.length}</p>
          </div>
          <div className="bg-surface-darker/30 rounded-lg p-4 lg:p-5">
            <p className="text-gray-400 text-base lg:text-lg">Stock Crítico (&lt;3)</p>
            <p className="text-2xl lg:text-3xl text-red-400">{products.filter(p => p.stock < 3).length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-5 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 flex-1 text-lg"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-5 py-3 bg-white border border-gray-300 rounded-lg text-black text-lg"
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
            className="px-5 py-3 bg-white border border-gray-300 rounded-lg text-black text-lg"
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

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Tagline <span className="text-gray-500">(frase de beneficio principal)</span>
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Ej: El boost de energía que tu rostro necesita"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Precio *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^[\d.,]*$/.test(v) || v === '') {
                      setForm({ ...form, price: v });
                    }
                  }}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Precio Tachado</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.originalPrice}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^[\d.,]*$/.test(v) || v === '') {
                      setForm({ ...form, originalPrice: v });
                    }
                  }}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="Ej: 12000"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Descuento %</label>
                <input
                  type="number"
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="Ej: 20"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Stock *</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm text-gray-400 mb-1">Peso / Contenido</label>
                <input
                  type="text"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="Ej: 300ml"
                />
              </div>
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Imágenes <span className="text-gray-500">(la primera es la principal)</span></label>
              
              {/* Upload button */}
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg cursor-pointer hover:bg-white/20 transition-colors mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-white">Subir imágenes</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length === 0) return;
                    
                    let ok = 0, fail = 0;
                    for (const file of files) {
                      const formData = new FormData();
                      formData.append('file', file);
                      
                      try {
                        const res = await fetch('/api/upload', { method: 'POST', body: formData });
                        const data = await res.json();
                        if (data.url) {
                          setForm(prev => ({ ...prev, images: [...prev.images, data.url] }));
                          ok++;
                        } else {
                          setMessage('⚠️ ' + file.name + ': ' + (data.error || data.details || 'Sin respuesta'));
                          fail++;
                        }
                      } catch (err) {
                        setMessage('⚠️ ' + file.name + ': ' + (err instanceof Error ? err.message : 'Error de conexión'));
                        fail++;
                      }
                    }
                    
                    if (ok > 0) {
                      setMessage(ok > 1 ? `✅ ${ok} imágenes subidas` : '✅ Imagen subida');
                    }
                    if (fail > 0 && ok === 0) {
                      setMessage(`⚠️ Fallaron ${fail} imagen(es)`);
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </label>

              {/* Preview grid */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {form.images.map((url, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-white/20 bg-black/50">
                      {/* Image */}
                      <div className="aspect-[4/3] relative">
                        <img src={url} alt={`Imagen ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Info bar */}
                      <div className="flex items-center justify-between px-3 py-2 bg-black/60">
                        <div className="flex items-center gap-2">
                          <span className="bg-white/15 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                            {idx + 1}
                          </span>
                          {idx === 0 && (
                            <span className="bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Principal
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const newImages = [...form.images];
                              [newImages[idx - 1], newImages[idx]] = [newImages[idx], newImages[idx - 1]];
                              setForm(prev => ({ ...prev, images: newImages }));
                            }}
                            className="w-8 h-8 bg-white/10 hover:bg-white/25 rounded-lg flex items-center justify-center text-white disabled:opacity-20 transition-colors"
                            title="Mover izquierda"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            disabled={idx === form.images.length - 1}
                            onClick={() => {
                              const newImages = [...form.images];
                              [newImages[idx], newImages[idx + 1]] = [newImages[idx + 1], newImages[idx]];
                              setForm(prev => ({ ...prev, images: newImages }));
                            }}
                            className="w-8 h-8 bg-white/10 hover:bg-white/25 rounded-lg flex items-center justify-center text-white disabled:opacity-20 transition-colors"
                            title="Mover derecha"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = form.images.filter((_, i) => i !== idx);
                              setForm(prev => ({ ...prev, images: newImages }));
                            }}
                            className="w-8 h-8 bg-red-500/20 hover:bg-red-500/50 rounded-lg flex items-center justify-center text-white transition-colors"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* URL fallback */}
              <details className="text-xs text-gray-500">
                <summary className="cursor-pointer hover:text-gray-300 transition-colors">O pegar URLs manualmente</summary>
                <textarea
                  value={form.images.join('\n')}
                  onChange={(e) => setForm({ ...form, images: e.target.value.split('\n').filter(url => url.trim()) })}
                  className="mt-2 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                  placeholder="https://res.cloudinary.com/.../img1.jpg&#10;https://res.cloudinary.com/.../img2.jpg"
                  rows={3}
                />
              </details>
            </div>

            {/* Detalles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Ingredientes</label>
                <textarea
                  value={form.ingredients}
                  onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Cómo usar</label>
                <textarea
                  value={form.howToUse}
                  onChange={(e) => setForm({ ...form, howToUse: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  rows={3}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Advertencias</label>
              <textarea
                value={form.warnings}
                onChange={(e) => setForm({ ...form, warnings: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                rows={2}
              />
            </div>

            {/* Combo */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isCombo"
                checked={form.isCombo}
                onChange={(e) => setForm({ ...form, isCombo: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isCombo" className="text-sm text-gray-400">Es un combo / kit</label>
            </div>
            {form.isCombo && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">IDs de productos incluidos <span className="text-gray-500">(separados por coma)</span></label>
                <input
                  type="text"
                  value={form.productsIncluded}
                  onChange={(e) => setForm({ ...form, productsIncluded: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="id1, id2, id3"
                />
              </div>
            )}

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
          <>
            <div className="space-y-3 md:space-y-0 md:bg-surface-darker/30 md:rounded-lg md:overflow-hidden">
              {/* Desktop header - grid */}
              <div className="hidden md:grid md:grid-cols-6 md:gap-3 md:p-4 bg-white/5 text-gray-400 text-sm">
                <div className="col-span-2">Producto</div>
                <div>Categoría</div>
                <div className="text-right">Stock</div>
                <div className="text-right">Precio</div>
                <div className="text-right">Acción</div>
              </div>
              
              {paginatedProducts.map((product) => {
              const isLow = product.stock < LOW_STOCK_THRESHOLD;
              const adj = adjustments[product.id];
              const isSaving = saving;
              
              return (
                <div 
                  key={product.id}
                  className={`p-4 rounded-lg md:rounded-none md:border-t md:border-white/5 ${isLow ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-surface-darker/30 border border-white/5'}`}
                >
                  {/* Desktop - grid layout */}
                  <div className="hidden md:grid md:grid-cols-6 md:gap-3 md:items-center">
                    <div className="flex items-center gap-4 col-span-2">
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-black/40">
                        {(() => {
                          const img = getDisplayImage(product.images);
                          return img ? (
                            <img src={img} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white text-base truncate">{product.title}</p>
                          {product.isCombo && (
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded flex-shrink-0">Combo</span>
                          )}
                        </div>
                        {isLow && <p className="text-orange-400 text-xs">⚠️ Bajo stock</p>}
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm truncate">{product.category}</div>
                    <div className="text-right">
                      <span className={isLow ? 'text-orange-400 font-semibold text-lg' : 'text-white text-lg'}>
                        {product.stock}
                      </span>
                    </div>
                    <div className="text-right text-gray-400 text-sm">
                      ${(product.price || 0).toLocaleString('es-AR')}
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => router.push(`/admin/productos/${product.id}`)}
                        className="px-2 py-1 bg-white/10 hover:bg-white/25 text-xs text-gray-300 rounded transition-colors"
                        title="Editar producto"
                      >
                        ✎
                      </button>
                      <select
                        value={adj?.operation || 'add'}
                        onChange={(e) => updateAdjustment(product.id, adj?.quantity || 1, e.target.value as 'add' | 'subtract')}
                        className="px-2 py-1 bg-white border border-gray-300 rounded text-black text-xs"
                      >
                        <option value="add">+</option>
                        <option value="subtract">−</option>
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={adj?.quantity || 1}
                        onChange={(e) => updateAdjustment(product.id, parseInt(e.target.value) || 1, adj?.operation || 'add')}
                        className="w-12 px-1 py-1 bg-white border border-gray-300 rounded text-black text-xs text-center"
                      />
                      <button
                        onClick={() => handleAdjustment(product.id)}
                        disabled={isSaving}
                        className="px-2 py-1 bg-primary hover:bg-primary/90 text-white text-xs rounded"
                      >
                        {isSaving ? '...' : '✓'}
                      </button>
                    </div>
                  </div>

                  {/* Mobile - card */}
                  <div className="md:hidden">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-black/40">
                        {(() => {
                          const img = getDisplayImage(product.images);
                          return img ? (
                            <img src={img} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-medium">{product.title}</p>
                          {product.isCombo && (
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">Combo</span>
                          )}
                        </div>
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
                      <button
                        onClick={() => router.push(`/admin/productos/${product.id}`)}
                        className="px-3 py-2 bg-white/10 hover:bg-white/25 text-white text-sm rounded-lg transition-colors"
                        title="Editar producto"
                      >
                        ✎
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}