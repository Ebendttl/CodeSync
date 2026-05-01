import { Server, Socket } from 'socket.io';
import { RedisClientType } from 'redis';

export class ChatHandler {
  constructor(private io: Server, private redis: any) {}

  async handleMessage(socket: Socket, roomId: string, text: string) {
    const message = {
      id: Math.random().toString(36).substring(7),
      userId: socket.data.userId || 'anonymous',
      username: 'User', // Would normally fetch from DB/token
      avatarColor: '#00d4ff', // Mock color
      text,
      timestamp: Date.now(),
      type: 'message'
    };

    // Store in Redis (capped at 100 per room)
    const key = `chat:room:${roomId}`;
    await this.redis.lPush(key, JSON.stringify(message));
    await this.redis.lTrim(key, 0, 99);

    // Broadcast to room
    this.io.to(roomId).emit('chat:message', message);
  }
}
