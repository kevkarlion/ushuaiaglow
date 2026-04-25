'use client';

import { useEffect, useState, useRef } from 'react';
import { Product } from '@/types/product';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  imageUrl: string;
}

const initialForm: ProductFormData = {
  title: '',
  description: '',
  price: '',
  category: 'Cuidado Facial',
  stock: '',
  imageUrl: '',
};

const categories = ['Cuidado Facial', 'Cuidado Corporal', 'Cuidado Capilar', 'Maquillaje'];

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ nombre: string; email: string } | null>(null);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [form, setForm] = useState<ProductFormData>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser({
            nombre: data.user.nombre || 'Admin',
            email: data.user.email || '',
          });
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Call logout API
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Redirect to login
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        setProducts([]);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.error) {
        console.error('API error:', data.error);
        setProducts([]);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const productData = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        stock: parseInt(form.stock),
        images: form.imageUrl ? [form.imageUrl] : [],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Producto guardado!');
        setForm(initialForm);
        fetchProducts();
      } else {
        setMessage('Error al guardar');
      }
    } catch (error) {
      setMessage('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar producto?')) return;

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (product: Product) => {
    // Go to edit page instead of inline edit
    router.push(`/admin/productos/${product.id}`);
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

      // Normalizar campos: Excel puede tener заголовки en español o inglés
      const products = (jsonData as any[]).map((row: any) => ({
        title: row.title || row.Title || row.nombre || row.Nombre || row.producto || row.Producto || '',
        description: row.description || row.Description || row.descripcion || row.Descripcion || '',
        price: row.price || row.Price || row.precio || row.Precio || 0,
        originalPrice: row.originalPrice || row.original_price || row.priceOriginal || row.precioOriginal || undefined,
        discount: row.discount || row.descuento || row.Discount || row.Descuento || undefined,
        category: row.category || row.Category || row.categoria || row.Categoria || 'General',
        brand: row.brand || row.Brand || row.marca || row.Marca || '',
        stock: row.stock || row.Stock || 0,
        images: row.images || row.Images || row.imagen || row.Imagen || row.url || row.URL 
          ? [row.images?.[0] || row.images || row.imagen || row.Imagen || row.url || row.URL]
          : [],
        ingredients: row.ingredients || row.Ingredients || row.ingredientes || row.Ingredientes || '',
        howToUse: row.howToUse || row['How to Use'] || row.modoDeUso || row['Modo de uso'] || '',
        warnings: row.warnings || row.Warnings || row.advertencias || row.Advertencias || '',
        weight: row.weight || row.Weight || row.peso || row.Peso || '',
        isCombo: row.isCombo || row.is_combo || row.combo || row.Combo === true || row.combo === 'true' ? true : false,
        productsIncluded: row.productsIncluded || row.products_included || row.productIds || row.product_ids || [],
      })).filter(p => p.title); // Solo productos con título

      if (products.length === 0) {
        setMessage('No se encontraron productos válidos en el Excel');
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
        setMessage(`✅ Importados ${result.count} productos`);
        fetchProducts();
      } else {
        setMessage('Error al importar: ' + (result.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Import error:', error);
      setMessage('Error al procesar el archivo');
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Fetch low stock count
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      const res = await fetch('/api/stock?lowStock=true');
      const data = await res.json();
      if (Array.isArray(data)) {
        setLowStockCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching low stock:', error);
    }
  };

  return (
    <div>
      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}

      {/* List */}
      <div>
        <h2 className="text-lg font-medium text-white mb-4">
          Productos ({products.length})
        </h2>
        {loading ? (
          <p className="text-gray-400">Cargando...</p>
        ) : !Array.isArray(products) || products.length === 0 ? (
          <p className="text-gray-400">No hay productos</p>
        ) : (
          <div className="space-y-3">
            {(products as Product[]).map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 bg-surface-darker/30 rounded-lg"
              >
                <div className="w-16 h-16 md:w-12 md:h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-lg md:text-base truncate">{product.title}</p>
                  <p className="text-gray-400 text-base md:text-sm">
                    ${product.price.toLocaleString('es-AR')} - {product.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 text-sm rounded-lg"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}