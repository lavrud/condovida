import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { NotificationDrawer } from '../../features/notifications/components/NotificationDrawer';
import { CommandPalette } from '../CommandPalette';

export function AppLayout() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Header
        onNotificationsClick={() => setNotificationsOpen(true)}
        onCommandPaletteOpen={() => setPaletteOpen(true)}
      />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 pb-nav flex flex-col">
        <Outlet />
      </main>

      <BottomNav />

      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
