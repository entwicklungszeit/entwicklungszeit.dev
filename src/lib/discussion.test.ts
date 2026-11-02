import { describe, expect, it } from 'vitest';
import { parseDiscussionAction, parseOffset, validateArticleSlug } from './discussion';
import { requireSameOrigin, validCaptchaResult } from '../../netlify/lib/discussion-security';

describe('discussion input validation', () => {
  it('accepts article slugs but rejects paths and unknown identifiers', () => {
    expect(validateArticleSlug('angular-signals-in-angular')).toBe('angular-signals-in-angular');
    for (const slug of [null, '', '../private', 'article/title', 'a'.repeat(181)]) {
      expect(() => validateArticleSlug(slug)).toThrow('Ungültiger Artikel');
    }
  });

  it('accepts upvotes, downvotes and removing a vote', () => {
    for (const value of [-1, 0, 1]) expect(parseDiscussionAction({ action: 'vote', value })).toEqual({ action: 'vote', value });
    for (const value of [2, '1', null, true]) expect(() => parseDiscussionAction({ action: 'vote', value })).toThrow();
  });

  const comment = { action: 'comment', body: ' Ein Gedanke. ', authorName: ' Leserin ', captchaToken: 'proof', website: '' };

  it('trims comment content and public display names', () => {
    expect(parseDiscussionAction(comment)).toMatchObject({ body: 'Ein Gedanke.', authorName: 'Leserin' });
  });

  it('rejects empty, oversized, unverified or honeypot submissions', () => {
    for (const input of [
      { body: '   ' }, { body: 'x'.repeat(2001) }, { authorName: 'x' },
      { authorName: 'x'.repeat(61) }, { captchaToken: '' }, { website: 'spam' }, { website: undefined }
    ]) expect(() => parseDiscussionAction({ ...comment, ...input })).toThrow();
  });

  it('restricts reaction types and requires explicit idempotent state', () => {
    const reaction = { action: 'reaction', commentId: 'c62cc6df-b26c-424a-bb30-6b2a2b045ab6', emoji: '👍', active: true };
    expect(parseDiscussionAction(reaction)).toEqual(reaction);
    expect(() => parseDiscussionAction({ ...reaction, emoji: '<script>' })).toThrow();
    expect(() => parseDiscussionAction({ ...reaction, commentId: 'not-a-uuid' })).toThrow();
    expect(() => parseDiscussionAction({ ...reaction, active: 'true' })).toThrow();
    expect(parseDiscussionAction({ action: 'delete', commentId: reaction.commentId })).toEqual({ action: 'delete', commentId: reaction.commentId });
  });

  it('validates bounded pagination offsets', () => {
    expect(parseOffset(null)).toBe(0);
    expect(parseOffset('20')).toBe(20);
    for (const value of ['-1', '1.5', '9999999', 'abc', '']) expect(() => parseOffset(value)).toThrow();
  });
});

describe('discussion bot and CSRF protection', () => {
  it('requires the exact origin and JSON for mutations', () => {
    const request = (origin?: string, type = 'application/json') => new Request('https://example.test/api/discussion', {
      method: 'POST', headers: { ...(origin ? { origin } : {}), 'Content-Type': type }
    });
    expect(() => requireSameOrigin(request('https://example.test'))).not.toThrow();
    expect(() => requireSameOrigin(request())).toThrow();
    expect(() => requireSameOrigin(request('https://attacker.test'))).toThrow();
    expect(() => requireSameOrigin(request('https://example.test', 'text/plain'))).toThrow();
  });

  it('accepts only successful, recent CAPTCHA proofs for the current host', () => {
    const now = Date.parse('2026-10-13T12:00:00Z');
    const result = { success: true, hostname: 'example.test', challenge_ts: '2026-10-13T11:59:30Z' };
    expect(validCaptchaResult(result, 'example.test', now)).toBe(true);
    for (const invalid of [
      null, { ...result, success: false }, { ...result, hostname: 'attacker.test' },
      { ...result, challenge_ts: '2026-10-13T11:57:00Z' }, { ...result, challenge_ts: '2026-10-13T12:01:00Z' },
      { ...result, challenge_ts: 'invalid' }, { success: true }
    ]) expect(validCaptchaResult(invalid, 'example.test', now)).toBe(false);
  });
});
