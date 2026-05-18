import { pgTable, serial, text, numeric, integer, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  hash: text('hash').notNull(),
});

export const budget = pgTable('budget', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  item: text('item').notNull(),
  price: numeric('price').notNull(),
});

export const savings = pgTable('savings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).unique(),
  amount: numeric('amount').notNull(),
});

export const kanbanCard = pgTable('kanban_card', {
  id: serial('id').primaryKey(),
  status: text('status').notNull(), //ONLY POSSIBLE STATES: to-do, doing, done
  title: text('title'),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
  userId: integer('user_id').references(() => users.id, { onDelete:'cascade' }),
});
