export type Language = 'javascript' | 'python' | 'typescript';

export interface RunPayload {
  code: string;
  language: Language;
}

export interface OutputChunk {
  text: string;
  type: 'stdout' | 'stderr';
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut: boolean;
  executionTime: number;
}
