import { Worker } from 'bullmq';
import * as dotenv from 'dotenv';
// @ts-ignore
import { runInSandbox } from './runner/dockerRunner';
// @ts-ignore
import { Language } from '@codesync/shared-types';

dotenv.config();

const worker = new Worker('execution-jobs', async job => {
  const { code, language, jobId } = job.data as { code: string; language: Language; jobId: string };
  console.log(`Processing job ${jobId} for language ${language}`);

  // In a real system, we'd stream output back to the Collab Server via Redis Pub/Sub here.
  // We'll mock the streaming for now since this is the microservice layer.
  
  const onOutput = (chunk: string) => {
    // Publish chunk to redis
  };

  const onError = (chunk: string) => {
    // Publish chunk to redis
  };

  const result = await runInSandbox(code, language, onOutput, onError);
  return result;

}, { 
  connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
  concurrency: parseInt(process.env.MAX_CONCURRENT_JOBS || '10')
});

worker.on('completed', job => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

console.log('Runner service initializing... Listening for jobs.');
