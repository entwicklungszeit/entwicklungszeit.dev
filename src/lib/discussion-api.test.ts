import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getUser } from '@netlify/identity';
import { getDatabase } from '../../db/index';
import { readFile } from 'node:fs/promises';
import { verifyCaptcha } from '../../netlify/lib/discussion-security';
import { DiscussionError } from './discussion';
import handler from '../../netlify/functions/discussion.mjs';

vi.mock('@netlify/identity', () => ({ getUser: vi.fn() }));
vi.mock('../../db/index.js', () => ({ getDatabase: vi.fn() }));
vi.mock('node:fs/promises', async importOriginal => {
  const actual = await importOriginal<typeof import('node:fs/promises')>();
  const readFile = vi.fn();
  return { ...actual, readFile, default: { ...actual, readFile } };
});
vi.mock('../../netlify/lib/discussion-security.js', async importOriginal => ({
  ...await importOriginal<typeof import('../../netlify/lib/discussion-security')>(),
  verifyCaptcha: vi.fn()
}));

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://example.test/api/discussion?article=published-article', {
    method: 'POST', headers: { origin: 'https://example.test', 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body)
  });
}

function mockDatabase(results: unknown[][]) {
  const query = {
    values: vi.fn().mockReturnThis(), onConflictDoUpdate: vi.fn().mockReturnThis(),
    onConflictDoNothing: vi.fn().mockReturnThis(), where: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(), returning: vi.fn().mockImplementation(() => Promise.resolve(results.shift() ?? [])),
    groupBy: vi.fn().mockReturnThis(), orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(), offset: vi.fn().mockReturnThis(),
    then: (resolve: (value: unknown[]) => void) => Promise.resolve(results.shift() ?? []).then(resolve)
  };
  const database = { insert: vi.fn(() => query), select: vi.fn(() => query), delete: vi.fn(() => query) };
  vi.mocked(getDatabase).mockReturnValue(database as unknown as ReturnType<typeof getDatabase>);
  return database;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(readFile).mockResolvedValue('---\nstatus: public\n---\nArticle');
  vi.mocked(getUser).mockResolvedValue({ id: 'reader-id', provider: 'github' });
});

describe('discussion API protections', () => {
  it('allows public reading without exposing account identifiers', async () => {
    vi.mocked(getUser).mockResolvedValue(null);
    mockDatabase([
      [{ value: 1, count: 2 }], [{ count: 1 }],
      [{ id: 'comment-id', userId: 'private-account-id', authorName: 'Mara', body: 'Gedanke', createdAt: new Date('2026-10-13T12:00:00Z') }],
      [{ commentId: 'comment-id', emoji: '👍', count: 1, active: false }]
    ]);
    const response = await handler(new Request('https://example.test/api/discussion?article=published-article'));
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.votes).toEqual({ up: 2, down: 0, mine: 0 });
    expect(result.totalComments).toBe(1);
    expect(result.comments[0].canDelete).toBe(false);
    expect(result.comments[0]).not.toHaveProperty('userId');
    expect(result.comments[0]).not.toHaveProperty('email');
    expect(result.comments[0].reactions[0]).toEqual({ emoji: '👍', count: 1, active: false });
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('rejects unpublished articles before connecting to the database', async () => {
    vi.mocked(readFile).mockResolvedValue('---\nstatus: draft\n---\nArticle');
    const response = await handler(request({ action: 'vote', value: 1 }));
    expect(response.status).toBe(404);
    expect(getDatabase).not.toHaveBeenCalled();
  });

  it('requires social authentication for every mutation', async () => {
    for (const user of [null, { id: 'reader-id', provider: 'email' as const }]) {
      vi.mocked(getUser).mockResolvedValue(user);
      expect((await handler(request({ action: 'vote', value: 1 }))).status).toBe(401);
    }
    expect(getDatabase).not.toHaveBeenCalled();
  });

  it('rejects cross-origin changes and malformed JSON', async () => {
    expect((await handler(request({ action: 'vote', value: 1 }, { origin: 'https://attacker.test' }))).status).toBe(403);
    const malformed = new Request('https://example.test/api/discussion?article=published-article', {
      method: 'POST', headers: { origin: 'https://example.test', 'Content-Type': 'application/json' }, body: '{'
    });
    expect((await handler(malformed)).status).toBe(400);
    expect(getDatabase).not.toHaveBeenCalled();
  });

  it('enforces the persistent submission limit before writing content', async () => {
    const database = mockDatabase([[]]);
    const response = await handler(request({ action: 'vote', value: 1 }));
    expect(response.status).toBe(429);
    expect(database.insert).toHaveBeenCalledTimes(1);
  });

  it('fails closed when CAPTCHA is unavailable or rejected', async () => {
    const database = mockDatabase([[{ userId: 'reader-id' }]]);
    vi.mocked(verifyCaptcha).mockRejectedValue(new DiscussionError(503, 'Sicherheitsprüfung nicht eingerichtet.'));
    const response = await handler(request({ action: 'comment', body: 'Gedanke', authorName: 'Leserin', captchaToken: 'proof', website: '' }));
    expect(response.status).toBe(503);
    expect(database.insert).toHaveBeenCalledTimes(1);
  });

  it('publishes comments only after successful CAPTCHA verification', async () => {
    const database = mockDatabase([[{ userId: 'reader-id' }], [{ id: 'comment-id' }]]);
    vi.mocked(verifyCaptcha).mockResolvedValue(undefined);
    const response = await handler(request({ action: 'comment', body: '<script>alert(1)</script>', authorName: 'Leserin', captchaToken: 'proof', website: '' }));
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ id: 'comment-id' });
    expect(database.insert).toHaveBeenCalledTimes(2);
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('prevents deleting another reader’s comment', async () => {
    const database = mockDatabase([[{ userId: 'reader-id' }], [{ userId: 'someone-else' }]]);
    const response = await handler(request({ action: 'delete', commentId: 'c62cc6df-b26c-424a-bb30-6b2a2b045ab6' }));
    expect(response.status).toBe(403);
    expect(database.delete).not.toHaveBeenCalled();
  });

  it('allows a moderator to remove abusive comments', async () => {
    vi.mocked(getUser).mockResolvedValue({ id: 'moderator-id', provider: 'google', roles: ['moderator'] });
    const database = mockDatabase([[{ userId: 'moderator-id' }], [{ userId: 'someone-else' }], []]);
    expect((await handler(request({ action: 'delete', commentId: 'c62cc6df-b26c-424a-bb30-6b2a2b045ab6' }))).status).toBe(200);
    expect(database.delete).toHaveBeenCalledOnce();
  });
});
