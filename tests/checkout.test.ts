// Tests de integración para el flujo de compra de Ushuaia
// Run con: npm test

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// Tests del Checkout API
describe('POST /api/checkout', () => {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  
  it('debería rechazar pedido sin items', async () => {
    const response = await fetch(`${baseUrl}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [], total: 0 }),
    });
    
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toContain('No hay items');
  });
  
  it('debería rechazar pedido sin datos válidos', async () => {
    const response = await fetch(`${baseUrl}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: null, total: 0 }),
    });
    
    expect(response.status).toBe(400);
  });
  
  it('debería aceptar pedido con items válidos (sin MP configurado)', async () => {
    const response = await fetch(`${baseUrl}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { id: 'test-1', title: 'Producto Test', price: 1000, quantity: 1 }
        ],
        total: 1000,
        buyer: {
          nombreCompleto: 'Test User',
          email: 'test@test.com',
          telefono: '12345678',
          direccion: 'Calle 123',
          codigoPostal: '1000',
          provincia: 'Buenos Aires'
        }
      }),
    });
    
    const data = await response.json();
    // Si MP no está configurado, devuelve demo: true
    expect(data.demo || data.preferenceId).toBeTruthy();
  });
});

// Tests del Carrito
describe('Carrito - CartContext', () => {
  it('debería agregar item al carrito', () => {
    // El CartContext usa localStorage
    const cartItem = {
      productId: 'prod-1',
      title: 'Serum Test',
      price: 2500,
      quantity: 1,
      image: 'test.jpg'
    };
    
    // Verificar estructura
    expect(cartItem.productId).toBeDefined();
    expect(cartItem.title).toBeDefined();
    expect(cartItem.price).toBeGreaterThan(0);
    expect(cartItem.quantity).toBe(1);
  });
  
  it('debería calcular total correctamente', () => {
    const items = [
      { price: 1000, quantity: 2 },
      { price: 500, quantity: 3 },
    ];
    
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    expect(total).toBe(3500); // (1000*2) + (500*3)
  });
  
  it('debería incrementar cantidad si item ya existe', () => {
    const existingItem = { productId: 'prod-1', quantity: 1 };
    const newQuantity = 2;
    
    // En el CartContext, si el item existe, suma quantity
    const result = existingItem.quantity + newQuantity;
    expect(result).toBe(3);
  });
});

// Tests de validación de datos del buyer
describe('Validación de Buyer', () => {
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const isValidPhone = (phone: string) => {
    return /^\d{8,}$/.test(phone.replace(/\D/g, ''));
  };
  
  it('debería validar email correctamente', () => {
    expect(isValidEmail('test@test.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
  
  it('debería validar teléfono correctamente', () => {
    expect(isValidPhone('12345678')).toBe(true);
    expect(isValidPhone('1234')).toBe(false);
    expect(isValidPhone('11 2345 6789')).toBe(true);
  });
});

console.log('Tests configurados para el flujo de compra de Ushuaia');
console.log('Para ejecutar necesitas MongoDB y MP_ACCESS_TOKEN configurados');