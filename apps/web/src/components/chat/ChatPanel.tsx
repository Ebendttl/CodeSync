import React, { useState, useEffect } from 'react';
// @ts-ignore
import { socket } from '../../lib/api';
// @ts-ignore
import type { ChatMessage } from '@codesync/shared-types';

interface Props {
  roomId: string;
}

export function ChatPanel({ roomId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const onMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('chat:message', onMessage);
    return () => {
      socket.off('chat:message', onMessage);
    };
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit('chat:send', input);
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-surface)' }}>
      <div style={{ padding: 16, borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-ui)', color: 'var(--text-primary)' }}>
        Room Chat
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: 12 }}>
            {m.type === 'system' ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>{m.text}</div>
            ) : (
              <div>
                <span style={{ color: m.avatarColor, fontWeight: 'bold', marginRight: 8, fontSize: 13 }}>{m.username}</span>
                <span style={{ color: 'var(--text-primary)', fontSize: 14 }}>{m.text}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ padding: 16, borderTop: '1px solid var(--border-subtle)' }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type a message..."
          style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-elevated)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', outline: 'none' }}
        />
      </form>
    </div>
  );
}
