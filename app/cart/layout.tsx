import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrito de Compras',
  description: 'Tu carrito de compras. Revisá tus productos de skincare antes de finalizar la compra. Envío gratis a todo Argentina.',
  keywords: ['carrito compras', 'carrito skincare', 'carrito belleza'],
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}