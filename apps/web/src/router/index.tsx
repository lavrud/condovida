import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { AppLayout } from '../components/layout/AppLayout';

// Lazy imports
import { LoginPage } from '../features/auth/pages/LoginPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { ReservationsPage } from '../features/reservations/pages/ReservationsPage';
import { FinancesPage } from '../features/finances/pages/FinancesPage';
import { GatewayPage } from '../features/gateway/pages/GatewayPage';
import { TicketsPage } from '../features/tickets/pages/TicketsPage';
import { ChatPage } from '../features/chat/pages/ChatPage';
import { AnnouncementsPage } from '../features/announcements/pages/AnnouncementsPage';
import { PollsPage } from '../features/polls/pages/PollsPage';
import { VotesPage } from '../features/votes/pages/VotesPage';
import { MarketplacePage } from '../features/marketplace/pages/MarketplacePage';
import { MaintenancePage } from '../features/maintenance/pages/MaintenancePage';
import { AdminPage } from '../features/admin/pages/AdminPage';

function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function GuestGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: [
      { path: '/login', element: <LoginPage /> },
    ],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/reservations', element: <ReservationsPage /> },
          { path: '/finances', element: <FinancesPage /> },
          { path: '/tickets', element: <TicketsPage /> },
          { path: '/gateway', element: <GatewayPage /> },
          { path: '/chat', element: <ChatPage /> },
          { path: '/announcements', element: <AnnouncementsPage /> },
          { path: '/polls', element: <PollsPage /> },
          { path: '/votes', element: <VotesPage /> },
          { path: '/marketplace', element: <MarketplacePage /> },
          { path: '/maintenance', element: <MaintenancePage /> },
          { path: '/admin', element: <AdminPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
