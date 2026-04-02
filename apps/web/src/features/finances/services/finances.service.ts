import { apiClient } from '../../../lib/api-client';
import { Payment, Expense, ExpenseSplit, FinanceSummary } from '@condovida/shared';

export const financesService = {
  async getPayments(mine = false): Promise<Payment[]> {
    const r = await apiClient.get<{ data: Payment[] }>(`/finances/payments${mine ? '?mine=true' : ''}`);
    return r.data.data;
  },

  async payPayment(id: string): Promise<Payment> {
    const r = await apiClient.patch<{ data: Payment }>(`/finances/payments/${id}/pay`);
    return r.data.data;
  },

  async getExpenses(): Promise<Expense[]> {
    const r = await apiClient.get<{ data: Expense[] }>('/finances/expenses');
    return r.data.data;
  },

  async createExpense(data: { description: string; amount: number; category: string; date: string }): Promise<Expense> {
    const r = await apiClient.post<{ data: Expense }>('/finances/expenses', data);
    return r.data.data;
  },

  async getSplits(): Promise<ExpenseSplit[]> {
    const r = await apiClient.get<{ data: ExpenseSplit[] }>('/finances/splits');
    return r.data.data;
  },

  async createSplit(data: { description: string; total: number; units: number }): Promise<ExpenseSplit> {
    const r = await apiClient.post<{ data: ExpenseSplit }>('/finances/splits', data);
    return r.data.data;
  },

  async getRevenueSummary(): Promise<FinanceSummary[]> {
    const r = await apiClient.get<{ data: FinanceSummary[] }>('/finances/summary');
    return r.data.data;
  },
};
