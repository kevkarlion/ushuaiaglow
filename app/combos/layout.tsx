import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Combos de Skincare con Descuento',
  description: 'Combos exclusivos con hasta 25% de descuento. Todo lo que necesitás para tu rutina de cuidado facial. Envío gratis a todo Argentina.',
  keywords: ['combos skincare', 'combo skincare descuento', 'rutina facial completa', 'paquetes belleza'],
};

export default function CombosLayout({ children }: { children: React.ReactNode }) {
  return children;
}