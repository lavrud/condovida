import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Download, Trash2, Plus, Search } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import { Card, Badge, Modal, Button, Input } from '../../../components/ui';
import { CondoDocument, DocumentCategory } from '@condovida/shared';
import { fmtDate } from '../../../lib/utils';
import { useAuthStore } from '../../../store/auth.store';
import { Role } from '@condovida/shared';

const categoryColor: Record<DocumentCategory, string> = {
  ATA: 'bg-blue-100 text-blue-700', REGULAMENTO: 'bg-purple-100 text-purple-700',
  FINANCEIRO: 'bg-emerald-100 text-emerald-700', OBRA: 'bg-orange-100 text-orange-700',
  CONTRATO: 'bg-rose-100 text-rose-700', OUTROS: 'bg-stone-100 text-stone-600',
};

const categories: DocumentCategory[] = ['ATA', 'REGULAMENTO', 'FINANCEIRO', 'OBRA', 'CONTRATO', 'OUTROS'];

export function DocumentsPage() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isSindico = user?.role === Role.SINDICO;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<DocumentCategory | 'ALL'>('ALL');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'ATA' as DocumentCategory, fileSize: '—' });

  const { data: docs = [], isLoading } = useQuery<CondoDocument[]>({
    queryKey: ['documents'],
    queryFn: async () => (await apiClient.get<{ data: CondoDocument[] }>('/documents')).data.data,
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/documents/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
  });

  const create = useMutation({
    mutationFn: (data: typeof form) => apiClient.post('/documents', { ...data, fileUrl: '#' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['documents'] }); setModal(false); setForm({ title: '', category: 'ATA', fileSize: '—' }); },
  });

  const filtered = docs.filter((d) =>
    (filter === 'ALL' || d.category === filter) &&
    d.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-stone-900">Documentos</h1><p className="text-sm text-stone-400">Atas, contratos e regulamentos</p></div>
        {isSindico && <Button variant="accent" size="sm" icon={Plus} onClick={() => setModal(true)}>Enviar</Button>}
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar documentos..." className="w-full pl-9 pr-4 py-2.5 text-sm bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400" />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {(['ALL', ...categories] as const).map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === c ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500'}`}>
            {c === 'ALL' ? 'Todos' : c}
          </button>
        ))}
      </div>

      {isLoading && <div className="h-32 bg-stone-200 rounded-2xl animate-pulse" />}

      <div className="space-y-2">
        {filtered.length === 0 && <Card className="text-center py-8 text-stone-400">Nenhum documento encontrado</Card>}
        {filtered.map((d) => (
          <Card key={d.id} padding="px-4 py-3" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0"><FileText size={16} className="text-stone-500" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-800 truncate">{d.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${categoryColor[d.category]}`}>{d.category}</span>
                <span className="text-xs text-stone-400">{d.fileSize} · {fmtDate(d.createdAt)}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <a href={d.fileUrl} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors"><Download size={15} /></a>
              {isSindico && <button onClick={() => remove.mutate(d.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Enviar Documento">
        <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nome do documento" required />
        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Categoria</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as DocumentCategory })} className="w-full rounded-xl px-4 py-3 text-base bg-stone-50 border-2 border-transparent focus:border-stone-300 outline-none">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Button variant="accent" full icon={FileText} onClick={() => create.mutate(form)} loading={create.isPending}>Salvar Documento</Button>
      </Modal>
    </div>
  );
}
