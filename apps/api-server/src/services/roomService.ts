import { nanoid } from 'nanoid';
// @ts-ignore
import { db } from '../index';
// @ts-ignore
import { rooms, roomMembers } from '../db/schema';
import { eq } from 'drizzle-orm';

export class RoomService {
  static async createRoom(name: string, ownerId: string, language: string) {
    const id = nanoid(12);
    
    const [room] = await db.insert(rooms).values({
      id,
      name,
      ownerId,
      language
    }).returning();

    await db.insert(roomMembers).values({
      roomId: id,
      userId: ownerId,
      role: 'owner'
    });

    return room;
  }

  static async getRoom(id: string) {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    return room;
  }

  static async joinRoom(roomId: string, userId: string) {
    await db.insert(roomMembers).values({
      roomId,
      userId,
      role: 'editor'
    }).onConflictDoNothing();
  }
}
