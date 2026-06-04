import * as Y from 'yjs';
export class YjsHandler {
    io;
    redis;
    docs = new Map();
    constructor(io, redis) {
        this.io = io;
        this.redis = redis;
    }
    async getOrCreateDoc(roomId) {
        if (this.docs.has(roomId))
            return this.docs.get(roomId);
        const doc = new Y.Doc();
        const persisted = await this.redis.get(`yjs:room:${roomId}`);
        if (persisted) {
            Y.applyUpdate(doc, Buffer.from(persisted, 'base64'));
        }
        let timeout = null;
        doc.on('update', () => {
            if (timeout)
                clearTimeout(timeout);
            timeout = setTimeout(async () => {
                const state = Y.encodeStateAsUpdate(doc);
                await this.redis.setEx(`yjs:room:${roomId}`, 86400, Buffer.from(state).toString('base64'));
            }, 2000);
        });
        this.docs.set(roomId, doc);
        return doc;
    }
    handleUpdate(socket, roomId, update) {
        const doc = this.docs.get(roomId);
        if (!doc)
            return;
        Y.applyUpdate(doc, update, socket.id);
        socket.to(roomId).emit('yjs:update', update);
    }
}
