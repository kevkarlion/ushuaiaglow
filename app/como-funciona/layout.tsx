import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cómo Funciona | Ushuaia Glow',
  description: 'Descubrí cómo aplicar tus productos de skincare para lograr un glow natural. Guía paso a paso, resultados visibles y combos personalizados.',
  keywords: ['cómo aplicar skincare', 'glow natural', 'rutina skincare', 'comos funciona skincare'],
  openGraph: {
    title: 'Cómo Funciona | Ushuaia Glow',
    description: 'Descubrí cómo aplicar tus productos de skincare para lograr un glow natural.',
  },
};

export default function ComoFuncionaLayout({ children }: { children: React.ReactNode }) {
  return children;
}