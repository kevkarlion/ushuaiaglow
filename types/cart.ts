export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}