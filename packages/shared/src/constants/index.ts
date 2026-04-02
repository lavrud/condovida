import { TicketCategory, AnnouncementPriority, ListingType, NotificationType } from '../types';

// ── Common Areas ─────────────────────────────────────────────

export const COMMON_AREAS = [
  {
    id: 'churrasqueira',
    name: 'Churrasqueira',
    iconName: 'Flame',
    capacity: 20,
    rules: 'Horário: 10h–22h. Limpeza obrigatória após uso.',
    ratePerUse: 150,
    minDaysAdvance: 2,
    maxReservationsPerMonth: 4,
  },
  {
    id: 'salao',
    name: 'Salão de Festas',
    iconName: 'PartyPopper',
    capacity: 60,
    rules: 'Antecedência mínima de 7 dias. Devolução até meia-noite.',
    ratePerUse: 350,
    minDaysAdvance: 7,
    maxReservationsPerMonth: 1,
  },
  {
    id: 'quadra',
    name: 'Quadra Esportiva',
    iconName: 'CircleDot',
    capacity: 12,
    rules: 'Máximo 2h por reserva. Calçado adequado obrigatório.',
    ratePerUse: 0,
    minDaysAdvance: 1,
    maxReservationsPerMonth: 8,
  },
  {
    id: 'piscina',
    name: 'Piscina',
    iconName: 'Waves',
    capacity: 30,
    rules: '8h–20h. Touca obrigatória. Crianças com acompanhante.',
    ratePerUse: 0,
    minDaysAdvance: 0,
    maxReservationsPerMonth: 0,
  },
  {
    id: 'academia',
    name: 'Academia',
    iconName: 'Dumbbell',
    capacity: 15,
    rules: '6h–22h. Toalha obrigatória. Higienizar equipamentos.',
    ratePerUse: 0,
    minDaysAdvance: 0,
    maxReservationsPerMonth: 0,
  },
  {
    id: 'coworking',
    name: 'Coworking',
    iconName: 'Coffee',
    capacity: 8,
    rules: '8h–20h. Silêncio. Limpeza da mesa após uso.',
    ratePerUse: 0,
    minDaysAdvance: 0,
    maxReservationsPerMonth: 0,
  },
] as const;

export const TIME_SLOTS = [
  '08:00–10:00',
  '10:00–12:00',
  '14:00–16:00',
  '16:00–18:00',
  '18:00–20:00',
  '20:00–22:00',
  '18:00–23:00',
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

// ── Ticket Categories ────────────────────────────────────────

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  [TicketCategory.COMPLAINT]: 'Reclamação',
  [TicketCategory.MAINTENANCE]: 'Manutenção',
  [TicketCategory.SUGGESTION]: 'Sugestão',
  [TicketCategory.QUESTION]: 'Dúvida',
};

/** @alias TICKET_CATEGORY_LABELS — kept for component compatibility */
export const TICKET_CATEGORIES = TICKET_CATEGORY_LABELS;

// ── Announcement Priorities ──────────────────────────────────

export const ANNOUNCEMENT_PRIORITY_LABELS: Record<AnnouncementPriority, string> = {
  [AnnouncementPriority.LOW]: 'Baixa',
  [AnnouncementPriority.MEDIUM]: 'Média',
  [AnnouncementPriority.HIGH]: 'Alta',
};

// ── Listing Types ────────────────────────────────────────────

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  [ListingType.SALE]: 'Venda',
  [ListingType.DONATION]: 'Doação',
  [ListingType.RENT]: 'Aluguel',
};

// ── Notification Types ───────────────────────────────────────

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  [NotificationType.PACKAGE]: 'Encomenda',
  [NotificationType.PAYMENT]: 'Boleto',
  [NotificationType.RESERVATION]: 'Reserva',
  [NotificationType.ASSEMBLY]: 'Assembleia',
  [NotificationType.TICKET]: 'Chamado',
  [NotificationType.ANNOUNCEMENT]: 'Comunicado',
  [NotificationType.GENERAL]: 'Geral',
};

// ── Maintenance Frequencies ──────────────────────────────────

export const MAINTENANCE_FREQUENCIES = [
  { value: 'WEEKLY', label: 'Semanal' },
  { value: 'MONTHLY', label: 'Mensal' },
  { value: 'QUARTERLY', label: 'Trimestral' },
  { value: 'SEMIANNUAL', label: 'Semestral' },
  { value: 'ANNUAL', label: 'Anual' },
] as const;

// ── Role Labels ──────────────────────────────────────────────

export const ROLE_LABELS = {
  RESIDENT: 'Morador',
  SINDICO: 'Síndico',
  COUNCIL: 'Conselho',
  PORTEIRO: 'Porteiro',
  ADMIN: 'Administrador',
} as const;

// ── Expense Categories ───────────────────────────────────────

export const EXPENSE_CATEGORIES = [
  { value: 'staff', label: 'Pessoal' },
  { value: 'utilities', label: 'Utilidades' },
  { value: 'maintenance', label: 'Manutenção' },
  { value: 'security', label: 'Segurança' },
  { value: 'admin', label: 'Administrativo' },
  { value: 'other', label: 'Outros' },
] as const;

export const EXPENSE_CATEGORY_COLORS: Record<string, string> = {
  staff: '#c45d3e',
  utilities: '#0070c0',
  maintenance: '#e6a817',
  security: '#2d7a4f',
  admin: '#7c3aed',
  other: '#78716c',
};
