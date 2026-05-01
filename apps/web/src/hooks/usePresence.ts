import { useEffect, useState } from 'react';
import { Awareness } from 'y-protocols/awareness';
// @ts-ignore
import type { AwarenessState } from '@codesync/shared-types';

export function usePresence(awareness: Awareness) {
  const [peers, setPeers] = useState<Map<number, AwarenessState>>(new Map());

  useEffect(() => {
    if (!awareness) return;

    const handler = () => {
      const states = new Map<number, AwarenessState>();
      awareness.getStates().forEach((state, clientId) => {
        if (clientId !== awareness.clientID && state.user) {
          states.set(clientId, state as AwarenessState);
        }
      });
      setPeers(states);
    };

    awareness.on('change', handler);
    return () => awareness.off('change', handler);
  }, [awareness]);

  return peers;
}
