import React, { useState, useRef, useEffect } from 'react';
import { Bell, Building, LogOut, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useNotifications } from '../../features/notifications/hooks/useNotifications';
import { cx } from '../../lib/utils';

const roleLabel: Record<string, string> = {
  SINDICO: 'Síndico',
  RESIDENT: 'Morador',
  COUNCIL: 'Conselho',
  PORTEIRO: 'Porteiro',
  ADMIN: 'Admin',
};

interface HeaderProps {
  onNotificationsClick: () => void;
  onCommandPaletteOpen: () => void;
}

export function Header({ onNotificationsClick, onCommandPaletteOpen }: HeaderProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-900 rounded-xl flex items-center justify-center">
            <Building size={16} className="text-white" />
          </div>
          <span className="font-bold text-stone-900 text-sm">CondoVida</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Command palette trigger */}
          <button
            onClick={onCommandPaletteOpen}
            className="p-2 rounded-xl hover:bg-stone-50 transition-colors text-stone-400 hover:text-stone-700"
            title="Busca rápida (⌘K)"
          >
            <Search size={18} />
          </button>

          {/* Notifications */}
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

          {/* Avatar + dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={cx(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white transition-opacity',
                menuOpen ? 'opacity-80' : '',
                'bg-stone-700',
              )}
            >
              {user?.avatar || user?.name?.charAt(0) || 'U'}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 w-52 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-stone-100">
                  <div className="flex items-center gap-2 mb-0.5">
                    <User size={12} className="text-stone-400" />
                    <p className="text-xs font-semibold text-stone-800 truncate">{user?.name}</p>
                  </div>
                  <p className="text-xs text-stone-400 pl-4">
                    {user?.role ? roleLabel[user.role] || user.role : '—'}
                    {user?.unit && user?.block ? ` · ${user.unit}-${user.block}` : ''}
                  </p>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} />
                  Sair da conta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
