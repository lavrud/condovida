import { z } from 'zod';
import { TicketCategory, ListingType, VisitorType } from '../types';

// ── Auth ─────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// ── Residents ────────────────────────────────────────────────

export const CreateResidentSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  unit: z.string().min(1, 'Unidade obrigatória'),
  block: z.string().min(1, 'Bloco obrigatório'),
  phone: z.string().optional(),
  cpf: z.string().optional(),
});

export type CreateResidentInput = z.infer<typeof CreateResidentSchema>;

// ── Reservations ─────────────────────────────────────────────

export const CreateReservationSchema = z.object({
  areaId: z.string().min(1, 'Área obrigatória'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  timeSlot: z.string().min(1, 'Horário obrigatório'),
  notes: z.string().optional(),
});

export type CreateReservationInput = z.infer<typeof CreateReservationSchema>;

// ── Tickets ──────────────────────────────────────────────────

export const CreateTicketSchema = z.object({
  title: z.string().min(5, 'Título muito curto'),
  description: z.string().min(10, 'Descreva melhor o problema'),
  category: z.nativeEnum(TicketCategory),
  hasPhoto: z.boolean().default(false),
});

export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;

export const AddTicketResponseSchema = z.object({
  text: z.string().min(1, 'Resposta obrigatória'),
});

export type AddTicketResponseInput = z.infer<typeof AddTicketResponseSchema>;

// ── Announcements ────────────────────────────────────────────

export const CreateAnnouncementSchema = z.object({
  title: z.string().min(5, 'Título muito curto'),
  body: z.string().min(10, 'Corpo muito curto'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('LOW'),
  pinned: z.boolean().default(false),
});

export type CreateAnnouncementInput = z.infer<typeof CreateAnnouncementSchema>;

// ── Polls ────────────────────────────────────────────────────

export const CreatePollSchema = z.object({
  question: z.string().min(5, 'Pergunta muito curta'),
  options: z.array(z.string().min(1)).min(2, 'Mínimo 2 opções'),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
});

export type CreatePollInput = z.infer<typeof CreatePollSchema>;

// ── Assembly Votes ───────────────────────────────────────────

export const CreateVoteSessionSchema = z.object({
  title: z.string().min(5, 'Título muito curto'),
  description: z.string().min(10, 'Descrição muito curta'),
  options: z.array(z.string().min(1)).min(2, 'Mínimo 2 opções'),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  quorum: z.number().int().min(1),
});

export type CreateVoteSessionInput = z.infer<typeof CreateVoteSessionSchema>;

// ── Visitors ─────────────────────────────────────────────────

export const CreateVisitorSchema = z.object({
  name: z.string().min(3, 'Nome obrigatório'),
  type: z.nativeEnum(VisitorType),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido'),
  document: z.string().optional(),
});

export type CreateVisitorInput = z.infer<typeof CreateVisitorSchema>;

// ── Finances ─────────────────────────────────────────────────

export const CreateExpenseSchema = z.object({
  description: z.string().min(3, 'Descrição obrigatória'),
  amount: z.number().positive('Valor deve ser positivo'),
  category: z.string().min(1, 'Categoria obrigatória'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
});

export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>;

export const CreateSplitSchema = z.object({
  description: z.string().min(3, 'Descrição obrigatória'),
  total: z.number().positive('Valor deve ser positivo'),
  unitCount: z.number().int().positive(),
});

export type CreateSplitInput = z.infer<typeof CreateSplitSchema>;

// ── Marketplace ──────────────────────────────────────────────

export const CreateListingSchema = z.object({
  title: z.string().min(3, 'Título obrigatório'),
  description: z.string().min(5, 'Descrição obrigatória'),
  price: z.number().min(0),
  type: z.nativeEnum(ListingType),
});

export type CreateListingInput = z.infer<typeof CreateListingSchema>;

// ── Maintenance ──────────────────────────────────────────────

export const CreateMaintenanceSchema = z.object({
  title: z.string().min(3, 'Título obrigatório'),
  frequency: z.string().min(1, 'Frequência obrigatória'),
  nextDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  provider: z.string().min(2, 'Prestador obrigatório'),
  notes: z.string().optional(),
});

export type CreateMaintenanceInput = z.infer<typeof CreateMaintenanceSchema>;
