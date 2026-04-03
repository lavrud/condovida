import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, Calendar, DollarSign, MessageSquare, Vote, Megaphone,
  ShoppingBag, Wrench, Shield, Package, MessageCircle, Search, ArrowRight,
} from 'lucide-react';
import { cx } from '../lib/utils';

const COMMANDS = [
  { id: 'home',          label: 'Início',       icon: Home,          to: '/' },
  { id: 'reservations',  label: 'Reservas',     icon: Calendar,      to: '/reservations' },
  { id: 'finances',      label: 'Finanças',     icon: DollarSign,    to: '/finances' },
  { id: 'tickets',       label: 'Chamados',     icon: MessageSquare, to: '/tickets' },
  { id: 'chat',          label: 'Chat',         icon: MessageCircle, to: '/chat' },
  { id: 'announcements', label: 'Comunicados',  icon: Megaphone,     to: '/announcements' },
  { id: 'polls',         label: 'Enquetes',     icon: Vote,          to: '/polls' },
  { id: 'votes',         label: 'Votações',     icon: Vote,          to: '/votes' },
  { id: 'gateway',       label: 'Portaria',     icon: Package,       to: '/gateway' },
  { id: 'marketplace',   label: 'Classificados',icon: ShoppingBag,   to: '/marketplace' },
  { id: 'maintenance',   label: 'Manutenção',   icon: Wrench,        to: '/maintenance' },
  { id: 'admin',         label: 'Admin',        icon: Shield,        to: '/admin' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => { setSelected(0); }, [query]);

  const go = (to: string) => { navigate(to); onClose(); };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && filtered[selected]) {
      go(filtered[selected].to);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 border-b border-stone-100">
          <Search size={16} className="text-stone-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar página ou ação..."
            className="flex-1 py-4 text-sm text-stone-900 placeholder:text-stone-400 outline-none bg-transparent"
          />
          <kbd className="text-[10px] font-mono bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded">ESC</kbd>
        </div>

        {/* Results */}
        <div className="py-2 max-h-72 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-sm text-stone-400 text-center py-6">Nenhum resultado</p>
          )}
          {filtered.map((cmd, i) => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.id}
                onClick={() => go(cmd.to)}
                onMouseEnter={() => setSelected(i)}
                className={cx(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                  i === selected ? 'bg-stone-50' : 'hover:bg-stone-50',
                )}
              >
                <div className="w-7 h-7 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-stone-600" />
                </div>
                <span className="text-sm font-medium text-stone-800 flex-1">{cmd.label}</span>
                {i === selected && <ArrowRight size={14} className="text-stone-400" />}
              </button>
            );
          })}
        </div>

        {/* Footer hints */}
        <div className="border-t border-stone-100 px-4 py-2.5 flex items-center gap-3">
          <span className="text-[10px] text-stone-400 flex items-center gap-2">
            <span><kbd className="font-mono bg-stone-100 px-1 rounded">↑↓</kbd> navegar</span>
            <span><kbd className="font-mono bg-stone-100 px-1 rounded">↵</kbd> abrir</span>
            <span><kbd className="font-mono bg-stone-100 px-1 rounded">⌘K</kbd> fechar</span>
          </span>
        </div>
      </div>
    </div>
  );
}
