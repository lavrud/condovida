import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsService } from '../services/tickets.service';
import { TicketCategory } from '@condovida/shared';

export function useTickets() {
  const qc = useQueryClient();

  const tickets = useQuery({
    queryKey: ['tickets'],
    queryFn: ticketsService.findAll,
  });

  const createMutation = useMutation({
    mutationFn: ticketsService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets'] }),
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      ticketsService.addResponse(id, text),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets'] }),
  });

  return {
    tickets: tickets.data || [],
    isLoading: tickets.isLoading,
    create: createMutation.mutate,
    respond: respondMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
