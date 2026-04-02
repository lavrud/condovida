import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { Announcement, Poll, VoteSession, Payment, Notification } from '@condovida/shared';

export function useDashboard() {
  const announcements = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const r = await apiClient.get<{ data: Announcement[] }>('/announcements');
      return r.data.data;
    },
  });

  const polls = useQuery({
    queryKey: ['polls'],
    queryFn: async () => {
      const r = await apiClient.get<{ data: Poll[] }>('/polls');
      return r.data.data;
    },
  });

  const votes = useQuery({
    queryKey: ['votes'],
    queryFn: async () => {
      const r = await apiClient.get<{ data: VoteSession[] }>('/votes');
      return r.data.data;
    },
  });

  const payments = useQuery({
    queryKey: ['payments', 'mine'],
    queryFn: async () => {
      const r = await apiClient.get<{ data: Payment[] }>('/finances/payments?mine=true');
      return r.data.data;
    },
  });

  const pendingPayment = payments.data?.find((p) => p.status === 'PENDING');
  const openVotes = votes.data?.filter((v) => v.status === 'OPEN' && !v.userVoted) || [];
  const unvotedPolls = polls.data?.filter((p) => !p.userVoted) || [];

  return {
    announcements: announcements.data || [],
    pendingPayment,
    openVotes,
    unvotedPolls,
    isLoading: announcements.isLoading || polls.isLoading || votes.isLoading,
  };
}
