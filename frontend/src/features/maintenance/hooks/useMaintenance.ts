import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { MaintenanceTask, MaintenanceFrequency } from '@condovida/shared';

export function useMaintenance() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      const r = await apiClient.get<{ data: MaintenanceTask[] }>('/maintenance');
      return r.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; frequency: MaintenanceFrequency; nextDate: string; provider: string }) => {
      const r = await apiClient.post<{ data: MaintenanceTask }>('/maintenance', data);
      return r.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['maintenance'] }),
  });

  const markDoneMutation = useMutation({
    mutationFn: async (id: string) => {
      const r = await apiClient.patch(`/maintenance/${id}/done`);
      return r.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['maintenance'] }),
  });

  return {
    tasks: query.data || [],
    isLoading: query.isLoading,
    create: createMutation.mutate,
    markDone: markDoneMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
