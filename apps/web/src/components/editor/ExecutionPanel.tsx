import React from 'react';
// @ts-ignore
import { useExecutionStore } from '../../store/executionStore';

export function ExecutionPanel() {
  const { isRunning, output, exitCode } = useExecutionStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-elevated)', color: 'var(--text-primary)', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-ui)', color: 'var(--text-secondary)' }}>Terminal Output</h3>
        {isRunning && <span style={{ color: 'var(--accent-amber)', fontSize: 12 }}>Running...</span>}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'var(--font-code)', fontSize: 13, background: 'var(--bg-base)', padding: 12, borderRadius: 'var(--radius-sm)' }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{output}</pre>
        {exitCode !== null && (
          <div style={{ marginTop: 8, color: exitCode === 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
            Process exited with code {exitCode}
          </div>
        )}
      </div>
    </div>
  );
}
