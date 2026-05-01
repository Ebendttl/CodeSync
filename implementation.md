# 🚀 CodeSync — Real-Time Collaborative Code Editor
### Implementation Plan for Antigravity IDE
**Version:** 1.0.0 | **Classification:** Full-Stack Production Build | **Authored by:** Principal Architect

---

## 🧭 Executive Vision

Build **CodeSync** — a production-grade, multiplayer code editing platform that fuses the precision of VS Code with the real-time presence of Figma. This is not a demo. This is a portfolio-defining, interview-stopping, distributed-systems showcase that demonstrates mastery of CRDTs, WebSocket orchestration, secure sandboxed execution, and scalable pub/sub infrastructure.

> **Architectural Mantra:** Every design decision must survive a 10x traffic spike, a network partition, and a malicious code submission — simultaneously.

---

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                    │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  React 18 + Vite  │  Monaco Editor  │  Y.js CRDT  │  Socket.io  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ WSS / HTTPS
┌───────────────────────────────▼─────────────────────────────────────────┐
│                          API GATEWAY (Nginx)                             │
│              TLS Termination │ Rate Limiting │ Load Balancing            │
└────────┬──────────────────────────┬──────────────────────────┬──────────┘
         │                          │                           │
┌────────▼────────┐      ┌──────────▼──────────┐    ┌─────────▼──────────┐
│  Collaboration  │      │   REST API Server   │    │   Code Execution   │
│  Server (WS)    │      │   (Node/Express)    │    │   Service (Node)   │
│                 │      │                     │    │                    │
│  Socket.io      │      │  Auth / Rooms /     │    │  Docker Sandbox    │
│  Y.js Provider  │      │  Snapshots / Users  │    │  Process Isolation │
│  Awareness      │      │                     │    │  Resource Limits   │
└────────┬────────┘      └──────────┬──────────┘    └─────────┬──────────┘
         │                          │                           │
┌────────▼──────────────────────────▼───────────────────────────▼─────────┐
│                        DATA LAYER                                        │
│                                                                          │
│   Redis (pub/sub + room state + cursor positions + ephemeral sessions)   │
│   PostgreSQL (users, rooms, snapshots, audit logs)                       │
│   S3 / MinIO (code snapshots, large revision history)                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Monorepo Structure

```
codesync/
├── apps/
│   ├── web/                          # React frontend (Vite)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── editor/
│   │   │   │   │   ├── CodeEditor.tsx          # Monaco wrapper + Y.js binding
│   │   │   │   │   ├── CursorOverlay.tsx       # Remote cursor renderer
│   │   │   │   │   ├── ExecutionPanel.tsx      # Stdout/stderr + language picker
│   │   │   │   │   └── EditorToolbar.tsx       # Run, share, settings
│   │   │   │   ├── presence/
│   │   │   │   │   ├── AvatarStack.tsx         # Live collaborator avatars
│   │   │   │   │   ├── PresenceCursor.tsx      # Per-user colored caret
│   │   │   │   │   └── PresenceTooltip.tsx
│   │   │   │   ├── room/
│   │   │   │   │   ├── RoomLobby.tsx           # Create / join room
│   │   │   │   │   ├── RoomSettings.tsx        # Language, theme, permissions
│   │   │   │   │   └── InviteModal.tsx
│   │   │   │   ├── chat/
│   │   │   │   │   ├── ChatPanel.tsx
│   │   │   │   │   ├── ChatMessage.tsx
│   │   │   │   │   └── ChatInput.tsx
│   │   │   │   └── auth/
│   │   │   │       ├── LoginPage.tsx
│   │   │   │       └── AuthGuard.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useYjs.ts                   # Y.js doc + provider lifecycle
│   │   │   │   ├── useCollaboration.ts         # Socket.io room management
│   │   │   │   ├── useExecution.ts             # Code run + streaming output
│   │   │   │   ├── usePresence.ts              # Cursor awareness map
│   │   │   │   └── useAutosave.ts              # Debounced snapshot trigger
│   │   │   ├── lib/
│   │   │   │   ├── yjs/
│   │   │   │   │   ├── provider.ts             # Socket.io Y.js provider (custom)
│   │   │   │   │   └── awareness.ts            # Cursor + selection state
│   │   │   │   ├── monaco/
│   │   │   │   │   ├── monacoSetup.ts          # Workers, themes, languages
│   │   │   │   │   └── cursorWidget.ts         # Custom cursor DOM widget
│   │   │   │   └── api.ts                      # Axios instance + interceptors
│   │   │   ├── store/
│   │   │   │   ├── roomStore.ts                # Zustand: room, users, language
│   │   │   │   ├── executionStore.ts           # Zustand: run state + output
│   │   │   │   └── authStore.ts
│   │   │   └── types/
│   │   │       ├── room.ts
│   │   │       ├── user.ts
│   │   │       └── execution.ts
│   │   ├── public/
│   │   ├── index.html
│   │   └── vite.config.ts
│   │
│   ├── collab-server/                # WebSocket + Y.js collaboration service
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── server.ts             # Socket.io server bootstrap
│   │   │   ├── handlers/
│   │   │   │   ├── yjsHandler.ts     # Y.js document sync + update relay
│   │   │   │   ├── awarenessHandler.ts  # Cursor/selection broadcasting
│   │   │   │   ├── chatHandler.ts
│   │   │   │   └── roomHandler.ts    # Join/leave/kick events
│   │   │   ├── services/
│   │   │   │   ├── documentStore.ts  # Y.js doc persistence via Redis
│   │   │   │   ├── redisAdapter.ts   # Socket.io Redis adapter for clustering
│   │   │   │   └── snapshotService.ts  # Periodic doc state persistence
│   │   │   └── middleware/
│   │   │       ├── authMiddleware.ts  # JWT validation on WS connect
│   │   │       └── rateLimiter.ts
│   │   └── package.json
│   │
│   ├── api-server/                   # REST API (rooms, auth, snapshots)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── app.ts
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts           # Register, login, JWT refresh
│   │   │   │   ├── rooms.ts          # Create, join, list, delete rooms
│   │   │   │   ├── snapshots.ts      # Get revision history + restore
│   │   │   │   └── execution.ts      # HTTP trigger for code run jobs
│   │   │   ├── services/
│   │   │   │   ├── authService.ts
│   │   │   │   ├── roomService.ts
│   │   │   │   └── snapshotService.ts
│   │   │   ├── db/
│   │   │   │   ├── migrations/
│   │   │   │   │   ├── 001_init.sql
│   │   │   │   │   ├── 002_rooms.sql
│   │   │   │   │   └── 003_snapshots.sql
│   │   │   │   ├── schema.ts         # Drizzle ORM schema
│   │   │   │   └── client.ts
│   │   │   └── middleware/
│   │   │       ├── auth.ts
│   │   │       ├── validate.ts       # Zod request validation
│   │   │       └── errorHandler.ts
│   │   └── package.json
│   │
│   └── runner-service/               # Sandboxed code execution microservice
│       ├── src/
│       │   ├── index.ts
│       │   ├── runner/
│       │   │   ├── dockerRunner.ts   # Spawn isolated Docker containers
│       │   │   ├── processRunner.ts  # Node child_process fallback
│       │   │   └── languageMap.ts    # Language → Docker image + entrypoint
│       │   ├── sandbox/
│       │   │   ├── resourceLimits.ts # CPU, memory, timeout enforcement
│       │   │   └── outputSanitizer.ts # Strip ANSI, truncate, XSS-clean
│       │   └── queue/
│       │       ├── jobQueue.ts       # BullMQ job queue for execution requests
│       │       └── jobProcessor.ts
│       └── package.json
│
├── packages/
│   ├── shared-types/                 # Shared TypeScript interfaces
│   │   └── src/
│   │       ├── index.ts
│   │       ├── socket-events.ts      # Strongly typed Socket.io event map
│   │       ├── room.ts
│   │       └── execution.ts
│   │
│   └── ui/                           # Shared design system components
│       └── src/
│           ├── tokens.css            # Design tokens (colors, spacing, type)
│           ├── Button.tsx
│           ├── Badge.tsx
│           └── Avatar.tsx
│
├── infra/
│   ├── docker/
│   │   ├── docker-compose.yml        # Full local dev stack
│   │   ├── docker-compose.prod.yml
│   │   ├── Dockerfile.web
│   │   ├── Dockerfile.collab
│   │   ├── Dockerfile.api
│   │   ├── Dockerfile.runner
│   │   └── sandbox/
│   │       ├── Dockerfile.js-sandbox  # Node 20 Alpine, no network
│   │       └── Dockerfile.py-sandbox  # Python 3.12 Alpine, no network
│   └── nginx/
│       └── nginx.conf
│
├── turbo.json                        # Turborepo pipeline config
├── pnpm-workspace.yaml
└── package.json
```

---

## ⚙️ Tech Stack (Definitive & Justified)

| Layer | Technology | Version | Justification |
|---|---|---|---|
| Frontend Framework | React | 18.3 | Concurrent rendering for smooth presence updates |
| Build Tool | Vite | 5.x | 10x faster HMR than CRA; native ESM |
| Code Editor | Monaco Editor | 0.47 | Production VS Code engine; worker-thread architecture |
| CRDT Engine | Y.js | 13.x | Industry gold standard; proven at Figma-scale |
| WS Transport | Socket.io | 4.7 | Fallback resilience; rooms/namespaces built-in |
| State Management | Zustand | 4.x | Zero-boilerplate; React 18 compatible |
| Backend Runtime | Node.js | 20 LTS | Native ESM; stable performance |
| API Framework | Express | 4.x + tRPC | Type-safe end-to-end contracts |
| Real-Time Broker | Redis | 7.2 | Sub-millisecond pub/sub; Socket.io cluster adapter |
| Primary Database | PostgreSQL | 16 | ACID compliance for rooms + revisions |
| ORM | Drizzle ORM | latest | Type-safe SQL; zero runtime overhead |
| Job Queue | BullMQ | 5.x | Redis-backed; execution job retry + TTL |
| Monorepo | Turborepo + pnpm | latest | Incremental builds; workspace hoisting |
| Containerization | Docker + Compose | latest | Sandbox isolation + local dev parity |
| Styling | CSS Modules + Vanilla Extract | — | Zero-runtime, type-safe CSS |

---

## 🔄 Phase-by-Phase Execution Plan

---

### PHASE 0 — Monorepo Scaffold & Toolchain (Day 1)

**Objective:** Establish the non-negotiable foundation. Everything else lives or dies by this.

#### 0.1 — Initialize Turborepo Monorepo

```bash
pnpm dlx create-turbo@latest codesync --package-manager pnpm
```

Configure `turbo.json` with pipelines:
```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "typecheck": { "dependsOn": ["^build"] }
  }
}
```

#### 0.2 — TypeScript Configuration

Establish `tsconfig.base.json` at root with strict settings:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "moduleResolution": "bundler",
    "target": "ES2022"
  }
}
```

#### 0.3 — Shared Types Package

In `packages/shared-types/src/socket-events.ts`, define the complete Socket.io event contract using TypeScript discriminated unions. This becomes the contract law every service follows — never break it.

```typescript
// Every event typed end-to-end. No `any`. Ever.
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
```

#### 0.4 — Docker Compose (Full Dev Stack)

```yaml
# infra/docker/docker-compose.yml
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: codesync
      POSTGRES_USER: codesync
      POSTGRES_PASSWORD: codesync_dev
    ports: ['5432:5432']
    volumes: ['pgdata:/var/lib/postgresql/data']

  redis:
    image: redis:7.2-alpine
    ports: ['6379:6379']
    command: redis-server --appendonly yes

  nginx:
    image: nginx:alpine
    ports: ['80:80']
    volumes: ['./nginx/nginx.conf:/etc/nginx/nginx.conf']
    depends_on: [web, collab-server, api-server]

volumes:
  pgdata:
```

**Deliverables:** Running `pnpm dev` spins up all services. `pnpm build` produces deployable artifacts. TypeScript is strict across all packages with zero errors.

---

### PHASE 1 — Authentication & Room Management (Days 2–3)

**Objective:** Every user is identified. Every room is owned. Every action is authorized.

#### 1.1 — Database Schema (Drizzle ORM)

```typescript
// apps/api-server/src/db/schema.ts

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  avatarColor: varchar('avatar_color', { length: 7 }).notNull(),  // hex color
  createdAt: timestamp('created_at').defaultNow(),
});

export const rooms = pgTable('rooms', {
  id: varchar('id', { length: 12 }).primaryKey(),  // nanoid, e.g. "abc123xyz789"
  name: varchar('name', { length: 100 }).notNull(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  language: varchar('language', { length: 20 }).default('javascript').notNull(),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  lastActiveAt: timestamp('last_active_at').defaultNow(),
});

export const roomMembers = pgTable('room_members', {
  roomId: varchar('room_id').references(() => rooms.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  role: varchar('role', { length: 20 }).default('editor'),  // owner | editor | viewer
  joinedAt: timestamp('joined_at').defaultNow(),
}, (t) => ({ pk: primaryKey(t.roomId, t.userId) }));

export const snapshots = pgTable('snapshots', {
  id: uuid('id').defaultRandom().primaryKey(),
  roomId: varchar('room_id').references(() => rooms.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  language: varchar('language', { length: 20 }).notNull(),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### 1.2 — Auth Service

- **Registration:** Argon2id password hashing (bcrypt is 2004; we use Argon2id in 2024).
- **JWT Strategy:** Short-lived access tokens (15 min) + HTTP-only refresh tokens (7 days) stored in secure cookies. Never localStorage.
- **WS Auth:** On `Socket.io` `connection`, validate `auth.token` in handshake before emitting any events.

#### 1.3 — Room API

```
POST   /api/rooms            → Create room, generate nanoid, return invite URL
GET    /api/rooms/:id        → Get room metadata + member list
POST   /api/rooms/:id/join   → Join room (public) or validate invite token
DELETE /api/rooms/:id        → Owner-only room deletion
GET    /api/rooms/:id/snapshots → Paginated revision history
POST   /api/rooms/:id/snapshots → Manual snapshot trigger
GET    /api/rooms/:id/snapshots/:snapId/restore → Restore to revision
```

**Deliverables:** Auth flow with JWT refresh. Room creation returns `/room/abc123xyz789`. Role-based access control enforced at API and WS layers.

---

### PHASE 2 — Collaborative Editor Core (Days 4–7)

**Objective:** The heart of the system. This is where distributed systems mastery is demonstrated.

#### 2.1 — Y.js Architecture

**The CRDT Model:**
Y.js uses a **CRDT (Conflict-free Replicated Data Type)** — specifically a variant of LSEQ. Every character insertion/deletion is a pure operation with a globally unique Lamport timestamp. Two clients can edit offline and merge with zero conflicts. This is architecturally superior to operational transforms for P2P topologies.

**Document Lifecycle:**
```
Client connects → WS auth → join room namespace →
  server sends full Y.js state vector →
  client applies state →
  client and server exchange incremental updates →
  awareness updates for presence (separate channel)
```

#### 2.2 — Custom Socket.io Y.js Provider

> **Critical Design Decision:** Do NOT use `y-websocket` provider directly — it assumes a dedicated y-websocket server. We build a custom provider that integrates with our Socket.io room architecture. This is what separates engineers from developers.

```typescript
// apps/web/src/lib/yjs/provider.ts

import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as syncProtocol from 'y-protocols/sync';
import { Socket } from 'socket.io-client';

export class SocketIOProvider {
  doc: Y.Doc;
  awareness: Awareness;
  private socket: Socket;
  private _synced = false;

  constructor(socket: Socket, doc: Y.Doc) {
    this.doc = doc;
    this.socket = socket;
    this.awareness = new Awareness(doc);

    // Step 1: On connect, send sync step 1 (our state vector)
    this.socket.on('connect', () => {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, MessageType.Sync);
      syncProtocol.writeSyncStep1(encoder, this.doc);
      this.socket.emit('yjs:update', encoding.toUint8Array(encoder));
    });

    // Step 2: Handle incoming Y.js messages
    this.socket.on('yjs:update', (update: Uint8Array) => {
      const decoder = decoding.createDecoder(update);
      const messageType = decoding.readVarUint(decoder);

      if (messageType === MessageType.Sync) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MessageType.Sync);
        const syncMessageType = syncProtocol.readSyncMessage(
          decoder, encoder, this.doc, this
        );
        if (syncMessageType === syncProtocol.messageYjsSyncStep2) {
          this._synced = true;
        }
        if (encoding.length(encoder) > 1) {
          this.socket.emit('yjs:update', encoding.toUint8Array(encoder));
        }
      } else if (messageType === MessageType.Update) {
        Y.applyUpdate(this.doc, decoding.readVarUint8Array(decoder), this);
      }
    });

    // Step 3: Forward local changes to server
    this.doc.on('update', (update: Uint8Array, origin: unknown) => {
      if (origin !== this) {  // Avoid echo loop
        this.socket.emit('yjs:update', update);
      }
    });

    // Step 4: Awareness (cursors, selections, presence)
    this.socket.on('awareness:update', (update: Uint8Array) => {
      awarenessProtocol.applyAwarenessUpdate(this.awareness, update, this);
    });

    this.awareness.on('update', ({ added, updated, removed }: AwarenessChange) => {
      const changedClients = [...added, ...updated, ...removed];
      const encoder = encoding.createEncoder();
      awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients, encoder);
      this.socket.emit('awareness:update', encoding.toUint8Array(encoder));
    });
  }

  destroy() {
    this.awareness.destroy();
    this.doc.off('update', this._docUpdateHandler);
    this.socket.off('yjs:update');
    this.socket.off('awareness:update');
  }
}
```

#### 2.3 — Collaboration Server — Y.js Handler

```typescript
// apps/collab-server/src/handlers/yjsHandler.ts

export class YjsHandler {
  private docs = new Map<string, Y.Doc>();

  constructor(private io: Server, private redis: Redis) {}

  async getOrCreateDoc(roomId: string): Promise<Y.Doc> {
    if (this.docs.has(roomId)) return this.docs.get(roomId)!;

    const doc = new Y.Doc();

    // Load persisted state from Redis
    const persisted = await this.redis.get(`yjs:room:${roomId}`);
    if (persisted) {
      Y.applyUpdate(doc, Buffer.from(persisted, 'base64'));
    }

    // Persist on every update (debounced 2 seconds)
    const persistDebounced = debounce(async () => {
      const state = Y.encodeStateAsUpdate(doc);
      await this.redis.set(
        `yjs:room:${roomId}`,
        Buffer.from(state).toString('base64'),
        'EX', 86400  // 24h TTL; PostgreSQL has the durable copy
      );
    }, 2000);

    doc.on('update', persistDebounced);
    this.docs.set(roomId, doc);
    return doc;
  }

  handleUpdate(socket: Socket, roomId: string, update: Uint8Array) {
    const doc = this.docs.get(roomId);
    if (!doc) return;

    // Apply to server-side doc (source of truth)
    Y.applyUpdate(doc, update, socket.id);

    // Broadcast to room EXCEPT sender (Socket.io rooms handle topology)
    socket.to(roomId).emit('yjs:update', update);
  }
}
```

#### 2.4 — Monaco Editor Integration

```typescript
// apps/web/src/components/editor/CodeEditor.tsx

import Editor, { Monaco } from '@monaco-editor/react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';

export function CodeEditor({ roomId, provider }: Props) {
  const editorRef = useRef<MonacoEditorInstance | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const { doc, awareness } = useYjs(roomId);

  const handleEditorMount = useCallback((editor: MonacoEditorInstance, monaco: Monaco) => {
    editorRef.current = editor;

    // Y.js text type — the shared collaborative document
    const yText = doc.getText('code');

    // MonacoBinding synchronizes Monaco's model with Y.js text CRDT
    bindingRef.current = new MonacoBinding(
      yText,
      editor.getModel()!,
      new Set([editor]),
      awareness
    );
  }, [doc, awareness]);

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      theme="codesync-dark"
      onMount={handleEditorMount}
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        renderLineHighlight: 'gutter',
        padding: { top: 16 },
      }}
    />
  );
}
```

#### 2.5 — Shared Cursor Rendering

Each user in the awareness state carries:
```typescript
interface AwarenessState {
  user: {
    id: string;
    name: string;
    color: string;      // Unique per user, deterministic from userId hash
    avatar: string;     // Initials or gravatar URL
  };
  cursor: {
    anchor: RelativePosition | null;   // Y.js relative positions survive edits
    head: RelativePosition | null;
  };
}
```

Render remote cursors as Monaco `ContentWidget` elements — this places them in the correct line/column position in the editor DOM, surviving scroll and resize.

```typescript
// apps/web/src/lib/monaco/cursorWidget.ts

export class RemoteCursorWidget implements monaco.editor.IContentWidget {
  private domNode: HTMLElement;

  constructor(private user: AwarenessUser, private position: monaco.Position) {
    this.domNode = document.createElement('div');
    this.domNode.className = 'remote-cursor-widget';
    this.domNode.style.cssText = `
      position: absolute;
      border-left: 2px solid ${user.color};
      height: 1.2em;
      pointer-events: none;
      z-index: 100;
    `;

    // Nametag floating above cursor
    const label = document.createElement('div');
    label.className = 'remote-cursor-label';
    label.textContent = user.name;
    label.style.cssText = `
      background: ${user.color};
      color: white;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 3px;
      white-space: nowrap;
      position: absolute;
      bottom: 100%;
      left: 0;
      transform: translateY(-2px);
    `;
    this.domNode.appendChild(label);
  }

  getId() { return `remote-cursor-${this.user.id}`; }
  getDomNode() { return this.domNode; }
  getPosition() {
    return {
      position: this.position,
      preference: [monaco.editor.ContentWidgetPositionPreference.EXACT],
    };
  }
}
```

**Deliverables:** Multiple browser tabs can edit simultaneously. Changes appear in all connected clients within ~50ms on localhost. Colored cursor labels follow each user's caret. CRDT merges all concurrent edits without conflict.

---

### PHASE 3 — Sandboxed Code Execution (Days 8–10)

**Objective:** Execute untrusted code safely. This is the most security-critical phase.

#### 3.1 — Threat Model

| Threat | Mitigation |
|---|---|
| Infinite loops | Execution timeout: 10s hard kill |
| Memory exhaustion | Docker `--memory 128m` |
| Network exfiltration | `--network none` |
| Filesystem access | Read-only mount; tmpfs for writes |
| Fork bombs | `--pids-limit 50` |
| CPU starvation | `--cpus 0.5` |
| Output flooding | Stdout truncated at 100KB |

#### 3.2 — Docker Sandbox Images

```dockerfile
# infra/docker/sandbox/Dockerfile.js-sandbox
FROM node:20-alpine

# Create restricted user — NEVER run as root
RUN addgroup -S sandbox && adduser -S sandbox -G sandbox

# No package manager, no npm, no shell scripts
RUN rm -rf /usr/local/lib/node_modules/npm

WORKDIR /sandbox
USER sandbox

CMD ["node", "--experimental-vm-modules", "/sandbox/code.js"]
```

```dockerfile
# infra/docker/sandbox/Dockerfile.py-sandbox
FROM python:3.12-alpine

RUN addgroup -S sandbox && adduser -S sandbox -G sandbox

WORKDIR /sandbox
USER sandbox

CMD ["python3", "-u", "/sandbox/code.py"]
```

#### 3.3 — Docker Runner Service

```typescript
// apps/runner-service/src/runner/dockerRunner.ts

import Docker from 'dockerode';
import { Readable } from 'stream';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

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
    image: 'codesync-sandbox-ts:latest',  // node + ts-node
    filename: 'code.ts',
    timeout: 15_000,
  },
};

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
      Memory: 128 * 1024 * 1024,   // 128MB
      MemorySwap: 128 * 1024 * 1024,
      CpuPeriod: 100_000,
      CpuQuota: 50_000,             // 50% of one core
      PidsLimit: 50,
      NetworkMode: 'none',          // Air-gapped
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

  // Write code via stdin
  const attachStream = await container.attach({
    stream: true, stdin: true, stdout: true, stderr: true,
  });

  await container.start();

  // Write code content to container stdin
  const codeBuffer = Buffer.from(code, 'utf-8');
  attachStream.write(codeBuffer);
  attachStream.end();

  let stdout = '';
  let stderr = '';
  let killed = false;

  // Hard timeout kill
  const killTimer = setTimeout(async () => {
    killed = true;
    try { await container.kill(); } catch { /* already exited */ }
  }, config.timeout);

  // Stream output
  container.modem.demuxStream(
    attachStream as Readable,
    {
      write: (chunk: Buffer) => {
        const text = sanitizeOutput(chunk.toString('utf-8'));
        stdout += text;
        if (stdout.length <= 100_000) onOutput(text);  // 100KB cap
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
```

#### 3.4 — Execution Flow (Socket.io Streaming)

```
Client clicks "Run" →
  emit('execution:run', { code, language }) →
  Collab Server validates user is room member →
  forwards to Runner Service via BullMQ job →
  Runner spawns Docker container →
  streams stdout/stderr chunks back via Socket.io →
  client receives 'execution:output' events in real-time →
  'execution:complete' signals end with exit code
```

> **Streaming is critical** — a user running a long computation should see output in real-time, not wait for execution to complete. This is the difference between a demo and a product.

**Deliverables:** JavaScript and Python execute in isolated containers. Output streams to all room members in real-time. Malicious code (infinite loops, memory bombs, network calls) is neutralized by sandbox limits.

---

### PHASE 4 — Presence & Chat (Day 11)

**Objective:** Make collaboration feel alive. Presence is what separates CodeSync from a shared pastebin.

#### 4.1 — Presence System

Awareness state updates fire on every cursor move (debounced 50ms). The `AvatarStack` component renders up to 5 avatars; additional users shown as `+N` badge.

```typescript
// apps/web/src/hooks/usePresence.ts

export function usePresence(awareness: Awareness) {
  const [peers, setPeers] = useState<Map<number, AwarenessState>>(new Map());

  useEffect(() => {
    const handler = () => {
      const states = new Map<number, AwarenessState>();
      awareness.getStates().forEach((state, clientId) => {
        if (clientId !== awareness.clientID && state.user) {
          states.set(clientId, state as AwarenessState);
        }
      });
      setPeers(states);
    };

    awareness.on('change', handler);
    return () => awareness.off('change', handler);
  }, [awareness]);

  return peers;
}
```

#### 4.2 — Chat Panel

Chat messages are stored in Redis `LPUSH` (capped at 100 messages per room via `LTRIM`) for the session, and persisted to PostgreSQL for rooms older than 1 hour. No Y.js for chat — simple Socket.io relay is correct here; chat is append-only and eventual consistency is fine.

```typescript
// Message schema
interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatarColor: string;
  text: string;
  timestamp: number;
  type: 'message' | 'system';  // system for join/leave events
}
```

**Deliverables:** Avatar stack updates as users join/leave. System messages announce "Alice joined the room". Chat persists across brief disconnections.

---

### PHASE 5 — Autosave & Revision History (Day 12)

**Objective:** No work is ever lost. Every state is recoverable.

#### 5.1 — Autosave Strategy

Two-tier autosave:
1. **Redis (Hot):** Y.js document state serialized every 2 seconds via debounced `doc.on('update')`. Survives server restarts. TTL: 24h.
2. **PostgreSQL (Durable):** Full snapshot of editor content every 5 minutes, or on explicit save. Survives Redis flush. Unlimited retention.

```typescript
// apps/collab-server/src/services/snapshotService.ts

export class SnapshotService {
  private timers = new Map<string, NodeJS.Timeout>();

  scheduleSnapshot(roomId: string, doc: Y.Doc, db: Database) {
    if (this.timers.has(roomId)) return;

    const timer = setInterval(async () => {
      const yText = doc.getText('code');
      const content = yText.toString();

      if (content.trim().length === 0) return;

      await db.insert(snapshots).values({
        id: randomUUID(),
        roomId,
        content,
        language: await this.getRoomLanguage(roomId, db),
        createdBy: null,  // System snapshot
        createdAt: new Date(),
      });

      // Keep only last 50 auto-snapshots per room (prune oldest)
      await db.execute(sql`
        DELETE FROM snapshots
        WHERE room_id = ${roomId}
          AND created_by IS NULL
          AND id NOT IN (
            SELECT id FROM snapshots
            WHERE room_id = ${roomId}
            ORDER BY created_at DESC
            LIMIT 50
          )
      `);
    }, 5 * 60 * 1000);  // Every 5 minutes

    this.timers.set(roomId, timer);
  }
}
```

#### 5.2 — Revision History UI

Timeline sidebar showing snapshots with timestamps. Each entry shows character diff from previous. Click to preview in read-only Monaco instance. "Restore" replaces Y.js document content (using Y.Doc transaction to batch the operation cleanly).

**Deliverables:** Switching browser tabs confirms state persists. Disconnecting and reconnecting restores last known state. Snapshot list shows at least 5 auto-saves for active rooms.

---

### PHASE 6 — UI/UX Design System (Days 13–14)

**Objective:** Visually, CodeSync must look like a product people would pay for.

#### 6.1 — Design Direction: "Midnight Terminal"

- **Palette:** Deep space black `#0a0a0f` base. Electric cyan `#00d4ff` primary accent. Amber `#ffb800` for warnings/execution. Slate-blue `#1e2035` for panels.
- **Typography:** `JetBrains Mono` for all code. `Syne` (variable, geometric sans) for UI chrome. Never Inter. Never system fonts.
- **Motion:** Socket connection events trigger subtle shimmer on the room header. User joins animate in from the right in the avatar stack. Execution output types character-by-character (CSS `animation-delay` stagger per line).
- **Layout:** Three-column: file tree (future) | editor (dominant, 70%) | right panel (chat + execution output, collapsible).

#### 6.2 — Design Tokens

```css
/* packages/ui/src/tokens.css */
:root {
  --bg-base:        #0a0a0f;
  --bg-surface:     #111118;
  --bg-elevated:    #1e2035;
  --bg-overlay:     #252640;

  --accent-primary: #00d4ff;
  --accent-glow:    rgba(0, 212, 255, 0.15);
  --accent-amber:   #ffb800;
  --accent-success: #00e676;
  --accent-danger:  #ff4757;

  --text-primary:   #e8eaf6;
  --text-secondary: #7986cb;
  --text-muted:     #3d4166;

  --border-subtle:  rgba(255,255,255,0.06);
  --border-active:  rgba(0, 212, 255, 0.3);

  --font-code:      'JetBrains Mono', 'Fira Code', monospace;
  --font-ui:        'Syne', sans-serif;

  --radius-sm:      4px;
  --radius-md:      8px;
  --radius-lg:      12px;

  --shadow-ambient: 0 0 0 1px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.6);
  --shadow-glow:    0 0 20px rgba(0, 212, 255, 0.15);

  --transition-fast: 120ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-std:  220ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### 6.3 — Custom Monaco Theme

```typescript
monaco.editor.defineTheme('codesync-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment',   foreground: '3d4166', fontStyle: 'italic' },
    { token: 'keyword',   foreground: '00d4ff' },
    { token: 'string',    foreground: '00e676' },
    { token: 'number',    foreground: 'ffb800' },
    { token: 'function',  foreground: '82aaff' },
    { token: 'variable',  foreground: 'e8eaf6' },
    { token: 'type',      foreground: 'c3e88d' },
  ],
  colors: {
    'editor.background':         '#0a0a0f',
    'editor.foreground':         '#e8eaf6',
    'editorLineNumber.foreground': '#3d4166',
    'editorCursor.foreground':   '#00d4ff',
    'editor.selectionBackground': 'rgba(0,212,255,0.15)',
    'editorGutter.background':   '#0a0a0f',
    'editor.lineHighlightBackground': 'rgba(255,255,255,0.03)',
  },
});
```

**Deliverables:** Screenshots of the running application would not look out of place as a feature image on Product Hunt.

---

### PHASE 7 — Performance, Scalability & Hardening (Days 15–16)

**Objective:** The system must handle concurrent users without degradation.

#### 7.1 — Socket.io Clustering

```typescript
// apps/collab-server/src/services/redisAdapter.ts
import { createAdapter } from '@socket.io/redis-adapter';

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();
await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
```

This enables horizontal scaling: multiple collab-server instances share room state via Redis pub/sub. A user on Node 1 and a user on Node 2 in the same room collaborate seamlessly.

#### 7.2 — Y.js Update Optimization

- **Binary protocol:** Y.js updates are already binary (Uint8Array). Never JSON-encode them.
- **State vector diffing:** When a client reconnects, send only the diff since their last known state vector — not the entire document.
- **Throttle awareness:** Cursor position updates are throttled to 30 fps (33ms) before emitting. The human eye cannot perceive faster updates.

#### 7.3 — Rate Limiting

```typescript
// Per-socket rate limiting on the collab server
const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rl:ws',
  points: 50,      // Max 50 Y.js updates
  duration: 1,     // Per second
});

socket.on('yjs:update', async (update) => {
  try {
    await rateLimiter.consume(socket.data.userId);
    yjsHandler.handleUpdate(socket, roomId, update);
  } catch {
    socket.emit('error', { code: 'RATE_LIMIT', message: 'Slow down' });
  }
});
```

#### 7.4 — Connection Resilience

```typescript
// apps/web/src/lib/socket.ts
const socket = io(WS_URL, {
  auth: { token: getAccessToken() },
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
  transports: ['websocket'],  // Skip long-polling; we require WebSocket
});

socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    // Server-initiated; likely auth expiry — refresh token then reconnect
    refreshTokenAndReconnect();
  }
  // Otherwise, Socket.io auto-reconnects
});
```

**Deliverables:** System handles graceful reconnection. Redis cluster mode tested with multiple server instances. No memory leaks on prolonged sessions (verify with `clinic.js` heap profiler).

---

### PHASE 8 — Testing Strategy (Day 17)

#### 8.1 — Unit Tests (Vitest)

- Y.js provider: offline edit → reconnect → state convergence
- Docker runner: timeout enforcement, output truncation, exit code handling
- Room service: permission checks, invite token validation
- Auth service: token refresh, Argon2id hash verification

#### 8.2 — Integration Tests (Supertest + socket.io-client)

```typescript
// Test: Two clients editing simultaneously converges to same state

test('concurrent edits converge via CRDT', async () => {
  const [client1, client2] = await Promise.all([
    createTestClient(roomId),
    createTestClient(roomId),
  ]);

  // Simulate concurrent inserts
  client1.doc.getText('code').insert(0, 'Hello');
  client2.doc.getText('code').insert(0, 'World');

  await waitForSync([client1, client2]);

  // Both clients must have identical state
  expect(client1.doc.getText('code').toString()).toBe(
    client2.doc.getText('code').toString()
  );
});
```

#### 8.3 — E2E Tests (Playwright)

- Full room creation → invite → join → collaborative edit → run code → see output flow
- Test across Chromium, Firefox, WebKit

---

## 🌐 Nginx Configuration

```nginx
# infra/nginx/nginx.conf
upstream collab_servers { server collab-server:3001; }
upstream api_servers    { server api-server:3002;    }
upstream web_app        { server web:5173;            }

server {
    listen 80;

    # WebSocket connections → Collab Server
    location /socket.io/ {
        proxy_pass http://collab_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }

    # REST API
    location /api/ {
        proxy_pass http://api_servers;
        proxy_set_header X-Real-IP $remote_addr;
        limit_req zone=api_limit burst=20 nodelay;
    }

    # React frontend (SPA)
    location / {
        proxy_pass http://web_app;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 📦 Environment Variables Reference

```env
# apps/api-server/.env
DATABASE_URL=postgresql://codesync:codesync_dev@localhost:5432/codesync
REDIS_URL=redis://localhost:6379
JWT_SECRET=<256-bit random secret>
JWT_REFRESH_SECRET=<256-bit random secret>
CORS_ORIGIN=http://localhost:5173
RUNNER_SERVICE_URL=http://localhost:3003

# apps/collab-server/.env
REDIS_URL=redis://localhost:6379
JWT_SECRET=<same as api-server>
CORS_ORIGIN=http://localhost:5173

# apps/runner-service/.env
REDIS_URL=redis://localhost:6379
DOCKER_SOCKET=/var/run/docker.sock
MAX_CONCURRENT_JOBS=10
JS_SANDBOX_IMAGE=codesync-sandbox-js:latest
PY_SANDBOX_IMAGE=codesync-sandbox-py:latest

# apps/web/.env
VITE_API_URL=http://localhost:3002
VITE_WS_URL=http://localhost:3001
```

---

## 🗓️ Master Timeline

| Phase | Focus | Duration | Output |
|---|---|---|---|
| 0 | Monorepo + toolchain + shared types | Day 1 | pnpm dev boots all services |
| 1 | Auth + Room API + DB schema | Days 2–3 | JWT auth, room CRUD, invite URLs |
| 2 | Y.js CRDT + Monaco + cursors | Days 4–7 | Live collaborative editing works |
| 3 | Docker sandbox + code execution | Days 8–10 | JS + Python run in isolation |
| 4 | Presence + chat | Day 11 | Avatar stack, system messages |
| 5 | Autosave + revision history | Day 12 | Snapshots, restore, history UI |
| 6 | Design system + polish | Days 13–14 | Production-quality UI |
| 7 | Scaling + hardening + profiling | Days 15–16 | Multi-instance, rate-limited |
| 8 | Testing suite | Day 17 | Unit + integration + E2E passing |

---

## 🔑 Key Engineering Decisions (Interview Talking Points)

| Decision | Rationale |
|---|---|
| **Y.js over OT** | CRDTs have no central coordinator requirement; scale to P2P; proven at production scale (Figma, Linear) |
| **Custom Socket.io Y.js provider** | `y-websocket` assumes full protocol ownership; building custom integrates cleanly with our room/auth model |
| **Redis for Y.js hot state** | Millisecond read for reconnecting users; PostgreSQL for durability; right tool for each layer |
| **BullMQ for execution jobs** | Decouples code execution from WebSocket latency; enables retries, dead-letter queues, job monitoring |
| **Argon2id over bcrypt** | Memory-hard; side-channel resistant; 2024 OWASP recommendation |
| **Turborepo over Nx** | Less config overhead for our service count; excellent Vite integration |
| **`--network none` on Docker sandboxes** | Absolute air gap; no DNS, no outbound; cannot exfiltrate data or hit external APIs |
| **Relative positions for cursors** | Y.js `RelativePosition` survives document mutations; absolute line/col positions break on concurrent edits |

---

## 🚀 Launch Checklist

- [ ] `docker compose up` starts all services cleanly from cold state
- [ ] User can register, create a room, copy `/room/abc123`, share with incognito tab
- [ ] Second user joins, both see each other's cursors with colored labels
- [ ] Concurrent edits in both windows converge without conflict
- [ ] Both users see execution output in real-time when "Run" is clicked
- [ ] Chat panel shows join/leave system messages
- [ ] Autosave snapshot appears in revision history after 5 minutes
- [ ] Snapshot restore replaces editor content in all clients simultaneously
- [ ] Disconnecting and reconnecting restores last document state
- [ ] Malicious code (infinite loop) is killed after 10 seconds
- [ ] Rate limiter rejects > 50 WS updates/second per user
- [ ] All TypeScript packages compile with zero errors (`pnpm typecheck`)
- [ ] All unit + integration tests pass (`pnpm test`)

---

*Implementation plan prepared to production-engineering standards. Every architectural choice is defensible, every security boundary is intentional, and every technology is the right tool for its specific job — not the fashionable choice.*

*Build this. Then talk about it in interviews. Watch the room change.*
