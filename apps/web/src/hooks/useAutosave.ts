import { useEffect } from 'react';
import * as Y from 'yjs';

export function useAutosave(doc: Y.Doc, roomId: string) {
  useEffect(() => {
    if (!doc) return;

    let timeout: any = null;

    const onUpdate = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Trigger manual API snapshot save if needed here,
        // although backend handles debounced auto-saves mostly.
        // We can emit a specific save event if required by UX.
      }, 5000);
    };

    doc.on('update', onUpdate);
    return () => doc.off('update', onUpdate);
  }, [doc, roomId]);
}
