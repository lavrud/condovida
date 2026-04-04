import React, { useEffect, useRef, useState } from 'react';
import { Building, QrCode, Keyboard, Package, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { apiClient } from '../../../lib/api-client';
import { fmtDateTime } from '../../../lib/utils';
import type { Package as Pkg } from '@condovida/shared';

type State = 'idle' | 'scanning' | 'typing' | 'loading' | 'found' | 'confirming' | 'done' | 'error';

export function RetiradaPage() {
  const [state, setState] = useState<State>('idle');
  const [pkg, setPkg] = useState<Pkg | null>(null);
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Inicia/para o scanner de câmera
  useEffect(() => {
    if (state !== 'scanning') {
      scannerRef.current?.stop().catch(() => {});
      return;
    }
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;
    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      (decodedText) => {
        scanner.stop().catch(() => {});
        fetchPackage(decodedText);
      },
      () => {},
    ).catch(() => setState('idle'));

    return () => { scanner.stop().catch(() => {}); };
  }, [state]);

  useEffect(() => {
    if (state === 'typing') inputRef.current?.focus();
  }, [state]);

  const fetchPackage = async (token: string) => {
    setState('loading');
    try {
      const res = await apiClient.get<{ data: Pkg }>(`/totem/package/${token.trim().toUpperCase()}`);
      setPkg(res.data.data);
      setState('found');
    } catch {
      setErrorMsg('Código não encontrado. Verifique e tente novamente.');
      setState('error');
    }
  };

  const confirmPickup = async () => {
    if (!pkg?.deliveryToken) return;
    setState('confirming');
    try {
      await apiClient.post(`/totem/${pkg.deliveryToken}/pickup`);
      setState('done');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setErrorMsg(e.response?.data?.message || 'Erro ao confirmar retirada.');
      setState('error');
    }
  };

  const reset = () => {
    setState('idle');
    setPkg(null);
    setCode('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">

        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
            <Building size={24} className="text-stone-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">CondoVida</h1>
            <p className="text-sm text-stone-400">Retirada de encomenda</p>
          </div>
        </div>

        {/* IDLE — escolha do método */}
        {state === 'idle' && (
          <div className="space-y-3">
            <p className="text-center text-stone-400 text-sm mb-6">Como você quer identificar sua encomenda?</p>
            <button
              onClick={() => setState('scanning')}
              className="w-full bg-white text-stone-900 rounded-2xl py-5 flex items-center justify-center gap-3 text-base font-bold hover:bg-stone-100 transition-colors"
            >
              <QrCode size={22} /> Escanear QR Code
            </button>
            <button
              onClick={() => setState('typing')}
              className="w-full bg-stone-700 text-white rounded-2xl py-5 flex items-center justify-center gap-3 text-base font-bold hover:bg-stone-600 transition-colors"
            >
              <Keyboard size={22} /> Digitar código
            </button>
          </div>
        )}

        {/* SCANNING — câmera */}
        {state === 'scanning' && (
          <div className="bg-white rounded-3xl p-4 space-y-3">
            <p className="text-center text-sm text-stone-500">Aponte a câmera para o QR da etiqueta</p>
            <div id="qr-reader" className="rounded-2xl overflow-hidden" />
            <button onClick={reset} className="w-full flex items-center justify-center gap-2 text-stone-400 text-sm py-2 hover:text-stone-700">
              <ArrowLeft size={14} /> Voltar
            </button>
          </div>
        )}

        {/* TYPING — digitar código */}
        {state === 'typing' && (
          <div className="bg-white rounded-3xl p-6 space-y-4">
            <p className="text-center text-sm text-stone-500">Digite o código da etiqueta</p>
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && code.length >= 4 && fetchPackage(code)}
              placeholder="Ex: X9K2M4"
              maxLength={8}
              className="w-full rounded-xl px-4 py-4 text-3xl font-black text-center bg-stone-50 border-2 border-transparent focus:border-stone-300 outline-none tracking-widest"
            />
            <button
              onClick={() => fetchPackage(code)}
              disabled={code.length < 4}
              className="w-full bg-stone-900 text-white rounded-2xl py-4 font-bold hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Buscar encomenda
            </button>
            <button onClick={reset} className="w-full flex items-center justify-center gap-2 text-stone-400 text-sm py-1 hover:text-stone-700">
              <ArrowLeft size={14} /> Voltar
            </button>
          </div>
        )}

        {/* LOADING */}
        {state === 'loading' && (
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
            <p className="text-stone-500">Buscando encomenda...</p>
          </div>
        )}

        {/* FOUND — confirmar retirada */}
        {state === 'found' && pkg && (
          <div className="bg-white rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900">{pkg.description}</p>
                <p className="text-xs text-stone-500">Ap. {pkg.unit}-{pkg.block} · {pkg.carrier}</p>
                <p className="text-xs text-stone-400">Chegou: {fmtDateTime(pkg.arrivedAt)}</p>
              </div>
            </div>

            {pkg.status === 'PICKED_UP' ? (
              <div className="text-center text-amber-600 text-sm font-semibold py-2">
                Esta encomenda já foi retirada.
              </div>
            ) : (
              <button
                onClick={confirmPickup}
                className="w-full bg-emerald-600 text-white rounded-2xl py-4 font-bold hover:bg-emerald-700 transition-colors"
              >
                Confirmar retirada
              </button>
            )}
            <button onClick={reset} className="w-full flex items-center justify-center gap-2 text-stone-400 text-sm py-1 hover:text-stone-700">
              <ArrowLeft size={14} /> Voltar
            </button>
          </div>
        )}

        {/* CONFIRMING */}
        {state === 'confirming' && (
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-stone-200 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-stone-500">Confirmando retirada...</p>
          </div>
        )}

        {/* DONE */}
        {state === 'done' && (
          <div className="bg-white rounded-3xl p-6 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle size={36} className="text-emerald-600" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-stone-900">Retirada confirmada!</p>
              <p className="text-sm text-stone-400 mt-1">O morador foi notificado.</p>
            </div>
            <button onClick={reset} className="w-full bg-stone-900 text-white rounded-2xl py-4 font-bold hover:bg-stone-700 transition-colors mt-2">
              Voltar ao início
            </button>
          </div>
        )}

        {/* ERROR */}
        {state === 'error' && (
          <div className="bg-white rounded-3xl p-6 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle size={36} className="text-red-500" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-stone-900">Ops!</p>
              <p className="text-sm text-stone-500 mt-1">{errorMsg}</p>
            </div>
            <button onClick={reset} className="w-full bg-stone-900 text-white rounded-2xl py-4 font-bold hover:bg-stone-700 transition-colors">
              Tentar novamente
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
