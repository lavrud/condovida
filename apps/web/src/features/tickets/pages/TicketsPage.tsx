import React, { useState } from 'react';
import { Plus, MessageSquare, ChevronRight } from 'lucide-react';
import { useTickets } from '../hooks/useTickets';
import { Card, Badge, Modal, Button, TabPills, Textarea } from '../../../components/ui';
import { Input, Select } from '../../../components/ui';
import { fmtDate } from '../../../lib/utils';
import { TicketCategory, TicketStatus } from '@condovida/shared';
import { TICKET_CATEGORIES } from '@condovida/shared';

const statusVariant: Record<string, 'default' | 'warning' | 'info' | 'success' | 'danger'> = {
  [TicketStatus.OPEN]: 'warning',
  [TicketStatus.IN_PROGRESS]: 'info',
  [TicketStatus.RESOLVED]: 'success',
  [TicketStatus.CLOSED]: 'default',
};

const statusLabel: Record<string, string> = {
  [TicketStatus.OPEN]: 'Aberto',
  [TicketStatus.IN_PROGRESS]: 'Em andamento',
  [TicketStatus.RESOLVED]: 'Resolvido',
  [TicketStatus.CLOSED]: 'Fechado',
};

const tabs = [
  { id: 'all', label: 'Todos' },
  { id: TicketStatus.OPEN, label: 'Abertos' },
  { id: TicketStatus.IN_PROGRESS, label: 'Em andamento' },
  { id: TicketStatus.RESOLVED, label: 'Resolvidos' },
];

export function TicketsPage() {
  const { tickets, isLoading, create, isCreating } = useTickets();
  const [modal, setModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<(typeof tickets)[0] | null>(null);
  const [tab, setTab] = useState('all');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: TicketCategory.MAINTENANCE,
  });

  const filtered = tab === 'all' ? tickets : tickets.filter((t) => t.status === tab);

  const handleCreate = () => {
    if (!form.title || !form.description) return;
    create(
      { title: form.title, description: form.description, category: form.category },
      {
        onSuccess: () => {
          setModal(false);
          setForm({ title: '', description: '', category: TicketCategory.MAINTENANCE });
        },
      },
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Chamados</h1>
          <p className="text-sm text-stone-400">Manutenção e reclamações</p>
        </div>
        <Button variant="accent" size="sm" icon={Plus} onClick={() => setModal(true)}>
          Novo
        </Button>
      </div>

      <TabPills tabs={tabs} active={tab} onChange={setTab} />

      <div className="space-y-2">
        {isLoading && <div className="h-32 bg-stone-200 rounded-2xl animate-pulse" />}
        {!isLoading && filtered.length === 0 && (
          <Card className="text-center py-8 text-stone-400">Nenhum chamado encontrado</Card>
        )}
        {filtered.map((ticket) => (
          <Card
            key={ticket.id}
            padding="px-4 py-3"
            className="flex items-center gap-3"
            onClick={() => setSelectedTicket(ticket)}
          >
            <div className="w-9 h-9 rounded-full bg-stone-50 flex items-center justify-center flex-shrink-0">
              <MessageSquare size={16} className="text-stone-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-800 leading-snug truncate">
                {ticket.title}
              </p>
              <p className="text-xs text-stone-400">
                {TICKET_CATEGORIES[ticket.category as TicketCategory]} · {fmtDate(ticket.createdAt)}
              </p>
            </div>
            <Badge variant={statusVariant[ticket.status] || 'default'}>
              {statusLabel[ticket.status] || ticket.status}
            </Badge>
            <ChevronRight size={16} className="text-stone-300 flex-shrink-0" />
          </Card>
        ))}
      </div>

      {/* Create modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Novo Chamado">
        <Select
          label="Categoria"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as TicketCategory })}
          options={Object.entries(TICKET_CATEGORIES).map(([v, l]) => ({ value: v, label: l }))}
          required
        />
        <Input
          label="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Descreva o problema brevemente"
          required
        />
        <Textarea
          label="Descrição"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Detalhes do chamado..."
          rows={4}
          required
        />
        <Button variant="accent" full onClick={handleCreate} loading={isCreating}>
          Abrir Chamado
        </Button>
      </Modal>

      {/* Detail modal */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={selectedTicket.title}
        >
          <div className="space-y-3">
            <div className="flex gap-2">
              <Badge variant={statusVariant[selectedTicket.status] || 'default'}>
                {statusLabel[selectedTicket.status]}
              </Badge>
              <Badge>{TICKET_CATEGORIES[selectedTicket.category as TicketCategory]}</Badge>
            </div>
            <p className="text-sm text-stone-600">{selectedTicket.description}</p>
            <div className="border-t border-stone-100 pt-3">
              <p className="text-xs font-semibold text-stone-500 mb-2">Respostas ({selectedTicket.responses?.length || 0})</p>
              {selectedTicket.responses?.map((r) => (
                <div
                  key={r.id}
                  className={`rounded-xl px-3 py-2 mb-2 text-sm ${r.isAdmin ? 'bg-orange-50 text-orange-900' : 'bg-stone-50 text-stone-700'}`}
                >
                  <p className="font-semibold text-xs mb-0.5">{r.authorName || 'Admin'}</p>
                  {r.text}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
