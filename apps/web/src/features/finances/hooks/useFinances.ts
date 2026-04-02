import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financesService } from '../services/finances.service';

export function useFinances() {
  const qc = useQueryClient();

  const payments = useQuery({
    queryKey: ['payments', 'mine'],
    queryFn: () => financesService.getPayments(true),
  });

  const expenses = useQuery({
    queryKey: ['expenses'],
    queryFn: financesService.getExpenses,
  });

  const splits = useQuery({
    queryKey: ['splits'],
    queryFn: financesService.getSplits,
  });

  const summary = useQuery({
    queryKey: ['finances-summary'],
    queryFn: financesService.getRevenueSummary,
  });

  const payMutation = useMutation({
    mutationFn: financesService.payPayment,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payments'] }),
  });

  const createExpenseMutation = useMutation({
    mutationFn: financesService.createExpense,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
  });

  const createSplitMutation = useMutation({
    mutationFn: financesService.createSplit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['splits'] }),
  });

  return {
    payments: payments.data || [],
    expenses: expenses.data || [],
    splits: splits.data || [],
    summary: summary.data || [],
    isLoading: payments.isLoading,
    pay: payMutation.mutate,
    createExpense: createExpenseMutation.mutate,
    createSplit: createSplitMutation.mutate,
    isPayingId: payMutation.isPending,
  };
}
