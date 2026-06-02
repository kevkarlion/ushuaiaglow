'use client';

import { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { trackBeginCheckout, trackCartView, buildGA4Item } from '@/lib/ga4-ecommerce';
import { trackInitiateCheckout } from '@/lib/meta-pixel';

interface BuyerFormData {
  nombreCompleto: string;
  email: string;
  telefono: string;
  direccion: string;
  codigoPostal: string;
  provincia: string;
  localidad: string;
}

function CartContent() {
  const { items, subtotal, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [buyerForm, setBuyerForm] = useState<BuyerFormData>({
    nombreCompleto: '',
    email: '',
    telefono: '',
    direccion: '',
    codigoPostal: '',
    provincia: '',
    localidad: '',
  });

  const handleBuyerChange = (field: keyof BuyerFormData, value: string) => {
    setBuyerForm(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (items.length > 0 && !isLoading) {
      trackCartView({
        currency: 'ARS',
        value: subtotal,
        items: items.map((item) => buildGA4Item(item.productId, item.title, item.price, item.quantity))
      });
    }
  }, [items, subtotal, isLoading]);

  const handleCheckout = async () => {
    if (!buyerForm.nombreCompleto || !buyerForm.email || !buyerForm.direccion || 
        !buyerForm.codigoPostal || !buyerForm.provincia || !buyerForm.localidad) {
      setError('Completá todos los datos obligatorios (*)');
      return;
    }

    setIsProcessing(true);
    setError('');

    trackBeginCheckout({ currency: 'ARS', value: subtotal, items: items.map(i => buildGA4Item(i.productId, i.title, i.price, i.quantity)) });
    trackInitiateCheckout(subtotal, items.length);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({ id: item.productId, title: item.title, price: item.price, quantity: item.quantity })),
          total: subtotal,
          buyer: buyerForm,
        }),
      });

      const data = await response.json();
      console.log('Checkout response:', data);
      if (data.preferenceId && (data.init_point || data.sandbox_init_point || data.initPoint)) {
        window.location.href = data.init_point || data.sandbox_init_point || data.initPoint;
      } else {
        setError(data.error || data.message || 'Error al procesar');
        setIsProcessing(false);
      }
    } catch {
      setError('Error de conexión');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Izquierda: Productos */}
          <div className="lg:col-span-3">
            <div className="lg:hidden flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Tu carrito</h1>
              <span className="text-gray-400">{items.length} productos</span>
            </div>
            <h2 className="hidden lg:block text-xl font-semibold text-white mb-4">Tu carrito ({items.length})</h2>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex flex-col sm:flex-row gap-4 p-4 bg-surface-darker/30 rounded-xl sm:overflow-visible">
                  {item.image && (
                    <Image src={item.image} alt={item.title} width={80} height={80} className="w-20 h-20 rounded-lg object-cover shrink-0 self-start" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-base line-clamp-2">{item.title}</h4>
                    <p className="text-primary font-bold mt-1">${(item.price || 0).toLocaleString('es-AR')}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-l-lg text-white transition-all duration-300 ease-premium">−</button>
                        <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-r-lg text-white transition-all duration-300 ease-premium">+</button>
                      </div>
                      <button onClick={() => removeItem(item.productId)} className="text-gray-500 hover:text-red-400 text-sm transition-all duration-300 ease-premium">Eliminar</button>
                      <span className="ml-auto text-white font-bold text-lg">${((item.price || 0) * item.quantity).toLocaleString('es-AR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen desktop */}
            <div className="hidden lg:block mt-6 p-5 bg-surface-darker/30 rounded-xl">
              <h3 className="text-white font-semibold text-lg mb-4">Resumen</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="text-white">${(subtotal || 0).toLocaleString('es-AR')}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Envío</span><span className="text-primary">Gratis</span></div>
                <div className="flex justify-between pt-3 border-t border-white/[0.06]">
                  <span className="text-white font-semibold text-lg">Total</span>
                  <span className="text-primary font-bold text-2xl">${(subtotal || 0).toLocaleString('es-AR')}</span>
                </div>
              </div>
            </div>

            {/* Confianza */}
            <div className="hidden lg:flex flex-wrap justify-center gap-4 mt-6 text-xs text-white/40">
              <span>🔒 Compra segura</span>
              <span>💳 Pago protegido</span>
              <span>📦 Envíos a todo el país</span>
            </div>
          </div>

          {/* Derecha: Formulario */}
          <div className="lg:col-span-2">
            {/* Resumen mobile */}
            <div className="lg:hidden mb-6 p-5 bg-surface-darker/30 rounded-xl">
              <h3 className="text-white font-semibold text-lg mb-4">Resumen</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="text-white">${(subtotal || 0).toLocaleString('es-AR')}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Envío</span><span className="text-primary">Gratis</span></div>
                <div className="flex justify-between pt-3 border-t border-white/[0.06]">
                  <span className="text-white font-semibold text-lg">Total</span>
                  <span className="text-primary font-bold text-2xl">${(subtotal || 0).toLocaleString('es-AR')}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-5 bg-surface-darker/30 rounded-xl">
              <h3 className="text-white font-semibold text-lg mb-4">Datos de envío</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/50 mb-2">Nombre completo *</label>
                  <input type="text" value={buyerForm.nombreCompleto} onChange={(e) => handleBuyerChange('nombreCompleto', e.target.value)} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-base transition-all duration-300 ease-premium focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:bg-white/[0.06]" />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2">Email *</label>
                  <input type="email" value={buyerForm.email} onChange={(e) => handleBuyerChange('email', e.target.value)} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-base transition-all duration-300 ease-premium focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:bg-white/[0.06]" />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2">Teléfono</label>
                  <input type="tel" value={buyerForm.telefono} onChange={(e) => handleBuyerChange('telefono', e.target.value)} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-base transition-all duration-300 ease-premium focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:bg-white/[0.06]" />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2">Dirección *</label>
                  <input type="text" value={buyerForm.direccion} onChange={(e) => handleBuyerChange('direccion', e.target.value)} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-base transition-all duration-300 ease-premium focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:bg-white/[0.06]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/50 mb-2">CP *</label>
                    <input type="text" value={buyerForm.codigoPostal} onChange={(e) => handleBuyerChange('codigoPostal', e.target.value)} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-base transition-all duration-300 ease-premium focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:bg-white/[0.06]" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/50 mb-2">Localidad *</label>
                    <input type="text" value={buyerForm.localidad} onChange={(e) => handleBuyerChange('localidad', e.target.value)} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-base transition-all duration-300 ease-premium focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:bg-white/[0.06]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2">Provincia *</label>
                  <input type="text" value={buyerForm.provincia} onChange={(e) => handleBuyerChange('provincia', e.target.value)} className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white text-base transition-all duration-300 ease-premium focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:bg-white/[0.06]" />
                </div>
              </div>
            </div>

            {error && <div className="mt-4 p-4 bg-red-500/20 rounded-xl text-red-400">{error}</div>}

            {/* CTA sticky mobile */}
            <div className="sticky bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl shadow-premium pb-4 pt-2 -mx-4 px-4 lg:static lg:bg-transparent lg:p-0 lg:m-0 lg:shadow-none">
              <button onClick={handleCheckout} disabled={isProcessing} className="w-full py-4 bg-primary hover:bg-primary/90 disabled:bg-white/20 text-black font-bold rounded-xl flex items-center justify-center gap-2 text-lg transition-all duration-500 ease-premium hover:shadow-glow-lg">
                {isProcessing ? (
                  <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Procesando...</>
                ) : (
                  <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>Continuar al pago seguro</>
                )}
              </button>
            </div>

            <button onClick={clearCart} className="w-full py-3 mt-4 text-gray-500 hover:text-gray-400 text-sm text-center transition-all duration-300 ease-premium">Vaciar carrito</button>
            
            <div className="flex justify-center gap-4 mt-6 text-sm text-white/40">
              <Link href="/productos" className="hover:text-primary transition-all duration-300 ease-premium">Seguir comprando</Link>
              <span>|</span>
              <Link href="/terminos" className="hover:text-primary transition-all duration-300 ease-premium">Términos</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white/60 animate-pulse">Cargando...</div></div>}>
      <CartContent />
    </Suspense>
  );
}