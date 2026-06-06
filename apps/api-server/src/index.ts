import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from './db/schema.js';
import path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore
import authRoutes from './routes/auth.js';
// @ts-ignore
import roomRoutes from './routes/rooms.js';
// @ts-ignore
import snapshotRoutes from './routes/snapshots.js';

dotenv.config();

const app = express();
const cleanCorsOrigin = (origin: string | undefined): string => {
  if (!origin) return '*';
  const sanitized = origin.replace(/[\r\n\t]/g, '').trim();
  return sanitized !== '' ? sanitized : '*';
};
const corsOrigin = cleanCorsOrigin(process.env.CORS_ORIGIN);
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/snapshots', snapshotRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    console.log('Running database migrations...');
    const migrationsPath = path.join(__dirname, '../drizzle');
    await migrate(db, { migrationsFolder: migrationsPath });
    console.log('Database migrations completed successfully!');
  } catch (err) {
    console.error('Failed to run database migrations:', err);
  }

  app.listen(PORT, () => {
    console.log(`API Server listening on port ${PORT}`);
  });
};

startServer();
