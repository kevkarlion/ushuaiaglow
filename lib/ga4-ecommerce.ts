/**
 * GA4 Enhanced Ecommerce Tracking
 * https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

const GA_MEASUREMENT_ID = 'G-WLV7FGHDKB';

/**
 * Helper to check if gtag is available
 */
function isGtagAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return typeof (window as any).gtag === 'function';
}

/**
 * Build GA4 item object from product data
 */
interface GA4Item {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_brand?: string;
  price?: number;
  quantity?: number;
  item_variant?: string;
  item_list_name?: string;
  item_list_id?: string;
  index?: number;
}

export function buildGA4Item(
  productId: string,
  title: string,
  price: number,
  quantity: number = 1,
  category?: string,
  brand?: string
): GA4Item {
  return {
    item_id: productId,
    item_name: title,
    item_category: category,
    item_brand: brand,
    price,
    quantity,
  };
}

/**
 * Track view_item - when user views a product detail
 */
export function trackViewItem(params: {
  currency: string;
  value: number;
  items: GA4Item[];
}) {
  if (!isGtagAvailable()) return;
  
  (window as any).gtag('event', 'view_item', {
    currency: params.currency,
    value: params.value,
    items: params.items,
  });
  
  console.log('📊 GA4: view_item', params);
}

/**
 * Track add_to_cart - when user adds product to cart
 */
export function trackAddToCart(params: {
  currency: string;
  value: number;
  items: GA4Item[];
}) {
  if (!isGtagAvailable()) return;
  
  (window as any).gtag('event', 'add_to_cart', {
    currency: params.currency,
    value: params.value,
    items: params.items,
  });
  
  console.log('📊 GA4: add_to_cart', params);
}

/**
 * Track remove_from_cart - when user removes product from cart
 */
export function trackRemoveFromCart(params: {
  currency: string;
  value: number;
  items: GA4Item[];
}) {
  if (!isGtagAvailable()) return;
  
  (window as any).gtag('event', 'remove_from_cart', {
    currency: params.currency,
    value: params.value,
    items: params.items,
  });
  
  console.log('📊 GA4: remove_from_cart', params);
}

/**
 * Track begin_checkout - when user starts checkout process
 */
export function trackBeginCheckout(params: {
  currency: string;
  value: number;
  items: GA4Item[];
}) {
  if (!isGtagAvailable()) return;
  
  (window as any).gtag('event', 'begin_checkout', {
    currency: params.currency,
    value: params.value,
    items: params.items,
  });
  
  console.log('📊 GA4: begin_checkout', params);
}

/**
 * Track add_payment_info - when user enters payment info
 */
export function trackAddPaymentInfo(params: {
  currency: string;
  value: number;
  items: GA4Item[];
  payment_type?: string;
}) {
  if (!isGtagAvailable()) return;
  
  (window as any).gtag('event', 'add_payment_info', {
    currency: params.currency,
    value: params.value,
    items: params.items,
    payment_type: params.payment_type || 'MercadoPago',
  });
  
  console.log('📊 GA4: add_payment_info', params);
}

/**
 * Track purchase - when order is completed
 */
export interface PurchaseParams {
  transaction_id: string;
  currency: string;
  value: number;
  items: GA4Item[];
  tax?: number;
  shipping?: number;
  coupon?: string;
}

export function trackPurchase(params: PurchaseParams) {
  if (!isGtagAvailable()) return;
  
  (window as any).gtag('event', 'purchase', {
    transaction_id: params.transaction_id,
    currency: params.currency,
    value: params.value,
    tax: params.tax || 0,
    shipping: params.shipping || 0,
    coupon: params.coupon || undefined,
    items: params.items,
  });
  
  console.log('📊 GA4: purchase', params);
}

/**
 * Track view_cart - when user views cart
 */
export function trackViewCart(params: {
  currency: string;
  value: number;
  items: GA4Item[];
}) {
  if (!isGtagAvailable()) return;
  
  (window as any).gtag('event', 'view_cart', {
    currency: params.currency,
    value: params.value,
    items: params.items,
  });
  
  console.log('📊 GA4: view_cart', params);
}

/**
 * Track page view with custom parameters
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (!isGtagAvailable()) return;
  
  (window as any).gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  });
}

export { GA_MEASUREMENT_ID };