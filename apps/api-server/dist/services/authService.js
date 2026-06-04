import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import { db } from '../index';
// @ts-ignore
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export class AuthService {
    static async register(email, username, passwordPlain) {
        const passwordHash = await argon2.hash(passwordPlain);
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        const [user] = await db.insert(users).values({
            email,
            username,
            passwordHash,
            avatarColor: color
        }).returning();
        return user;
    }
    static async login(email, passwordPlain) {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user)
            throw new Error('Invalid credentials');
        const valid = await argon2.verify(user.passwordHash, passwordPlain);
        if (!valid)
            throw new Error('Invalid credentials');
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
        return { user, token };
    }
    static verifyToken(token) {
        return jwt.verify(token, JWT_SECRET);
    }
}
