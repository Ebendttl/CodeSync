import React, { useState } from 'react';
// @ts-ignore
import { useExecution } from '../../hooks/useExecution';
// @ts-ignore
import { useRoomStore } from '../../store/roomStore';
// @ts-ignore
import { useExecutionStore } from '../../store/executionStore';
// @ts-ignore
import { InviteModal } from '../room/InviteModal';

interface Props {
  code: string;
}

export function EditorToolbar({ code }: Props) {
  const { runCode } = useExecution();
  const { roomId, language, setLanguage } = useRoomStore();
  const { isRunning } = useExecutionStore();
  const [showInvite, setShowInvite] = useState(false);

  const handleRun = () => {
    // @ts-ignore
    runCode(code, language);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ marginRight: 16, background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: 'none', padding: '6px 12px', borderRadius: 'var(--radius-sm)', outline: 'none' }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
          </select>
          
          <button 
            onClick={handleRun} 
            disabled={isRunning}
            style={{
              background: isRunning ? 'var(--bg-elevated)' : 'var(--accent-primary)',
              color: isRunning ? 'var(--text-muted)' : 'var(--bg-base)',
              border: 'none',
              padding: '6px 16px',
              borderRadius: 'var(--radius-sm)',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontFamily: 'var(--font-ui)'
            }}
          >
            {isRunning ? 'Executing...' : 'Run Code'}
          </button>
        </div>
        <button 
          onClick={() => setShowInvite(true)}
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--accent-primary)',
            border: '1px solid var(--accent-primary)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontFamily: 'var(--font-ui)'
          }}
        >
          Invite
        </button>
      </div>
      {showInvite && roomId && <InviteModal roomId={roomId} onClose={() => setShowInvite(false)} />}
    </>
  );
}
