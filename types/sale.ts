export interface SaleItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Sale {
  _id: string;
  buyerId: string;
  buyerNombre: string;
  buyerEmail: string;
  items: SaleItem[];
  total: number;
  preferenceId?: string;
  paymentId?: string;
  status: 'pending' | 'paid' | 'failed';
  createdAt: string;
  paidAt?: string;
}

export interface CreateSaleDTO {
  buyerId: string;
  buyerNombre: string;
  buyerEmail: string;
  items: SaleItem[];
  total: number;
  preferenceId?: string;
  status?: 'pending' | 'paid' | 'failed';
}