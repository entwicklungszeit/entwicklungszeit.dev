import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { and, asc, count, eq, inArray, sql } from 'drizzle-orm';
import { getUser, type User } from '@netlify/identity';
import type { Config } from '@netlify/functions';
import { getDatabase } from '../../db/index.js';
import { articleVotes, comments, commentReactions, discussionLimits } from '../../db/schema.js';
import { DiscussionError, parseDiscussionAction, parseOffset, reactionOptions, validateArticleSlug } from '../../src/lib/discussion.js';
import { requireSameOrigin, verifyCaptcha } from '../lib/discussion-security.js';

async function requirePublishedArticle(article: string) {
  for (const extension of ['md', 'mdx']) {
    try {
      const content = await readFile(join(process.cwd(), 'src/content/blog', `${article}.${extension}`), 'utf8');
      const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
      if (frontmatter && /^status:\s*['"]?public['"]?\s*$/m.test(frontmatter)) return;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
  }
  throw new DiscussionError(404, 'Dieser Artikel ist nicht veröffentlicht.');
}

function canDelete(user: User | null, userId: string) {
  return Boolean(user && (user.id === userId || user.roles?.some(role => role === 'admin' || role === 'moderator')));
}

async function consumeLimit(database: ReturnType<typeof getDatabase>, userId: string, action: string) {
  const limit = action === 'comment' ? 5 : 60;
  const expired = sql`${discussionLimits.windowStart} <= now() - interval '10 minutes'`;
  const result = await database.insert(discussionLimits).values({ userId, action })
    .onConflictDoUpdate({
      target: [discussionLimits.userId, discussionLimits.action],
      set: {
        windowStart: sql`case when ${expired} then now() else ${discussionLimits.windowStart} end`,
        count: sql`case when ${expired} then 1 else ${discussionLimits.count} + 1 end`
      },
      setWhere: sql`${expired} or ${discussionLimits.count} < ${limit}`
    }).returning({ userId: discussionLimits.userId });
  if (!result.length) throw new DiscussionError(429, 'Zu viele Anfragen. Bitte warte bis zu zehn Minuten.');
}

async function getDiscussion(database: ReturnType<typeof getDatabase>, article: string, user: User | null, offset: number) {
  const pageSize = 20;
  const [voteCounts, ownVote, commentCount, page] = await Promise.all([
    database.select({ value: articleVotes.value, count: count() }).from(articleVotes)
      .where(eq(articleVotes.article, article)).groupBy(articleVotes.value),
    user ? database.select({ value: articleVotes.value }).from(articleVotes)
      .where(and(eq(articleVotes.article, article), eq(articleVotes.userId, user.id))) : Promise.resolve([]),
    database.select({ count: count() }).from(comments).where(eq(comments.article, article)),
    database.select().from(comments).where(eq(comments.article, article))
      .orderBy(asc(comments.createdAt), asc(comments.id)).limit(pageSize).offset(offset)
  ]);
  const reactions = page.length ? await database.select({
    commentId: commentReactions.commentId,
    emoji: commentReactions.emoji,
    count: count(),
    active: user ? sql<boolean>`bool_or(${commentReactions.userId} = ${user.id})` : sql<boolean>`false`
  }).from(commentReactions).where(inArray(commentReactions.commentId, page.map(comment => comment.id)))
    .groupBy(commentReactions.commentId, commentReactions.emoji) : [];
  const totalComments = commentCount[0].count;
  return {
    votes: {
      up: voteCounts.find(vote => vote.value === 1)?.count ?? 0,
      down: voteCounts.find(vote => vote.value === -1)?.count ?? 0,
      mine: ownVote[0]?.value ?? 0
    },
    totalComments,
    nextOffset: offset + page.length < totalComments ? offset + page.length : null,
    captchaSiteKey: process.env.RECAPTCHA_SECRET_KEY && process.env.RECAPTCHA_SITE_KEY ? process.env.RECAPTCHA_SITE_KEY : null,
    comments: page.map(comment => ({
      id: comment.id,
      authorName: comment.authorName,
      body: comment.body,
      createdAt: comment.createdAt.toISOString(),
      canDelete: canDelete(user, comment.userId),
      reactions: reactionOptions.map(option => {
        const reaction = reactions.find(reaction => reaction.commentId === comment.id && reaction.emoji === option.emoji);
        return { emoji: option.emoji, count: reaction?.count ?? 0, active: reaction?.active ?? false };
      })
    }))
  };
}

function respond(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}

export default async (request: Request) => {
  try {
    if (request.method !== 'GET' && request.method !== 'POST') {
      return new Response(null, { status: 405, headers: { Allow: 'GET, POST' } });
    }
    const url = new URL(request.url);
    const article = validateArticleSlug(url.searchParams.get('article'));
    await requirePublishedArticle(article);
    if (request.method === 'POST') requireSameOrigin(request);
    const user = await getUser();
    if (request.method === 'GET') {
      return respond(await getDiscussion(getDatabase(), article, user, parseOffset(url.searchParams.get('offset'))));
    }
    if (!user || !['google', 'github'].includes(user.provider ?? '')) {
      throw new DiscussionError(401, 'Bitte melde dich mit Google oder GitHub an.');
    }
    if (Number(request.headers.get('content-length')) > 16_000) throw new DiscussionError(413, 'Die Anfrage ist zu groß.');
    const body = await request.text();
    if (body.length > 16_000) throw new DiscussionError(413, 'Die Anfrage ist zu groß.');
    let input: unknown;
    try { input = JSON.parse(body); } catch { throw new DiscussionError(400, 'Ungültige Anfrage.'); }
    const action = parseDiscussionAction(input);
    const database = getDatabase();
    await consumeLimit(database, user.id, action.action);
    if (action.action === 'comment') {
      await verifyCaptcha(action.captchaToken, request);
      const [comment] = await database.insert(comments).values({
        article, userId: user.id, authorName: action.authorName, body: action.body
      }).returning({ id: comments.id });
      return respond({ id: comment.id }, 201);
    }
    if (action.action === 'vote') {
      if (action.value === 0) {
        await database.delete(articleVotes).where(and(eq(articleVotes.article, article), eq(articleVotes.userId, user.id)));
      } else {
        await database.insert(articleVotes).values({ article, userId: user.id, value: action.value })
          .onConflictDoUpdate({ target: [articleVotes.article, articleVotes.userId], set: { value: action.value } });
      }
    } else {
      const [comment] = await database.select({ userId: comments.userId }).from(comments)
        .where(and(eq(comments.id, action.commentId), eq(comments.article, article)));
      if (!comment) throw new DiscussionError(404, 'Dieser Kommentar existiert nicht mehr.');
      if (action.action === 'delete') {
        if (!canDelete(user, comment.userId)) throw new DiscussionError(403, 'Du darfst diesen Kommentar nicht löschen.');
        await database.delete(comments).where(and(eq(comments.id, action.commentId), eq(comments.article, article)));
      } else if (action.active) {
        await database.insert(commentReactions).values({ commentId: action.commentId, userId: user.id, emoji: action.emoji })
          .onConflictDoNothing();
      } else {
        await database.delete(commentReactions).where(and(
          eq(commentReactions.commentId, action.commentId), eq(commentReactions.userId, user.id), eq(commentReactions.emoji, action.emoji)
        ));
      }
    }
    return respond({ ok: true });
  } catch (error) {
    if (error instanceof DiscussionError) return respond({ error: error.message }, error.status);
    return respond({ error: 'Die Diskussion ist gerade nicht erreichbar. Bitte versuche es später erneut.' }, 503);
  }
};

export const config: Config = {
  path: '/api/discussion',
  rateLimit: { windowLimit: 120, windowSize: 60, aggregateBy: ['ip', 'domain'] }
};
