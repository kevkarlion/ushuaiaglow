// Meta Pixel event helpers

declare global {
  interface Window {
    fbq: any;
  }
}

export function trackMetaEvent(event: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.fbq) {
    if (data) {
      window.fbq('track', event, data);
    } else {
      window.fbq('track', event);
    }
  }
}

export function trackAddToCart(value: number, currency: string = 'ARS', contentId: string, contentName: string) {
  trackMetaEvent('AddToCart', {
    value,
    currency,
    content_type: 'product',
    content_id: contentId,
    content_name: contentName,
  });
}

export function trackInitiateCheckout(value: number, currency: string = 'ARS', numItems: number) {
  trackMetaEvent('InitiateCheckout', {
    value,
    currency,
    num_items: numItems,
  });
}

export function trackPurchase(value: number, currency: string = 'ARS', transactionId: string) {
  trackMetaEvent('Purchase', {
    value,
    currency,
    transaction_id: transactionId,
  });
}