import { getUser, handleAuthCallback, oauthLogin } from '@netlify/identity';

let callbackPromise: Promise<void> | undefined;

export async function initializeDiscussionAuth() {
  if (!callbackPromise) {
    callbackPromise = (async () => {
      const parameters = new URLSearchParams(window.location.hash.slice(1));
      if (parameters.has('error')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        throw new Error('Die Anmeldung ist fehlgeschlagen. Bitte versuche es erneut.');
      }
      const result = await handleAuthCallback();
      if (result?.type === 'oauth') {
        const returnTo = sessionStorage.getItem('discussion-return-to');
        sessionStorage.removeItem('discussion-return-to');
        if (returnTo && /^\/blog\/[a-z0-9-]+\/?$/.test(returnTo) && returnTo !== window.location.pathname) {
          window.location.replace(`${returnTo}#diskussion`);
        }
      }
    })().catch(error => {
      callbackPromise = undefined;
      throw error;
    });
  }
  await callbackPromise;
  return getUser();
}

export function signInForDiscussion(provider: 'google' | 'github') {
  sessionStorage.setItem('discussion-return-to', window.location.pathname);
  try {
    oauthLogin(provider);
  } catch (error) {
    if (!(error instanceof Error) || error.message !== 'Redirecting to OAuth provider') throw error;
  }
}
