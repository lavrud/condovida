import React, { useState } from 'react';
import { Vote, FileText } from 'lucide-react';
import { useVotes } from '../hooks/useVotes';
import { Card, Badge, Modal, IconContainer } from '../../../components/ui';
import { fmtDate } from '../../../lib/utils';
import { VoteSessionStatus } from '@condovida/shared';
import { useAuthStore } from '../../../store/auth.store';
import { Role } from '@condovida/shared';

export function VotesPage() {
  const { voteSessions, isLoading, vote, generateMinutes, isVoting } = useVotes();
  const user = useAuthStore((s) => s.user);
  const isSindico = user?.role === Role.SINDICO;
  const [minutesContent, setMinutesContent] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Votações</h1>
        <p className="text-sm text-stone-400">Assembleias e decisões oficiais</p>
      </div>

      <div className="space-y-4">
        {isLoading && <div className="h-40 bg-stone-200 rounded-2xl animate-pulse" />}
        {voteSessions.map((session) => {
          const total = session.options.reduce((s, o) => s + o.votes, 0);
          const isOpen = session.status === VoteSessionStatus.OPEN;
          return (
            <Card key={session.id} className={isOpen ? 'border-2 border-orange-100' : ''}>
              <div className="flex items-center gap-2 mb-3">
                <IconContainer icon={Vote} size={28} iconSize={14} color="bg-orange-50 text-orange-600" />
                <Badge variant={isOpen ? 'accent' : 'default'}>
                  {isOpen ? 'Aberta' : 'Encerrada'}
                </Badge>
                {session.userVoted && <Badge variant="success">Votou</Badge>}
              </div>

              <p className="text-sm font-bold text-stone-900 mb-1">{session.title}</p>
              <p className="text-xs text-stone-500 mb-3">{session.description}</p>

              <div className="space-y-2 mb-3">
                {session.options.map((o) => {
                  const pct = total > 0 ? Math.round((o.votes / total) * 100) : 0;
                  return (
                    <button
                      key={o.id}
                      disabled={!isOpen || session.userVoted || isVoting}
                      onClick={() => !session.userVoted && isOpen && vote({ sessionId: session.id, optionId: o.id })}
                      className="w-full text-left"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 hover:bg-orange-50 disabled:cursor-default transition-colors relative overflow-hidden">
                        {(session.userVoted || !isOpen) && (
                          <div className="absolute left-0 top-0 bottom-0 bg-orange-100 transition-all" style={{ width: `${pct}%` }} />
                        )}
                        <div className="relative z-10 w-4 h-4 rounded-full border-2 border-orange-300 flex-shrink-0" />
                        <span className="relative z-10 text-sm text-stone-700 flex-1">{o.text}</span>
                        <span className="relative z-10 text-xs font-bold text-stone-500">
                          {o.votes} {(session.userVoted || !isOpen) && `(${pct}%)`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-400">
                  Quórum: {total}/{session.quorum} (mín.) · Até {fmtDate(session.deadline)}
                </p>
                {isSindico && isOpen && (
                  <button
                    onClick={() => generateMinutes(session.id)}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <FileText size={12} /> Gerar Ata
                  </button>
                )}
              </div>

              {session.minutes && (
                <button
                  onClick={() => setMinutesContent(session.minutes!)}
                  className="mt-2 text-xs font-semibold text-stone-500 hover:text-stone-700 flex items-center gap-1"
                >
                  <FileText size={12} /> Ver Ata
                </button>
              )}
            </Card>
          );
        })}
        {!isLoading && voteSessions.length === 0 && (
          <Card className="text-center py-8 text-stone-400">Nenhuma votação encontrada</Card>
        )}
      </div>

      <Modal
        isOpen={!!minutesContent}
        onClose={() => setMinutesContent(null)}
        title="Ata da Votação"
      >
        <pre className="text-xs text-stone-700 whitespace-pre-wrap bg-stone-50 rounded-xl p-4">
          {minutesContent}
        </pre>
      </Modal>
    </div>
  );
}
