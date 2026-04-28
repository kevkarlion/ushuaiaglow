import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Ver todos los productos de skincare',
};

export default function ProductosMainLayout({ children }: { children: React.ReactNode }) {
  return children;
}