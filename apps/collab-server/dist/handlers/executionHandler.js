import { Queue } from 'bullmq';
const executionQueue = new Queue('execution-jobs', {
    connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' }
});
export class ExecutionHandler {
    io;
    constructor(io) {
        this.io = io;
    }
    async handleRun(socket, roomId, payload) {
        const jobId = Math.random().toString(36).substring(7);
        // Notify room that execution started
        this.io.to(roomId).emit('execution:started', jobId);
        // Add to BullMQ queue for Runner Service
        await executionQueue.add('run-code', {
            code: payload.code,
            language: payload.language,
            jobId,
            roomId
        }, {
            removeOnComplete: true,
            removeOnFail: true
        });
    }
}
