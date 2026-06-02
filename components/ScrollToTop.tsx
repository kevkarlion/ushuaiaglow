'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  // Disable browser scroll restoration on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      history.scrollRestoration = 'manual';
    }
    return () => {
      if (typeof window !== 'undefined') {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  // Scroll to top on every route change, after render
  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);

  return null;
}
