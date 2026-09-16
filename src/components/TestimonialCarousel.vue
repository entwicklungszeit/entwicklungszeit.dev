<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-5">
      <p class="sr-only" role="status" aria-live="polite">
        Stimme {{ activeIndex + 1 }} von {{ testimonials.length }}
      </p>
      <div class="flex gap-2 ml-auto">
        <button
          type="button"
          :class="navButtonClass"
          aria-label="Vorherige Stimme"
          :disabled="!canScrollPrev"
          @click="scrollByCard(-1)"
          @keydown.right="scrollByCard(1)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          :class="navButtonClass"
          aria-label="Nächste Stimme"
          :disabled="!canScrollNext"
          @click="scrollByCard(1)"
          @keydown.left="scrollByCard(-1)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <div
      ref="trackRef"
      :class="trackClass"
      style="scrollbar-width: none;"
      role="region"
      aria-roledescription="Karussell"
      aria-label="Stimmen von Coaching-Klient:innen"
      @scroll="handleScroll"
    >
      <div
        v-for="testimonial in testimonials"
        :key="`${testimonial.firstName}-${testimonial.lastName}`"
        class="snap-start flex-shrink-0 w-[80%] xs:w-[65%] sm:w-[45%] lg:w-[calc(25%-15px)]"
      >
        <TestimonialCard :testimonial="testimonial" @open-modal="handleOpenModal" />
      </div>
    </div>

    <TestimonialModal
      v-if="selectedTestimonial"
      :testimonial="selectedTestimonial"
      :is-open="isModalOpen"
      @close="handleCloseModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import TestimonialCard from './TestimonialCard.vue';
import TestimonialModal from './TestimonialModal.vue';
import type { Testimonial } from '../types/testimonial';

interface Props {
  testimonials: Testimonial[];
}

const props = defineProps<Props>();

const navButtonClass =
  'w-9 h-9 flex items-center justify-center rounded-full border border-rule text-ink hover:border-ink-faint transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-rule focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';
const trackClass =
  'flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-6 px-6 sm:mx-0 sm:px-0';

const trackRef = ref<HTMLElement | null>(null);
const canScrollPrev = ref(false);
const canScrollNext = ref(props.testimonials.length > 1);
const activeIndex = ref(0);

const isModalOpen = ref(false);
const selectedTestimonial = ref<Testimonial | null>(null);

const handleOpenModal = (testimonial: Testimonial) => {
  selectedTestimonial.value = testimonial;
  isModalOpen.value = true;
};

const handleCloseModal = () => {
  isModalOpen.value = false;
};

// Card width + the track's own `gap` (read live so it can't drift out of
// sync with the `trackClass` Tailwind gap utility above).
const getCardStep = (track: HTMLElement): number => {
  const cardWidth = track.firstElementChild?.clientWidth ?? track.clientWidth;
  const gap = parseFloat(getComputedStyle(track).columnGap || '0');
  return cardWidth + gap;
};

const updateScrollState = () => {
  const track = trackRef.value;
  if (!track) return;

  const maxScrollLeft = track.scrollWidth - track.clientWidth;
  canScrollPrev.value = track.scrollLeft > 8;
  canScrollNext.value = track.scrollLeft < maxScrollLeft - 8;

  activeIndex.value = Math.min(
    props.testimonials.length - 1,
    Math.round(track.scrollLeft / getCardStep(track))
  );
};

const scrollByCard = (direction: 1 | -1) => {
  const track = trackRef.value;
  if (!track) return;

  track.scrollBy({ left: direction * getCardStep(track), behavior: 'smooth' });
};

let resizeObserver: ResizeObserver | undefined;

onMounted(() => {
  updateScrollState();
  if (trackRef.value) {
    resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(trackRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

const handleScroll = () => updateScrollState();
</script>

<style scoped>
div[role='region']::-webkit-scrollbar {
  display: none;
}
</style>
