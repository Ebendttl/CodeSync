import Docker = require('dockerode');
import { Readable } from 'stream';
// @ts-ignore
import { Language, ExecutionResult } from '@codesync/shared-types';

const docker = new Docker({ socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock' });

interface DockerConfig {
  image: string;
  filename: string;
  timeout: number;
}

const LANGUAGE_CONFIG: Record<Language, DockerConfig> = {
  javascript: {
    image: 'codesync-sandbox-js:latest',
    filename: 'code.js',
    timeout: 10_000,
  },
  python: {
    image: 'codesync-sandbox-py:latest',
    filename: 'code.py',
    timeout: 10_000,
  },
  typescript: {
    image: 'codesync-sandbox-ts:latest',
    filename: 'code.ts',
    timeout: 15_000,
  },
};

function buildCommand(language: Language, filename: string): string[] {
  if (language === 'javascript') return ['node', '--experimental-vm-modules', `/sandbox/${filename}`];
  if (language === 'python') return ['python3', '-u', `/sandbox/${filename}`];
  if (language === 'typescript') return ['node', '--loader', 'ts-node/esm', `/sandbox/${filename}`];
  return [];
}

function sanitizeOutput(chunk: string): string {
  // eslint-disable-next-line no-control-regex
  return chunk.replace(/\x1B\[\d+;?\d*m/g, '');
}

export async function runInSandbox(
  code: string,
  language: Language,
  onOutput: (chunk: string) => void,
  onError: (chunk: string) => void,
): Promise<ExecutionResult> {
  const config = LANGUAGE_CONFIG[language];
  const startTime = Date.now();

  const container = await docker.createContainer({
    Image: config.image,
    Cmd: buildCommand(language, config.filename),
    HostConfig: {
      Memory: 128 * 1024 * 1024,
      MemorySwap: 128 * 1024 * 1024,
      CpuPeriod: 100_000,
      CpuQuota: 50_000,
      PidsLimit: 50,
      NetworkMode: 'none',
      ReadonlyRootfs: true,
      Tmpfs: { '/tmp': 'size=16m' },
      AutoRemove: true,
    },
    OpenStdin: true,
    StdinOnce: true,
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
  });

  const attachStream = await container.attach({
    stream: true, stdin: true, stdout: true, stderr: true,
  });

  await container.start();

  const codeBuffer = Buffer.from(code, 'utf-8');
  attachStream.write(codeBuffer);
  attachStream.end();

  let stdout = '';
  let stderr = '';
  let killed = false;

  const killTimer = setTimeout(async () => {
    killed = true;
    try { await container.kill(); } catch { /* ignore */ }
  }, config.timeout);

  container.modem.demuxStream(
    attachStream as unknown as Readable,
    {
      write: (chunk: Buffer) => {
        const text = sanitizeOutput(chunk.toString('utf-8'));
        stdout += text;
        if (stdout.length <= 100_000) onOutput(text);
      },
    },
    {
      write: (chunk: Buffer) => {
        const text = sanitizeOutput(chunk.toString('utf-8'));
        stderr += text;
        if (stderr.length <= 100_000) onError(text);
      },
    }
  );

  const [exitData] = await container.wait();
  clearTimeout(killTimer);

  return {
    stdout: stdout.slice(0, 100_000),
    stderr: stderr.slice(0, 100_000),
    exitCode: killed ? -1 : exitData.StatusCode,
    timedOut: killed,
    executionTime: Date.now() - startTime,
  };
}
