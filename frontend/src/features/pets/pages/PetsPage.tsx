import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, X, AlertTriangle } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import { Card, Badge, Modal, Button, Input } from '../../../components/ui';
import { Pet } from '@condovida/shared';
import { fmtDate } from '../../../lib/utils';

const speciesEmoji: Record<string, string> = { DOG: '🐶', CAT: '🐱', OTHER: '🐾' };
const speciesLabel: Record<string, string> = { DOG: 'Cachorro', CAT: 'Gato', OTHER: 'Outro' };

export function PetsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', species: 'DOG' as Pet['species'], breed: '', vaccinated: false, vaccineExpiry: '' });

  const { data: pets = [], isLoading } = useQuery<Pet[]>({
    queryKey: ['pets'],
    queryFn: async () => (await apiClient.get<{ data: Pet[] }>('/pets')).data.data,
  });

  const create = useMutation({
    mutationFn: (data: typeof form) => apiClient.post('/pets', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pets'] }); setModal(false); setForm({ name: '', species: 'DOG', breed: '', vaccinated: false, vaccineExpiry: '' }); },
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/pets/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pets'] }),
  });

  const vaccineExpiring = pets.filter((p) => {
    if (!p.vaccineExpiry) return false;
    const diff = new Date(p.vaccineExpiry).getTime() - Date.now();
    return diff < 30 * 24 * 60 * 60 * 1000;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-stone-900">Pets</h1><p className="text-sm text-stone-400">Animais cadastrados no condomínio</p></div>
        <Button variant="accent" size="sm" icon={Plus} onClick={() => setModal(true)}>Cadastrar</Button>
      </div>

      {vaccineExpiring.length > 0 && (
        <Card padding="p-3" className="border border-amber-200 bg-amber-50">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700 font-semibold">{vaccineExpiring.length} pet(s) com vacina vencendo em 30 dias: {vaccineExpiring.map(p => p.name).join(', ')}</p>
          </div>
        </Card>
      )}

      {isLoading && <div className="h-32 bg-stone-200 rounded-2xl animate-pulse" />}
      {!isLoading && pets.length === 0 && <Card className="text-center py-8 text-stone-400">Nenhum pet cadastrado</Card>}

      <div className="space-y-3">
        {pets.map((pet) => (
          <Card key={pet.id} padding="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-2xl flex-shrink-0">{speciesEmoji[pet.species]}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-stone-900">{pet.name}</p>
                  <button onClick={() => remove.mutate(pet.id)} className="p-1 rounded hover:bg-red-50 text-stone-300 hover:text-red-500"><X size={14} /></button>
                </div>
                <p className="text-xs text-stone-500">{speciesLabel[pet.species]}{pet.breed ? ` · ${pet.breed}` : ''}</p>
                <p className="text-xs text-stone-400">Ap. {pet.ownerUnit}-{pet.ownerBlock} · {pet.ownerName}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant={pet.vaccinated ? 'success' : 'warning'}>{pet.vaccinated ? 'Vacinado' : 'Sem vacina'}</Badge>
                  {pet.vaccineExpiry && <span className="text-xs text-stone-400">Vence: {fmtDate(pet.vaccineExpiry)}</span>}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Cadastrar Pet">
        <Input label="Nome do pet" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Thor" required />
        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Espécie</label>
          <div className="flex gap-2">
            {(['DOG', 'CAT', 'OTHER'] as const).map((s) => (
              <button key={s} onClick={() => setForm({ ...form, species: s })}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${form.species === s ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 text-stone-500'}`}>
                {speciesEmoji[s]} {speciesLabel[s]}
              </button>
            ))}
          </div>
        </div>
        <Input label="Raça (opcional)" value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} placeholder="Ex: Golden Retriever" />
        <div className="flex items-center justify-between bg-stone-50 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-stone-700 font-medium">Vacinado</p>
          <button onClick={() => setForm({ ...form, vaccinated: !form.vaccinated })}
            className={`w-11 h-6 rounded-full transition-colors relative ${form.vaccinated ? 'bg-stone-900' : 'bg-stone-200'}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.vaccinated ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {form.vaccinated && <Input label="Vencimento da vacina" type="date" value={form.vaccineExpiry} onChange={(e) => setForm({ ...form, vaccineExpiry: e.target.value })} />}
        <Button variant="accent" full onClick={() => create.mutate(form)} loading={create.isPending}>Cadastrar Pet</Button>
      </Modal>
    </div>
  );
}
