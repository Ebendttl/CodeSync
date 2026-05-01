import { ChatMessage } from './room';
import { CollabUser } from './room';
import { OutputChunk, ExecutionResult, RunPayload } from './execution';

export interface ServerToClientEvents {
  'yjs:update': (update: Uint8Array) => void;
  'awareness:update': (update: Uint8Array) => void;
  'chat:message': (msg: ChatMessage) => void;
  'room:user-joined': (user: CollabUser) => void;
  'room:user-left': (userId: string) => void;
  'execution:started': (jobId: string) => void;
  'execution:output': (chunk: OutputChunk) => void;
  'execution:complete': (result: ExecutionResult) => void;
}

export interface ClientToServerEvents {
  'yjs:update': (update: Uint8Array) => void;
  'awareness:update': (update: Uint8Array) => void;
  'chat:send': (text: string) => void;
  'room:join': (roomId: string, token: string) => void;
  'room:leave': () => void;
  'execution:run': (payload: RunPayload) => void;
}
