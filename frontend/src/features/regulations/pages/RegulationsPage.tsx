import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import { Card } from '../../../components/ui';
import { RegulationChapter } from '@condovida/shared';

export function RegulationsPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['1']));

  const { data: chapters = [], isLoading } = useQuery<RegulationChapter[]>({
    queryKey: ['regulations'],
    queryFn: async () => (await apiClient.get<{ data: RegulationChapter[] }>('/regulations')).data.data,
  });

  const toggle = (id: string) => setExpanded((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const filtered = search.trim()
    ? chapters.map((ch) => ({ ...ch, articles: ch.articles.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase())) })).filter((ch) => ch.articles.length > 0)
    : chapters;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Regulamento</h1>
        <p className="text-sm text-stone-400">Normas de convivência do condomínio</p>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar no regulamento..." className="w-full pl-9 pr-4 py-2.5 text-sm bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400" />
      </div>

      {isLoading && <div className="h-48 bg-stone-200 rounded-2xl animate-pulse" />}
      {!isLoading && filtered.length === 0 && <Card className="text-center py-8 text-stone-400">Nenhum resultado encontrado</Card>}

      <div className="space-y-2">
        {filtered.map((ch) => (
          <Card key={ch.id} padding="p-0" className="overflow-hidden">
            <button onClick={() => toggle(ch.id)} className="w-full flex items-center gap-3 px-4 py-4 hover:bg-stone-50 transition-colors">
              <div className="w-8 h-8 bg-stone-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen size={14} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-stone-900">Capítulo {ch.number}</p>
                <p className="text-xs text-stone-500">{ch.title}</p>
              </div>
              {expanded.has(ch.id) ? <ChevronDown size={16} className="text-stone-400" /> : <ChevronRight size={16} className="text-stone-400" />}
            </button>
            {expanded.has(ch.id) && (
              <div className="border-t border-stone-100">
                {ch.articles.map((art, idx) => (
                  <div key={art.id} className={`px-4 py-4 ${idx < ch.articles.length - 1 ? 'border-b border-stone-50' : ''}`}>
                    <p className="text-xs font-bold text-stone-700 mb-1">Art. {art.number} — {art.title}</p>
                    <p className="text-xs text-stone-500 leading-relaxed">{art.content}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
