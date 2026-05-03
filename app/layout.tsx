import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import MetaPixel from '@/components/MetaPixel';

export const metadata: Metadata = {
  title: {
    default: 'UshuaiaGlow | Tienda de Skincare en Argentina',
    template: '%s | UshuaiaGlow',
  },
  description: 'Comprá productos de cuidado facial: sérums, protectores solares, gels hidratantes ymás. Envío gratis a todo Argentina. Descuentos hasta 25% en combos.',
  keywords: ['skincare Argentina', 'cuidado facial', 'serum vitamina C', 'protector solar', 'gel hidratante', 'mascarilla facial', 'Ushuaia'],
  authors: [{ name: 'UshuaiaGlow' }],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'UshuaiaGlow',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <GoogleAnalytics />
        <MetaPixel />
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}