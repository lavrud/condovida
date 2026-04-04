import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search as SearchIcon, Plus, CheckCircle, Package } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import { Card, Badge, Modal, Button, Input } from '../../../components/ui';
import { LostItem } from '@condovida/shared';
import { fmtDate } from '../../../lib/utils';

export function LostFoundPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', foundAt: '' });
  const [filter, setFilter] = useState<'ALL' | 'AVAILABLE' | 'CLAIMED'>('ALL');

  const { data: items = [], isLoading } = useQuery<LostItem[]>({
    queryKey: ['lost-found'],
    queryFn: async () => (await apiClient.get<{ data: LostItem[] }>('/lost-found')).data.data,
  });

  const create = useMutation({
    mutationFn: (data: typeof form) => apiClient.post('/lost-found', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['lost-found'] }); setModal(false); setForm({ title: '', description: '', foundAt: '' }); },
  });

  const claim = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/lost-found/${id}/claim`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lost-found'] }),
  });

  const filtered = items.filter((i) => filter === 'ALL' || i.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-stone-900">Achados e Perdidos</h1><p className="text-sm text-stone-400">Objetos encontrados no condomínio</p></div>
        <Button variant="accent" size="sm" icon={Plus} onClick={() => setModal(true)}>Registrar</Button>
      </div>

      <div className="flex gap-2">
        {(['ALL', 'AVAILABLE', 'CLAIMED'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${filter === f ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500'}`}>
            {f === 'ALL' ? 'Todos' : f === 'AVAILABLE' ? 'Disponível' : 'Entregue'}
          </button>
        ))}
      </div>

      {isLoading && <div className="h-32 bg-stone-200 rounded-2xl animate-pulse" />}
      {!isLoading && filtered.length === 0 && <Card className="text-center py-8 text-stone-400">Nenhum item encontrado</Card>}

      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.id} padding="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0"><Package size={18} className="text-amber-600" /></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-stone-900">{item.title}</p>
                  <Badge variant={item.status === 'AVAILABLE' ? 'warning' : 'default'}>{item.status === 'AVAILABLE' ? 'Disponível' : 'Entregue'}</Badge>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{item.description}</p>
                <p className="text-xs text-stone-400 mt-1">Encontrado em: <strong>{item.foundAt}</strong> · {fmtDate(item.createdAt)}</p>
                <p className="text-xs text-stone-400">Por: {item.foundBy} {item.foundByUnit !== 'Portaria' ? `· Ap. ${item.foundByUnit}` : ''}</p>
                {item.status === 'AVAILABLE' && (
                  <button onClick={() => claim.mutate(item.id)} className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                    <CheckCircle size={13} /> É meu, quero retirar
                  </button>
                )}
                {item.status === 'CLAIMED' && item.claimedBy && (
                  <p className="text-xs text-emerald-600 mt-1 font-medium">✓ Retirado por {item.claimedBy}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Registrar Item Encontrado">
        <Input label="O que foi encontrado?" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Chave com chaveiro azul" required />
        <Input label="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detalhes do objeto..." />
        <Input label="Onde foi encontrado?" value={form.foundAt} onChange={(e) => setForm({ ...form, foundAt: e.target.value })} placeholder="Ex: Elevador social, piscina..." required />
        <Button variant="accent" full icon={SearchIcon} onClick={() => create.mutate(form)} loading={create.isPending}>Registrar Item</Button>
      </Modal>
    </div>
  );
}
