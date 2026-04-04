/**
 * Mock request handlers — route URL+method to in-memory DB operations.
 * Returns { data: T } to match the TransformInterceptor envelope from the API.
 */
import {
  USERS, payments, expenses, splits, revenue,
  reservations, tickets, announcements, polls, voteSessions,
  visitors, packages, serviceProviders, chatChannels, chatMessages,
  listings, maintenanceTasks, notifications, RESIDENTS, nextId,
  parkingSpots, parkingReservations, movings, documents, consumption,
  lostItems, pets, regulations, userSettings,
} from './db';
import { PaymentStatus, ReservationStatus, PackageStatus, VisitorType, MaintenanceStatus, VoteSessionStatus, TicketCategory, TicketStatus, Ticket } from '@condovida/shared';

type MockResponse = { data: unknown };

function ok(data: unknown): MockResponse {
  return { data };
}

// ── Route table ──────────────────────────────────────────────

export function handleMockRequest(method: string, url: string, body?: unknown): MockResponse {
  const m = method.toUpperCase();
  // Strip query string for matching
  const [path, qs] = url.replace(/^\/api/, '').split('?');
  const query = Object.fromEntries(new URLSearchParams(qs || ''));
  const segments = path.split('/').filter(Boolean);

  // ── Auth ───────────────────────────────────────────────────
  if (m === 'POST' && path === '/auth/login') {
    const { email, password } = body as { email: string; password: string };
    const demoPassword = import.meta.env.VITE_DEMO_PASSWORD;
    const user = USERS.find((u) => u.email === email);
    if (!user || password !== demoPassword) {
      throw { status: 401, message: 'Credenciais inválidas' };
    }
    return ok({ user, accessToken: 'mock-token', refreshToken: 'mock-refresh' });
  }

  if (m === 'GET' && path === '/auth/me') {
    const user = USERS[0]; // default — in real app would use token claim
    return ok(user);
  }

  // ── Residents ───────────────────────────────────────────────
  if (m === 'GET' && path === '/residents') {
    return ok(RESIDENTS);
  }

  // ── Announcements ───────────────────────────────────────────
  if (m === 'GET' && path === '/announcements') {
    return ok([...announcements]);
  }
  if (m === 'POST' && path === '/announcements') {
    const b = body as Record<string, unknown>;
    const a = { id: nextId(), ...b, author: 'Síndico', createdAt: new Date().toISOString() };
    announcements.unshift(a as typeof announcements[0]);
    return ok(a);
  }

  // ── Polls ───────────────────────────────────────────────────
  if (m === 'GET' && path === '/polls') {
    return ok([...polls]);
  }
  if (m === 'POST' && path === '/polls') {
    const b = body as { question: string; options: string[]; deadline: string };
    const poll = {
      id: nextId(),
      question: b.question,
      options: b.options.map((t, i) => ({ id: nextId() + i, text: t, votes: 0 })),
      deadline: b.deadline,
      totalUnits: 40, totalEligible: 40,
      hasVoted: false, userVoted: false,
      createdBy: '1', createdAt: new Date().toISOString(),
    };
    polls.push(poll);
    return ok(poll);
  }
  if (m === 'POST' && segments[0] === 'polls' && segments[2] === 'vote') {
    const pollId = segments[1];
    const { optionId } = body as { optionId: string };
    const poll = polls.find((p) => p.id === pollId);
    if (poll) {
      const opt = poll.options.find((o) => o.id === optionId);
      if (opt) opt.votes++;
      poll.hasVoted = true;
      poll.userVoted = true;
    }
    return ok(poll);
  }

  // ── Assembly Votes ──────────────────────────────────────────
  if (m === 'GET' && path === '/votes') {
    return ok([...voteSessions]);
  }
  if (m === 'POST' && path === '/votes') {
    const b = body as { title: string; description: string; options: string[]; deadline: string; quorum: number };
    const session = {
      id: nextId(),
      title: b.title, description: b.description,
      options: b.options.map((t, i) => ({ id: nextId() + i, text: t, votes: 0 })),
      deadline: b.deadline,
      status: VoteSessionStatus.OPEN,
      quorum: b.quorum, totalUnits: 40, totalEligible: 40,
      hasVoted: false, userVoted: false,
      createdBy: '1', createdAt: new Date().toISOString(),
    };
    voteSessions.push(session);
    return ok(session);
  }
  if (m === 'POST' && segments[0] === 'votes' && segments[2] === 'vote') {
    const sessionId = segments[1];
    const { optionId } = body as { optionId: string };
    const session = voteSessions.find((v) => v.id === sessionId);
    if (session) {
      const opt = session.options.find((o) => o.id === optionId);
      if (opt) opt.votes++;
      session.hasVoted = true;
      session.userVoted = true;
    }
    return ok(session);
  }
  if (m === 'POST' && segments[0] === 'votes' && segments[2] === 'generate-minutes') {
    const session = voteSessions.find((v) => v.id === segments[1]);
    if (session) {
      const total = session.options.reduce((s, o) => s + o.votes, 0);
      const winner = [...session.options].sort((a, b) => b.votes - a.votes)[0];
      const lines = [
        'ATA DA VOTAÇÃO ONLINE',
        '',
        `Assunto: ${session.title}`,
        `Total de votos: ${total}`,
        `Quórum mínimo: ${session.quorum}/${session.totalUnits}`,
        '',
        ...session.options.map((o) => `  ${o.text}: ${o.votes} voto(s) (${total > 0 ? Math.round(o.votes / total * 100) : 0}%)`),
        '',
        total >= session.quorum
          ? `RESULTADO: APROVADA — "${winner.text}" com ${winner.votes} voto(s).`
          : 'RESULTADO: NÃO ATINGIU QUÓRUM.',
        '',
        `Gerada em: ${new Date().toLocaleString('pt-BR')}`,
      ];
      session.minutes = lines.join('\n');
      session.status = VoteSessionStatus.CLOSED;
    }
    return ok(session);
  }

  // ── Finances ────────────────────────────────────────────────
  if (m === 'GET' && path === '/finances/payments') {
    return ok([...payments]);
  }
  if (m === 'PATCH' && segments[0] === 'finances' && segments[1] === 'payments' && segments[3] === 'pay') {
    const id = segments[2];
    const p = payments.find((x) => x.id === id);
    if (p) { p.status = PaymentStatus.PAID; p.paidDate = new Date().toISOString().split('T')[0]; }
    return ok(p);
  }
  if (m === 'GET' && path === '/finances/expenses') {
    return ok([...expenses]);
  }
  if (m === 'POST' && path === '/finances/expenses') {
    const e = { id: nextId(), ...(body as object), createdBy: '1' };
    expenses.unshift(e as typeof expenses[0]);
    return ok(e);
  }
  if (m === 'GET' && path === '/finances/splits') {
    return ok([...splits]);
  }
  if (m === 'POST' && path === '/finances/splits') {
    const b = body as { description: string; total: number; unitCount: number };
    const s = { id: nextId(), ...b, perUnit: b.total / b.unitCount, status: 'PENDING' as const, date: new Date().toISOString().split('T')[0] };
    splits.push(s);
    return ok(s);
  }
  if (m === 'GET' && path === '/finances/summary') {
    return ok([...revenue]);
  }

  // ── Reservations ────────────────────────────────────────────
  if (m === 'GET' && path === '/reservations') {
    return ok([...reservations]);
  }
  if (m === 'POST' && path === '/reservations') {
    const b = body as Record<string, string>;
    const r = { id: nextId(), ...b, residentId: '1', status: ReservationStatus.PENDING, createdAt: new Date().toISOString() };
    reservations.push(r as typeof reservations[0]);
    return ok(r);
  }
  if (m === 'PATCH' && segments[0] === 'reservations' && segments[2] === 'cancel') {
    const r = reservations.find((x) => x.id === segments[1]);
    if (r) r.status = ReservationStatus.CANCELLED;
    return ok(r);
  }
  if (m === 'DELETE' && segments[0] === 'reservations') {
    const idx = reservations.findIndex((x) => x.id === segments[1]);
    if (idx !== -1) reservations.splice(idx, 1);
    return ok(null);
  }

  // ── Tickets ─────────────────────────────────────────────────
  if (m === 'GET' && path === '/tickets') {
    return ok([...tickets]);
  }
  if (m === 'POST' && path === '/tickets') {
    const b = body as { title: string; description: string; category: TicketCategory; hasPhoto?: boolean };
    const t: Ticket = {
      id: nextId(), title: b.title, description: b.description,
      category: b.category, hasPhoto: b.hasPhoto || false,
      status: TicketStatus.OPEN, residentId: '1', responses: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    tickets.unshift(t);
    return ok(t);
  }
  if (m === 'POST' && segments[0] === 'tickets' && segments[2] === 'responses') {
    const t = tickets.find((x) => x.id === segments[1]);
    const b = body as { text: string };
    if (t) {
      const response = { id: nextId(), ticketId: t.id, authorId: '1', authorName: 'Você', isAdmin: false, text: b.text, createdAt: new Date().toISOString() };
      t.responses.push(response);
    }
    return ok(t);
  }
  if (m === 'PATCH' && segments[0] === 'tickets') {
    const t = tickets.find((x) => x.id === segments[1]);
    if (t) Object.assign(t, body);
    return ok(t);
  }

  // ── Gateway — Visitors ──────────────────────────────────────
  if (m === 'GET' && path === '/gateway/visitors') {
    return ok([...visitors]);
  }
  if (m === 'POST' && path === '/gateway/visitors') {
    const b = body as Record<string, unknown>;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const qr = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const v = { id: nextId(), ...b, qrCode: qr, status: 'AUTHORIZED', authorizedBy: '1', createdAt: new Date().toISOString() };
    visitors.push(v as typeof visitors[0]);
    return ok(v);
  }
  if (m === 'DELETE' && segments[0] === 'gateway' && segments[1] === 'visitors') {
    const idx = visitors.findIndex((x) => x.id === segments[2]);
    if (idx !== -1) visitors.splice(idx, 1);
    return ok(null);
  }

  // ── Gateway — Packages ──────────────────────────────────────
  if (m === 'GET' && path === '/gateway/packages') {
    return ok([...packages]);
  }
  if (m === 'PATCH' && segments[0] === 'gateway' && segments[1] === 'packages' && segments[3] === 'pickup') {
    const p = packages.find((x) => x.id === segments[2]);
    if (p) { p.status = PackageStatus.PICKED_UP; p.pickedUpAt = new Date().toISOString(); }
    return ok(p);
  }

  // ── Totem (público — sem auth) ──────────────────────────────
  if (m === 'POST' && path === '/totem/register') {
    const b = body as { unit: string; block: string; description?: string; carrier?: string };
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem I,O,0,1 para evitar confusão
    const token = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const pkg = {
      id: nextId(), description: b.description || 'Encomenda',
      unit: b.unit, block: b.block,
      arrivedAt: new Date().toISOString(), status: PackageStatus.WAITING,
      carrier: b.carrier || 'Entregador', receivedBy: 'Totem', deliveryToken: token,
    };
    packages.unshift(pkg as typeof packages[0]);
    return ok(pkg);
  }
  if (m === 'GET' && segments[0] === 'totem' && segments[1] === 'package') {
    const pkg = packages.find((x) => x.deliveryToken === segments[2]);
    if (!pkg) throw { status: 404, message: 'Encomenda não encontrada' };
    return ok(pkg);
  }
  if (m === 'POST' && segments[0] === 'totem' && segments[2] === 'pickup') {
    const pkg = packages.find((x) => x.deliveryToken === segments[1]);
    if (!pkg) throw { status: 404, message: 'Encomenda não encontrada' };
    if (pkg.status === PackageStatus.PICKED_UP) throw { status: 409, message: 'Encomenda já retirada' };
    pkg.status = PackageStatus.PICKED_UP;
    pkg.pickedUpAt = new Date().toISOString();
    return ok(pkg);
  }

  // ── Gateway — Providers ─────────────────────────────────────
  if (m === 'GET' && path === '/gateway/providers') {
    return ok([...serviceProviders]);
  }

  // ── Chat ────────────────────────────────────────────────────
  if (m === 'GET' && path === '/chat/channels') {
    return ok([...chatChannels]);
  }
  if (m === 'GET' && segments[0] === 'chat' && segments[1] === 'channels' && segments[3] === 'messages') {
    const chId = segments[2];
    return ok(chatMessages[chId] || []);
  }
  if (m === 'POST' && segments[0] === 'chat' && segments[1] === 'channels' && segments[3] === 'messages') {
    const chId = segments[2];
    const b = body as { text: string };
    const user = USERS[0];
    const msg = {
      id: nextId(), channelId: chId,
      authorId: user.id, authorName: user.name,
      authorUnit: `${user.unit}-${user.block}`,
      text: b.text, createdAt: new Date().toISOString(),
    };
    if (!chatMessages[chId]) chatMessages[chId] = [];
    chatMessages[chId].push(msg);
    return ok(msg);
  }

  // ── Marketplace ─────────────────────────────────────────────
  if (m === 'GET' && path === '/marketplace') {
    return ok([...listings]);
  }
  if (m === 'POST' && path === '/marketplace') {
    const b = body as Record<string, unknown>;
    const l = { id: nextId(), ...b, sellerId: '1', sellerName: 'Você', sellerUnit: '304-B', active: true, createdAt: new Date().toISOString() };
    listings.unshift(l as typeof listings[0]);
    return ok(l);
  }
  if (m === 'PATCH' && segments[0] === 'marketplace' && segments[2] === 'sold') {
    const l = listings.find((x) => x.id === segments[1]);
    if (l) l.active = false;
    return ok(l);
  }

  // ── Maintenance ─────────────────────────────────────────────
  if (m === 'GET' && path === '/maintenance') {
    return ok([...maintenanceTasks]);
  }
  if (m === 'POST' && path === '/maintenance') {
    const t = { id: nextId(), ...(body as object), status: MaintenanceStatus.SCHEDULED, createdAt: new Date().toISOString() };
    maintenanceTasks.push(t as typeof maintenanceTasks[0]);
    return ok(t);
  }
  if (m === 'PATCH' && segments[0] === 'maintenance' && segments[2] === 'done') {
    const t = maintenanceTasks.find((x) => x.id === segments[1]);
    if (t) t.status = MaintenanceStatus.DONE;
    return ok(t);
  }

  // ── Notifications ───────────────────────────────────────────
  if (m === 'GET' && path === '/notifications/mine') {
    return ok([...notifications]);
  }
  if (m === 'PATCH' && segments[0] === 'notifications' && segments[2] === 'read') {
    const n = notifications.find((x) => x.id === segments[1]);
    if (n) n.read = true;
    return ok(n);
  }
  if (m === 'PATCH' && path === '/notifications/read-all') {
    notifications.forEach((n) => { n.read = true; });
    return ok(null);
  }

  // ── Parking ─────────────────────────────────────────────────
  if (m === 'GET' && path === '/parking/spots') {
    return ok([...parkingSpots]);
  }
  if (m === 'GET' && path === '/parking/reservations') {
    return ok([...parkingReservations]);
  }
  if (m === 'POST' && path === '/parking/reservations') {
    const b = body as Record<string, unknown>;
    const spot = parkingSpots.find((s) => s.id === b.spotId);
    if (!spot || spot.status !== 'AVAILABLE') throw { status: 409, message: 'Vaga indisponível' };
    const r = { id: nextId(), ...b, residentId: '1', residentName: 'Demo User', unit: '304', block: 'B', status: 'CONFIRMED', createdAt: new Date().toISOString() };
    parkingReservations.push(r as typeof parkingReservations[0]);
    spot.status = 'RESERVED';
    return ok(r);
  }
  if (m === 'DELETE' && segments[0] === 'parking' && segments[1] === 'reservations') {
    const idx = parkingReservations.findIndex((r) => r.id === segments[2]);
    if (idx !== -1) {
      const r = parkingReservations[idx];
      const spot = parkingSpots.find((s) => s.id === r.spotId);
      if (spot) spot.status = 'AVAILABLE';
      parkingReservations.splice(idx, 1);
    }
    return ok(null);
  }

  // ── Moving ───────────────────────────────────────────────────
  if (m === 'GET' && path === '/moving') {
    return ok([...movings]);
  }
  if (m === 'POST' && path === '/moving') {
    const b = body as Record<string, unknown>;
    const mv = { id: nextId(), ...b, residentId: '1', residentName: 'Demo User', unit: '304', block: 'B', status: 'PENDING', createdAt: new Date().toISOString() };
    movings.unshift(mv as typeof movings[0]);
    return ok(mv);
  }
  if (m === 'DELETE' && segments[0] === 'moving') {
    const idx = movings.findIndex((x) => x.id === segments[1]);
    if (idx !== -1) movings.splice(idx, 1);
    return ok(null);
  }

  // ── Documents ────────────────────────────────────────────────
  if (m === 'GET' && path === '/documents') {
    return ok([...documents]);
  }
  if (m === 'POST' && path === '/documents') {
    const b = body as Record<string, unknown>;
    const d = { id: nextId(), ...b, uploadedBy: 'Síndico', createdAt: new Date().toISOString() };
    documents.unshift(d as typeof documents[0]);
    return ok(d);
  }
  if (m === 'DELETE' && segments[0] === 'documents') {
    const idx = documents.findIndex((x) => x.id === segments[1]);
    if (idx !== -1) documents.splice(idx, 1);
    return ok(null);
  }

  // ── Consumption ──────────────────────────────────────────────
  if (m === 'GET' && path === '/consumption/mine') {
    return ok([...consumption]);
  }

  // ── Lost & Found ─────────────────────────────────────────────
  if (m === 'GET' && path === '/lost-found') {
    return ok([...lostItems]);
  }
  if (m === 'POST' && path === '/lost-found') {
    const b = body as Record<string, unknown>;
    const item = { id: nextId(), ...b, foundBy: 'Demo User', foundByUnit: '304-B', status: 'AVAILABLE', createdAt: new Date().toISOString() };
    lostItems.unshift(item as typeof lostItems[0]);
    return ok(item);
  }
  if (m === 'PATCH' && segments[0] === 'lost-found' && segments[2] === 'claim') {
    const item = lostItems.find((x) => x.id === segments[1]);
    if (item) { item.status = 'CLAIMED'; item.claimedBy = 'Demo User'; }
    return ok(item);
  }

  // ── Pets ──────────────────────────────────────────────────────
  if (m === 'GET' && path === '/pets') {
    return ok([...pets]);
  }
  if (m === 'POST' && path === '/pets') {
    const b = body as Record<string, unknown>;
    const pet = { id: nextId(), ...b, ownerUnit: '304', ownerBlock: 'B', ownerName: 'Demo User', createdAt: new Date().toISOString() };
    pets.unshift(pet as typeof pets[0]);
    return ok(pet);
  }
  if (m === 'DELETE' && segments[0] === 'pets') {
    const idx = pets.findIndex((x) => x.id === segments[1]);
    if (idx !== -1) pets.splice(idx, 1);
    return ok(null);
  }

  // ── Regulations ──────────────────────────────────────────────
  if (m === 'GET' && path === '/regulations') {
    return ok([...regulations]);
  }

  // ── User Settings ─────────────────────────────────────────────
  if (m === 'GET' && path === '/profile/settings') {
    return ok(userSettings['1'] ?? { notifyAnnouncements: true, notifyPackages: true, notifyTickets: true, notifyFinances: true, notifyChat: false });
  }
  if (m === 'PATCH' && path === '/profile/settings') {
    userSettings['1'] = { ...userSettings['1'], ...(body as object) };
    return ok(userSettings['1']);
  }
  if (m === 'PATCH' && path === '/profile') {
    const b = body as Partial<typeof USERS[0]>;
    const u = USERS.find((x) => x.id === '1');
    if (u) Object.assign(u, b);
    return ok(u);
  }

  // ── Reports (Síndico) ─────────────────────────────────────────
  if (m === 'GET' && path === '/reports/summary') {
    return ok({
      totalResidents: RESIDENTS.length,
      pendingPayments: payments.filter((p) => p.status === 'PENDING').length,
      openTickets: tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
      monthlyRevenue: revenue[revenue.length - 1]?.revenue ?? 0,
      monthlyExpenses: revenue[revenue.length - 1]?.expenses ?? 0,
      pendingPackages: packages.filter((p) => p.status === 'WAITING').length,
      upcomingReservations: reservations.filter((r) => r.status === 'CONFIRMED').length,
      activePets: pets.length,
    });
  }

  // ── Fallback ─────────────────────────────────────────────────
  console.warn(`[mock] No handler for ${m} ${path}`);
  return ok(null);
}
