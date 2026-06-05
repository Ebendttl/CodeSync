import React, { useState } from 'react';
// @ts-ignore
import { useRoomStore } from '../../store/roomStore';
// @ts-ignore
import { useAuthStore } from '../../store/authStore';

export function RoomLobby({ onJoin }: { onJoin: (roomId: string) => void }) {
  const [roomId, setInputRoomId] = useState('');
  const { userId } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
  if (API_URL && !API_URL.startsWith('http://') && !API_URL.startsWith('https://')) {
    API_URL = 'https://' + API_URL;
  }

  const handleCreate = async () => {
    try {
      if (!userId) {
        setError('You must be logged in to create a room');
        return;
      }
      
      const res = await fetch(`${API_URL}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'My CodeSync Room', language: 'javascript', ownerId: userId })
      });
      const data = await res.json();
      if (data.room && data.room.id) {
        onJoin(data.room.id);
      } else {
        setError('Failed to create room');
      }
    } catch (err) {
      setError('Error communicating with server');
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      try {
        const res = await fetch(`${API_URL}/api/rooms/${roomId}`);
        if (!res.ok) {
          setError('Room does not exist');
          return;
        }
        onJoin(roomId.trim());
      } catch (err) {
        setError('Error communicating with server');
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-base)' }}>
      <div style={{ background: 'var(--bg-surface)', padding: 32, borderRadius: 'var(--radius-md)', width: 400, textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: 24, fontFamily: 'var(--font-ui)' }}>Join or Create Room</h2>
        {error && <div style={{ color: '#ff5252', marginBottom: 16, fontSize: '0.9rem' }}>{error}</div>}
        <button onClick={handleCreate} style={{ width: '100%', padding: 12, marginBottom: 24, borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--accent-primary)', color: 'var(--bg-base)', fontWeight: 'bold', cursor: 'pointer' }}>
          Create New Room
        </button>
        <div style={{ color: 'var(--text-muted)', margin: '16px 0' }}>— OR —</div>
        <form onSubmit={handleJoin} style={{ display: 'flex' }}>
          <input 
            type="text" 
            value={roomId} 
            onChange={(e) => setInputRoomId(e.target.value)} 
            placeholder="Room ID" 
            style={{ flex: 1, marginRight: 8, padding: 12, borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--bg-elevated)', color: 'var(--text-primary)', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '12px 24px', borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--bg-elevated)', color: 'var(--accent-primary)', fontWeight: 'bold', cursor: 'pointer' }}>
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
