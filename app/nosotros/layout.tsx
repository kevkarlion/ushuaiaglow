import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Somos UshuaiaGlow - empresa de skincare en General Roca, Río Negro, Patagonia. Productos de cuidado facial de calidad con atención personalizada. Envío gratis a todo Argentina.',
  keywords: ['nosotros skincare', 'empresa belleza Patagonia', 'UshuaiaGlow', 'tienda skincare Argentina'],
};

export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
  return children;
}