import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Building, Package, CheckCircle } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import type { Package as Pkg } from '@condovida/shared';

type State = 'form' | 'loading' | 'done';

export function TotemPage() {
  const [state, setState] = useState<State>('form');
  const [pkg, setPkg] = useState<Pkg | null>(null);
  const [form, setForm] = useState({ unit: '', block: '', description: '', carrier: '' });
  const [countdown, setCountdown] = useState(20);

  // Volta ao formulário automaticamente após 20s
  useEffect(() => {
    if (state !== 'done') return;
    setCountdown(20);
    const interval = setInterval(() => setCountdown((n) => n - 1), 1000);
    const timeout = setTimeout(() => {
      setState('form');
      setPkg(null);
      setForm({ unit: '', block: '', description: '', carrier: '' });
    }, 20000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [state]);

  const handleRegister = async () => {
    if (!form.unit || !form.block) return;
    setState('loading');
    try {
      const res = await apiClient.post<{ data: Pkg }>('/totem/register', form);
      setPkg(res.data.data);
      setState('done');
    } catch {
      setState('form');
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">

        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
            <Building size={24} className="text-stone-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">CondoVida</h1>
            <p className="text-sm text-stone-400">Terminal de entregas</p>
          </div>
        </div>

        {state === 'form' && (
          <div className="bg-white rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Package size={20} className="text-stone-600" />
              <h2 className="text-lg font-bold text-stone-900">Registrar encomenda</h2>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">Unidade *</label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value.toUpperCase() })}
                  placeholder="304"
                  className="w-full rounded-xl px-4 py-4 text-xl font-bold bg-stone-50 border-2 border-transparent focus:border-stone-300 outline-none text-center"
                />
              </div>
              <div className="w-24">
                <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">Bloco *</label>
                <input
                  type="text"
                  value={form.block}
                  onChange={(e) => setForm({ ...form, block: e.target.value.toUpperCase() })}
                  placeholder="B"
                  className="w-full rounded-xl px-4 py-4 text-xl font-bold bg-stone-50 border-2 border-transparent focus:border-stone-300 outline-none text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">Transportadora</label>
              <input
                type="text"
                value={form.carrier}
                onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                placeholder="Ex: Amazon, Correios..."
                className="w-full rounded-xl px-4 py-3 text-sm bg-stone-50 border-2 border-transparent focus:border-stone-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">Descrição</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Ex: Caixa média, envelope..."
                className="w-full rounded-xl px-4 py-3 text-sm bg-stone-50 border-2 border-transparent focus:border-stone-300 outline-none"
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={!form.unit || !form.block}
              className="w-full bg-stone-900 text-white rounded-2xl py-4 text-base font-bold hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-2"
            >
              Gerar Etiqueta
            </button>
          </div>
        )}

        {state === 'loading' && (
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
            <p className="text-stone-500">Gerando etiqueta...</p>
          </div>
        )}

        {state === 'done' && pkg && (
          <div className="bg-white rounded-3xl p-6 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle size={22} />
              <p className="font-bold text-base">Etiqueta gerada!</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-stone-500">Morador notificado · Cole esta etiqueta na encomenda</p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl w-full text-center border border-dashed border-stone-300">
              <p className="text-xs text-stone-400 mb-1 uppercase tracking-widest">Unidade destino</p>
              <p className="text-3xl font-black text-stone-900">{pkg.unit}-{pkg.block}</p>
              <p className="text-xs text-stone-400 mt-1">{pkg.description}</p>

              <div className="flex justify-center my-3">
                <div className="bg-white p-2 rounded-lg shadow-sm inline-block">
                  <QRCodeSVG value={pkg.deliveryToken!} size={160} />
                </div>
              </div>

              <div className="bg-stone-900 text-white rounded-xl py-2 px-4 inline-block">
                <p className="text-xs text-stone-400 mb-0.5">Código de retirada</p>
                <p className="text-2xl font-black tracking-widest">{pkg.deliveryToken}</p>
              </div>
            </div>

            <p className="text-xs text-stone-400">Tela reinicia em {countdown}s</p>

            <button
              onClick={() => { setState('form'); setPkg(null); setForm({ unit: '', block: '', description: '', carrier: '' }); }}
              className="w-full border-2 border-stone-200 text-stone-600 rounded-2xl py-3 text-sm font-semibold hover:bg-stone-50 transition-colors"
            >
              Nova entrega
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
