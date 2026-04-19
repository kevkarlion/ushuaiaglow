'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Product } from '@/types/product';

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  discount: string;
  category: string;
  stock: string;
  imageUrl: string;
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
  price: '',
  originalPrice: '',
  discount: '',
  category: 'Cuidado Facial',
  stock: '',
  imageUrl: '',
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
      if (!res.ok) {
        setMessage('Producto no encontrado');
        return;
      }
      const data = await res.json();
      setProduct(data);
      setForm({
        title: data.title || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        originalPrice: data.originalPrice?.toString() || '',
        discount: data.discount?.toString() || '',
        category: data.category || 'Cuidado Facial',
        stock: data.stock?.toString() || '0',
        imageUrl: data.images?.[0] || '',
        ingredients: data.ingredients || '',
        howToUse: data.howToUse || '',
        warnings: data.warnings || '',
        weight: data.weight || '',
        isCombo: data.isCombo || false,
        productsIncluded: data.productsIncluded?.join(', ') || '',
      });
    } catch (error) {
      setMessage('Error al cargar producto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ProductFormData, value: string | boolean) => {
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
        price: parseFloat(form.price) || 0,
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        discount: form.discount ? parseInt(form.discount) : null,
        category: form.category,
        stock: parseInt(form.stock) || 0,
        images: form.imageUrl ? [form.imageUrl] : [],
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

          {/* Precios y Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Precio Final *</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Precio Tachado</label>
              <input
                type="number"
                step="0.01"
                value={form.originalPrice}
                onChange={(e) => handleChange('originalPrice', e.target.value)}
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
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
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

          {/* Imagen */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">URL Imagen</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              placeholder="https://..."
            />
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