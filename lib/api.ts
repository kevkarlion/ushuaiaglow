// Usar ruta relativa en cliente, o variable de entorno en servidor
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchProducts() {
  // Si hay API_URL configurado usarlo, si no usar ruta relativa
  const url = API_URL ? `${API_URL}/api/products` : '/api/products';
  const res = await fetch(url, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProductById(id: string) {
  const url = API_URL ? `${API_URL}/api/products/${id}` : `/api/products/${id}`;
  const res = await fetch(url, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}