import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Truck, Plus, X, ArrowUp, ArrowDown } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import { Card, Badge, Modal, Button, Input } from '../../../components/ui';
import { Moving } from '@condovida/shared';
import { fmtDate } from '../../../lib/utils';

const statusVariant: Record<string, 'success' | 'warning' | 'default'> = { CONFIRMED: 'success', PENDING: 'warning', CANCELLED: 'default' };
const statusLabel: Record<string, string> = { CONFIRMED: 'Confirmada', PENDING: 'Pendente', CANCELLED: 'Cancelada' };

export function MovingPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ type: 'IN' as 'IN' | 'OUT', date: '', startTime: '', endTime: '', elevator: true, notes: '' });

  const { data: movings = [], isLoading } = useQuery<Moving[]>({
    queryKey: ['movings'],
    queryFn: async () => (await apiClient.get<{ data: Moving[] }>('/moving')).data.data,
  });

  const create = useMutation({
    mutationFn: (data: typeof form) => apiClient.post('/moving', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['movings'] }); setModal(false); setForm({ type: 'IN', date: '', startTime: '', endTime: '', elevator: true, notes: '' }); },
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/moving/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['movings'] }),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-stone-900">Mudanças</h1><p className="text-sm text-stone-400">Agendamento de entrada e saída</p></div>
        <Button variant="accent" size="sm" icon={Plus} onClick={() => setModal(true)}>Agendar</Button>
      </div>

      {isLoading && <div className="h-32 bg-stone-200 rounded-2xl animate-pulse" />}
      {!isLoading && movings.length === 0 && <Card className="text-center py-8 text-stone-400">Nenhuma mudança agendada</Card>}

      <div className="space-y-3">
        {movings.map((mv) => (
          <Card key={mv.id} padding="p-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${mv.type === 'IN' ? 'bg-emerald-50' : 'bg-orange-50'}`}>
                {mv.type === 'IN' ? <ArrowDown size={18} className="text-emerald-600" /> : <ArrowUp size={18} className="text-orange-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-stone-900">{mv.type === 'IN' ? 'Entrada' : 'Saída'} — Ap. {mv.unit}-{mv.block}</p>
                  <button onClick={() => remove.mutate(mv.id)} className="p-1 rounded hover:bg-red-50 text-stone-300 hover:text-red-500"><X size={14} /></button>
                </div>
                <p className="text-xs text-stone-500">{fmtDate(mv.date)} · {mv.startTime}–{mv.endTime}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={statusVariant[mv.status]}>{statusLabel[mv.status]}</Badge>
                  {mv.elevator && <Badge variant="default">Elevador</Badge>}
                </div>
                {mv.notes && <p className="text-xs text-stone-400 mt-1">{mv.notes}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Agendar Mudança">
        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Tipo</label>
          <div className="flex rounded-xl overflow-hidden border border-stone-200">
            {(['IN', 'OUT'] as const).map((t) => (
              <button key={t} onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${form.type === t ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-500'}`}>
                {t === 'IN' ? '↓ Entrada' : '↑ Saída'}
              </button>
            ))}
          </div>
        </div>
        <Input label="Data" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Início" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
          <Input label="Fim" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
        </div>
        <div className="flex items-center justify-between bg-stone-50 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-stone-700 font-medium">Reservar elevador</p>
          <button onClick={() => setForm({ ...form, elevator: !form.elevator })}
            className={`w-11 h-6 rounded-full transition-colors relative ${form.elevator ? 'bg-stone-900' : 'bg-stone-200'}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.elevator ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <Input label="Observações" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Informações adicionais..." />
        <Button variant="accent" full icon={Truck} onClick={() => create.mutate(form)} loading={create.isPending}>Agendar Mudança</Button>
      </Modal>
    </div>
  );
}
