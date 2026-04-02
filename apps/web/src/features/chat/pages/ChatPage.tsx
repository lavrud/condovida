import React, { useState, useRef, useEffect } from 'react';
import { Send, Globe, Shield, LucideIcon } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { cx, fmtRelative } from '../../../lib/utils';

const channelIcons: Record<string, LucideIcon> = {
  Globe, Shield,
};

export function ChatPage() {
  const [activeChannel, setActiveChannel] = useState('geral');
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { channels, messages, isConnected, sendMessage, currentUser } = useChat(activeChannel);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-13rem)]">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-stone-900">Chat</h1>
          <span className={cx('text-xs font-semibold px-2 py-0.5 rounded-full', isConnected ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500')}>
            {isConnected ? 'Conectado' : 'Reconectando...'}
          </span>
        </div>
      </div>

      {/* Channel pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {channels.map((ch) => {
          const ChIcon = channelIcons[ch.iconName] || Globe;
          return (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={cx(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                activeChannel === ch.id
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200',
              )}
            >
              <ChIcon size={12} />
              {ch.name}
            </button>
          );
        })}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.length === 0 && (
          <div className="text-center py-8 text-stone-400 text-sm">
            Seja o primeiro a enviar uma mensagem!
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.authorId === currentUser?.id;
          return (
            <div key={msg.id} className={cx('flex gap-2', isMine && 'flex-row-reverse')}>
              <div
                className={cx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0',
                  isMine ? 'bg-orange-500' : 'bg-stone-400',
                )}
              >
                {msg.authorName?.charAt(0) || '?'}
              </div>
              <div className={cx('max-w-[75%]', isMine && 'items-end')}>
                {!isMine && (
                  <p className="text-xs text-stone-400 mb-0.5 ml-1">{msg.authorName}</p>
                )}
                <div
                  className={cx(
                    'rounded-2xl px-3 py-2 text-sm',
                    isMine
                      ? 'bg-stone-900 text-white rounded-tr-sm'
                      : 'bg-white text-stone-800 rounded-tl-sm shadow-sm',
                  )}
                >
                  {msg.text}
                </div>
                <p className={cx('text-[10px] text-stone-400 mt-0.5', isMine ? 'text-right' : 'ml-1')}>
                  {fmtRelative(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 items-center">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mensagem..."
          className="flex-1 rounded-2xl px-4 py-3 text-sm bg-white border-2 border-stone-100 focus:border-stone-300 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!message.trim() || !isConnected}
          className="w-11 h-11 bg-stone-900 rounded-2xl flex items-center justify-center text-white hover:bg-stone-800 transition-colors disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
