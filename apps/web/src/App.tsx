import React, { useState, useEffect } from 'react';
// @ts-ignore
import { AuthGuard } from './components/auth/AuthGuard';
// @ts-ignore
import { RoomLobby } from './components/room/RoomLobby';
// @ts-ignore
import { CodeEditor } from './components/editor/CodeEditor';
// @ts-ignore
import { EditorToolbar } from './components/editor/EditorToolbar';
// @ts-ignore
import { ExecutionPanel } from './components/editor/ExecutionPanel';
// @ts-ignore
import { ChatPanel } from './components/chat/ChatPanel';
// @ts-ignore
import { AvatarStack } from './components/presence/AvatarStack';
// @ts-ignore
import { useRoomStore } from './store/roomStore';
// @ts-ignore
import { useAuthStore } from './store/authStore';
// @ts-ignore
import { useCollaboration } from './hooks/useCollaboration';
// @ts-ignore
import { connectSocket, disconnectSocket } from './lib/api';

function RoomView({ roomId }: { roomId: string }) {
  const { token } = useAuthStore();
  const { users } = useRoomStore();

  useCollaboration(roomId, token!);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-base)', fontFamily: 'var(--font-ui)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', background: 'var(--bg-surface)' }}>
          <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>CodeSync <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>#{roomId}</span></h2>
          <AvatarStack peers={new Map()} /> {/* Wiring presence here soon */}
        </div>
        <EditorToolbar code="" />
        <div style={{ flex: 1, position: 'relative' }}>
          <CodeEditor roomId={roomId} />
        </div>
      </div>
      <div style={{ width: 350, display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-subtle)' }}>
        <div style={{ flex: 1 }}>
          <ChatPanel roomId={roomId} />
        </div>
        <div style={{ height: 250, borderTop: '1px solid var(--border-subtle)' }}>
          <ExecutionPanel />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { roomId, setRoomId } = useRoomStore();
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      connectSocket(token);
    } else {
      disconnectSocket();
    }
  }, [token]);

  return (
    <AuthGuard>
      {!roomId ? (
        <RoomLobby onJoin={setRoomId} />
      ) : (
        <RoomView roomId={roomId} />
      )}
    </AuthGuard>
  );
}
