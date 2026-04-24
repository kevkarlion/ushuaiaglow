'use client';

import { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface BuyerFormData {
  nombreCompleto: string;
  email: string;
  telefono: string;
  direccion: string;
  codigoPostal: string;
  provincia: string;
}

function CartContent() {
  const { items, totalItems, subtotal, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [buyerForm, setBuyerForm] = useState<BuyerFormData>({
    nombreCompleto: '',
    email: '',
    telefono: '',
    direccion: '',
    codigoPostal: '',
    provincia: '',
  });

  const handleBuyerChange = (field: keyof BuyerFormData, value: string) => {
    setBuyerForm(prev => ({ ...prev, [field]: value }));
  };

  // Get search params from window (client-side)
  const [status, setStatus] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('status');
    }
    return null;
  });

  // Get preferenceId from URL for validation
  const [preferenceId, setPreferenceId] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('preference_id');
    }
    return null;
  });

  const handleCheckout = async () => {
    // Validate buyer data - ALWAYS required now
    if (!buyerForm.nombreCompleto || !buyerForm.email || !buyerForm.direccion || 
        !buyerForm.codigoPostal || !buyerForm.provincia) {
      setError('Por favor completá todos los datos de envío');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const checkoutBody: Record<string, unknown> = {
        items: items.map((item) => ({
          id: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        total: subtotal,
        // Always include buyer data - now mandatory
        buyer: buyerForm,
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutBody),
      });

      const data = await response.json();

      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else if (data.error) {
        setError(data.error + (data.details ? ': ' + data.details : ''));
      } else if (data.demo) {
        setError('Modo demo: Configura MP_ACCESS_TOKEN en .env para activar pagos reales');
      } else {
        setError('Error desconocido. Intentalo de nuevo.');
      }
    } catch (err) {
      setError('Error al procesar el pago. Intentalo de nuevo.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  // Success message - redirect to checkout success page
  if (status === 'success') {
    // Redirect to professional success page
    if (typeof window !== 'undefined') {
      window.location.href = `/checkout/success${preferenceId ? '?order=' + preferenceId : ''}`;
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Redirigiendo...</div>
        </div>
      );
    }
  }

  // Failure message
  if (status === 'failure') {
    if (typeof window !== 'undefined') {
      window.location.href = '/checkout/failure';
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Redirigiendo...</div>
        </div>
      );
    }
  }

  // Pending message
  if (status === 'pending') {
    if (typeof window !== 'undefined') {
      window.location.href = '/checkout/pending';
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Redirigiendo...</div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-surface-darker/50 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-white">Carrito</h1>
          <p className="text-gray-400 mt-1">
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-400 mb-8">Agregá productos para comenzar</p>
            <Link
              href="/productos"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-normal rounded-lg transition-colors"
            >
              Ver Productos
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 bg-surface-darker/30 rounded-lg p-4">
                <div className="w-20 h-20 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} width={80} height={80} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/10 rounded-full" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white text-sm truncate">{item.title}</h3>
                  <p className="text-primary font-semibold mt-1">${(item.price || 0).toLocaleString('es-AR')}</p>
                  
                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item.productId, item.quantity - 1);
                        } else {
                          removeItem(item.productId);
                        }
                      }}
                      className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded text-white"
                    >
                      −
                    </button>
                    <span className="text-white font-medium w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded text-white"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="ml-auto text-red-400 hover:text-red-300 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${((item.price || 0) * item.quantity).toLocaleString('es-AR')}</p>
                </div>
              </div>
            ))}
          </div>

<div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center mb-4">
              <Link
                href="/productos"
                className="text-primary hover:underline"
              >
                ← Seguir comprando
              </Link>
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white font-medium">${(subtotal || 0).toLocaleString('es-AR')}</span>
            </div>

            {/* Buyer Form - Always visible now */}
              <div className="mb-4 p-4 bg-surface-darker/30 rounded-lg space-y-3">
                <h3 className="text-white font-medium mb-3">Datos de envío</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    value={buyerForm.nombreCompleto}
                    onChange={(e) => handleBuyerChange('nombreCompleto', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email *</label>
                    <input
                      type="email"
                      value={buyerForm.email}
                      onChange={(e) => handleBuyerChange('email', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      placeholder="juan@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={buyerForm.telefono}
                      onChange={(e) => handleBuyerChange('telefono', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      placeholder="11 1234 5678"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Dirección *</label>
                  <input
                    type="text"
                    value={buyerForm.direccion}
                    onChange={(e) => handleBuyerChange('direccion', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Calle 123, piso 2"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Código Postal *</label>
                    <input
                      type="text"
                      value={buyerForm.codigoPostal}
                      onChange={(e) => handleBuyerChange('codigoPostal', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      placeholder="C1428"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Provincia *</label>
                    <input
                      type="text"
                      value={buyerForm.provincia}
                      onChange={(e) => handleBuyerChange('provincia', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      placeholder="Buenos Aires"
                      required
                    />
                  </div>
                </div>
              </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-white/20 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Finalizar Compra
                </>
              )}
            </button>
            
            <button onClick={clearCart} className="w-full py-3 mt-3 text-gray-400 hover:text-white text-sm">
              Vaciar Carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    }>
      <CartContent />
    </Suspense>
  );
}