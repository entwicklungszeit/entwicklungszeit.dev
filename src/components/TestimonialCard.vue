<template>
  <div
    class="h-full flex flex-col bg-paper-raised border border-rule rounded-sm p-6"
    role="group"
    aria-roledescription="Folie"
    :aria-label="`${testimonial.firstName} ${testimonial.lastName}`"
  >
    <!-- Portrait -->
    <div class="relative w-14 h-14 rounded-full overflow-hidden mb-4">
      <img
        :src="testimonial.portraitImage.src"
        :alt="testimonial.portraitImage.alt"
        class="w-full h-full object-cover block grayscale contrast-[1.05]"
        width="56"
        height="56"
        loading="lazy"
      />
      <div class="absolute inset-0 mix-blend-multiply opacity-[0.55]" :class="toneClass"></div>
      <div class="absolute inset-0 bg-paper mix-blend-soft-light opacity-25"></div>
    </div>

    <!-- Review Text -->
    <p class="flex-1 text-ink-soft text-sm leading-relaxed line-clamp-6 mb-5">
      „{{ testimonial.reviewText.trim() }}“
    </p>

    <!-- Name and Job -->
    <div class="mt-auto">
      <h3 class="font-serif text-lg font-normal text-ink leading-tight">
        {{ testimonial.firstName }} {{ testimonial.lastName }}
      </h3>
      <p class="text-ink-soft text-xs leading-snug mt-0.5">
        {{ testimonial.jobTitle }}
        <template v-if="testimonial.company">@ {{ testimonial.company }}</template>
      </p>
      <button
        v-if="testimonial.bio"
        class="mt-3 text-xs font-semibold text-primary hover:text-secondary transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
        @click="handleOpenModal"
      >
        Mehr
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Testimonial } from '../types/testimonial';

interface Props {
  testimonial: Testimonial;
  tone?: 'primary' | 'secondary' | 'tertiary';
}

const props = withDefaults(defineProps<Props>(), { tone: 'primary' });

const toneClass = computed(
  () => ({ primary: 'bg-primary', secondary: 'bg-secondary', tertiary: 'bg-tertiary' })[props.tone],
);
const emit = defineEmits<{
  openModal: [testimonial: Testimonial];
}>();

const handleOpenModal = () => {
  emit('openModal', props.testimonial);
};
</script>
