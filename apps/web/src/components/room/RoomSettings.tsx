import React from 'react';
// @ts-ignore
import { useRoomStore } from '../../store/roomStore';
// @ts-ignore
import { Button } from '@codesync/ui';

export function RoomSettings() {
  const { language, setLanguage } = useRoomStore();

  return (
    <div style={{ padding: 16, background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: 12 }}>Room Settings</h3>
      <div>
        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 4 }}>Default Language</label>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          style={{ width: '100%', padding: '8px', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: 'none', borderRadius: 'var(--radius-sm)' }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="typescript">TypeScript</option>
        </select>
      </div>
    </div>
  );
}
