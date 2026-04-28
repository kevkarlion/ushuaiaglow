import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categorías de Skincare',
  description: 'Encontrá el producto perfecto para tu rutina: cuidado facial, accesorios y combos. Asesoría personalizada en skincare.',
  keywords: ['categorías skincare', 'tipos de productos facial', 'accesorios skincare'],
};

export default function CategoriasLayout({ children }: { children: React.ReactNode }) {
  return children;
}