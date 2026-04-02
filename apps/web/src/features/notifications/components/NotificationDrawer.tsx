import React from 'react';
import { X, Bell, Package, Receipt, Calendar, Vote, Megaphone, MessageSquare, LucideIcon } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationType } from '@condovida/shared';
import { fmtRelative, cx } from '../../../lib/utils';

const typeIcon: Record<NotificationType, LucideIcon> = {
  [NotificationType.PACKAGE]: Package,
  [NotificationType.PAYMENT]: Receipt,
  [NotificationType.RESERVATION]: Calendar,
  [NotificationType.ASSEMBLY]: Vote,
  [NotificationType.ANNOUNCEMENT]: Megaphone,
  [NotificationType.TICKET]: MessageSquare,
  [NotificationType.GENERAL]: Bell,
};

const typeColor: Record<NotificationType, string> = {
  [NotificationType.PACKAGE]: 'bg-amber-100 text-amber-600',
  [NotificationType.PAYMENT]: 'bg-emerald-100 text-emerald-600',
  [NotificationType.RESERVATION]: 'bg-sky-100 text-sky-600',
  [NotificationType.ASSEMBLY]: 'bg-orange-100 text-orange-600',
  [NotificationType.ANNOUNCEMENT]: 'bg-purple-100 text-purple-600',
  [NotificationType.TICKET]: 'bg-stone-100 text-stone-600',
  [NotificationType.GENERAL]: 'bg-stone-100 text-stone-600',
};

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900">Notificações</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="text-xs font-semibold text-stone-400 hover:text-stone-700"
              >
                Marcar todas
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-stone-400">
              <Bell size={32} className="mb-2 opacity-30" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          )}
          {notifications.map((n) => {
            const Icon = typeIcon[n.type as NotificationType] || Bell;
            const color = typeColor[n.type as NotificationType] || 'bg-stone-100 text-stone-600';
            return (
              <button
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={cx(
                  'w-full flex gap-3 px-5 py-4 border-b border-stone-50 text-left transition-colors hover:bg-stone-50',
                  !n.read && 'bg-orange-50/30',
                )}
              >
                <div className={cx('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0', color)}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cx('text-sm font-semibold leading-snug', !n.read ? 'text-stone-900' : 'text-stone-600')}>
                    {n.title}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">{n.body}</p>
                  <p className="text-xs text-stone-300 mt-1">{fmtRelative(n.createdAt)}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
