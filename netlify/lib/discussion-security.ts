import { DiscussionError } from '../../src/lib/discussion.js';

export function requireSameOrigin(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    throw new DiscussionError(403, 'Diese Anfrage ist nicht erlaubt.');
  }
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    throw new DiscussionError(415, 'Die Anfrage muss JSON enthalten.');
  }
}

export function validCaptchaResult(value: unknown, hostname: string, now = Date.now()): boolean {
  if (!value || typeof value !== 'object') return false;
  const result = value as Record<string, unknown>;
  if (result.success !== true || result.hostname !== hostname || typeof result.challenge_ts !== 'string') return false;
  const age = now - Date.parse(result.challenge_ts);
  return Number.isFinite(age) && age >= -10_000 && age <= 120_000;
}

export async function verifyCaptcha(token: string, request: Request) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret || !process.env.RECAPTCHA_SITE_KEY) {
    throw new DiscussionError(503, 'Die Sicherheitsprüfung ist noch nicht eingerichtet. Kommentare sind vorübergehend deaktiviert.');
  }
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new DiscussionError(503, 'Die Sicherheitsprüfung ist gerade nicht erreichbar.');
    if (!validCaptchaResult(await response.json(), new URL(request.url).hostname)) {
      throw new DiscussionError(400, 'Die Sicherheitsprüfung ist abgelaufen oder ungültig. Bitte versuche es erneut.');
    }
  } catch (error) {
    if (error instanceof DiscussionError) throw error;
    throw new DiscussionError(503, 'Die Sicherheitsprüfung ist gerade nicht erreichbar. Bitte versuche es später erneut.');
  }
}
