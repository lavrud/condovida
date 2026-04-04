import React, { useState } from 'react';
import { Building, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../../../components/ui/Button';

export function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password });
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-8 items-center">

        <div className="w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-stone-900">CondoVida</h1>
            <p className="text-sm text-stone-400 mt-1">Gestão inteligente de condomínios</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-stone-800">Entrar na conta</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                Credenciais inválidas. Tente novamente.
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full rounded-xl px-4 py-3 text-base bg-stone-50 border-2 border-transparent text-stone-900 focus:border-stone-300 focus:bg-white transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl px-4 py-3 pr-11 text-base bg-stone-50 border-2 border-transparent text-stone-900 focus:border-stone-300 focus:bg-white transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="accent" full icon={LogIn} loading={isLoading}>
              Entrar
            </Button>
          </form>

          <p className="text-center text-xs text-stone-400 mt-6">
            CondoVida &copy; {new Date().getFullYear()}
          </p>
        </div>

      </div>
    </div>
  );
}
