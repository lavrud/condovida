import React, { useState } from 'react';
import { Calendar, Info, Check, X, DollarSign, Flame, PartyPopper, CircleDot, Waves, Dumbbell, Coffee, LucideIcon } from 'lucide-react';
import { useReservations } from '../hooks/useReservations';
import { Card, Badge, Modal, Button, Select } from '../../../components/ui';
import { fmt, fmtDate } from '../../../lib/utils';
import { cx } from '../../../lib/utils';
import { ReservationStatus } from '@condovida/shared';

const iconMap: Record<string, LucideIcon> = {
  Flame, PartyPopper, CircleDot, Waves, Dumbbell, Coffee, Calendar,
};

const statusVariant: Record<ReservationStatus, 'success' | 'warning' | 'danger'> = {
  [ReservationStatus.CONFIRMED]: 'success',
  [ReservationStatus.PENDING]: 'warning',
  [ReservationStatus.CANCELLED]: 'danger',
  [ReservationStatus.REJECTED]: 'danger',
};

const statusLabel: Record<ReservationStatus, string> = {
  [ReservationStatus.CONFIRMED]: 'Confirmada',
  [ReservationStatus.PENDING]: 'Aguardando',
  [ReservationStatus.CANCELLED]: 'Cancelada',
  [ReservationStatus.REJECTED]: 'Recusada',
};

export function ReservationsPage() {
  const { areas, timeSlots, reservations, create, cancel, isCreating } = useReservations();
  const [modal, setModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState<(typeof areas)[0] | null>(null);
  const [form, setForm] = useState<{ date: string; timeSlot: string }>({ date: '', timeSlot: timeSlots[0] });

  const handleCreate = () => {
    if (!selectedArea || !form.date) return;
    create(
      { areaId: selectedArea.id, date: form.date, timeSlot: form.timeSlot },
      {
        onSuccess: () => {
          setModal(false);
          setSelectedArea(null);
          setForm({ date: '', timeSlot: timeSlots[0] });
        },
      },
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Reservas</h1>
        <p className="text-sm text-stone-400">Áreas comuns do condomínio</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {areas.map((area) => {
          const AreaIcon = iconMap[area.iconName] || Calendar;
          return (
            <Card
              key={area.id}
              onClick={() => { setSelectedArea(area as typeof areas[0]); setModal(true); }}
              padding="p-4"
              className="group"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-50 group-hover:bg-orange-50 flex items-center justify-center mb-3 transition-colors">
                <AreaIcon size={20} className="text-stone-400 group-hover:text-orange-500 transition-colors" />
              </div>
              <p className="text-sm font-semibold text-stone-800">{area.name}</p>
              <p className="text-xs text-stone-400 mt-0.5">Até {area.capacity} pessoas</p>
              {area.ratePerUse > 0 && (
                <p className="text-xs font-semibold text-orange-600 mt-1">{fmt(area.ratePerUse)}</p>
              )}
            </Card>
          );
        })}
      </div>

      {reservations.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
            Minhas reservas
          </h2>
          <div className="space-y-2">
            {reservations.map((r) => {
              const area = areas.find((a) => a.id === r.areaId);
              const AreaIcon = area ? (iconMap[area.iconName] || Calendar) : Calendar;
              return (
                <Card key={r.id} padding="px-4 py-3" className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-50 flex items-center justify-center flex-shrink-0">
                    <AreaIcon size={16} className="text-stone-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-stone-800">{area?.name || r.areaId}</p>
                    <p className="text-xs text-stone-400">
                      {fmtDate(r.date as string)} · {r.timeSlot}
                    </p>
                  </div>
                  <Badge variant={statusVariant[r.status as ReservationStatus]}>
                    {statusLabel[r.status as ReservationStatus]}
                  </Badge>
                  {r.status !== ReservationStatus.CANCELLED && (
                    <button
                      onClick={() => cancel(r.id)}
                      className="p-1 rounded hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <Modal
        isOpen={modal}
        onClose={() => { setModal(false); setSelectedArea(null); }}
        title={`Reservar — ${selectedArea?.name || ''}`}
      >
        {selectedArea && (
          <div>
            <div className="bg-stone-50 rounded-xl p-3 mb-4 text-xs text-stone-500 flex items-start gap-2">
              <Info size={14} className="text-stone-400 mt-0.5 flex-shrink-0" />
              <span>{selectedArea.rules}</span>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">
                Data <span className="text-orange-500">*</span>
              </label>
              <input
                type="date"
                value={form.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm bg-stone-50 border-2 border-transparent text-stone-900 focus:border-stone-300 focus:bg-white transition-all outline-none"
              />
            </div>

            <Select
              label="Horário"
              value={form.timeSlot}
              onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
              options={timeSlots.map((t) => ({ value: t, label: t }))}
            />

            {selectedArea.ratePerUse > 0 && (
              <div className="bg-amber-50 rounded-xl p-3 mb-4 text-xs text-amber-700 flex items-center gap-2">
                <DollarSign size={14} />
                Taxa: <strong>{fmt(selectedArea.ratePerUse)}</strong>
              </div>
            )}

            <Button variant="accent" full icon={Check} onClick={handleCreate} loading={isCreating}>
              Confirmar Reserva
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
