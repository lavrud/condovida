import React, { useState } from 'react';
import { Users, DollarSign, Wrench, BarChart2, Settings, Shield, LucideIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { Card, IconContainer, TabPills } from '../../../components/ui';
import { useAuthStore } from '../../../store/auth.store';
import { Navigate } from 'react-router-dom';
import { Role, Resident } from '@condovida/shared';
import { fmt } from '../../../lib/utils';

const tabs = [
  { id: 'overview', label: 'Visão Geral' },
  { id: 'residents', label: 'Moradores' },
  { id: 'settings', label: 'Configurações' },
];

function StatsCard({ icon, label, value, sub }: { icon: LucideIcon; label: string; value: string | number; sub?: string }) {
  return (
    <Card padding="p-4">
      <div className="flex items-center gap-3">
        <IconContainer icon={icon} size={40} iconSize={18} color="bg-stone-100 text-stone-600" />
        <div>
          <p className="text-xs text-stone-400">{label}</p>
          <p className="text-xl font-bold text-stone-900">{value}</p>
          {sub && <p className="text-xs text-stone-400">{sub}</p>}
        </div>
      </div>
    </Card>
  );
}

export function AdminPage() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState('overview');

  if (user?.role !== Role.SINDICO && user?.role !== Role.COUNCIL) {
    return <Navigate to="/" replace />;
  }

  const residents = useQuery({
    queryKey: ['residents'],
    queryFn: async () => {
      const r = await apiClient.get<{ data: Resident[] }>('/residents');
      return r.data.data;
    },
  });

  const summary = useQuery({
    queryKey: ['finances-summary'],
    queryFn: async () => {
      const r = await apiClient.get<{ data: Array<{ month: string; revenue: number; expenses: number }> }>('/finances/summary');
      return r.data.data;
    },
  });

  const lastMonth = summary.data?.[summary.data.length - 1];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-stone-900 flex items-center justify-center">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Painel Admin</h1>
          <p className="text-sm text-stone-400">Gestão do condomínio</p>
        </div>
      </div>

      <TabPills tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <StatsCard
              icon={Users}
              label="Moradores"
              value={residents.data?.length || 0}
              sub="Cadastrados"
            />
            <StatsCard
              icon={DollarSign}
              label="Receita"
              value={fmt(lastMonth?.revenue || 0)}
              sub={lastMonth?.month || '—'}
            />
            <StatsCard
              icon={DollarSign}
              label="Despesas"
              value={fmt(lastMonth?.expenses || 0)}
              sub={lastMonth?.month || '—'}
            />
            <StatsCard
              icon={BarChart2}
              label="Saldo"
              value={fmt((lastMonth?.revenue || 0) - (lastMonth?.expenses || 0))}
              sub="Mês atual"
            />
          </div>
        </div>
      )}

      {tab === 'residents' && (
        <div className="space-y-2">
          {residents.isLoading && <div className="h-32 bg-stone-200 rounded-2xl animate-pulse" />}
          {residents.data?.map((r) => (
            <Card key={r.id} padding="px-4 py-3" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600 flex-shrink-0">
                {r.avatar || r.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-stone-800">{r.name}</p>
                <p className="text-xs text-stone-400">
                  Unidade {r.unit}-{r.block} · {r.role}
                </p>
              </div>
              <div className={`w-2 h-2 rounded-full ${r.active ? 'bg-emerald-500' : 'bg-stone-300'}`} />
            </Card>
          ))}
          {!residents.isLoading && residents.data?.length === 0 && (
            <Card className="text-center py-8 text-stone-400">Nenhum morador cadastrado</Card>
          )}
        </div>
      )}

      {tab === 'settings' && (
        <Card padding="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Settings size={18} className="text-stone-500" />
            <h3 className="text-sm font-bold text-stone-800">Configurações do Condomínio</h3>
          </div>
          <p className="text-sm text-stone-500">
            As configurações avançadas estão disponíveis no painel web completo.
          </p>
        </Card>
      )}
    </div>
  );
}
