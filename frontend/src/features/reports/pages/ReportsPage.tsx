import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart2, Users, DollarSign, MessageSquare, Package, Calendar, PawPrint, TrendingUp, TrendingDown } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import { Card } from '../../../components/ui';
import { fmt } from '../../../lib/utils';

interface ReportSummary {
  totalResidents: number;
  pendingPayments: number;
  openTickets: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  pendingPackages: number;
  upcomingReservations: number;
  activePets: number;
}

export function ReportsPage() {
  const { data: summary, isLoading } = useQuery<ReportSummary>({
    queryKey: ['reports-summary'],
    queryFn: async () => (await apiClient.get<{ data: ReportSummary }>('/reports/summary')).data.data,
  });

  const balance = summary ? summary.monthlyRevenue - summary.monthlyExpenses : 0;

  if (isLoading) return <div className="h-48 bg-stone-200 rounded-2xl animate-pulse" />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Relatórios</h1>
        <p className="text-sm text-stone-400">Visão geral do condomínio</p>
      </div>

      {summary && (
        <>
          <Card padding="p-4" className="bg-stone-900 text-white">
            <p className="text-xs text-stone-400 mb-1">Balanço do mês</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-black">{fmt(balance)}</p>
                <p className="text-xs text-stone-400 mt-1">{balance >= 0 ? '✓ Superávit' : '⚠ Déficit'}</p>
              </div>
              {balance >= 0 ? <TrendingUp size={32} className="text-emerald-400" /> : <TrendingDown size={32} className="text-red-400" />}
            </div>
            <div className="flex gap-4 mt-3 pt-3 border-t border-stone-700">
              <div><p className="text-xs text-stone-400">Receita</p><p className="text-sm font-bold text-emerald-400">{fmt(summary.monthlyRevenue)}</p></div>
              <div><p className="text-xs text-stone-400">Despesas</p><p className="text-sm font-bold text-red-400">{fmt(summary.monthlyExpenses)}</p></div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Users, label: 'Moradores', value: summary.totalResidents, color: 'bg-blue-50 text-blue-600' },
              { icon: DollarSign, label: 'Boletos pendentes', value: summary.pendingPayments, color: 'bg-orange-50 text-orange-600' },
              { icon: MessageSquare, label: 'Chamados abertos', value: summary.openTickets, color: 'bg-rose-50 text-rose-600' },
              { icon: Package, label: 'Encomendas', value: summary.pendingPackages, color: 'bg-amber-50 text-amber-600' },
              { icon: Calendar, label: 'Reservas confirmadas', value: summary.upcomingReservations, color: 'bg-emerald-50 text-emerald-600' },
              { icon: PawPrint, label: 'Pets cadastrados', value: summary.activePets, color: 'bg-purple-50 text-purple-600' },
            ].map(({ icon: Icon, label, value, color }) => (
              <Card key={label} padding="p-4">
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-2`}><Icon size={16} /></div>
                <p className="text-2xl font-black text-stone-900">{value}</p>
                <p className="text-xs text-stone-400 mt-0.5">{label}</p>
              </Card>
            ))}
          </div>

          <Card padding="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 size={16} className="text-stone-500" />
              <h3 className="text-sm font-bold text-stone-800">Indicadores de saúde</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Adimplência', value: Math.round((summary.totalResidents - summary.pendingPayments) / summary.totalResidents * 100), color: 'bg-emerald-500' },
                { label: 'Chamados resolvidos', value: Math.round((10 - summary.openTickets) / 10 * 100), color: 'bg-blue-500' },
                { label: 'Encomendas retiradas', value: Math.round((5 - summary.pendingPackages) / 5 * 100), color: 'bg-amber-500' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1"><span className="text-stone-600 font-medium">{label}</span><span className="font-bold text-stone-800">{Math.max(0, value)}%</span></div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden"><div className={`h-full ${color} rounded-full`} style={{ width: `${Math.max(0, value)}%` }} /></div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
