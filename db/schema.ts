import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const articleVotes = pgTable('article_votes', {
  article: text().notNull(),
  userId: text('user_id').notNull(),
  value: integer().notNull()
}, table => [
  primaryKey({ columns: [table.article, table.userId] }),
  check('article_vote_value', sql`${table.value} in (-1, 1)`)
]);

export const comments = pgTable('article_comments', {
  id: uuid().defaultRandom().primaryKey(),
  article: text().notNull(),
  userId: text('user_id').notNull(),
  authorName: text('author_name').notNull(),
  body: text().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, table => [
  index('article_comments_page').on(table.article, table.createdAt, table.id),
  check('comment_body_length', sql`char_length(${table.body}) between 1 and 2000`),
  check('comment_author_length', sql`char_length(${table.authorName}) between 2 and 60`)
]);

export const commentReactions = pgTable('comment_reactions', {
  commentId: uuid('comment_id').notNull().references(() => comments.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  emoji: text().notNull()
}, table => [
  primaryKey({ columns: [table.commentId, table.userId, table.emoji] }),
  check('comment_reaction_emoji', sql`${table.emoji} in ('👍', '❤️', '💡', '🎉')`)
]);

export const discussionLimits = pgTable('discussion_limits', {
  userId: text('user_id').notNull(),
  action: text().notNull(),
  windowStart: timestamp('window_start', { withTimezone: true }).defaultNow().notNull(),
  count: integer().default(1).notNull()
}, table => [primaryKey({ columns: [table.userId, table.action] })]);
