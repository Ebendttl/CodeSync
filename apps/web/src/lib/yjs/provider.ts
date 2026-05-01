import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as syncProtocol from 'y-protocols/sync';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';

const MessageType = {
  Sync: 0,
  Awareness: 1,
  Auth: 2,
  QueryAwareness: 3,
};

export class SocketIOProvider {
  doc: Y.Doc;
  awareness: Awareness;
  private socket: any;
  public _synced = false;

  constructor(socket: any, doc: Y.Doc, roomId: string) {
    this.doc = doc;
    this.socket = socket;
    this.awareness = new Awareness(doc);

    // Step 1: Join room and sync
    this.socket.emit('room:join', roomId);
    this.socket.on('connect', () => {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, MessageType.Sync);
      syncProtocol.writeSyncStep1(encoder, this.doc);
      this.socket.emit('yjs:update', encoding.toUint8Array(encoder));
    });

    // Step 2: Handle incoming Y.js messages
    this.socket.on('yjs:update', (update: Uint8Array) => {
      const decoder = decoding.createDecoder(new Uint8Array(update));
      const messageType = decoding.readVarUint(decoder);

      if (messageType === MessageType.Sync) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MessageType.Sync);
        const syncMessageType = syncProtocol.readSyncMessage(
          decoder, encoder, this.doc, this
        );
        if (syncMessageType === syncProtocol.messageYjsSyncStep2) {
          this._synced = true;
        }
        if (encoding.length(encoder) > 1) {
          this.socket.emit('yjs:update', encoding.toUint8Array(encoder));
        }
      } else {
        // Assume update
        Y.applyUpdate(this.doc, new Uint8Array(update), this);
      }
    });

    // Step 3: Forward local changes to server
    this.doc.on('update', (update: Uint8Array, origin: unknown) => {
      if (origin !== this) {
        this.socket.emit('yjs:update', update);
      }
    });

    // Step 4: Awareness
    this.socket.on('awareness:update', (update: Uint8Array) => {
      awarenessProtocol.applyAwarenessUpdate(this.awareness, new Uint8Array(update), this);
    });

    this.awareness.on('update', ({ added, updated, removed }: any, origin: any) => {
      if (origin === 'local') {
        const changedClients = [...added, ...updated, ...removed];
        const update = awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients);
        this.socket.emit('awareness:update', update);
      }
    });
  }

  destroy() {
    this.awareness.destroy();
    this.socket.off('yjs:update');
    this.socket.off('awareness:update');
  }
}
