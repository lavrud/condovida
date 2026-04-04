import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Calendar, DollarSign, MessageSquare, MoreHorizontal,
  Vote, Megaphone, ShoppingBag, Wrench, Shield, Package, X, MessageCircle,
  Car, Truck, FileText, Droplets, Search, PawPrint, BookOpen, BarChart2, UserCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { Role } from '@condovida/shared';
import { cx } from '../../lib/utils';

// ── Primary tabs (always visible) ────────────────────────────
const PRIMARY = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/reservations', label: 'Reservas', icon: Calendar },
  { to: '/finances', label: 'Finanças', icon: DollarSign },
  { to: '/tickets', label: 'Chamados', icon: MessageSquare },
];

// ── "More" menu items ─────────────────────────────────────────
const MORE_ITEMS = [
  { to: '/chat', label: 'Chat', icon: MessageCircle, roles: [] as Role[] },
  { to: '/announcements', label: 'Comunicados', icon: Megaphone, roles: [] as Role[] },
  { to: '/polls', label: 'Enquetes', icon: Vote, roles: [] as Role[] },
  { to: '/votes', label: 'Votações', icon: Vote, roles: [] as Role[] },
  { to: '/gateway', label: 'Portaria', icon: Package, roles: [] as Role[] },
  { to: '/marketplace', label: 'Classificados', icon: ShoppingBag, roles: [] as Role[] },
  { to: '/parking', label: 'Garagem', icon: Car, roles: [] as Role[] },
  { to: '/moving', label: 'Mudança', icon: Truck, roles: [] as Role[] },
  { to: '/documents', label: 'Documentos', icon: FileText, roles: [] as Role[] },
  { to: '/consumption', label: 'Consumo', icon: Droplets, roles: [] as Role[] },
  { to: '/lost-found', label: 'Achados', icon: Search, roles: [] as Role[] },
  { to: '/pets', label: 'Pets', icon: PawPrint, roles: [] as Role[] },
  { to: '/regulations', label: 'Regulamento', icon: BookOpen, roles: [] as Role[] },
  { to: '/reports', label: 'Relatórios', icon: BarChart2, roles: [Role.SINDICO, Role.COUNCIL] },
  { to: '/maintenance', label: 'Manutenção', icon: Wrench, roles: [Role.SINDICO, Role.COUNCIL] },
  { to: '/admin', label: 'Admin', icon: Shield, roles: [Role.SINDICO, Role.COUNCIL] },
  { to: '/profile', label: 'Perfil', icon: UserCircle, roles: [] as Role[] },
];

export function BottomNav() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  const visibleMore = MORE_ITEMS.filter(
    (item) => item.roles.length === 0 || (user?.role && item.roles.includes(user.role as Role)),
  );

  const handleMoreNav = (to: string) => {
    setMoreOpen(false);
    navigate(to);
  };

  return (
    <>
      {/* More drawer overlay */}
      {moreOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div
            className="absolute bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white rounded-t-3xl shadow-2xl p-4"
            style={{ paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                Mais opções
              </span>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1 pb-2">
              {visibleMore.map(({ to, label, icon: Icon }) => (
                <button
                  key={to}
                  onClick={() => handleMoreNav(to)}
                  className="flex flex-col items-center py-3 px-2 rounded-2xl hover:bg-stone-50 active:bg-stone-100 transition-colors gap-1.5"
                >
                  <div className="w-10 h-10 bg-stone-100 rounded-2xl flex items-center justify-center">
                    <Icon size={18} className="text-stone-600" />
                  </div>
                  <span className="text-[10px] font-semibold text-stone-600 text-center leading-tight">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-100 safe-bottom">
        <div className="max-w-2xl mx-auto px-2 flex">
          {PRIMARY.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cx(
                  'flex-1 flex flex-col items-center py-3 px-1 gap-0.5 text-[10px] font-semibold transition-colors min-h-[52px] justify-center',
                  isActive ? 'text-stone-900' : 'text-stone-400',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cx(
                      'p-1.5 rounded-xl transition-colors',
                      isActive ? 'bg-stone-100' : 'hover:bg-stone-50',
                    )}
                  >
                    <Icon size={18} />
                  </div>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* More button */}
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className={cx(
              'flex-1 flex flex-col items-center py-3 px-1 gap-0.5 text-[10px] font-semibold transition-colors min-h-[52px] justify-center',
              moreOpen ? 'text-stone-900' : 'text-stone-400',
            )}
          >
            <div
              className={cx(
                'p-1.5 rounded-xl transition-colors',
                moreOpen ? 'bg-stone-100' : 'hover:bg-stone-50',
              )}
            >
              <MoreHorizontal size={18} />
            </div>
            <span>Mais</span>
          </button>
        </div>
      </nav>
    </>
  );
}
