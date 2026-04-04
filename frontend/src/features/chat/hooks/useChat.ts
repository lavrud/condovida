import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../../../store/auth.store';
import { chatService } from '../services/chat.service';
import { ChatMessage } from '@condovida/shared';
import { apiClient } from '../../../lib/api-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// ── Mock chat (HTTP polling) ──────────────────────────────────

function useMockChat(channelId: string) {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  const channels = useQuery({
    queryKey: ['chat-channels'],
    queryFn: chatService.getChannels,
  });

  const messages = useQuery({
    queryKey: ['chat-messages', channelId],
    queryFn: () => chatService.getMessages(channelId),
    refetchInterval: 3000,
  });

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !user) return;
      apiClient
        .post(`/chat/channels/${channelId}/messages`, { text: text.trim() })
        .then(() => qc.invalidateQueries({ queryKey: ['chat-messages', channelId] }));
    },
    [channelId, user, qc],
  );

  return {
    channels: channels.data || [],
    messages: messages.data || [],
    isConnected: true,
    sendMessage,
    currentUser: user,
  };
}

// ── Real socket.io chat ───────────────────────────────────────

function useSocketChat(channelId: string) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const channels = useQuery({
    queryKey: ['chat-channels'],
    queryFn: chatService.getChannels,
  });

  useEffect(() => {
    if (!token) return;

    const socket = io(`${WS_URL}/chat`, {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('joinChannel', channelId);
    });

    socket.on('disconnect', () => setIsConnected(false));

    socket.on('channelHistory', (data: { channelId: string; messages: ChatMessage[] }) => {
      if (data.channelId === channelId) setMessages(data.messages);
    });

    socket.on('newMessage', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit('leaveChannel', channelId);
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [token, channelId]);

  useEffect(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('joinChannel', channelId);
      setMessages([]);
    }
  }, [channelId]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!socketRef.current?.connected || !text.trim()) return;
      socketRef.current.emit('sendMessage', { channelId, text: text.trim() });
    },
    [channelId],
  );

  return {
    channels: channels.data || [],
    messages,
    isConnected,
    sendMessage,
    currentUser: user,
  };
}

// ── Public hook — picks the right implementation ──────────────

export function useChat(channelId: string) {
  const mockResult = useMockChat(channelId);
  const socketResult = useSocketChat(channelId);
  return USE_MOCK ? mockResult : socketResult;
}
