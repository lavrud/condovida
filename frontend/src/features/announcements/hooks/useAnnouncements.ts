import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { Announcement, AnnouncementPriority } from '@condovida/shared';

export function useAnnouncements() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const r = await apiClient.get<{ data: Announcement[] }>('/announcements');
      return r.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; body: string; priority: AnnouncementPriority; pinned: boolean }) => {
      const r = await apiClient.post<{ data: Announcement }>('/announcements', data);
      return r.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/announcements/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  });

  return {
    announcements: query.data || [],
    isLoading: query.isLoading,
    create: createMutation.mutate,
    remove: deleteMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
