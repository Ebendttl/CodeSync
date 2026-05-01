import { useEffect, useState } from 'react';
import * as Y from 'yjs';
// @ts-ignore
import { SocketIOProvider } from '../lib/yjs/provider';
// @ts-ignore
import { socket } from '../lib/api';

export function useYjs(roomId: string) {
  const [doc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<SocketIOProvider | null>(null);

  useEffect(() => {
    // @ts-ignore
    const newProvider = new SocketIOProvider(socket, doc, roomId);
    setProvider(newProvider);

    return () => {
      newProvider.destroy();
      doc.destroy();
    };
  }, [roomId, doc]);

  return { doc, awareness: provider?.awareness };
}
