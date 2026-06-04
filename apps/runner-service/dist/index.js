import { Worker } from 'bullmq';
import * as dotenv from 'dotenv';
// @ts-ignore
import { runInSandbox } from './runner/dockerRunner.js';
import { Redis } from 'ioredis';
dotenv.config();
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const pubClient = new Redis(redisUrl);
const worker = new Worker('execution-jobs', async (job) => {
    const { code, language, jobId, roomId } = job.data;
    console.log(`Processing job ${jobId} for language ${language} in room ${roomId}`);
    const onOutput = (chunk) => {
        pubClient.publish(`execution:channel:${roomId}`, JSON.stringify({
            type: 'output',
            jobId,
            text: chunk
        })).catch(console.error);
    };
    const onError = (chunk) => {
        pubClient.publish(`execution:channel:${roomId}`, JSON.stringify({
            type: 'error',
            jobId,
            text: chunk
        })).catch(console.error);
    };
    const result = await runInSandbox(code, language, onOutput, onError);
    pubClient.publish(`execution:channel:${roomId}`, JSON.stringify({
        type: 'complete',
        jobId,
        exitCode: result.exitCode
    })).catch(console.error);
    return result;
}, {
    connection: { url: redisUrl },
    concurrency: parseInt(process.env.MAX_CONCURRENT_JOBS || '10')
});
worker.on('completed', job => {
    console.log(`Job ${job.id} completed successfully`);
});
worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
});
console.log('Runner service initializing... Listening for jobs.');
