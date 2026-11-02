<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { getSettings, getUser, logout, onAuthChange, type User } from '@netlify/identity';
import CommentCaptcha from './CommentCaptcha.vue';
import { initializeDiscussionAuth, signInForDiscussion } from '../lib/discussion-auth';
import { DiscussionError, reactionOptions, type DiscussionAction, type DiscussionComment, type DiscussionData, type ReactionEmoji } from '../lib/discussion';

const props = defineProps<{ article: string }>();
const user = ref<User | null>(null);
const authReady = ref(false);
const providers = ref({ google: false, github: false });
const data = ref<DiscussionData | null>(null);
const loading = ref(true);
const loadingMore = ref(false);
const busy = ref(false);
const error = ref('');
const authError = ref('');
const notice = ref('');
const body = ref('');
const authorName = ref('');
const website = ref('');
const captchaToken = ref('');
const captcha = ref<InstanceType<typeof CommentCaptcha>>();
const pendingDelete = ref<string | null>(null);
let unsubscribe: (() => void) | undefined;
let disposed = false;

const mayParticipate = computed(() => user.value?.provider === 'google' || user.value?.provider === 'github');
const commentReady = computed(() => mayParticipate.value && data.value?.captchaSiteKey && captchaToken.value
  && body.value.trim().length > 0 && body.value.length <= 2000 && authorName.value.trim().length >= 2);

async function request<T>(options?: RequestInit, offset = 0): Promise<T> {
  const response = await fetch(`/api/discussion?article=${encodeURIComponent(props.article)}&offset=${offset}`, {
    credentials: 'same-origin', cache: 'no-store', ...options
  });
  const result = await response.json();
  if (!response.ok) throw new DiscussionError(response.status, result.error || 'Die Anfrage ist fehlgeschlagen.');
  return result as T;
}

async function load(append = false) {
  if (append) loadingMore.value = true;
  else loading.value = true;
  error.value = '';
  try {
    const result = await request<DiscussionData>(undefined, append ? data.value?.nextOffset ?? 0 : 0);
    if (disposed) return;
    data.value = append && data.value ? {
      ...result,
      comments: [...data.value.comments, ...result.comments.filter(comment => !data.value?.comments.some(existing => existing.id === comment.id))]
    } : result;
  } catch (failure) {
    error.value = failure instanceof Error ? failure.message : 'Die Diskussion konnte nicht geladen werden.';
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

async function mutate(action: DiscussionAction, success: string) {
  if (busy.value) return;
  busy.value = true;
  error.value = '';
  notice.value = '';
  try {
    await getUser();
    await request({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(action) });
    if (action.action === 'comment') body.value = '';
    pendingDelete.value = null;
    notice.value = success;
    await load();
  } catch (failure) {
    if (failure instanceof DiscussionError && failure.status === 401) {
      user.value = null;
      captchaToken.value = '';
    }
    error.value = failure instanceof Error ? failure.message : 'Die Anfrage ist fehlgeschlagen.';
  } finally {
    if (action.action === 'comment') captcha.value?.reset();
    busy.value = false;
  }
}

function vote(value: -1 | 1) {
  return mutate({ action: 'vote', value: data.value?.votes.mine === value ? 0 : value }, 'Deine Bewertung wurde gespeichert.');
}

function react(comment: DiscussionComment, emoji: ReactionEmoji) {
  const active = !comment.reactions.find(reaction => reaction.emoji === emoji)?.active;
  return mutate({ action: 'reaction', commentId: comment.id, emoji, active }, 'Deine Reaktion wurde gespeichert.');
}

function submitComment() {
  if (!commentReady.value) return;
  return mutate({ action: 'comment', body: body.value, authorName: authorName.value, captchaToken: captchaToken.value, website: website.value },
    'Dein Kommentar wurde veröffentlicht. Vielen Dank für deinen Beitrag!');
}

function signIn(provider: 'google' | 'github') {
  authError.value = '';
  try { signInForDiscussion(provider); } catch {
    authError.value = 'Die Anmeldung konnte nicht gestartet werden. Bitte versuche es erneut.';
  }
}

async function signOut() {
  busy.value = true;
  try {
    await logout();
    user.value = null;
    captchaToken.value = '';
    await load();
  } catch {
    authError.value = 'Die Abmeldung ist fehlgeschlagen. Bitte versuche es erneut.';
  } finally { busy.value = false; }
}

function formatCommentDate(date: string) {
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));
}

onMounted(async () => {
  unsubscribe = onAuthChange((event, currentUser) => {
    user.value = currentUser;
    if (event === 'logout') captchaToken.value = '';
  });
  try {
    user.value = await initializeDiscussionAuth();
    if (disposed) return;
    authorName.value = user.value?.name?.slice(0, 60) ?? '';
    const settings = await getSettings();
    if (disposed) return;
    providers.value = { google: settings.providers.google, github: settings.providers.github };
  } catch {
    authError.value = 'Die Anmeldung ist gerade nicht verfügbar. Du kannst die Diskussion weiterhin lesen.';
  } finally {
    authReady.value = true;
    if (!disposed) await load();
  }
});

onBeforeUnmount(() => { disposed = true; unsubscribe?.(); });
</script>

<template>
  <section id="diskussion" class="mt-16 border-t border-rule pt-10 sm:pt-14" aria-labelledby="discussion-title" :aria-busy="loading">
    <div class="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
      <div>
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-highlight-ink">Deine Perspektive zählt</p>
        <h2 id="discussion-title" class="font-serif text-3xl font-normal leading-tight text-ink">Weiterdenken.<br>Mitreden.</h2>
        <p class="mt-4 text-sm text-ink-soft">Was nimmst du aus diesem Artikel mit? Teile Erfahrungen, stelle Fragen oder gib anderen Gedanken eine Reaktion.</p>
        <div class="mt-7 border-t border-rule pt-5">
          <h3 class="mb-3 text-sm font-semibold text-ink">Wie findest du den Artikel?</h3>
          <div class="flex flex-wrap gap-2" role="group" aria-label="Artikel bewerten">
            <button type="button" class="vote-button" :class="{ selected: data?.votes.mine === 1 }" :aria-pressed="data?.votes.mine === 1" :disabled="!mayParticipate || busy || !data" @click="vote(1)">
              <span aria-hidden="true">↑</span> Gut <span class="tabular-nums">{{ data?.votes.up ?? '–' }}</span>
            </button>
            <button type="button" class="vote-button" :class="{ selected: data?.votes.mine === -1 }" :aria-pressed="data?.votes.mine === -1" :disabled="!mayParticipate || busy || !data" @click="vote(-1)">
              <span aria-hidden="true">↓</span> Weniger gut <span class="tabular-nums">{{ data?.votes.down ?? '–' }}</span>
            </button>
          </div>
          <p class="mt-3 text-xs text-ink-soft">Eine Bewertung pro Konto. Erneut klicken, um sie zurückzunehmen.</p>
        </div>
      </div>

      <div class="min-w-0">
        <div v-if="!authReady" class="mb-6 h-24 animate-pulse rounded-sm bg-rule/50 motion-reduce:animate-none" aria-label="Anmeldung wird geladen" />
        <div v-else-if="!mayParticipate" class="mb-6 rounded-sm border border-rule bg-paper-raised p-5 sm:p-6">
          <h3 class="font-serif text-xl text-ink">Ein Gespräch mit echten Menschen.</h3>
          <p class="mt-2 text-sm text-ink-soft">Melde dich mit Google oder GitHub an, um zu bewerten, zu kommentieren und zu reagieren. Lesen geht ohne Anmeldung.</p>
          <div class="mt-4 flex flex-wrap gap-3">
            <button v-if="providers.google" type="button" class="provider-button" @click="signIn('google')">Mit Google anmelden</button>
            <button v-if="providers.github" type="button" class="provider-button" @click="signIn('github')">Mit GitHub anmelden</button>
          </div>
          <p v-if="!providers.google && !providers.github && !authError" class="mt-3 text-sm text-ink-soft">Die Anmeldung wird noch eingerichtet.</p>
          <p class="mt-4 text-xs text-ink-soft">Mehr über die Verarbeitung deiner Daten in unserer <a href="/datenschutz" class="text-primary underline">Datenschutzerklärung</a>.</p>
        </div>
        <div v-else class="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4 text-sm">
          <p class="text-ink-soft">Angemeldet <span v-if="user?.name">als <strong class="font-semibold text-ink">{{ user.name }}</strong></span></p>
          <button type="button" class="font-semibold text-primary underline underline-offset-4 disabled:opacity-50" :disabled="busy" @click="signOut">Abmelden</button>
        </div>
        <p v-if="authError" role="alert" class="mb-4 text-sm text-red-700">{{ authError }}</p>
        <div v-if="error" role="alert" class="mb-5 rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p>{{ error }}</p>
          <button type="button" class="mt-2 font-semibold underline" :disabled="loading || busy" @click="load()">Diskussion erneut laden</button>
        </div>
        <p v-if="notice" role="status" class="mb-5 border-l-2 border-primary pl-4 text-sm text-ink">{{ notice }}</p>

        <form v-if="mayParticipate && data?.captchaSiteKey" class="mb-10 space-y-4" @submit.prevent="submitComment">
          <div>
            <label for="comment-name" class="mb-2 block text-sm font-semibold text-ink">Dein öffentlicher Anzeigename</label>
            <input id="comment-name" v-model="authorName" class="discussion-input" type="text" required minlength="2" maxlength="60" autocomplete="nickname" :disabled="busy">
          </div>
          <div>
            <label for="comment-body" class="mb-2 block text-sm font-semibold text-ink">Dein Kommentar</label>
            <textarea id="comment-body" v-model="body" class="discussion-input min-h-36 resize-y" required maxlength="2000" rows="5" placeholder="Deine Gedanken zum Artikel …" aria-describedby="comment-guidelines comment-count" :disabled="busy" />
            <div class="mt-2 flex justify-between gap-3 text-xs text-ink-soft">
              <p id="comment-guidelines">Respektvoll und zum Thema. Keine Werbung. Dein Kommentar erscheint sofort öffentlich.</p>
              <span id="comment-count" class="shrink-0 tabular-nums">{{ body.length }} / 2.000</span>
            </div>
          </div>
          <div class="honeypot" aria-hidden="true">
            <label for="comment-website">Website</label>
            <input id="comment-website" v-model="website" type="text" name="website" tabindex="-1" autocomplete="off">
          </div>
          <CommentCaptcha ref="captcha" :site-key="data.captchaSiteKey" @token="captchaToken = $event" />
          <button type="submit" class="provider-button publish-button" :disabled="!commentReady || busy">
            {{ busy ? 'Wird gespeichert …' : 'Kommentar veröffentlichen' }}
          </button>
        </form>
        <p v-else-if="mayParticipate && data" class="mb-8 rounded-sm border border-rule bg-paper-raised p-4 text-sm text-ink-soft">Die Sicherheitsprüfung wird noch eingerichtet. Kommentare sind bis dahin deaktiviert; Bewertungen und Reaktionen sind möglich.</p>

        <div class="mb-5 flex items-baseline justify-between gap-3 border-b border-rule pb-4">
          <h3 class="font-serif text-2xl text-ink">Im Gespräch <span v-if="data" class="ml-1 font-sans text-sm text-ink-faint">({{ data.totalComments }})</span></h3>
          <span class="text-xs text-ink-soft">Älteste zuerst</span>
        </div>
        <div v-if="loading && !data" class="space-y-5" role="status" aria-label="Kommentare werden geladen">
          <div v-for="placeholder in 2" :key="placeholder" class="animate-pulse space-y-3 motion-reduce:animate-none">
            <div class="h-4 w-1/3 bg-rule/60" /><div class="h-14 bg-rule/40" />
          </div>
        </div>
        <div v-else-if="data && !data.comments.length" class="border-l-2 border-highlight bg-highlight-tint/40 px-5 py-6">
          <p class="font-serif text-xl text-ink">Hier ist Platz für deinen Gedanken.</p>
          <p class="mt-2 text-sm text-ink-soft">Noch keine Kommentare. Mach den Anfang und bring das Gespräch ins Rollen.</p>
        </div>
        <ol v-else-if="data" class="divide-y divide-rule">
          <li v-for="comment in data.comments" :id="`kommentar-${comment.id}`" :key="comment.id" class="py-6 first:pt-0">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <span class="font-semibold text-ink">{{ comment.authorName }}</span>
              <time :datetime="comment.createdAt" class="text-xs text-ink-soft">{{ formatCommentDate(comment.createdAt) }}</time>
            </div>
            <p class="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-soft">{{ comment.body }}</p>
            <div class="mt-4 flex flex-wrap items-center gap-2" role="group" :aria-label="`Reaktionen auf den Kommentar von ${comment.authorName}`">
              <button v-for="(option, index) in reactionOptions" :key="option.emoji" type="button" class="reaction-button" :class="{ selected: comment.reactions[index].active }" :aria-pressed="comment.reactions[index].active" :aria-label="`${option.label}: ${comment.reactions[index].count}${!mayParticipate ? ' – Anmeldung erforderlich' : ''}`" :disabled="!mayParticipate || busy" @click="react(comment, option.emoji)">
                <span aria-hidden="true">{{ option.emoji }}</span><span class="tabular-nums">{{ comment.reactions[index].count }}</span>
              </button>
              <button v-if="comment.canDelete" type="button" class="ml-auto text-xs text-ink-soft underline hover:text-red-700 disabled:opacity-50" :disabled="busy" @click="pendingDelete = comment.id">Löschen</button>
            </div>
            <div v-if="pendingDelete === comment.id" class="mt-4 border border-rule bg-paper-raised p-4 text-sm text-ink">
              <p>Diesen Kommentar und seine Reaktionen endgültig löschen?</p>
              <div class="mt-3 flex flex-wrap gap-4">
                <button type="button" class="font-semibold text-red-700 underline" :disabled="busy" @click="mutate({ action: 'delete', commentId: comment.id }, 'Der Kommentar wurde gelöscht.')">Endgültig löschen</button>
                <button type="button" class="text-ink-soft underline" :disabled="busy" @click="pendingDelete = null">Abbrechen</button>
              </div>
            </div>
          </li>
        </ol>
        <button v-if="data?.nextOffset !== null && data?.nextOffset !== undefined" type="button" class="provider-button mt-6 w-full" :disabled="loadingMore || busy" @click="load(true)">
          {{ loadingMore ? 'Kommentare laden …' : 'Weitere Kommentare laden' }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.vote-button, .reaction-button, .provider-button {
  @apply inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-rule bg-paper-raised px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50;
}
.reaction-button { @apply min-h-10 px-3 text-xs; }
.publish-button { @apply border-primary bg-primary text-white hover:bg-primary-dark hover:text-white; }
.selected { @apply border-primary bg-primary-tint text-primary; }
.discussion-input { @apply w-full rounded-sm border border-rule bg-paper-raised px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60; }
.honeypot { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
</style>
