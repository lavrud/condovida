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
  Notification, ParkingSpot, ParkingReservation, Moving, CondoDocument,
  ConsumptionRecord, LostItem, Pet, RegulationChapter, UserSettings,
} from '@condovida/shared';

// ── Users / Residents ───────────────────────────────────────

export const USERS: User[] = [
  {
    id: '1', name: 'Demo User', email: 'demo@email.com',
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
    pixKey: '00020126580014br.gov.bcb.pix013600000000-0000-0000-0000-0000000000005204000053039865406980.005802BR5925CondoVida Administracao6009SAO PAULO62070503***6304ABCD',
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
    carrier: 'Amazon', receivedBy: 'Totem', deliveryToken: 'X9K2M4',
  },
  {
    id: '2', description: 'Correios — Carta registrada', unit: '304', block: 'B',
    arrivedAt: '2026-03-28T11:00:00Z', pickedUpAt: '2026-03-28T18:20:00Z',
    status: PackageStatus.PICKED_UP, carrier: 'Correios', receivedBy: 'Totem', deliveryToken: 'B7T5R2',
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

// ── Parking ────────────────────────────────────────────────────

export const parkingSpots: ParkingSpot[] = [
  { id: '1', number: 'V01', block: 'A', type: 'VISITOR', status: 'AVAILABLE' },
  { id: '2', number: 'V02', block: 'A', type: 'VISITOR', status: 'OCCUPIED' },
  { id: '3', number: '101', block: 'A', ownerUnit: '101', ownerBlock: 'A', type: 'RESIDENT', status: 'OCCUPIED' },
  { id: '4', number: '304', block: 'B', ownerUnit: '304', ownerBlock: 'B', type: 'RESIDENT', status: 'AVAILABLE' },
  { id: '5', number: '203', block: 'B', ownerUnit: '203', ownerBlock: 'B', type: 'RESIDENT', status: 'OCCUPIED' },
  { id: '6', number: 'D01', block: 'A', type: 'DISABLED', status: 'AVAILABLE' },
];

export const parkingReservations: ParkingReservation[] = [
  {
    id: '1', spotId: '1', spotNumber: 'V01', residentId: '2', residentName: 'Camila Rodrigues',
    unit: '101', block: 'A', date: '2026-04-05', startTime: '14:00', endTime: '18:00',
    status: 'CONFIRMED', createdAt: '2026-04-03T09:00:00Z',
  },
];

// ── Moving ─────────────────────────────────────────────────────

export const movings: Moving[] = [
  {
    id: '1', residentId: '3', residentName: 'Rafael Souza', unit: '502', block: 'A',
    date: '2026-04-10', startTime: '08:00', endTime: '14:00', type: 'OUT',
    elevator: true, notes: 'Mudança completa.', status: 'CONFIRMED',
    createdAt: '2026-04-01T10:00:00Z',
  },
];

// ── Documents ──────────────────────────────────────────────────

export const documents: CondoDocument[] = [
  { id: '1', title: 'Ata Assembleia Mar/2026', category: 'ATA', fileUrl: '#', fileSize: '420 KB', uploadedBy: 'Síndico', createdAt: '2026-03-16T10:00:00Z' },
  { id: '2', title: 'Regulamento Interno 2024', category: 'REGULAMENTO', fileUrl: '#', fileSize: '1.2 MB', uploadedBy: 'Síndico', createdAt: '2024-01-10T10:00:00Z' },
  { id: '3', title: 'Balancete Fev/2026', category: 'FINANCEIRO', fileUrl: '#', fileSize: '210 KB', uploadedBy: 'Síndico', createdAt: '2026-03-05T10:00:00Z' },
  { id: '4', title: 'Contrato Limpeza 2026', category: 'CONTRATO', fileUrl: '#', fileSize: '380 KB', uploadedBy: 'Síndico', createdAt: '2026-01-15T10:00:00Z' },
  { id: '5', title: 'Planta Hidráulica', category: 'OBRA', fileUrl: '#', fileSize: '2.8 MB', uploadedBy: 'Síndico', createdAt: '2024-06-20T10:00:00Z' },
];

// ── Consumption ────────────────────────────────────────────────

export const consumption: ConsumptionRecord[] = [
  { id: '1', unit: '304', block: 'B', month: 'Jan/2026', water: 12.4, energy: 180, waterCost: 87, energyCost: 210 },
  { id: '2', unit: '304', block: 'B', month: 'Fev/2026', water: 11.8, energy: 195, waterCost: 82, energyCost: 228 },
  { id: '3', unit: '304', block: 'B', month: 'Mar/2026', water: 13.2, energy: 172, waterCost: 92, energyCost: 201 },
  { id: '4', unit: '304', block: 'B', month: 'Abr/2026', water: 10.9, energy: 165, waterCost: 76, energyCost: 193 },
];

// ── Lost & Found ───────────────────────────────────────────────

export const lostItems: LostItem[] = [
  {
    id: '1', title: 'Chave com chaveiro azul', description: 'Encontrada no elevador social.',
    foundAt: 'Elevador Social', foundBy: 'Portaria', foundByUnit: 'Portaria',
    status: 'AVAILABLE', createdAt: '2026-04-01T08:30:00Z',
  },
  {
    id: '2', title: 'Óculos de sol feminino', description: 'Encontrado na piscina.',
    foundAt: 'Piscina', foundBy: 'Limpeza', foundByUnit: 'Portaria',
    status: 'AVAILABLE', createdAt: '2026-03-28T16:00:00Z',
  },
  {
    id: '3', title: 'Guarda-chuva preto', description: 'Achado no salão de festas.',
    foundAt: 'Salão de Festas', foundBy: 'Camila Rodrigues', foundByUnit: '101-A',
    status: 'CLAIMED', claimedBy: 'Rafael Souza', createdAt: '2026-03-20T09:00:00Z',
  },
];

// ── Pets ───────────────────────────────────────────────────────

export const pets: Pet[] = [
  {
    id: '1', name: 'Thor', species: 'DOG', breed: 'Golden Retriever',
    ownerUnit: '304', ownerBlock: 'B', ownerName: 'Demo User',
    vaccinated: true, vaccineExpiry: '2026-12-01', createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: '2', name: 'Luna', species: 'CAT', breed: 'Persa',
    ownerUnit: '101', ownerBlock: 'A', ownerName: 'Camila Rodrigues',
    vaccinated: true, vaccineExpiry: '2026-08-15', createdAt: '2024-05-10T00:00:00Z',
  },
  {
    id: '3', name: 'Bob', species: 'DOG', breed: 'Labrador',
    ownerUnit: '502', ownerBlock: 'A', ownerName: 'Rafael Souza',
    vaccinated: false, createdAt: '2025-01-20T00:00:00Z',
  },
];

// ── Regulations ────────────────────────────────────────────────

export const regulations: RegulationChapter[] = [
  {
    id: '1', number: 'I', title: 'Das Disposições Gerais',
    articles: [
      { id: '1', chapterId: '1', number: '1º', title: 'Objeto', content: 'O presente regulamento tem por objetivo estabelecer as normas de convivência e utilização das áreas comuns do Condomínio CondoVida, visando o bem-estar de todos os condôminos.' },
      { id: '2', chapterId: '1', number: '2º', title: 'Aplicação', content: 'As disposições deste regulamento aplicam-se a todos os condôminos, locatários, ocupantes e visitantes.' },
    ],
  },
  {
    id: '2', number: 'II', title: 'Das Áreas Comuns',
    articles: [
      { id: '3', chapterId: '2', number: '3º', title: 'Piscina', content: 'O uso da piscina é permitido das 08h às 22h. É obrigatório o uso de touca e proibido o consumo de alimentos na borda.' },
      { id: '4', chapterId: '2', number: '4º', title: 'Salão de Festas', content: 'O salão deve ser reservado com antecedência mínima de 72h. O condômino responsável deverá entregar o espaço limpo até 23h.' },
      { id: '5', chapterId: '2', number: '5º', title: 'Academia', content: 'Horário de funcionamento: 06h às 23h. É obrigatório o uso de tênis e toalha. Menores de 16 anos devem ser acompanhados.' },
    ],
  },
  {
    id: '3', number: 'III', title: 'Dos Animais de Estimação',
    articles: [
      { id: '6', chapterId: '3', number: '6º', title: 'Circulação', content: 'Animais devem circular nas áreas comuns com coleira e guia, conduzidos pelo responsável. É obrigatório o recolhimento de dejetos.' },
      { id: '7', chapterId: '3', number: '7º', title: 'Cadastro', content: 'Todos os animais devem ser cadastrados na administração com carteira de vacinação atualizada.' },
    ],
  },
  {
    id: '4', number: 'IV', title: 'Do Silêncio e Convivência',
    articles: [
      { id: '8', chapterId: '4', number: '8º', title: 'Horário de Silêncio', content: 'É obrigatório o silêncio entre 22h e 08h nos dias úteis, e entre 23h e 09h nos fins de semana e feriados.' },
      { id: '9', chapterId: '4', number: '9º', title: 'Obras', content: 'Obras são permitidas de segunda a sexta das 08h às 17h e sábados das 09h às 13h. Proibidas aos domingos e feriados.' },
    ],
  },
];

// ── User Settings ──────────────────────────────────────────────

export const userSettings: Record<string, UserSettings> = {
  '1': { notifyAnnouncements: true, notifyPackages: true, notifyTickets: true, notifyFinances: true, notifyChat: false },
  '2': { notifyAnnouncements: true, notifyPackages: true, notifyTickets: true, notifyFinances: false, notifyChat: true },
};

// ── ID counter ─────────────────────────────────────────────────
let _nextId = 100;
export function nextId(): string {
  return String(++_nextId);
}
