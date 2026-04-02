import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { MarketplaceListing, MarketplaceType } from '@condovida/shared';

export function useMarketplace() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['marketplace'],
    queryFn: async () => {
      const r = await apiClient.get<{ data: MarketplaceListing[] }>('/marketplace');
      return r.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; price: number; type: MarketplaceType }) => {
      const r = await apiClient.post<{ data: MarketplaceListing }>('/marketplace', data);
      return r.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['marketplace'] }),
  });

  const markSoldMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/marketplace/${id}/sold`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['marketplace'] }),
  });

  return {
    listings: query.data || [],
    isLoading: query.isLoading,
    create: createMutation.mutate,
    markSold: markSoldMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
