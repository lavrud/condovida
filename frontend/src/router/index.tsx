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
import { TotemPage } from '../features/totem/pages/TotemPage';
import { RetiradaPage } from '../features/totem/pages/RetiradaPage';
import { ParkingPage } from '../features/parking/pages/ParkingPage';
import { MovingPage } from '../features/moving/pages/MovingPage';
import { DocumentsPage } from '../features/documents/pages/DocumentsPage';
import { ConsumptionPage } from '../features/consumption/pages/ConsumptionPage';
import { LostFoundPage } from '../features/lost-found/pages/LostFoundPage';
import { PetsPage } from '../features/pets/pages/PetsPage';
import { RegulationsPage } from '../features/regulations/pages/RegulationsPage';
import { ReportsPage } from '../features/reports/pages/ReportsPage';
import { ProfilePage } from '../features/profile/pages/ProfilePage';

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
  // Rotas públicas — sem autenticação
  { path: '/totem', element: <TotemPage /> },
  { path: '/retirada', element: <RetiradaPage /> },
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
          { path: '/parking', element: <ParkingPage /> },
          { path: '/moving', element: <MovingPage /> },
          { path: '/documents', element: <DocumentsPage /> },
          { path: '/consumption', element: <ConsumptionPage /> },
          { path: '/lost-found', element: <LostFoundPage /> },
          { path: '/pets', element: <PetsPage /> },
          { path: '/regulations', element: <RegulationsPage /> },
          { path: '/reports', element: <ReportsPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
