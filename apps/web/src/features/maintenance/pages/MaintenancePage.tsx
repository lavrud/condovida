import React, { useState } from 'react';
import { Plus, Wrench, Check } from 'lucide-react';
import { useMaintenance } from '../hooks/useMaintenance';
import { Card, Badge, Modal, Button, Input, Select } from '../../../components/ui';
import { fmtDate } from '../../../lib/utils';
import { MaintenanceFrequency, MaintenanceStatus } from '@condovida/shared';
import { MAINTENANCE_FREQUENCIES } from '@condovida/shared';
import { useAuthStore } from '../../../store/auth.store';
import { Role } from '@condovida/shared';

const statusVariant: Record<MaintenanceStatus, 'success' | 'warning' | 'danger'> = {
  [MaintenanceStatus.SCHEDULED]: 'warning',
  [MaintenanceStatus.IN_PROGRESS]: 'warning',
  [MaintenanceStatus.DONE]: 'success',
  [MaintenanceStatus.OVERDUE]: 'danger',
};

const statusLabel: Record<MaintenanceStatus, string> = {
  [MaintenanceStatus.SCHEDULED]: 'Agendada',
  [MaintenanceStatus.IN_PROGRESS]: 'Em andamento',
  [MaintenanceStatus.DONE]: 'Concluída',
  [MaintenanceStatus.OVERDUE]: 'Atrasada',
};

export function MaintenancePage() {
  const { tasks, isLoading, create, markDone, isCreating } = useMaintenance();
  const user = useAuthStore((s) => s.user);
  const canManage = user?.role === Role.SINDICO || user?.role === Role.COUNCIL;
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    frequency: MaintenanceFrequency.MONTHLY,
    nextDate: '',
    provider: '',
  });

  const handleCreate = () => {
    if (!form.title || !form.nextDate || !form.provider) return;
    create(form, {
      onSuccess: () => {
        setModal(false);
        setForm({ title: '', frequency: MaintenanceFrequency.MONTHLY, nextDate: '', provider: '' });
      },
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Manutenção</h1>
          <p className="text-sm text-stone-400">Tarefas preventivas agendadas</p>
        </div>
        {canManage && (
          <Button variant="accent" size="sm" icon={Plus} onClick={() => setModal(true)}>
            Nova
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {isLoading && <div className="h-32 bg-stone-200 rounded-2xl animate-pulse" />}
        {tasks.map((task) => (
          <Card key={task.id} padding="px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center flex-shrink-0">
                <Wrench size={18} className="text-stone-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-stone-900">{task.title}</p>
                  <Badge variant={statusVariant[task.status as MaintenanceStatus]}>
                    {statusLabel[task.status as MaintenanceStatus] || task.status}
                  </Badge>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  {task.provider} · {task.frequency}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Próxima: <strong className="text-stone-700">{fmtDate(task.nextDate)}</strong>
                  {task.lastDate && ` · Última: ${fmtDate(task.lastDate)}`}
                </p>
              </div>
            </div>
            {canManage && task.status !== MaintenanceStatus.DONE && (
              <button
                onClick={() => markDone(task.id)}
                className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 py-2 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <Check size={13} /> Marcar como concluída
              </button>
            )}
          </Card>
        ))}
        {!isLoading && tasks.length === 0 && (
          <Card className="text-center py-8 text-stone-400">Nenhuma tarefa agendada</Card>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Nova Tarefa de Manutenção">
        <Input
          label="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Ex: Revisão elevadores"
          required
        />
        <Select
          label="Frequência"
          value={form.frequency}
          onChange={(e) => setForm({ ...form, frequency: e.target.value as MaintenanceFrequency })}
          options={MAINTENANCE_FREQUENCIES.map((f) => ({ value: f.value, label: f.label }))}
        />
        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">
            Próxima data <span className="text-orange-500">*</span>
          </label>
          <input
            type="date"
            value={form.nextDate}
            onChange={(e) => setForm({ ...form, nextDate: e.target.value })}
            className="w-full rounded-xl px-4 py-3 text-sm bg-stone-50 border-2 border-transparent focus:border-stone-300 focus:bg-white transition-all outline-none"
          />
        </div>
        <Input
          label="Prestador responsável"
          value={form.provider}
          onChange={(e) => setForm({ ...form, provider: e.target.value })}
          placeholder="Ex: ThyssenKrupp"
          required
        />
        <Button variant="accent" full onClick={handleCreate} loading={isCreating}>
          Criar Tarefa
        </Button>
      </Modal>
    </div>
  );
}
