'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Product } from '@/types/product';

// Parse price in Argentine format: "22,990" → 22990, "22,99" → 22.99, "1.500" → 1500
function parsePrice(val: string): number {
  let s = val.replace(/\./g, '');
  if (/,\d{2}$/.test(s)) {
    s = s.replace(',', '.');
  } else {
    s = s.replace(/,/g, '');
  }
  return parseFloat(s) || 0;
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

const categories = ['Cuidado Facial', 'Cuidado Corporal', 'Cuidado Capilar', 'Maquillaje', 'General', 'Combo'];

const initialForm: ProductFormData = {
  title: '',
  description: '',
  tagline: '',
  price: '',
  originalPrice: '',
  discount: '',
  category: 'Cuidado Facial',
  stock: '',
  images: [],
  ingredients: '',
  howToUse: '',
  warnings: '',
  weight: '',
  isCombo: false,
  productsIncluded: '',
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState<ProductFormData>(initialForm);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      
      if (!res.ok || data.error) {
        setMessage(data.error || 'Producto no encontrado');
        setLoading(false);
        return;
      }
      
      setProduct(data);
      setForm({
        title: data.title || '',
        description: data.description || '',
        tagline: data.tagline || '',
        price: data.price?.toString() || '',
        originalPrice: data.originalPrice?.toString() || '',
        discount: data.discount?.toString() || '',
        category: data.category || 'Cuidado Facial',
        stock: data.stock?.toString() || '0',
        images: Array.isArray(data.images) 
  ? data.images.map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean) 
  : [],
        ingredients: data.ingredients || '',
        howToUse: data.howToUse || '',
        warnings: data.warnings || '',
        weight: data.weight || '',
        isCombo: data.isCombo || false,
        productsIncluded: Array.isArray(data.productsIncluded) 
          ? data.productsIncluded.join(', ') 
          : (data.productsIncluded || ''),
      });
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('Error al cargar producto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ProductFormData, value: string | boolean | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const productData = {
        title: form.title,
        description: form.description,
        tagline: form.tagline,
        price: parsePrice(form.price) || 0,
        originalPrice: form.originalPrice ? parsePrice(form.originalPrice) : null,
        discount: form.discount ? parseInt(form.discount) : null,
        category: form.category,
        stock: parseInt(form.stock) || 0,
        images: form.images.length > 0 ? form.images.map((url, i) => ({ url, order: i })) : [],
        ingredients: form.ingredients,
        howToUse: form.howToUse,
        warnings: form.warnings,
        weight: form.weight,
        isCombo: form.isCombo,
        productsIncluded: form.isCombo && form.productsIncluded 
          ? form.productsIncluded.split(',').map(s => s.trim()).filter(Boolean)
          : [],
      };

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Producto actualizado!');
        setTimeout(() => router.push('/admin'), 1500);
      } else {
        setMessage(data.error || 'Error al guardar');
      }
    } catch (error) {
      setMessage('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Eliminar producto?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin');
      } else {
        setMessage('Error al eliminar');
      }
    } catch {
      setMessage('Error al eliminar');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white p-8">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.push('/admin')}
            className="text-primary hover:underline"
          >
            ← Volver al Admin
          </button>
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded"
          >
            Eliminar
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-2xl font-semibold text-white">Editar Producto</h1>

          {/* Título */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Título *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              rows={3}
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Tagline <span className="text-gray-500">(frase de beneficio principal)</span>
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              placeholder="Ej: El boost de energía que tu rostro necesita"
            />
          </div>

          {/* Precios y Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Precio Final *</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.price}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^[\d.,]*$/.test(v) || v === '') {
                    handleChange('price', v);
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
                    handleChange('originalPrice', v);
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
                onChange={(e) => handleChange('discount', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Ej: 20"
              />
            </div>
          </div>

          {/* Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-white/20 rounded-lg text-white appearance-none cursor-pointer"
                style={{ backgroundColor: 'rgb(23 23 23)', color: 'white' }}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Combo */}
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="isCombo"
              checked={form.isCombo}
              onChange={(e) => handleChange('isCombo', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="isCombo" className="text-white">Es Combo</label>
          </div>

          {form.isCombo && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Productos incluidos (IDs separados por coma)</label>
              <input
                type="text"
                value={form.productsIncluded}
                onChange={(e) => handleChange('productsIncluded', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="id1, id2, id3"
              />
            </div>
          )}

          {/* Imágenes */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Imágenes <span className="text-gray-500">(la primera es la principal)</span></label>
            
            {/* Upload buttons */}
            <div className="flex gap-3 mb-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
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
                          handleChange('images', [...form.images, data.url]);
                          ok++;
                        } else {
                          setMessage('⚠️ Error con ' + file.name + ': ' + (data.error || 'Sin respuesta'));
                          fail++;
                        }
                      } catch {
                        setMessage('⚠️ Error al subir ' + file.name);
                        fail++;
                      }
                    }
                    
                    if (ok > 0) setMessage(ok > 1 ? `✅ ${ok} imágenes subidas` : '✅ Imagen subida');
                    if (fail > 0 && ok === 0) setMessage(`⚠️ Fallaron ${fail} imagen(es)`);
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image grid with ordering */}
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
                        {/* Mover izquierda */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const newImages = [...form.images];
                            [newImages[idx - 1], newImages[idx]] = [newImages[idx], newImages[idx - 1]];
                            handleChange('images', newImages);
                          }}
                          className="w-8 h-8 bg-white/10 hover:bg-white/25 rounded-lg flex items-center justify-center text-white disabled:opacity-20 transition-colors"
                          title="Mover izquierda"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        
                        {/* Mover derecha */}
                        <button
                          type="button"
                          disabled={idx === form.images.length - 1}
                          onClick={() => {
                            const newImages = [...form.images];
                            [newImages[idx], newImages[idx + 1]] = [newImages[idx + 1], newImages[idx]];
                            handleChange('images', newImages);
                          }}
                          className="w-8 h-8 bg-white/10 hover:bg-white/25 rounded-lg flex items-center justify-center text-white disabled:opacity-20 transition-colors"
                          title="Mover derecha"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        {/* Eliminar */}
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = form.images.filter((_, i) => i !== idx);
                            handleChange('images', newImages);
                          }}
                          className="w-8 h-8 bg-red-500/20 hover:bg-red-500/50 rounded-lg flex items-center justify-center text-white transition-colors"
                          title="Eliminar imagen"
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

            {/* URL fallback textarea */}
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-300 transition-colors">O pegar URLs manualmente</summary>
              <textarea
                value={form.images.join('\n')}
                onChange={(e) => handleChange('images', e.target.value.split('\n').filter(url => url.trim()))}
                className="mt-2 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                placeholder="https://res.cloudinary.com/.../img1.jpg&#10;https://res.cloudinary.com/.../img2.jpg"
                rows={3}
              />
            </details>
          </div>

          {/* Info adicional */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Ingredientes</label>
              <input
                type="text"
                value={form.ingredients}
                onChange={(e) => handleChange('ingredients', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Modo de uso</label>
              <input
                type="text"
                value={form.howToUse}
                onChange={(e) => handleChange('howToUse', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-white/20 text-white font-semibold rounded-lg"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}