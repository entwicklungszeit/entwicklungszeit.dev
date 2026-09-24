<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useEpisodes } from '../composables/useEpisodes';
import { formatDate } from '../lib/formatDate';

const PAGE_SIZE = 10;

const props = defineProps<{
  /** Shownotes-Seiten aus der Content-Collection, Schlüssel = Veröffentlichungstag (YYYY-MM-DD). */
  shownotes: Record<string, string>;
}>();

const { episodes, loading, error, fetchEpisodes } = useEpisodes();

const currentPage = ref(1);
const totalPages = computed(() => Math.max(1, Math.ceil(episodes.value.length / PAGE_SIZE)));
const pageEpisodes = computed(() =>
  episodes.value.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE)
);
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1));

const shownotesHref = (pubDate?: Date): string | null => {
  const id = pubDate ? props.shownotes[pubDate.toISOString().slice(0, 10)] : undefined;
  return id ? `/podcast/${id}` : null;
};

const readPageFromUrl = (): number => {
  const page = Number(new URLSearchParams(window.location.search).get('seite'));
  return Number.isInteger(page) && page >= 1 ? Math.min(page, totalPages.value) : 1;
};

const goTo = (page: number) => {
  currentPage.value = page;
  const url = new URL(window.location.href);
  if (page === 1) url.searchParams.delete('seite');
  else url.searchParams.set('seite', String(page));
  history.pushState({}, '', url);
  document.getElementById('episode-list')?.scrollIntoView({ block: 'start' });
};

onMounted(async () => {
  await fetchEpisodes();
  currentPage.value = readPageFromUrl();
  window.addEventListener('popstate', () => {
    currentPage.value = readPageFromUrl();
  });
});
</script>

<template>
  <div id="episode-list" class="scroll-mt-24">
    <p v-if="loading" class="text-ink-soft" role="status">Folgen werden geladen …</p>
    <p v-else-if="error" class="text-ink-soft" role="alert">
      Die Folgen konnten nicht geladen werden. Du findest sie auch auf Spotify, Apple Podcasts und
      YouTube.
    </p>
    <p v-else-if="episodes.length === 0" class="text-ink-soft">Noch keine Episoden veröffentlicht.</p>

    <template v-else>
      <div class="border-t border-rule">
        <a
          v-for="episode in pageEpisodes"
          :key="episode.link"
          :href="shownotesHref(episode.pubDate) ?? episode.link"
          :target="shownotesHref(episode.pubDate) ? undefined : '_blank'"
          :rel="shownotesHref(episode.pubDate) ? undefined : 'noopener noreferrer'"
          class="flex items-baseline gap-5 sm:gap-7 py-6 border-b border-rule group"
        >
          <span
            class="font-serif text-2xl sm:text-3xl text-ink-faint w-10 sm:w-12 flex-shrink-0"
            :aria-label="episode.episodeNumber ? `Folge ${episode.episodeNumber}` : undefined"
          >
            {{ episode.episodeNumber ? String(episode.episodeNumber).padStart(2, '0') : '' }}
          </span>
          <img
            :src="episode.thumbnail"
            alt=""
            width="64"
            height="64"
            loading="lazy"
            class="w-14 h-14 sm:w-16 sm:h-16 rounded-sm object-cover flex-shrink-0 self-center bg-paper-raised"
          />
          <div class="flex-1 min-w-0">
            <h2
              class="font-serif text-lg sm:text-xl font-normal text-ink mb-1 group-hover:text-primary transition-colors duration-300"
            >
              {{ episode.title }}
            </h2>
            <time
              v-if="episode.pubDate"
              :datetime="episode.pubDate.toISOString()"
              class="text-xs sm:text-sm text-ink-soft"
            >
              {{ formatDate(episode.pubDate) }}
            </time>
          </div>
          <span class="hidden sm:inline text-sm font-semibold text-primary flex-shrink-0">
            {{ shownotesHref(episode.pubDate) ? 'Shownotes →' : 'Auf Spotify ↗' }}
          </span>
        </a>
      </div>

      <nav
        v-if="totalPages > 1"
        class="mt-10 flex flex-wrap items-center justify-between gap-4"
        aria-label="Seitennavigation"
      >
        <button
          type="button"
          class="text-sm font-semibold text-primary hover:text-secondary transition-colors duration-300 disabled:opacity-40 disabled:pointer-events-none"
          :disabled="currentPage === 1"
          @click="goTo(currentPage - 1)"
        >
          ← Neuere
        </button>
        <ul class="flex items-center gap-1">
          <li v-for="page in pageNumbers" :key="page">
            <button
              type="button"
              class="min-w-9 h-9 px-2 rounded-sm text-sm transition-colors duration-300"
              :class="
                page === currentPage
                  ? 'bg-primary-tint text-primary font-semibold'
                  : 'text-ink-soft hover:text-primary'
              "
              :aria-current="page === currentPage ? 'page' : undefined"
              :aria-label="`Seite ${page}`"
              @click="goTo(page)"
            >
              {{ page }}
            </button>
          </li>
        </ul>
        <button
          type="button"
          class="text-sm font-semibold text-primary hover:text-secondary transition-colors duration-300 disabled:opacity-40 disabled:pointer-events-none"
          :disabled="currentPage === totalPages"
          @click="goTo(currentPage + 1)"
        >
          Ältere →
        </button>
      </nav>
    </template>
  </div>
</template>
