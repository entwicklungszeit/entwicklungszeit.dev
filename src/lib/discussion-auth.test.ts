import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getUser, handleAuthCallback, oauthLogin } from '@netlify/identity';

vi.mock('@netlify/identity', () => ({ getUser: vi.fn(), handleAuthCallback: vi.fn(), oauthLogin: vi.fn() }));

const replace = vi.fn();
const replaceState = vi.fn();
const location = { pathname: '/', search: '', hash: '', replace };

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  sessionStorage.clear();
  location.pathname = '/';
  location.hash = '';
  vi.stubGlobal('window', { location, history: { replaceState } });
  vi.mocked(getUser).mockResolvedValue({ id: 'reader-id', provider: 'github' });
  vi.mocked(handleAuthCallback).mockResolvedValue(null);
});

afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });

describe('discussion OAuth callbacks', () => {
  it('returns a signed-in reader to the originating article', async () => {
    sessionStorage.setItem('discussion-return-to', '/blog/public-article/');
    vi.mocked(handleAuthCallback).mockResolvedValue({ type: 'oauth', user: { id: 'reader-id', provider: 'github' } });
    const { initializeDiscussionAuth } = await import('./discussion-auth');
    expect(await initializeDiscussionAuth()).toMatchObject({ id: 'reader-id' });
    expect(replace).toHaveBeenCalledWith('/blog/public-article/#diskussion');
    expect(sessionStorage.getItem('discussion-return-to')).toBeNull();
  });

  it('does not follow an external or protocol-relative return URL', async () => {
    vi.mocked(handleAuthCallback).mockResolvedValue({ type: 'oauth', user: { id: 'reader-id' } });
    for (const returnTo of ['https://attacker.test', '//attacker.test', '/blog/../private', '/blog/article?redirect=external']) {
      vi.resetModules();
      sessionStorage.setItem('discussion-return-to', returnTo);
      const { initializeDiscussionAuth } = await import('./discussion-auth');
      await initializeDiscussionAuth();
    }
    expect(replace).not.toHaveBeenCalled();
  });

  it('allows recovery after an OAuth callback error', async () => {
    location.hash = '#error=access_denied';
    const { initializeDiscussionAuth } = await import('./discussion-auth');
    await expect(initializeDiscussionAuth()).rejects.toThrow('Anmeldung ist fehlgeschlagen');
    expect(replaceState).toHaveBeenCalledWith(null, '', '/');
    location.hash = '';
    await expect(initializeDiscussionAuth()).resolves.toMatchObject({ id: 'reader-id' });
  });

  it('handles a callback once even when multiple page components initialize', async () => {
    const { initializeDiscussionAuth } = await import('./discussion-auth');
    await Promise.all([initializeDiscussionAuth(), initializeDiscussionAuth()]);
    expect(handleAuthCallback).toHaveBeenCalledOnce();
  });

  it('stores the current article before starting social sign-in', async () => {
    location.pathname = '/blog/public-article/';
    vi.mocked(oauthLogin).mockImplementation(() => { throw new Error('Redirecting to OAuth provider'); });
    const { signInForDiscussion } = await import('./discussion-auth');
    expect(() => signInForDiscussion('github')).not.toThrow();
    expect(oauthLogin).toHaveBeenCalledWith('github');
    expect(sessionStorage.getItem('discussion-return-to')).toBe('/blog/public-article/');
  });
});
