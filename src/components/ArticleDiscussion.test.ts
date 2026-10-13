import { defineComponent } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getSettings, getUser } from '@netlify/identity';
import { initializeDiscussionAuth } from '../lib/discussion-auth';
import ArticleDiscussion from './ArticleDiscussion.vue';
import { reactionOptions, type DiscussionData } from '../lib/discussion';

vi.mock('@netlify/identity', () => ({ getSettings: vi.fn(), getUser: vi.fn(), logout: vi.fn(), onAuthChange: vi.fn(() => vi.fn()) }));
vi.mock('../lib/discussion-auth', () => ({ initializeDiscussionAuth: vi.fn(), signInForDiscussion: vi.fn() }));

const captchaReset = vi.fn();
const CaptchaStub = defineComponent({
  name: 'CommentCaptcha', props: ['siteKey'], emits: ['token'],
  template: '<div class="captcha-stub" />', methods: { reset: captchaReset }
});

function discussion(): DiscussionData {
  return {
    votes: { up: 3, down: 1, mine: 0 }, totalComments: 1, nextOffset: null, captchaSiteKey: 'configured-public-key',
    comments: [{
      id: 'c62cc6df-b26c-424a-bb30-6b2a2b045ab6', authorName: 'Mara', body: '<img src=x onerror=alert(1)>',
      createdAt: '2026-10-13T12:00:00Z', canDelete: false,
      reactions: reactionOptions.map(option => ({ emoji: option.emoji, count: 0, active: false }))
    }]
  };
}

const fetchMock = vi.fn();
const mounted: ReturnType<typeof mount>[] = [];

async function render() {
  const wrapper = mount(ArticleDiscussion, { props: { article: 'public-article' }, global: { stubs: { CommentCaptcha: CaptchaStub } } });
  mounted.push(wrapper);
  await flushPromises();
  return wrapper;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('fetch', fetchMock);
  vi.mocked(initializeDiscussionAuth).mockResolvedValue(null);
  vi.mocked(getUser).mockResolvedValue(null);
  vi.mocked(getSettings).mockResolvedValue({ autoconfirm: false, disableSignup: false, providers: { google: true, github: true, gitlab: false, bitbucket: false, facebook: false, email: false } });
  fetchMock.mockImplementation(async () => Response.json(discussion()));
});

afterEach(() => {
  for (const wrapper of mounted.splice(0)) wrapper.unmount();
  vi.unstubAllGlobals();
});

describe('article discussion interface', () => {
  it('allows anonymous reading while requiring sign-in for participation', async () => {
    const wrapper = await render();
    expect(wrapper.text()).toContain('Mit Google anmelden');
    expect(wrapper.text()).toContain('Mit GitHub anmelden');
    expect(wrapper.find('form').exists()).toBe(false);
    expect(wrapper.find('.vote-button').attributes('disabled')).toBeDefined();
    expect(wrapper.find('.reaction-button').attributes('disabled')).toBeDefined();
    expect(wrapper.text()).toContain('<img src=x onerror=alert(1)>');
    expect(wrapper.find('img').exists()).toBe(false);
  });

  it('renders only configured social providers', async () => {
    vi.mocked(getSettings).mockResolvedValue({ autoconfirm: false, disableSignup: false, providers: { google: false, github: true, gitlab: false, bitbucket: false, facebook: false, email: false } });
    const wrapper = await render();
    expect(wrapper.text()).not.toContain('Mit Google anmelden');
    expect(wrapper.text()).toContain('Mit GitHub anmelden');
  });

  it('sends an authenticated vote without a full-page form submission', async () => {
    vi.mocked(initializeDiscussionAuth).mockResolvedValue({ id: 'reader-id', provider: 'github', name: 'Rika' });
    const wrapper = await render();
    await wrapper.find('.vote-button').trigger('click');
    await flushPromises();
    const mutation = fetchMock.mock.calls.find(([, options]) => options.method === 'POST');
    expect(JSON.parse(mutation?.[1].body)).toEqual({ action: 'vote', value: 1 });
    expect(wrapper.text()).toContain('Deine Bewertung wurde gespeichert.');
  });

  it('blocks comment publication until CAPTCHA succeeds and resets it after publishing', async () => {
    vi.mocked(initializeDiscussionAuth).mockResolvedValue({ id: 'reader-id', provider: 'google', name: 'Rika' });
    const wrapper = await render();
    await wrapper.find('#comment-body').setValue('Ein guter Gedanke.');
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
    wrapper.findComponent(CaptchaStub).vm.$emit('token', 'captcha-proof');
    await flushPromises();
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined();
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    const mutation = fetchMock.mock.calls.find(([, options]) => options.method === 'POST');
    expect(JSON.parse(mutation?.[1].body)).toEqual({ action: 'comment', body: 'Ein guter Gedanke.', authorName: 'Rika', captchaToken: 'captcha-proof', website: '' });
    expect(captchaReset).toHaveBeenCalledOnce();
    expect((wrapper.find('#comment-body').element as HTMLTextAreaElement).value).toBe('');
    expect(wrapper.text()).toContain('Dein Kommentar wurde veröffentlicht.');
  });

  it('preserves a draft after rejected publication', async () => {
    vi.mocked(initializeDiscussionAuth).mockResolvedValue({ id: 'reader-id', provider: 'google', name: 'Rika' });
    fetchMock.mockImplementation(async (_url, options) => options.method === 'POST'
      ? Response.json({ error: 'Sicherheitsprüfung abgelaufen.' }, { status: 400 }) : Response.json(discussion()));
    const wrapper = await render();
    await wrapper.find('#comment-body').setValue('Mein Entwurf bleibt erhalten.');
    wrapper.findComponent(CaptchaStub).vm.$emit('token', 'captcha-proof');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(wrapper.text()).toContain('Sicherheitsprüfung abgelaufen.');
    expect((wrapper.find('#comment-body').element as HTMLTextAreaElement).value).toBe('Mein Entwurf bleibt erhalten.');
    expect(captchaReset).toHaveBeenCalledOnce();
  });

  it('fails closed when CAPTCHA configuration is missing', async () => {
    vi.mocked(initializeDiscussionAuth).mockResolvedValue({ id: 'reader-id', provider: 'google' });
    fetchMock.mockImplementation(async () => Response.json({ ...discussion(), captchaSiteKey: null }));
    const wrapper = await render();
    expect(wrapper.find('form').exists()).toBe(false);
    expect(wrapper.text()).toContain('Kommentare sind bis dahin deaktiviert');
    expect(wrapper.find('.vote-button').attributes('disabled')).toBeUndefined();
  });

  it('offers sign-in again when the server rejects an expired session', async () => {
    vi.mocked(initializeDiscussionAuth).mockResolvedValue({ id: 'reader-id', provider: 'github', name: 'Rika' });
    fetchMock.mockImplementation(async (_url, options) => options.method === 'POST'
      ? Response.json({ error: 'Bitte melde dich mit Google oder GitHub an.' }, { status: 401 }) : Response.json(discussion()));
    const wrapper = await render();
    await wrapper.find('.vote-button').trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('Mit GitHub anmelden');
    expect(wrapper.find('form').exists()).toBe(false);
  });

  it('shows a retryable API error instead of a misleading empty discussion', async () => {
    fetchMock.mockResolvedValue(Response.json({ error: 'Diskussion nicht erreichbar.' }, { status: 503 }));
    const wrapper = await render();
    expect(wrapper.text()).toContain('Diskussion nicht erreichbar.');
    expect(wrapper.text()).toContain('Diskussion erneut laden');
    expect(wrapper.text()).not.toContain('Noch keine Kommentare');
  });
});
