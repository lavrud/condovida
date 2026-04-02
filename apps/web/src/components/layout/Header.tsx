import React from 'react';
import { Bell, Building } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useNotifications } from '../../features/notifications/hooks/useNotifications';
import { cx } from '../../lib/utils';

interface HeaderProps {
  onNotificationsClick: () => void;
}

export function Header({ onNotificationsClick }: HeaderProps) {
  const user = useAuthStore((s) => s.user);
  const { unreadCount } = useNotifications();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-900 rounded-xl flex items-center justify-center">
            <Building size={16} className="text-white" />
          </div>
          <span className="font-bold text-stone-900 text-sm">CondoVida</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNotificationsClick}
            className="relative p-2 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <Bell size={20} className="text-stone-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <div className={cx('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white', 'bg-stone-700')}>
            {user?.avatar || user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
