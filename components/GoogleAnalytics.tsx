'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-LSZTLY8S35';

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Configuración básica con enhanced ecommerce
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              // Enhanced Ecommerce
              send_page_view: true,
              // Optimizaciones
              debug_mode: ${process.env.NODE_ENV === 'development'}
            });
            
            // Configurar linker para cross-domain si es necesario
            gtag('set', 'cross_domain_state', 'UA-${GA_MEASUREMENT_ID.split('-')[1]}-1');
          `,
        }}
      />
    </>
  );
}