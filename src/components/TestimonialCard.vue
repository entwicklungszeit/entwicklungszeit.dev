<template>
  <div class="h-full flex flex-col bg-paper-raised border border-rule rounded-sm p-6 md:p-8 max-w-xl mx-auto min-h-[420px] md:min-h-[480px]">
    <!-- Portrait -->
    <div class="flex justify-center md:justify-start mb-4">
      <img
        :src="testimonial.portraitImage.src"
        :alt="testimonial.portraitImage.alt"
        class="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full border border-rule"
        width="112"
        height="112"
        loading="lazy"
      />
    </div>

    <!-- Name and Job -->
    <div class="mb-2">
      <h3 class="font-serif text-xl md:text-2xl font-normal text-ink leading-tight">
        {{ testimonial.firstName }} {{ testimonial.lastName }}
      </h3>
      <div class="text-primary font-medium text-sm md:text-base leading-snug">
        {{ testimonial.jobTitle }}
        <span v-if="testimonial.company" class="text-ink-soft font-normal">
          @ {{ testimonial.company }}
        </span>
      </div>
    </div>

    <!-- Review Text -->
    <div class="flex-1 mt-2 mb-4">
      <p class="text-ink-soft text-base leading-relaxed">
        {{ testimonial.reviewText }}
      </p>
    </div>

    <!-- Actions -->
    <div class="mt-auto flex flex-wrap gap-2">
      <button
        v-if="testimonial.bio"
        class="px-4 py-1.5 border border-primary text-primary hover:text-secondary hover:border-secondary rounded-full text-xs font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        @click="handleOpenModal"
      >
        Mehr
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Testimonial } from '../types/testimonial';

interface Props {
  testimonial: Testimonial;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  openModal: [testimonial: Testimonial];
}>();

const handleOpenModal = () => {
  emit('openModal', props.testimonial);
};
</script>
