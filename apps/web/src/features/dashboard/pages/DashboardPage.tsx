import React from 'react';
import { Bell, Receipt, Bookmark, Vote, Package } from 'lucide-react';
import { useAuthStore } from '../../../store/auth.store';
import { useDashboard } from '../hooks/useDashboard';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import { useGateway } from '../../gateway/hooks/useGateway';
import { Card, Badge, IconContainer } from '../../../components/ui';
import { fmt, fmtDate, greeting } from '../../../lib/utils';
import { AnnouncementPriority } from '@condovida/shared';

const priorityColor: Record<AnnouncementPriority, string> = {
  [AnnouncementPriority.HIGH]: 'bg-red-400',
  [AnnouncementPriority.MEDIUM]: 'bg-amber-400',
  [AnnouncementPriority.LOW]: 'bg-stone-200',
};

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { announcements, pendingPayment, openVotes, unvotedPolls, isLoading } = useDashboard();
  const { unreadCount } = useNotifications();
  const { pendingPackages } = useGateway();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-stone-200 rounded-xl" />
        <div className="h-24 bg-stone-200 rounded-2xl" />
        <div className="h-32 bg-stone-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-stone-400 text-sm">{greeting()},</p>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {user?.name?.split(' ')[0]}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-400">Unidade</p>
          <p className="text-lg font-bold text-stone-700">
            {user?.unit && user?.block ? `${user.unit}-${user.block}` : '—'}
          </p>
        </div>
      </div>

      {/* Alert + packages banners */}
      {(unreadCount > 0 || pendingPackages.length > 0) && (
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <div className="flex-1 bg-orange-50 rounded-2xl px-4 py-3 border border-orange-100 flex items-center gap-3">
              <IconContainer icon={Bell} size={36} iconSize={16} color="bg-orange-100 text-orange-600" />
              <div>
                <p className="text-sm font-semibold text-stone-800">
                  {unreadCount} alerta{unreadCount > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-stone-400">Não lido{unreadCount > 1 ? 's' : ''}</p>
              </div>
            </div>
          )}
          {pendingPackages.length > 0 && (
            <div className="flex-1 bg-amber-50 rounded-2xl px-4 py-3 border border-amber-100 flex items-center gap-3">
              <IconContainer icon={Package} size={36} iconSize={16} color="bg-amber-100 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-stone-800">
                  {pendingPackages.length} encomenda{pendingPackages.length > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-stone-400">Na portaria</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pending payment */}
      {pendingPayment && (
        <Card className="flex items-center gap-4">
          <IconContainer icon={Receipt} size={44} iconSize={20} color="bg-emerald-50 text-emerald-600" />
          <div className="flex-1">
            <p className="text-xs text-stone-400">Próxima fatura — {pendingPayment.month}</p>
            <p className="text-xl font-bold text-stone-900">{fmt(pendingPayment.amount)}</p>
            <p className="text-xs text-stone-400">Venc. {fmtDate(pendingPayment.dueDate)}</p>
          </div>
          <Badge variant="warning">Pendente</Badge>
        </Card>
      )}

      {/* Announcements */}
      {announcements.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
            Comunicados
          </h2>
          <div className="space-y-2">
            {announcements.slice(0, 3).map((a) => (
              <Card key={a.id} padding="px-4 py-3" className="flex items-start gap-3">
                <div
                  className={`w-1 rounded-full h-8 mt-0.5 flex-shrink-0 ${priorityColor[a.priority as AnnouncementPriority] || 'bg-stone-200'}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800 leading-snug">{a.title}</p>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">{a.body}</p>
                </div>
                {a.pinned && <Bookmark size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Open polls */}
      {unvotedPolls.slice(0, 1).map((poll) => (
        <div key={poll.id}>
          <h2 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">Enquete</h2>
          <Card>
            <p className="text-sm font-semibold text-stone-800 mb-3">{poll.question}</p>
            <div className="space-y-2">
              {poll.options.map((o) => (
                <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 text-left">
                  <div className="w-4 h-4 rounded-full border-2 border-stone-300 flex-shrink-0" />
                  <span className="text-sm text-stone-700 flex-1">{o.text}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-400 mt-3">
              {poll.options.reduce((s, o) => s + o.votes, 0)}/{poll.totalEligible} votos
            </p>
          </Card>
        </div>
      ))}

      {/* Open votes */}
      {openVotes.slice(0, 1).map((v) => (
        <div key={v.id}>
          <h2 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
            Votação Assembleia
          </h2>
          <Card className="border-2 border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <IconContainer icon={Vote} size={28} iconSize={14} color="bg-orange-50 text-orange-600" />
              <Badge variant="accent">Votação oficial</Badge>
            </div>
            <p className="text-sm font-bold text-stone-900 mb-1">{v.title}</p>
            <p className="text-xs text-stone-500 mb-3">{v.description}</p>
            <div className="space-y-2">
              {v.options.map((o) => (
                <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
                  <div className="w-4 h-4 rounded-full border-2 border-orange-300 flex-shrink-0" />
                  <span className="text-sm text-stone-700">{o.text}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-400 mt-3">
              Quórum: {v.quorum}/{v.totalEligible}
            </p>
          </Card>
        </div>
      ))}
    </div>
  );
}
