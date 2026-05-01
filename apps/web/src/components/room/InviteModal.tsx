import React, { useState } from 'react';
// @ts-ignore
import { Button } from '@codesync/ui';

interface Props {
  roomId: string;
  onClose: () => void;
}

export function InviteModal({ roomId, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const inviteUrl = `${window.location.origin}/room/${roomId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 'var(--radius-md)', width: 400 }}>
        <h3 style={{ color: 'var(--text-primary)', marginTop: 0 }}>Invite Collaborators</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Share this link to collaborate in real-time.</p>
        
        <div style={{ display: 'flex', marginTop: 16, marginBottom: 24 }}>
          <input 
            readOnly 
            value={inviteUrl} 
            style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-elevated)', border: 'none', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)' }}
          />
          <button 
            onClick={handleCopy}
            style={{ padding: '8px 16px', background: 'var(--accent-primary)', color: 'var(--bg-base)', border: 'none', fontWeight: 'bold', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', cursor: 'pointer' }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <button onClick={onClose} style={{ width: '100%', padding: '8px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  );
}
