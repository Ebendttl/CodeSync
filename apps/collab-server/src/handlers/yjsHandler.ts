import { Server, Socket } from 'socket.io';
import { RedisClientType } from 'redis';
import * as Y from 'yjs';

export class YjsHandler {
  private docs = new Map<string, Y.Doc>();

  constructor(private io: Server, private redis: any) {}

  async getOrCreateDoc(roomId: string): Promise<Y.Doc> {
    if (this.docs.has(roomId)) return this.docs.get(roomId)!;

    const doc = new Y.Doc();

    const persisted = await this.redis.get(`yjs:room:${roomId}`);
    if (persisted) {
      Y.applyUpdate(doc, Buffer.from(persisted, 'base64'));
    }

    let timeout: NodeJS.Timeout | null = null;
    doc.on('update', () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const state = Y.encodeStateAsUpdate(doc);
        await this.redis.setEx(
          `yjs:room:${roomId}`,
          86400,
          Buffer.from(state).toString('base64')
        );
      }, 2000);
    });

    this.docs.set(roomId, doc);
    return doc;
  }

  handleUpdate(socket: Socket, roomId: string, update: Uint8Array) {
    const doc = this.docs.get(roomId);
    if (!doc) return;

    Y.applyUpdate(doc, update, socket.id);
    socket.to(roomId).emit('yjs:update', update);
  }
}
