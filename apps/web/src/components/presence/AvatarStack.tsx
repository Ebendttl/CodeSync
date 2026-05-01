import React from 'react';
// @ts-ignore
import type { AwarenessState } from '@codesync/shared-types';

interface Props {
  peers: Map<number, AwarenessState>;
}

export function AvatarStack({ peers }: Props) {
  const peersArray = Array.from(peers.values());
  const displayPeers = peersArray.slice(0, 5);
  const remainingCount = Math.max(0, peersArray.length - 5);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {displayPeers.map((peer, i) => (
        <div
          key={peer.user.id}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: peer.user.color,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: i > 0 ? -10 : 0,
            border: '2px solid var(--bg-surface)',
            fontSize: 12,
            fontWeight: 'bold',
            zIndex: 10 - i,
          }}
          title={peer.user.name}
        >
          {peer.user.name.charAt(0).toUpperCase()}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: -10,
            border: '2px solid var(--bg-surface)',
            fontSize: 12,
            zIndex: 0,
          }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
