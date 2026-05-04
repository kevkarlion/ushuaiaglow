'use client';

import { useEffect } from 'react';

export default function MetaPixel() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // cargar script
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    script.async = true;
    document.head.appendChild(script);

    // inicializar pixel
    window.fbq = function () {
      window.fbq.callMethod
        ? window.fbq.callMethod.apply(window.fbq, arguments)
        : window.fbq.queue.push(arguments);
    };

    window.fbq.queue = [];
    window.fbq.loaded = true;
    window.fbq.version = '2.0';

    window.fbq('init', '2716691235377865');
    window.fbq('track', 'PageView');
  }, []);

  return null;
}