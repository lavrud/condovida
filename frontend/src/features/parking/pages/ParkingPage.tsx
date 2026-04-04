import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Car, Plus, X, ParkingSquare } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import { Card, Badge, Modal, Button, TabPills, Input } from '../../../components/ui';
import { ParkingSpot, ParkingReservation } from '@condovida/shared';

const tabs = [{ id: 'spots', label: 'Vagas' }, { id: 'reservations', label: 'Reservas' }];

const statusLabel: Record<string, string> = { AVAILABLE: 'Livre', OCCUPIED: 'Ocupada', RESERVED: 'Reservada' };
const statusVariant: Record<string, 'success' | 'warning' | 'default'> = { AVAILABLE: 'success', OCCUPIED: 'default', RESERVED: 'warning' };
const typeLabel: Record<string, string> = { RESIDENT: 'Morador', VISITOR: 'Visitante', DISABLED: 'PCD' };

export function ParkingPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState('spots');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ spotId: '', date: '', startTime: '', endTime: '' });

  const { data: spots = [] } = useQuery<ParkingSpot[]>({ queryKey: ['parking-spots'], queryFn: async () => (await apiClient.get<{ data: ParkingSpot[] }>('/parking/spots')).data.data });
  const { data: reservations = [] } = useQuery<ParkingReservation[]>({ queryKey: ['parking-reservations'], queryFn: async () => (await apiClient.get<{ data: ParkingReservation[] }>('/parking/reservations')).data.data });

  const reserve = useMutation({
    mutationFn: (data: typeof form) => apiClient.post('/parking/reservations', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['parking-spots'] }); qc.invalidateQueries({ queryKey: ['parking-reservations'] }); setModal(false); setForm({ spotId: '', date: '', startTime: '', endTime: '' }); },
  });

  const cancel = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/parking/reservations/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['parking-spots'] }); qc.invalidateQueries({ queryKey: ['parking-reservations'] }); },
  });

  const availableSpots = spots.filter((s) => s.status === 'AVAILABLE' && s.type === 'VISITOR');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-stone-900">Vagas</h1><p className="text-sm text-stone-400">Garagem e estacionamento</p></div>
        <Button variant="accent" size="sm" icon={Plus} onClick={() => setModal(true)}>Reservar</Button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[['Livres', spots.filter(s => s.status === 'AVAILABLE').length, 'text-emerald-600'],
          ['Ocupadas', spots.filter(s => s.status === 'OCCUPIED').length, 'text-stone-600'],
          ['Reservadas', spots.filter(s => s.status === 'RESERVED').length, 'text-orange-500']].map(([label, val, color]) => (
          <Card key={label as string} padding="py-3 px-2">
            <p className={`text-2xl font-black ${color}`}>{val}</p>
            <p className="text-xs text-stone-400">{label}</p>
          </Card>
        ))}
      </div>

      <TabPills tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'spots' && (
        <div className="space-y-2">
          {spots.map((s) => (
            <Card key={s.id} padding="px-4 py-3" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0"><Car size={16} className="text-stone-500" /></div>
              <div className="flex-1">
                <p className="text-sm font-bold text-stone-900">Vaga {s.number} — Bloco {s.block}</p>
                <p className="text-xs text-stone-400">{typeLabel[s.type]}{s.ownerUnit ? ` · Ap. ${s.ownerUnit}-${s.ownerBlock}` : ''}</p>
              </div>
              <Badge variant={statusVariant[s.status]}>{statusLabel[s.status]}</Badge>
            </Card>
          ))}
        </div>
      )}

      {tab === 'reservations' && (
        <div className="space-y-2">
          {reservations.length === 0 && <Card className="text-center py-8 text-stone-400">Nenhuma reserva ativa</Card>}
          {reservations.map((r) => (
            <Card key={r.id} padding="px-4 py-3" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0"><ParkingSquare size={16} className="text-orange-500" /></div>
              <div className="flex-1">
                <p className="text-sm font-bold text-stone-900">Vaga {r.spotNumber}</p>
                <p className="text-xs text-stone-400">{r.date} · {r.startTime}–{r.endTime}</p>
              </div>
              <button onClick={() => cancel.mutate(r.id)} className="p-1 rounded hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors"><X size={14} /></button>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Reservar Vaga de Visitante">
        <div className="space-y-1 mb-4">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Vaga</label>
          <select value={form.spotId} onChange={(e) => setForm({ ...form, spotId: e.target.value })} className="w-full rounded-xl px-4 py-3 text-base bg-stone-50 border-2 border-transparent focus:border-stone-300 outline-none">
            <option value="">Selecione...</option>
            {availableSpots.map((s) => <option key={s.id} value={s.id}>Vaga {s.number} — Bloco {s.block}</option>)}
          </select>
        </div>
        <Input label="Data" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Início" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
          <Input label="Fim" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
        </div>
        <Button variant="accent" full icon={Car} onClick={() => reserve.mutate(form)} loading={reserve.isPending}>Confirmar Reserva</Button>
      </Modal>
    </div>
  );
}
