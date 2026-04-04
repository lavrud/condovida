import { apiClient } from '../../../lib/api-client';
import { Ticket, TicketCategory } from '@condovida/shared';

export const ticketsService = {
  async findAll(): Promise<Ticket[]> {
    const r = await apiClient.get<{ data: Ticket[] }>('/tickets');
    return r.data.data;
  },

  async create(data: { title: string; description: string; category: TicketCategory; hasPhoto?: boolean }): Promise<Ticket> {
    const r = await apiClient.post<{ data: Ticket }>('/tickets', data);
    return r.data.data;
  },

  async addResponse(ticketId: string, text: string): Promise<void> {
    await apiClient.post(`/tickets/${ticketId}/responses`, { text });
  },
};
