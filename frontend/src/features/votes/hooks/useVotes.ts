import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { VoteSession } from '@condovida/shared';

export function useVotes() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['votes'],
    queryFn: async () => {
      const r = await apiClient.get<{ data: VoteSession[] }>('/votes');
      return r.data.data;
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({ sessionId, optionId }: { sessionId: string; optionId: string }) => {
      const r = await apiClient.post(`/votes/${sessionId}/vote`, { optionId });
      return r.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['votes'] }),
  });

  const generateMinutesMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const r = await apiClient.post(`/votes/${sessionId}/generate-minutes`);
      return r.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['votes'] }),
  });

  return {
    voteSessions: query.data || [],
    isLoading: query.isLoading,
    vote: voteMutation.mutate,
    generateMinutes: generateMinutesMutation.mutate,
    isVoting: voteMutation.isPending,
  };
}
