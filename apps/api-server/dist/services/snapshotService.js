// @ts-ignore
import { db } from '../index';
// @ts-ignore
import { snapshots } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
export class SnapshotService {
    static async getSnapshots(roomId) {
        return await db.select()
            .from(snapshots)
            .where(eq(snapshots.roomId, roomId))
            .orderBy(desc(snapshots.createdAt));
    }
    static async createSnapshot(roomId, content, language, createdBy) {
        const [snapshot] = await db.insert(snapshots).values({
            roomId,
            content,
            language,
            createdBy
        }).returning();
        return snapshot;
    }
}
