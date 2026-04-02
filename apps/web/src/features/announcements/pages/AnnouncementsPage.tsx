import React, { useState } from 'react';
import { Plus, Bookmark } from 'lucide-react';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { Card, Badge, Modal, Button, Input, Textarea, Select } from '../../../components/ui';
import { fmtDate } from '../../../lib/utils';
import { AnnouncementPriority } from '@condovida/shared';
import { useAuthStore } from '../../../store/auth.store';
import { Role } from '@condovida/shared';

const priorityBar: Record<string, string> = {
  HIGH: 'bg-red-400',
  MEDIUM: 'bg-amber-400',
  LOW: 'bg-stone-200',
};

const priorityLabel: Record<string, string> = {
  HIGH: 'Alta',
  MEDIUM: 'Média',
  LOW: 'Baixa',
};

export function AnnouncementsPage() {
  const { announcements, isLoading, create, isCreating } = useAnnouncements();
  const user = useAuthStore((s) => s.user);
  const canCreate = user?.role === Role.SINDICO || user?.role === Role.COUNCIL;
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    body: '',
    priority: AnnouncementPriority.LOW,
    pinned: false,
  });

  const handleCreate = () => {
    if (!form.title || !form.body) return;
    create(form, {
      onSuccess: () => {
        setModal(false);
        setForm({ title: '', body: '', priority: AnnouncementPriority.LOW, pinned: false });
      },
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Comunicados</h1>
          <p className="text-sm text-stone-400">Avisos do condomínio</p>
        </div>
        {canCreate && (
          <Button variant="accent" size="sm" icon={Plus} onClick={() => setModal(true)}>
            Novo
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {isLoading && <div className="h-32 bg-stone-200 rounded-2xl animate-pulse" />}
        {announcements.map((a) => (
          <Card key={a.id} padding="px-4 py-4" className="flex items-start gap-3">
            <div className={`w-1 rounded-full self-stretch flex-shrink-0 ${priorityBar[a.priority] || 'bg-stone-200'}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-stone-900">{a.title}</p>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Badge variant={a.priority === 'HIGH' ? 'danger' : a.priority === 'MEDIUM' ? 'warning' : 'default'}>
                    {priorityLabel[a.priority]}
                  </Badge>
                  {a.pinned && <Bookmark size={14} className="text-orange-400" />}
                </div>
              </div>
              <p className="text-sm text-stone-600 mt-1">{a.body}</p>
              <p className="text-xs text-stone-400 mt-2">
                {a.author} · {fmtDate(a.createdAt)}
              </p>
            </div>
          </Card>
        ))}
        {!isLoading && announcements.length === 0 && (
          <Card className="text-center py-8 text-stone-400">Nenhum comunicado</Card>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Novo Comunicado">
        <Input
          label="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Título do comunicado"
          required
        />
        <Textarea
          label="Conteúdo"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          placeholder="Detalhes do comunicado..."
          rows={4}
          required
        />
        <Select
          label="Prioridade"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value as AnnouncementPriority })}
          options={[
            { value: AnnouncementPriority.LOW, label: 'Baixa' },
            { value: AnnouncementPriority.MEDIUM, label: 'Média' },
            { value: AnnouncementPriority.HIGH, label: 'Alta' },
          ]}
        />
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={form.pinned}
            onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm text-stone-700">Fixar comunicado</span>
        </label>
        <Button variant="accent" full onClick={handleCreate} loading={isCreating}>
          Publicar
        </Button>
      </Modal>
    </div>
  );
}
