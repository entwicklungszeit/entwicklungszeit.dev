<template>
  <div class="gallery-container relative">
    <!-- Navigation Arrows -->
    <button
      v-if="canGoPrev"
      class="gallery-nav-button prev-button"
      aria-label="Previous slide"
      @click="navigate('prev')"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        ></path>
      </svg>
    </button>

    <!-- Gallery Pages -->
    <div
      class="gallery-viewport relative overflow-hidden touch-pan-x"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div
        class="gallery-track absolute inset-0 flex transition-transform duration-500 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(page, index) in parsedPages"
          :key="index"
          class="gallery-page w-full flex-shrink-0 px-4 sm:px-6 py-2"
        >
          <div class="prose prose-lg max-w-none">
            <p
              class="text-base sm:text-lg text-gray-700"
              v-html="page.parsedContent"
            />
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="canGoNext"
      class="gallery-nav-button next-button"
      aria-label="Next slide"
      @click="navigate('next')"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        ></path>
      </svg>
    </button>

    <!-- Enhanced Indicators -->
    <div class="mt-12 px-4">
      <div class="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          v-for="(page, index) in parsedPages"
          :key="index"
          class="gallery-indicator group flex flex-col items-center p-3 rounded-lg transition-all duration-300 hover:bg-gray-50"
          :aria-label="`Go to slide ${index + 1}`"
          @click="goToPage(index)"
        >
          <div
            :class="[
              'w-12 h-12 mb-3 rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-white transition-colors duration-300 border-2',
              index === currentIndex
                ? 'border-primary bg-primary/5'
                : 'border-transparent',
              'group-hover:border-primary'
            ]"
          >
            <svg
              :class="[
                'w-6 h-6 transition-colors duration-300',
                index === currentIndex ? 'text-primary' : 'text-gray-400',
                'group-hover:text-primary'
              ]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              v-html="sectionIcons[page.caption]"
            >
            </svg>
          </div>
          <span
            :class="[
              'text-sm font-medium transition-colors duration-300 text-center',
              index === currentIndex ? 'text-primary' : 'text-gray-500',
              'group-hover:text-primary'
            ]"
          >
            {{ page.caption }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';
import { useGallery } from '../../composables/useGallery';
import type { GalleryPage } from '../../types/gallery';

interface Props {
  pages: GalleryPage[];
}

const props = defineProps<Props>();

const { currentIndex, navigate, goToPage, handleTouchStart, handleTouchMove, handleTouchEnd } = useGallery({
  currentIndex: 0,
  totalPages: props.pages.length,
});

const canGoPrev = computed(() => currentIndex.value > 0);
const canGoNext = computed(() => currentIndex.value < props.pages.length - 1);

// Pre-parse all content to ensure it works during SSR
const parsedPages = computed(() => {
  return props.pages.map(page => ({
    ...page,
    parsedContent: marked.parse(page.content)
  }));
});

const sectionIcons: Record<string, string> = {
  Team: `<path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm6 10a3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3z"/>`,
  Erfahrungen: `<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>`,
  Perspektivwechsel: `<path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11m16-11v11M12 3v18"/>`,
  Wirtschaftlichkeit: `<path d="M12 1v2m0 18v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M1 12h2m18 0h2M4.2 19.8l1.4-1.4m12.8-12.8 1.4-1.4M12 6a6 6 0 0 0-6 6c0 3.314 2.686 6 6 6v-2a4 4 0 1 1 4-4h2a6 6 0 0 0-6-6z"/>`,
  Award: `<path d="M12 15c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z"/><path d="M15 9l6 12H3l6-12"/>`
};
</script>

<style scoped>
.gallery-nav-button {
  @apply absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10
         rounded-full bg-white/90 shadow-lg backdrop-blur-sm
         text-gray-400 hover:text-primary transition-all duration-300
         opacity-0 hover:scale-110 hover:shadow-xl
         sm:opacity-100;
}

.prev-button {
  @apply -left-2 sm:-left-12;
}

.next-button {
  @apply -right-2 sm:-right-12;
}

.gallery-container:hover .gallery-nav-button {
  @apply opacity-100;
}

@media (max-width: 640px) {
  .gallery-nav-button {
    @apply bg-white/95 shadow-md;
  }
}

.gallery-page {
  height: auto;
  min-height: 100%;
}

.gallery-page :deep(p) {
  @apply break-words;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  height: auto;
}

.gallery-viewport {
  transition: all 0.3s ease-in-out;
  height: auto !important;
  min-height: 280px;
}

.gallery-track {
  width: 100%;
  height: auto;
}

.gallery-indicator {
  cursor: pointer;
  user-select: none;
}

.gallery-indicator:focus {
  outline: none;
}

.gallery-page :deep(strong) {
  @apply font-semibold text-gray-900;
}

.gallery-page :deep(em) {
  @apply italic;
}

.gallery-page :deep(a) {
  @apply text-primary hover:text-secondary underline;
}
</style>
