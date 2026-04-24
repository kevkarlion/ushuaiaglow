'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // NO auto-redirect - let user submit the form

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('📝 Submitting login for:', email.trim().toLowerCase());

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('📝 Login response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('📝 Login data:', data);
        
        if (data.token) {
          // Use intermediate route to set cookie properly
          window.location.href = `/api/auth/set-cookie?token=${encodeURIComponent(data.token)}`;
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('📝 Login error:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white">Ushuaia Admin</h1>
          <p className="text-gray-400 mt-2">Ingresá a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-white/20 text-white font-semibold rounded-lg"
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-primary hover:underline text-sm">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}