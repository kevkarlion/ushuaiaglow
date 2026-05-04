import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import Script from 'next/script';

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
      <head>
        {/* Meta Pixel base */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}
              (window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');

              fbq('init', '2716691235377865');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <GoogleAnalytics />
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}