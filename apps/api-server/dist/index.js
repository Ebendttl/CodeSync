import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './db/schema';
// @ts-ignore
import authRoutes from './routes/auth';
// @ts-ignore
import roomRoutes from './routes/rooms';
// @ts-ignore
import snapshotRoutes from './routes/snapshots';
dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN }));
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
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`API Server listening on port ${PORT}`);
});
