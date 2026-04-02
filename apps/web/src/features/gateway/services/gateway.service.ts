import { apiClient } from '../../../lib/api-client';
import { Visitor, Package, ServiceProvider, VisitorType } from '@condovida/shared';

export const gatewayService = {
  async getVisitors(): Promise<Visitor[]> {
    const r = await apiClient.get<{ data: Visitor[] }>('/gateway/visitors');
    return r.data.data;
  },

  async createVisitor(data: { name: string; type: VisitorType; date: string; time: string; unit: string }): Promise<Visitor> {
    const r = await apiClient.post<{ data: Visitor }>('/gateway/visitors', data);
    return r.data.data;
  },

  async removeVisitor(id: string): Promise<void> {
    await apiClient.delete(`/gateway/visitors/${id}`);
  },

  async getPackages(): Promise<Package[]> {
    const r = await apiClient.get<{ data: Package[] }>('/gateway/packages');
    return r.data.data;
  },

  async pickupPackage(id: string): Promise<Package> {
    const r = await apiClient.patch<{ data: Package }>(`/gateway/packages/${id}/pickup`);
    return r.data.data;
  },

  async getProviders(): Promise<ServiceProvider[]> {
    const r = await apiClient.get<{ data: ServiceProvider[] }>('/gateway/providers');
    return r.data.data;
  },
};
