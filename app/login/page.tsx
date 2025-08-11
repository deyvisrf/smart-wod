'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await new Promise((r) => setTimeout(r, 800));
      try {
        localStorage.setItem('isLoggedIn', '1');
      } catch {}
      window.location.href = '/home';
    } finally {
      // mantemos o estado até redirecionar
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-purple-50">
      {/* Background decor */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-pink-200/40 blur-3xl" />
      </div>

      <div className="relative mx-4 w-full max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-xl backdrop-blur">
          {/* Left: form */}
          <div className="p-6 sm:p-10 min-h-[28rem]">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-md">
                <i className="ri-dumbbell-fill text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900">SmartWod</h1>
                <p className="text-xs text-gray-500">Crie treinos completos de CROSSFIT forma rápida e inteligente.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="voce@email.com"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link href="#" className="text-xs font-medium text-purple-600 hover:text-purple-700">forgot password?</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 pr-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute inset-y-0 right-2 grid place-items-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                aria-live="polite"
                disabled={status !== 'idle'}
                className={`relative w-full rounded-xl py-2.5 font-semibold text-white shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 ${status === 'loading' ? 'scale-[0.99]' : ''}`}
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                    <span>Entrando…</span>
                  </span>
                ) : (
                  'Log in'
                )}
              </button>

              <div className="relative py-2 text-center">
                <span className="bg-white px-3 text-xs text-gray-500">Or continue with</span>
                <div className="absolute left-0 right-0 top-1/2 -z-10 h-px -translate-y-1/2 bg-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 hover:bg-gray-50">
                  <i className="ri-google-fill text-lg text-red-500" />
                  <span className="text-sm font-medium">Google</span>
                </button>
                <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 hover:bg-gray-50">
                  <i className="ri-facebook-circle-fill text-lg text-blue-600" />
                  <span className="text-sm font-medium">Facebook</span>
                </button>
              </div>

              <p className="pt-2 text-center text-xs text-gray-500">
                Don’t have an account?{' '}
                <Link href="#" className="font-medium text-purple-600 hover:text-purple-700">Sign up</Link>
              </p>
            </form>
          </div>

          {/* Right: image panel */}
          <div className="relative hidden sm:block min-h-[28rem]">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-pink-500/20 to-pink-600/20"/>
            <Image
              src="/login-side.png"
              alt="Treino e condicionamento físico"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-gray-500">
          Ao continuar, você concorda com nossos
          {' '}<a className="text-purple-600 hover:text-purple-700" href="#">Termos</a> e
          {' '}<a className="text-purple-600 hover:text-purple-700" href="#">Política de Privacidade</a>.
        </p>
      </div>
    </main>
  );
}


