// ── Enums ────────────────────────────────────────────────────

export enum Role {
  RESIDENT = 'RESIDENT',
  SINDICO = 'SINDICO',
  COUNCIL = 'COUNCIL',
  PORTEIRO = 'PORTEIRO',
  ADMIN = 'ADMIN',
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketCategory {
  COMPLAINT = 'COMPLAINT',
  MAINTENANCE = 'MAINTENANCE',
  SUGGESTION = 'SUGGESTION',
  QUESTION = 'QUESTION',
}

export enum AnnouncementPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum VoteSessionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum VisitorType {
  VISITOR = 'VISITOR',
  PROVIDER = 'PROVIDER',
  DELIVERY = 'DELIVERY',
}

export enum MaintenanceFrequency {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMIANNUAL = 'SEMIANNUAL',
  ANNUAL = 'ANNUAL',
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  OVERDUE = 'OVERDUE',
}

export enum PackageStatus {
  WAITING = 'WAITING',
  PICKED_UP = 'PICKED_UP',
}

export enum ListingType {
  SALE = 'SALE',
  DONATION = 'DONATION',
  RENT = 'RENT',
}

export enum NotificationType {
  PACKAGE = 'PACKAGE',
  PAYMENT = 'PAYMENT',
  RESERVATION = 'RESERVATION',
  ASSEMBLY = 'ASSEMBLY',
  TICKET = 'TICKET',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  GENERAL = 'GENERAL',
}

// ── Core Domain Types ────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  unit: string;
  block: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resident extends User {
  phone?: string;
  cpf?: string;
  active?: boolean;
  activeReservations?: number;
  pendingPayments?: number;
}

// ── Reservations ────────────────────────────────────────────

export interface CommonArea {
  id: string;
  name: string;
  capacity: number;
  rules: string;
  ratePerUse: number;
  minDaysAdvance: number;
  maxReservationsPerMonth: number;
  iconName: string;
}

export interface Reservation {
  id: string;
  areaId: string;
  area?: CommonArea;
  residentId: string;
  resident?: Pick<User, 'id' | 'name' | 'unit' | 'block'>;
  date: string;
  timeSlot: string;
  status: ReservationStatus;
  notes?: string;
  createdAt: string;
}

// ── Finances ────────────────────────────────────────────────

export interface Payment {
  id: string;
  residentId: string;
  month: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  barcode?: string;
  receiptUrl?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdBy: string;
}

export interface ExpenseSplit {
  id: string;
  description: string;
  total: number;
  unitCount: number;
  perUnit: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
  approvedBy?: string;
}

export interface RevenueMonth {
  month: string;
  revenue: number;
  expenses: number;
}

// ── Tickets ─────────────────────────────────────────────────

export interface TicketResponse {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  isAdmin: boolean;
  text: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  residentId: string;
  resident?: Pick<User, 'id' | 'name' | 'unit' | 'block'>;
  hasPhoto: boolean;
  responses: TicketResponse[];
  createdAt: string;
  updatedAt: string;
}

// ── Announcements ────────────────────────────────────────────

export interface Announcement {
  id: string;
  title: string;
  body: string;
  priority: AnnouncementPriority;
  author: string;
  pinned: boolean;
  createdAt: string;
}

// ── Polls ────────────────────────────────────────────────────

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  deadline: string;
  totalUnits: number;
  /** alias for totalUnits — used in UI components */
  totalEligible: number;
  hasVoted: boolean;
  /** alias for hasVoted */
  userVoted: boolean;
  createdBy: string;
  createdAt: string;
}

// ── Assembly Votes ───────────────────────────────────────────

export interface VoteOption {
  id: string;
  text: string;
  votes: number;
}

export interface VoteSession {
  id: string;
  title: string;
  description: string;
  options: VoteOption[];
  deadline: string;
  status: VoteSessionStatus;
  quorum: number;
  totalUnits: number;
  /** alias for totalUnits — used in UI components */
  totalEligible: number;
  hasVoted: boolean;
  /** alias for hasVoted */
  userVoted: boolean;
  minutes?: string;
  createdBy: string;
  createdAt: string;
}

// ── Gateway (Portaria) ───────────────────────────────────────

export interface Visitor {
  id: string;
  name: string;
  type: VisitorType;
  date: string;
  scheduledTime: string;
  unit: string;
  block: string;
  document?: string;
  qrCode: string;
  status: 'AUTHORIZED' | 'ENTERED' | 'LEFT' | 'DENIED';
  authorizedBy: string;
  createdAt: string;
}

export interface Package {
  id: string;
  description: string;
  unit: string;
  block: string;
  arrivedAt: string;
  pickedUpAt?: string;
  status: PackageStatus;
  carrier?: string;
  trackingCode?: string;
  receivedBy: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  company?: string;
  service: string;
  unit: string;
  block: string;
  entryTime: string;
  exitTime?: string;
  authorizedBy: string;
}

// ── Chat ─────────────────────────────────────────────────────

export interface ChatChannel {
  id: string;
  name: string;
  iconName: string;
  description?: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  authorId: string;
  authorName: string;
  authorUnit: string;
  text: string;
  createdAt: string;
}

// ── Marketplace ──────────────────────────────────────────────

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  type: ListingType;
  sellerId: string;
  sellerName: string;
  sellerUnit: string;
  active: boolean;
  imageUrl?: string;
  createdAt: string;
}

// ── Maintenance ──────────────────────────────────────────────

export interface MaintenanceTask {
  id: string;
  title: string;
  frequency: MaintenanceFrequency | string;
  nextDate: string;
  lastDate?: string;
  provider: string;
  status: MaintenanceStatus | string;
  notes?: string;
  createdAt: string;
}

// ── Notifications ────────────────────────────────────────────

export interface Notification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  relatedId?: string;
  createdAt: string;
}

// ── API Response wrappers ────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// ── Auth ─────────────────────────────────────────────────────

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/** @alias LoginResponse */
export type AuthResponse = LoginResponse;

// ── Finance Summary ──────────────────────────────────────────

export interface FinanceSummary {
  month: string;
  revenue: number;
  expenses: number;
}

// ── Aliases ──────────────────────────────────────────────────

/** @alias ListingType — kept for component compatibility */
export { ListingType as MarketplaceType };
