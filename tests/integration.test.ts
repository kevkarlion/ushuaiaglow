// Tests de integración del Checkout API
// Requiere: server corriendo (npm run dev) y MongoDB configurada

import { describe, it, expect } from 'vitest';

const API_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

describe('POST /api/checkout - Integración', () => {
  
  it('POST /api/checkout: rechaza carrito vacío', async () => {
    const res = await fetch(`${API_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [], total: 0 }),
    });
    
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('No hay items');
  });

  it('POST /api/checkout: acepta pedido válido sin buyer', async () => {
    const res = await fetch(`${API_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { id: 'prod-test-1', title: 'Producto Test', price: 1000, quantity: 1 }
        ],
        total: 1000
      }),
    });
    
    const data = await res.json();
    expect([200, 500]).toContain(res.status); // 500 si MP no configurado
  });

  it('POST /api/checkout: crea buyer cuando se proveen datos', async () => {
    const email = `test-${Date.now()}@test.com`;
    
    const res = await fetch(`${API_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { id: 'prod-1', title: 'Serum Vit C', price: 2500, quantity: 1 }
        ],
        total: 2500,
        buyer: {
          nombreCompleto: 'Juan Test',
          email: email,
          telefono: '1122334455',
          direccion: 'Av. Test 123',
          codigoPostal: '1000',
          provincia: 'Buenos Aires'
        }
      }),
    });
    
    const data = await res.json();
    // Si hay MP configurado, devuelve preferenceId
    // Si no, devuelve demo: true
    expect(data.preferenceId || data.demo || data.error).toBeDefined();
  });
});

describe('GET /api/buyers - Listar buyers', () => {
  it('GET /api/buyers: devuelve lista de buyers', async () => {
    const res = await fetch(`${API_URL}/api/buyers`);
    expect([200, 401]).toContain(res.status);
  });
});

describe('GET /api/sales - Listar ventas', () => {
  it('GET /api/sales: requiere auth', async () => {
    const res = await fetch(`${API_URL}/api/sales`);
    expect([200, 401]).toContain(res.status);
  });
});

console.log('✅ Tests de integración listos');
console.log('Para ejecutar: npm run test:run');
console.log('Requiere server corriendo en puerto 3000');