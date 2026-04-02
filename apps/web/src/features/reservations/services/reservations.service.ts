import { apiClient } from '../../../lib/api-client';
import { Reservation } from '@condovida/shared';
import { COMMON_AREAS } from '@condovida/shared';

export const reservationsService = {
  getAreas: () => COMMON_AREAS,

  async findAll(mine = false): Promise<Reservation[]> {
    const r = await apiClient.get<{ data: Reservation[] }>(`/reservations${mine ? '?mine=true' : ''}`);
    return r.data.data;
  },

  async create(data: { areaId: string; date: string; timeSlot: string; notes?: string }): Promise<Reservation> {
    const r = await apiClient.post<{ data: Reservation }>('/reservations', data);
    return r.data.data;
  },

  async cancel(id: string): Promise<void> {
    await apiClient.delete(`/reservations/${id}`);
  },

  async approve(id: string): Promise<Reservation> {
    const r = await apiClient.patch<{ data: Reservation }>(`/reservations/${id}/approve`);
    return r.data.data;
  },
};
