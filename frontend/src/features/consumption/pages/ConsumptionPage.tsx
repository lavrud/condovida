import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Droplets, Zap, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { apiClient } from '../../../lib/api-client';
import { Card } from '../../../components/ui';
import { ConsumptionRecord } from '@condovida/shared';
import { fmt } from '../../../lib/utils';

export function ConsumptionPage() {
  const { data: records = [], isLoading } = useQuery<ConsumptionRecord[]>({
    queryKey: ['consumption'],
    queryFn: async () => (await apiClient.get<{ data: ConsumptionRecord[] }>('/consumption/mine')).data.data,
  });

  const latest = records[records.length - 1];
  const prev = records[records.length - 2];

  const waterDiff = latest && prev ? ((latest.water - prev.water) / prev.water * 100).toFixed(1) : null;
  const energyDiff = latest && prev ? ((latest.energy - prev.energy) / prev.energy * 100).toFixed(1) : null;

  if (isLoading) return <div className="h-48 bg-stone-200 rounded-2xl animate-pulse" />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Consumo</h1>
        <p className="text-sm text-stone-400">Água e energia da sua unidade</p>
      </div>

      {latest && (
        <div className="grid grid-cols-2 gap-3">
          <Card padding="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center"><Droplets size={16} className="text-blue-600" /></div>
              <span className="text-xs font-semibold text-stone-500">Água</span>
            </div>
            <p className="text-2xl font-black text-stone-900">{latest.water}<span className="text-sm font-normal text-stone-400"> m³</span></p>
            <p className="text-xs text-stone-500 mt-0.5">{fmt(latest.waterCost)}</p>
            {waterDiff && <p className={`text-xs font-semibold mt-1 ${Number(waterDiff) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{Number(waterDiff) > 0 ? '▲' : '▼'} {Math.abs(Number(waterDiff))}% vs mês anterior</p>}
          </Card>
          <Card padding="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center"><Zap size={16} className="text-yellow-600" /></div>
              <span className="text-xs font-semibold text-stone-500">Energia</span>
            </div>
            <p className="text-2xl font-black text-stone-900">{latest.energy}<span className="text-sm font-normal text-stone-400"> kWh</span></p>
            <p className="text-xs text-stone-500 mt-0.5">{fmt(latest.energyCost)}</p>
            {energyDiff && <p className={`text-xs font-semibold mt-1 ${Number(energyDiff) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{Number(energyDiff) > 0 ? '▲' : '▼'} {Math.abs(Number(energyDiff))}% vs mês anterior</p>}
          </Card>
        </div>
      )}

      <Card padding="p-4">
        <h3 className="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-emerald-500" /> Histórico de consumo
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={records} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="water" name="Água (m³)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="energy" name="Energia (kWh)" fill="#eab308" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card padding="p-4">
        <h3 className="text-sm font-bold text-stone-800 mb-3">Custo por mês</h3>
        <div className="space-y-2">
          {[...records].reverse().map((r) => (
            <div key={r.id} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
              <span className="text-sm text-stone-700 font-medium">{r.month}</span>
              <div className="flex gap-4 text-xs text-stone-500">
                <span className="text-blue-600 font-semibold">{fmt(r.waterCost)}</span>
                <span className="text-yellow-600 font-semibold">{fmt(r.energyCost)}</span>
                <span className="font-bold text-stone-800">{fmt(r.waterCost + r.energyCost)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
