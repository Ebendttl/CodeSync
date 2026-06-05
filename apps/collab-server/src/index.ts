import { createServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import * as dotenv from 'dotenv';
// @ts-ignore
import { YjsHandler } from './handlers/yjsHandler.js';
// @ts-ignore
import { authMiddleware } from './middleware/authMiddleware.js';
// @ts-ignore
import { ChatHandler } from './handlers/chatHandler.js';
// @ts-ignore
import { ExecutionHandler } from './handlers/executionHandler.js';

dotenv.config();

const port = process.env.PORT || 3001;

async function bootstrap() {
  const httpServer = createServer();
  const corsOrigin = process.env.CORS_ORIGIN && process.env.CORS_ORIGIN.trim() !== '' ? process.env.CORS_ORIGIN : '*';
  const io = new Server(httpServer, {
    cors: { origin: corsOrigin },
  });

  const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));

  // Dedicated Redis subscription client for streaming code execution results
  const executionSubClient = subClient.duplicate();
  await executionSubClient.connect();

  await executionSubClient.pSubscribe('execution:channel:*', (message, channel) => {
    const roomId = channel.split(':').pop();
    if (!roomId) return;
    try {
      const data = JSON.parse(message);
      if (data.type === 'output') {
        io.to(roomId).emit('execution:output', { text: data.text, type: 'stdout' });
      } else if (data.type === 'error') {
        io.to(roomId).emit('execution:output', { text: data.text, type: 'stderr' });
      } else if (data.type === 'complete') {
        io.to(roomId).emit('execution:complete', { exitCode: data.exitCode });
      }
    } catch (err) {
      console.error('Error handling Redis Pub/Sub execution message:', err);
    }
  });

  io.use(authMiddleware);

  const yjsHandler = new YjsHandler(io, pubClient);
  const chatHandler = new ChatHandler(io, pubClient);
  const executionHandler = new ExecutionHandler(io);

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('room:join', async (roomId, token) => {
      socket.join(roomId);
      await yjsHandler.getOrCreateDoc(roomId);
      
      const user = { id: socket.data.userId || 'anon', username: 'User', avatarColor: '#00d4ff' };
      socket.to(roomId).emit('room:user-joined', user);
      
      io.to(roomId).emit('chat:message', {
        id: Math.random().toString(),
        userId: 'system',
        username: 'System',
        avatarColor: '#aaa',
        text: `${user.username} joined the room`,
        timestamp: Date.now(),
        type: 'system'
      });
    });

    socket.on('yjs:update', (update) => {
      const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
      for (const roomId of rooms) {
        yjsHandler.handleUpdate(socket, roomId, update);
      }
    });

    socket.on('chat:send', (text) => {
      const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
      for (const roomId of rooms) {
        chatHandler.handleMessage(socket, roomId, text);
      }
    });

    socket.on('execution:run', (payload) => {
      const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
      for (const roomId of rooms) {
        executionHandler.handleRun(socket, roomId, payload);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      // Would emit room:user-left here based on socket state
    });
  });

  httpServer.listen(port, () => {
    console.log(`Collab Server listening on port ${port}`);
  });
}

bootstrap().catch(console.error);
