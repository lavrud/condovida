import { apiClient } from '../../../lib/api-client';
import { ChatChannel, ChatMessage } from '@condovida/shared';

export const chatService = {
  async getChannels(): Promise<ChatChannel[]> {
    const r = await apiClient.get<{ data: ChatChannel[] }>('/chat/channels');
    return r.data.data;
  },

  async getMessages(channelId: string, limit = 50): Promise<ChatMessage[]> {
    const r = await apiClient.get<{ data: ChatMessage[] }>(`/chat/channels/${channelId}/messages?limit=${limit}`);
    return r.data.data;
  },
};
