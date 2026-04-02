import React, { useState } from 'react';
import { DollarSign, Receipt, TrendingUp, Copy, Check } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useFinances } from '../hooks/useFinances';
import { Card, Badge, TabPills } from '../../../components/ui';
import { fmt, fmtDate } from '../../../lib/utils';
import { PaymentStatus } from '@condovida/shared';

const tabs = [
  { id: 'boletos', label: 'Boletos' },
  { id: 'despesas', label: 'Despesas' },
  { id: 'rateios', label: 'Rateios' },
  { id: 'resumo', label: 'Resumo' },
];

export function FinancesPage() {
  const { payments, expenses, splits, summary, pay, isLoading } = useFinances();
  const [tab, setTab] = useState('boletos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyBarcode = (barcode: string, id: string) => {
    navigator.clipboard.writeText(barcode).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  if (isLoading) {
    return <div className="h-48 bg-stone-200 rounded-2xl animate-pulse" />;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Financeiro</h1>
        <p className="text-sm text-stone-400">Pagamentos e despesas</p>
      </div>

      <TabPills tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'boletos' && (
        <div className="space-y-3">
          {payments.length === 0 && (
            <Card className="text-center py-8 text-stone-400">Nenhum boleto encontrado</Card>
          )}
          {payments.map((p) => (
            <Card key={p.id} padding="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-stone-900">{p.month}</p>
                  <p className="text-xs text-stone-400">Venc. {fmtDate(p.dueDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-stone-900">{fmt(p.amount)}</p>
                  <Badge variant={p.status === PaymentStatus.PAID ? 'success' : 'warning'}>
                    {p.status === PaymentStatus.PAID ? 'Pago' : 'Pendente'}
                  </Badge>
                </div>
              </div>
              {p.status === PaymentStatus.PENDING && (
                <div className="space-y-2">
                  {p.barcode && (
                    <div className="bg-stone-50 rounded-xl px-3 py-2 flex items-center gap-2">
                      <p className="text-xs text-stone-500 font-mono flex-1 truncate">{p.barcode}</p>
                      <button
                        onClick={() => copyBarcode(p.barcode!, p.id)}
                        className="text-stone-400 hover:text-stone-700 p-1 flex-shrink-0"
                      >
                        {copiedId === p.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => pay(p.id)}
                    className="w-full bg-emerald-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Pagar
                  </button>
                </div>
              )}
              {p.status === PaymentStatus.PAID && p.paidDate && (
                <p className="text-xs text-emerald-600">Pago em {fmtDate(p.paidDate)}</p>
              )}
            </Card>
          ))}
        </div>
      )}

      {tab === 'despesas' && (
        <div className="space-y-2">
          {expenses.map((e) => (
            <Card key={e.id} padding="px-4 py-3" className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-stone-800">{e.description}</p>
                <p className="text-xs text-stone-400">{e.category} · {fmtDate(e.date)}</p>
              </div>
              <p className="text-sm font-bold text-red-600">{fmt(e.amount)}</p>
            </Card>
          ))}
          {expenses.length === 0 && (
            <Card className="text-center py-8 text-stone-400">Nenhuma despesa registrada</Card>
          )}
        </div>
      )}

      {tab === 'rateios' && (
        <div className="space-y-3">
          {splits.map((s) => (
            <Card key={s.id} padding="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold text-stone-800">{s.description}</p>
                <Badge variant={s.status === 'APPROVED' ? 'success' : 'warning'}>
                  {s.status === 'APPROVED' ? 'Aprovado' : 'Pendente'}
                </Badge>
              </div>
              <div className="flex gap-4 text-xs text-stone-500">
                <span>Total: <strong className="text-stone-800">{fmt(s.total)}</strong></span>
                <span>Unidades: <strong className="text-stone-800">{s.unitCount}</strong></span>
                <span>Por unidade: <strong className="text-orange-600">{fmt(s.perUnit)}</strong></span>
              </div>
            </Card>
          ))}
          {splits.length === 0 && (
            <Card className="text-center py-8 text-stone-400">Nenhum rateio registrado</Card>
          )}
        </div>
      )}

      {tab === 'resumo' && (
        <div>
          <Card padding="p-4">
            <h3 className="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-500" /> Receitas vs Despesas
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={summary} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Bar dataKey="revenue" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Despesa" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
}
