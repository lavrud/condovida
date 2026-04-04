import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { usePolls } from '../hooks/usePolls';
import { Card, Badge, Modal, Button, Input } from '../../../components/ui';
import { fmtDate } from '../../../lib/utils';
import { useAuthStore } from '../../../store/auth.store';
import { Role } from '@condovida/shared';

export function PollsPage() {
  const { polls, isLoading, vote, create, isCreating } = usePolls();
  const user = useAuthStore((s) => s.user);
  const canCreate = user?.role === Role.SINDICO || user?.role === Role.COUNCIL;
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ question: '', options: ['', ''], deadline: '' });

  const addOption = () => setForm((f) => ({ ...f, options: [...f.options, ''] }));
  const updateOption = (i: number, v: string) =>
    setForm((f) => ({ ...f, options: f.options.map((o, idx) => (idx === i ? v : o)) }));

  const handleCreate = () => {
    const opts = form.options.filter((o) => o.trim());
    if (!form.question || opts.length < 2 || !form.deadline) return;
    create(
      { question: form.question, options: opts, deadline: form.deadline },
      {
        onSuccess: () => {
          setModal(false);
          setForm({ question: '', options: ['', ''], deadline: '' });
        },
      },
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Enquetes</h1>
          <p className="text-sm text-stone-400">Vote nas questões do condomínio</p>
        </div>
        {canCreate && (
          <Button variant="accent" size="sm" icon={Plus} onClick={() => setModal(true)}>
            Nova
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {isLoading && <div className="h-40 bg-stone-200 rounded-2xl animate-pulse" />}
        {polls.map((poll) => {
          const total = poll.options.reduce((s, o) => s + o.votes, 0);
          return (
            <Card key={poll.id}>
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-bold text-stone-900">{poll.question}</p>
                {poll.userVoted && <Badge variant="success">Votou</Badge>}
              </div>
              <div className="space-y-2">
                {poll.options.map((o) => {
                  const pct = total > 0 ? Math.round((o.votes / total) * 100) : 0;
                  return (
                    <button
                      key={o.id}
                      disabled={poll.userVoted || false}
                      onClick={() => !poll.userVoted && vote({ pollId: poll.id, optionId: o.id })}
                      className="w-full text-left"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 hover:bg-stone-100 disabled:cursor-default transition-colors relative overflow-hidden">
                        {poll.userVoted && (
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-orange-50 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        )}
                        <div className="relative z-10 w-4 h-4 rounded-full border-2 border-stone-300 flex-shrink-0 flex items-center justify-center">
                          {poll.userVoted && o.votes > 0 && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                        </div>
                        <span className="relative z-10 text-sm text-stone-700 flex-1">{o.text}</span>
                        {poll.userVoted && (
                          <span className="relative z-10 text-xs font-semibold text-stone-500">{pct}%</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-stone-400 mt-3">
                {total}/{poll.totalEligible} votos · Até {fmtDate(poll.deadline)}
              </p>
            </Card>
          );
        })}
        {!isLoading && polls.length === 0 && (
          <Card className="text-center py-8 text-stone-400">Nenhuma enquete ativa</Card>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Nova Enquete">
        <Input
          label="Pergunta"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          placeholder="Qual sua opinião sobre...?"
          required
        />
        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">
            Opções <span className="text-orange-500">*</span>
          </label>
          {form.options.map((opt, i) => (
            <input
              key={i}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`Opção ${i + 1}`}
              className="w-full rounded-xl px-4 py-2.5 text-sm bg-stone-50 border-2 border-transparent text-stone-900 focus:border-stone-300 focus:bg-white transition-all outline-none mb-2"
            />
          ))}
          <button
            type="button"
            onClick={addOption}
            className="text-xs text-stone-400 hover:text-stone-600 font-semibold"
          >
            + Adicionar opção
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">
            Prazo <span className="text-orange-500">*</span>
          </label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="w-full rounded-xl px-4 py-3 text-sm bg-stone-50 border-2 border-transparent focus:border-stone-300 focus:bg-white transition-all outline-none"
          />
        </div>
        <Button variant="accent" full icon={Check} onClick={handleCreate} loading={isCreating}>
          Publicar Enquete
        </Button>
      </Modal>
    </div>
  );
}
