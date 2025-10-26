<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useCarousel } from '../../composables/useCarousel';
import type { Episode } from '../../types/episode';
import EpisodeCard from './EpisodeCard.vue';
import YouTubeCTACard from './YouTubeCTACard.vue';
import SpotifyCTACard from './SpotifyCTACard.vue';
import ApplePodcastsCTACard from './ApplePodcastsCTACard.vue';

interface Props {
  episodes: Episode[];
}

const props = defineProps<Props>();

// Carousel state management using dedicated composable
const {
  currentPage,
  totalPages,
  itemsPerPage,
  canGoPrev,
  canGoNext,
  goToPage,
  navigate,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
} = useCarousel();

const carouselRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);

type CTACardType = 'youtube' | 'spotify' | 'apple';

type CTACard = {
  type: 'cta';
  platform: CTACardType;
};

type CarouselItem = Episode | CTACard;

/**
 * Type guard to check if item is an episode
 */
const isEpisode = (item: CarouselItem): item is Episode => {
  return 'link' in item;
};

/**
 * Type guard to check if item is a CTA card
 */
const isCTACard = (item: CarouselItem): item is CTACard => {
  return 'type' in item && item.type === 'cta';
};

/**
 * All carousel items: episodes first, then platform CTA cards
 * Order: [Episode 1-5, YouTube CTA, Spotify CTA, Apple Podcasts CTA]
 */
const allItems = computed<CarouselItem[]>(() => {
  const items: CarouselItem[] = [...props.episodes];

  // Add CTA cards at the end
  items.push({ type: 'cta', platform: 'youtube' });
  items.push({ type: 'cta', platform: 'spotify' });
  items.push({ type: 'cta', platform: 'apple' });

  return items;
});

/**
 * Calculate total pages based on items and screen size
 */
const updatePagination = () => {
  // Determine items per page based on viewport
  if (window.innerWidth >= 1024) {
    itemsPerPage.value = 4;
  } else if (window.innerWidth >= 768) {
    itemsPerPage.value = 2;
  } else {
    itemsPerPage.value = 1;
  }

  totalPages.value = Math.ceil(allItems.value.length / itemsPerPage.value);

  // Ensure current page is valid after resize
  if (currentPage.value >= totalPages.value) {
    currentPage.value = Math.max(0, totalPages.value - 1);
  }
};

/**
 * Get items for a specific page
 */
const getPageItems = (pageIndex: number): CarouselItem[] => {
  const startIdx = pageIndex * itemsPerPage.value;
  const endIdx = Math.min(startIdx + itemsPerPage.value, allItems.value.length);
  return allItems.value.slice(startIdx, endIdx);
};

/**
 * Generate array of page numbers for rendering
 */
const pages = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i);
});

/**
 * Calculate transform for carousel track
 */
const trackTransform = computed(() => {
  if (!carouselRef.value) return 'translateX(0)';
  const trackWidth = carouselRef.value.clientWidth;
  return `translateX(${-currentPage.value * trackWidth}px)`;
});

/**
 * Handle keyboard navigation
 */
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    navigate(-1);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    navigate(1);
  }
};

// Debounced resize handler
let resizeTimeout: number;
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(() => {
    updatePagination();
  }, 250);
};

// Lifecycle hooks
onMounted(() => {
  updatePagination();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  clearTimeout(resizeTimeout);
});

// Watch episodes changes to update pagination
watch(() => props.episodes.length, () => {
  updatePagination();
});
</script>

<template>
  <div class="relative px-8 sm:px-12">
    <!-- Carousel container -->
    <div
      ref="carouselRef"
      class="relative w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Podcast-Episoden"
      tabindex="0"
      @keydown="handleKeydown"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- Carousel track -->
      <div
        ref="trackRef"
        class="flex transition-transform duration-300 ease-out"
        :style="{ transform: trackTransform }"
        role="presentation"
      >
        <!-- Pages -->
        <div
          v-for="pageIndex in pages"
          :key="pageIndex"
          class="flex-shrink-0 flex-grow-0 w-full flex justify-center gap-4 md:gap-6 lg:gap-8"
          :aria-roledescription="'slide'"
          :aria-label="`Seite ${pageIndex + 1} von ${totalPages}`"
        >
          <!-- Items on this page -->
          <template v-for="(item, idx) in getPageItems(pageIndex)" :key="`page-${pageIndex}-item-${idx}`">
            <!-- Episode Card -->
            <EpisodeCard
              v-if="isEpisode(item)"
              :episode="item"
            />

            <!-- CTA Cards -->
            <template v-else-if="isCTACard(item)">
              <YouTubeCTACard v-if="item.platform === 'youtube'" />
              <SpotifyCTACard v-else-if="item.platform === 'spotify'" />
              <ApplePodcastsCTACard v-else-if="item.platform === 'apple'" />
            </template>
          </template>

          <!-- Empty spacers for grid alignment -->
          <div
            v-for="n in Math.max(0, itemsPerPage - getPageItems(pageIndex).length)"
            :key="`spacer-${pageIndex}-${n}`"
            class="w-full max-w-[280px] aspect-square"
            aria-hidden="true"
          />

        </div>
      </div>
    </div>

    <!-- Navigation buttons -->
    <button
      class="absolute top-1/2 left-0 -translate-y-1/2 bg-white rounded-full p-2 sm:p-3 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transform transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
      aria-label="Vorherige Episoden"
      aria-controls="episode-carousel"
      :disabled="!canGoPrev"
      @click="navigate(-1)"
    >
      <svg
        class="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>

    <button
      class="absolute top-1/2 right-0 -translate-y-1/2 bg-white rounded-full p-2 sm:p-3 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transform transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
      aria-label="Nächste Episoden"
      aria-controls="episode-carousel"
      :disabled="!canGoNext"
      @click="navigate(1)"
    >
      <svg
        class="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>

    <!-- Pagination indicators -->
    <div class="flex justify-center gap-2 mt-6">
      <button
        v-for="page in totalPages"
        :key="page"
        class="w-2 h-2 rounded-full transition-all duration-300"
        :class="[
          currentPage === page - 1
            ? 'bg-primary w-8'
            : 'bg-gray-300 hover:bg-gray-400'
        ]"
        :aria-label="`Gehe zu Seite ${page}`"
        :aria-current="currentPage === page - 1 ? 'true' : 'false'"
        @click="goToPage(page - 1)"
      />
    </div>
  </div>
</template>

<style scoped>
/* Ensure smooth transitions without layout shifts */
.transition-transform {
  will-change: transform;
}
</style>
