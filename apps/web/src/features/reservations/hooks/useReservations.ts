import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsService } from '../services/reservations.service';
import { COMMON_AREAS, TIME_SLOTS } from '@condovida/shared';

export function useReservations() {
  const queryClient = useQueryClient();

  const myReservations = useQuery({
    queryKey: ['reservations', 'mine'],
    queryFn: () => reservationsService.findAll(true),
  });

  const createMutation = useMutation({
    mutationFn: reservationsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: reservationsService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });

  return {
    areas: COMMON_AREAS,
    timeSlots: TIME_SLOTS,
    reservations: myReservations.data || [],
    isLoading: myReservations.isLoading,
    create: createMutation.mutate,
    cancel: cancelMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
