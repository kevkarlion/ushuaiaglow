// Meta Pixel event helpers

export function trackMetaEvent(event: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    if (data) {
      (window as any).fbq('track', event, data);
    } else {
      (window as any).fbq('track', event);
    }
  }
}

// ViewContent - cuando el usuario ve un producto
export function trackViewContent(productId: string, productName: string, price: number) {
  trackMetaEvent('ViewContent', {
    content_type: 'product',
    content_ids: [productId],
    content_name: productName,
    value: price,
    currency: 'ARS',
  });
}

// AddToCart - cuando agrega al carrito
export function trackAddToCart(productId: string, productName: string, price: number) {
  trackMetaEvent('AddToCart', {
    content_type: 'product',
    content_ids: [productId],
    content_name: productName,
    value: price,
    currency: 'ARS',
  });
}

// InitiateCheckout - cuando inicia checkout
export function trackInitiateCheckout(total: number, numItems: number) {
  trackMetaEvent('InitiateCheckout', {
    value: total,
    currency: 'ARS',
    num_items: numItems,
  });
}

// Purchase - cuando completa compra
export function trackPurchase(total: number, transactionId: string) {
  trackMetaEvent('Purchase', {
    value: total,
    currency: 'ARS',
    transaction_id: transactionId,
  });
}