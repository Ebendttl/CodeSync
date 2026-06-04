import { pgTable, uuid, varchar, text, timestamp, boolean, primaryKey } from 'drizzle-orm/pg-core';
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    username: varchar('username', { length: 50 }).unique().notNull(),
    passwordHash: text('password_hash').notNull(),
    avatarColor: varchar('avatar_color', { length: 7 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});
export const rooms = pgTable('rooms', {
    id: varchar('id', { length: 12 }).primaryKey(),
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
    role: varchar('role', { length: 20 }).default('editor'),
    joinedAt: timestamp('joined_at').defaultNow(),
}, (t) => ({ pk: primaryKey({ columns: [t.roomId, t.userId] }) }));
export const snapshots = pgTable('snapshots', {
    id: uuid('id').defaultRandom().primaryKey(),
    roomId: varchar('room_id').references(() => rooms.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    language: varchar('language', { length: 20 }).notNull(),
    createdBy: uuid('created_by').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
});
