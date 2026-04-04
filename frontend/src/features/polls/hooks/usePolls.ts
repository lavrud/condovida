import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { Poll } from '@condovida/shared';

export function usePolls() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['polls'],
    queryFn: async () => {
      const r = await apiClient.get<{ data: Poll[] }>('/polls');
      return r.data.data;
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({ pollId, optionId }: { pollId: string; optionId: string }) => {
      const r = await apiClient.post(`/polls/${pollId}/vote`, { optionId });
      return r.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['polls'] }),
  });

  const createMutation = useMutation({
    mutationFn: async (data: { question: string; options: string[]; deadline: string }) => {
      const r = await apiClient.post<{ data: Poll }>('/polls', data);
      return r.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['polls'] }),
  });

  return {
    polls: query.data || [],
    isLoading: query.isLoading,
    vote: voteMutation.mutate,
    create: createMutation.mutate,
    isCreating: createMutation.isPending,
    isVoting: voteMutation.isPending,
  };
}
