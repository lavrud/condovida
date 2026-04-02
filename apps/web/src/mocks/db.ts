/**
 * In-memory mock database — mirrors the seed data from condovida-v2.jsx
 * All arrays are mutable so mutations (create/update/delete) persist during the session.
 */
import {
  Role, ReservationStatus, PaymentStatus, TicketStatus, TicketCategory,
  AnnouncementPriority, VoteSessionStatus, VisitorType, PackageStatus,
  ListingType, NotificationType, MaintenanceStatus, MaintenanceFrequency,
  User, Resident, Reservation, Payment, Expense, ExpenseSplit, RevenueMonth,
  Ticket, TicketResponse, Announcement, Poll, VoteSession, Visitor, Package,
  ServiceProvider, ChatChannel, ChatMessage, MarketplaceListing, MaintenanceTask,
  Notification,
} from '@condovida/shared';

// ── Users / Residents ───────────────────────────────────────

export const USERS: User[] = [
  {
    id: '1', name: 'Durval Martins', email: 'durval@email.com',
    role: Role.SINDICO, unit: '304', block: 'B', avatar: 'D',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2', name: 'Camila Rodrigues', email: 'camila@email.com',
    role: Role.RESIDENT, unit: '101', block: 'A', avatar: 'C',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3', name: 'Rafael Souza', email: 'rafael@email.com',
    role: Role.RESIDENT, unit: '502', block: 'A', avatar: 'R',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4', name: 'Beatriz Lima', email: 'beatriz@email.com',
    role: Role.COUNCIL, unit: '203', block: 'B', avatar: 'B',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const RESIDENTS: Resident[] = USERS.map((u) => ({
  ...u,
  active: true,
  activeReservations: 0,
  pendingPayments: 0,
}));

// Password map for mock login
export const PASSWORDS: Record<string, string> = {
  'durval@email.com': 'senha123',
  'camila@email.com': 'senha123',
  'rafael@email.com': 'senha123',
  'beatriz@email.com': 'senha123',
};

// ── Payments ────────────────────────────────────────────────

export const payments: Payment[] = [
  {
    id: '1', residentId: '1', month: 'Mar/2026', amount: 980,
    dueDate: '2026-03-10', paidDate: '2026-03-08', status: PaymentStatus.PAID,
    barcode: '23793.38128 60000.000003 00000.000402 1 92340000098000',
  },
  {
    id: '2', residentId: '1', month: 'Abr/2026', amount: 980,
    dueDate: '2026-04-10', paidDate: undefined, status: PaymentStatus.PENDING,
    barcode: '23793.38128 60000.000003 00000.000402 2 93340000098000',
  },
  {
    id: '3', residentId: '1', month: 'Fev/2026', amount: 950,
    dueDate: '2026-02-10', paidDate: '2026-02-10', status: PaymentStatus.PAID,
  },
  {
    id: '4', residentId: '1', month: 'Jan/2026', amount: 950,
    dueDate: '2026-01-10', paidDate: '2026-01-09', status: PaymentStatus.PAID,
  },
];

// ── Expenses ─────────────────────────────────────────────────

export const expenses: Expense[] = [
  { id: '1', description: 'Folha funcionários', amount: 12500, category: 'staff', date: '2026-03-05', createdBy: '1' },
  { id: '2', description: 'Energia elétrica', amount: 4200, category: 'utilities', date: '2026-03-10', createdBy: '1' },
  { id: '3', description: 'Água/esgoto', amount: 3100, category: 'utilities', date: '2026-03-10', createdBy: '1' },
  { id: '4', description: 'Manutenção elevadores', amount: 2800, category: 'maintenance', date: '2026-03-15', createdBy: '1' },
  { id: '5', description: 'Segurança/portaria', amount: 5600, category: 'security', date: '2026-03-05', createdBy: '1' },
  { id: '6', description: 'Limpeza', amount: 3200, category: 'staff', date: '2026-03-05', createdBy: '1' },
];

export const splits: ExpenseSplit[] = [
  {
    id: '1', description: 'Reparo bomba piscina', total: 4800,
    unitCount: 40, perUnit: 120, status: 'APPROVED', date: '2026-03-20',
  },
];

export const revenue: RevenueMonth[] = [
  { month: 'Jan', revenue: 38000, expenses: 29500 },
  { month: 'Fev', revenue: 36500, expenses: 31200 },
  { month: 'Mar', revenue: 39200, expenses: 28800 },
];

// ── Reservations ─────────────────────────────────────────────

export const reservations: Reservation[] = [
  {
    id: '1', areaId: 'churrasqueira', date: '2026-04-05',
    timeSlot: '14:00–18:00', residentId: '1', status: ReservationStatus.CONFIRMED,
    createdAt: '2026-03-20T10:00:00Z',
  },
  {
    id: '2', areaId: 'salao', date: '2026-04-12',
    timeSlot: '18:00–23:00', residentId: '1', status: ReservationStatus.PENDING,
    createdAt: '2026-03-22T10:00:00Z',
  },
];

// ── Tickets ──────────────────────────────────────────────────

export const tickets: Ticket[] = [
  {
    id: '1', title: 'Barulho excessivo 201A',
    description: 'Som alto após 22h, sextas recorrentes.',
    category: TicketCategory.COMPLAINT, status: TicketStatus.OPEN,
    residentId: '1', hasPhoto: false,
    responses: [
      { id: 'r1', ticketId: '1', authorId: '0', authorName: 'Administração', isAdmin: true, text: 'Notificação enviada ao morador.', createdAt: '2026-03-26T09:00:00Z' },
    ],
    createdAt: '2026-03-25T08:00:00Z', updatedAt: '2026-03-26T09:00:00Z',
  },
  {
    id: '2', title: 'Interfone sem som 304B',
    description: 'Interfone não funciona desde segunda.',
    category: TicketCategory.MAINTENANCE, status: TicketStatus.IN_PROGRESS,
    residentId: '1', hasPhoto: true, responses: [],
    createdAt: '2026-03-28T07:30:00Z', updatedAt: '2026-03-28T07:30:00Z',
  },
];

// ── Announcements ─────────────────────────────────────────────

export const announcements: Announcement[] = [
  {
    id: '1', title: 'Assembleia Geral Ordinária',
    body: 'Dia 15/04 às 19h no salão de festas. Pauta: orçamento anual.',
    priority: AnnouncementPriority.HIGH, author: 'Síndico',
    pinned: true, createdAt: '2026-03-28T08:00:00Z',
  },
  {
    id: '2', title: 'Piscina em manutenção',
    body: 'Fechada de 01 a 05/04 para limpeza e troca de areia.',
    priority: AnnouncementPriority.MEDIUM, author: 'Administração',
    pinned: false, createdAt: '2026-03-25T10:00:00Z',
  },
  {
    id: '3', title: 'Portaria 24h com biometria',
    body: 'A partir de abril. Cadastre suas digitais na portaria.',
    priority: AnnouncementPriority.LOW, author: 'Síndico',
    pinned: false, createdAt: '2026-03-20T09:00:00Z',
  },
];

// ── Polls ─────────────────────────────────────────────────────

export const polls: Poll[] = [
  {
    id: '1',
    question: 'Você aprova a instalação de câmeras no playground?',
    options: [
      { id: 'p1o1', text: 'Sim, aprovo', votes: 18 },
      { id: 'p1o2', text: 'Não aprovo', votes: 5 },
      { id: 'p1o3', text: 'Indiferente', votes: 3 },
    ],
    deadline: '2026-04-10',
    totalUnits: 40,
    totalEligible: 40,
    hasVoted: false,
    userVoted: false,
    createdBy: '1',
    createdAt: '2026-03-20T08:00:00Z',
  },
];

// ── Assembly Votes ────────────────────────────────────────────

export const voteSessions: VoteSession[] = [
  {
    id: '1',
    title: 'Aprovação da pintura da fachada',
    description: 'Investimento de R$ 85.000. Empresa Alfa Pinturas foi aprovada em cotação.',
    options: [
      { id: 'v1o1', text: 'Aprovar', votes: 24 },
      { id: 'v1o2', text: 'Reprovar', votes: 8 },
      { id: 'v1o3', text: 'Abstém', votes: 3 },
    ],
    deadline: '2026-04-20',
    status: VoteSessionStatus.OPEN,
    quorum: 26,
    totalUnits: 40,
    totalEligible: 40,
    hasVoted: false,
    userVoted: false,
    createdBy: '1',
    createdAt: '2026-03-27T08:00:00Z',
  },
];

// ── Gateway ────────────────────────────────────────────────────

export const visitors: Visitor[] = [
  {
    id: '1', name: 'João Eletricista', type: VisitorType.PROVIDER,
    date: '2026-03-30', scheduledTime: '09:00', unit: '304', block: 'B',
    qrCode: 'XK9F2M4A', status: 'AUTHORIZED', authorizedBy: '1',
    createdAt: '2026-03-29T15:00:00Z',
  },
  {
    id: '2', name: 'Maria (mãe)', type: VisitorType.VISITOR,
    date: '2026-04-02', scheduledTime: '14:00', unit: '304', block: 'B',
    qrCode: 'BN7T5R2Q', status: 'AUTHORIZED', authorizedBy: '1',
    createdAt: '2026-03-30T10:00:00Z',
  },
];

export const packages: Package[] = [
  {
    id: '1', description: 'Amazon — Caixa grande', unit: '304', block: 'B',
    arrivedAt: '2026-03-30T14:30:00Z', status: PackageStatus.WAITING,
    carrier: 'Amazon', receivedBy: 'Portaria',
  },
  {
    id: '2', description: 'Correios — Carta registrada', unit: '304', block: 'B',
    arrivedAt: '2026-03-28T11:00:00Z', pickedUpAt: '2026-03-28T18:20:00Z',
    status: PackageStatus.PICKED_UP, carrier: 'Correios', receivedBy: 'Portaria',
  },
];

export const serviceProviders: ServiceProvider[] = [
  {
    id: '1', name: 'Carlos — Encanador', service: 'Reparo vazamento',
    unit: '203', block: 'B', entryTime: '2026-03-30T08:30:00Z',
    exitTime: '2026-03-30T11:45:00Z', authorizedBy: '1',
  },
];

// ── Chat ──────────────────────────────────────────────────────

export const chatChannels: ChatChannel[] = [
  { id: 'geral', name: 'Geral', iconName: 'Globe', description: 'Canal geral do condomínio' },
  { id: 'blocoB', name: 'Bloco B', iconName: 'Building', description: 'Moradores do Bloco B' },
  { id: 'sindico', name: 'Síndico', iconName: 'Shield', description: 'Fale com o síndico' },
];

export const chatMessages: Record<string, ChatMessage[]> = {
  geral: [
    { id: 'm1', channelId: 'geral', authorId: '2', authorName: 'Camila R.', authorUnit: '101-A', text: 'Alguém sabe o horário da assembleia?', createdAt: '2026-03-28T10:30:00Z' },
    { id: 'm2', channelId: 'geral', authorId: '1', authorName: 'Síndico', authorUnit: '304-B', text: 'Dia 15/04 às 19h no salão!', createdAt: '2026-03-28T10:45:00Z' },
    { id: 'm3', channelId: 'geral', authorId: '3', authorName: 'Rafael S.', authorUnit: '502-A', text: 'Obrigado!', createdAt: '2026-03-28T11:02:00Z' },
  ],
  blocoB: [],
  sindico: [],
};

// ── Marketplace ────────────────────────────────────────────────

export const listings: MarketplaceListing[] = [
  {
    id: '1', title: 'Sofá 3 lugares cinza', description: 'Bom estado, 2 anos de uso.',
    price: 800, type: ListingType.SALE, sellerId: '2', sellerName: 'Camila R.',
    sellerUnit: '101-A', active: true, createdAt: '2026-03-28T08:00:00Z',
  },
  {
    id: '2', title: 'Bicicleta infantil aro 16', description: 'Doação. Retirar na garagem B2.',
    price: 0, type: ListingType.DONATION, sellerId: '3', sellerName: 'Fernando C.',
    sellerUnit: '405-C', active: true, createdAt: '2026-03-25T08:00:00Z',
  },
];

// ── Maintenance ────────────────────────────────────────────────

export const maintenanceTasks: MaintenanceTask[] = [
  {
    id: '1', title: 'Revisão elevadores', frequency: MaintenanceFrequency.MONTHLY,
    nextDate: '2026-04-15', provider: 'ThyssenKrupp',
    status: MaintenanceStatus.SCHEDULED, createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: '2', title: 'Limpeza caixa d\'água', frequency: MaintenanceFrequency.SEMIANNUAL,
    nextDate: '2026-06-01', provider: 'HidroClean',
    status: MaintenanceStatus.SCHEDULED, createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: '3', title: 'Recarga extintores', frequency: MaintenanceFrequency.ANNUAL,
    nextDate: '2026-08-01', provider: 'Extinfor ES',
    status: MaintenanceStatus.SCHEDULED, createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: '4', title: 'Desinsetização', frequency: MaintenanceFrequency.QUARTERLY,
    nextDate: '2026-04-20', provider: 'PragOff',
    status: MaintenanceStatus.SCHEDULED, createdAt: '2026-01-01T00:00:00Z',
  },
];

// ── Notifications ──────────────────────────────────────────────

export const notifications: Notification[] = [
  {
    id: '1', recipientId: '1', type: NotificationType.PACKAGE,
    title: 'Encomenda na portaria', body: 'Amazon — retirar até 02/04.',
    read: false, relatedId: '1', createdAt: '2026-03-30T14:30:00Z',
  },
  {
    id: '2', recipientId: '1', type: NotificationType.PAYMENT,
    title: 'Boleto abril disponível', body: 'R$ 980,00 — vencimento 10/04.',
    read: false, createdAt: '2026-04-01T09:00:00Z',
  },
  {
    id: '3', recipientId: '1', type: NotificationType.RESERVATION,
    title: 'Reserva confirmada', body: 'Churrasqueira — 05/04.',
    read: true, createdAt: '2026-03-29T10:00:00Z',
  },
  {
    id: '4', recipientId: '1', type: NotificationType.ASSEMBLY,
    title: 'Votação aberta', body: 'Pintura fachada — vote até 20/04.',
    read: true, createdAt: '2026-03-27T08:00:00Z',
  },
];

// ── ID counter ─────────────────────────────────────────────────
let _nextId = 100;
export function nextId(): string {
  return String(++_nextId);
}
