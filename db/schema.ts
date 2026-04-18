import { sql } from 'drizzle-orm';
import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const resources = pgTable(
  'resources',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    title: text('title').notNull(),
    summary: text('summary').notNull(),
    type: text('type').notNull(),
    date: timestamp('date', { withTimezone: true }).notNull(),
    external_link: text('external_link').notNull(),
    technical_level: text('technical_level').notNull(),
    authors: text('authors').array().notNull().default(sql`'{}'::text[]`),
    tags: jsonb('tags').$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    extras: jsonb('extras').$type<Record<string, unknown>>().default(sql`'{}'::jsonb`),
    last_verified: timestamp('last_verified', { withTimezone: true }).defaultNow().notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_resources_type').on(table.type),
    index('idx_resources_date').on(table.date),
    index('idx_resources_technical_level').on(table.technical_level),
    index('idx_resources_tags').using('gin', table.tags),
    index('idx_resources_extras').using('gin', table.extras),
  ]
);

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().default(sql`uuidv7()`),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
