import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gatewayService } from '../services/gateway.service';
import { VisitorType } from '@condovida/shared';

export function useGateway() {
  const qc = useQueryClient();

  const visitors = useQuery({
    queryKey: ['visitors'],
    queryFn: gatewayService.getVisitors,
  });

  const packages = useQuery({
    queryKey: ['packages'],
    queryFn: gatewayService.getPackages,
  });

  const providers = useQuery({
    queryKey: ['providers'],
    queryFn: gatewayService.getProviders,
  });

  const createVisitorMutation = useMutation({
    mutationFn: gatewayService.createVisitor,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['visitors'] }),
  });

  const removeVisitorMutation = useMutation({
    mutationFn: gatewayService.removeVisitor,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['visitors'] }),
  });

  const pickupMutation = useMutation({
    mutationFn: gatewayService.pickupPackage,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['packages'] }),
  });

  const pendingPackages = packages.data?.filter((p) => p.status === 'WAITING') || [];

  return {
    visitors: visitors.data || [],
    packages: packages.data || [],
    providers: providers.data || [],
    pendingPackages,
    isLoading: visitors.isLoading || packages.isLoading,
    createVisitor: createVisitorMutation.mutate,
    removeVisitor: removeVisitorMutation.mutate,
    pickupPackage: pickupMutation.mutate,
    isCreatingVisitor: createVisitorMutation.isPending,
  };
}
