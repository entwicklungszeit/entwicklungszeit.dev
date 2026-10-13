export const reactionOptions = [
  { emoji: '👍', label: 'Zustimmung' },
  { emoji: '❤️', label: 'Gefällt mir' },
  { emoji: '💡', label: 'Inspirierend' },
  { emoji: '🎉', label: 'Großartig' }
] as const;

export type ReactionEmoji = typeof reactionOptions[number]['emoji'];

export interface DiscussionComment {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  canDelete: boolean;
  reactions: { emoji: ReactionEmoji; count: number; active: boolean }[];
}

export interface DiscussionData {
  votes: { up: number; down: number; mine: number };
  comments: DiscussionComment[];
  totalComments: number;
  nextOffset: number | null;
  captchaSiteKey: string | null;
}

export type DiscussionAction =
  | { action: 'vote'; value: -1 | 0 | 1 }
  | { action: 'comment'; body: string; authorName: string; captchaToken: string; website: string }
  | { action: 'reaction'; commentId: string; emoji: ReactionEmoji; active: boolean }
  | { action: 'delete'; commentId: string };

export class DiscussionError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function validateArticleSlug(value: unknown): string {
  if (typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || value.length > 180) {
    throw new DiscussionError(400, 'Ungültiger Artikel.');
  }
  return value;
}

export function parseDiscussionAction(value: unknown): DiscussionAction {
  if (!value || typeof value !== 'object') throw new DiscussionError(400, 'Ungültige Anfrage.');
  const input = value as Record<string, unknown>;
  if (input.action === 'vote' && (input.value === -1 || input.value === 0 || input.value === 1)) {
    return { action: 'vote', value: input.value };
  }
  if (input.action === 'comment') {
    const body = typeof input.body === 'string' ? input.body.trim() : '';
    const authorName = typeof input.authorName === 'string' ? input.authorName.trim() : '';
    if (!body || body.length > 2000) throw new DiscussionError(400, 'Kommentare dürfen 1 bis 2.000 Zeichen enthalten.');
    if (authorName.length < 2 || authorName.length > 60) throw new DiscussionError(400, 'Dein Anzeigename muss 2 bis 60 Zeichen enthalten.');
    if (input.website !== '') throw new DiscussionError(400, 'Die Anfrage konnte nicht verarbeitet werden.');
    if (typeof input.captchaToken !== 'string' || !input.captchaToken || input.captchaToken.length > 4096) {
      throw new DiscussionError(400, 'Bitte bestätige zuerst die Sicherheitsprüfung.');
    }
    return { action: 'comment', body, authorName, captchaToken: input.captchaToken, website: '' };
  }
  if ((input.action === 'reaction' || input.action === 'delete') && typeof input.commentId === 'string'
    && /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(input.commentId)) {
    if (input.action === 'delete') return { action: 'delete', commentId: input.commentId };
    const option = reactionOptions.find(option => option.emoji === input.emoji);
    if (option && typeof input.active === 'boolean') {
      return { action: 'reaction', commentId: input.commentId, emoji: option.emoji, active: input.active };
    }
  }
  throw new DiscussionError(400, 'Ungültige Anfrage.');
}

export function parseOffset(value: string | null): number {
  if (value === null) return 0;
  if (!/^\d{1,6}$/.test(value)) throw new DiscussionError(400, 'Ungültige Kommentarseite.');
  return Number(value);
}
