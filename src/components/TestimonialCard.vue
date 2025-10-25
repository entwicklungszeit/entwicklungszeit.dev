<template>
  <div class="h-full flex flex-col bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-xl mx-auto min-h-[420px] md:min-h-[480px]">
    <!-- Portrait -->
    <div class="flex justify-center md:justify-start mb-4">
      <img
        :src="testimonial.portraitImage.src"
        :alt="testimonial.portraitImage.alt"
        class="w-24 h-24 md:w-28 md:h-28 object-cover rounded-2xl border-2 border-gray-100 shadow-sm"
        width="112"
        height="112"
      />
    </div>

    <!-- Name and Job -->
    <div class="mb-2">
      <h3 class="font-display text-lg md:text-xl font-bold text-gray-900 leading-tight">
        {{ testimonial.firstName }} {{ testimonial.lastName }}
      </h3>
      <div class="text-primary font-medium text-base md:text-lg leading-snug">
        {{ testimonial.jobTitle }}
        <span v-if="testimonial.company" class="text-gray-700 font-normal">
          @ {{ testimonial.company }}
        </span>
      </div>
    </div>

    <!-- Review Text -->
    <div class="flex-1 mt-2 mb-4">
      <p class="text-gray-700 text-base md:text-lg leading-relaxed">
        {{ testimonial.reviewText }}
      </p>
    </div>

    <!-- Actions -->
    <div class="mt-auto flex flex-wrap gap-2">
      <button
        v-if="testimonial.bio"
        class="px-4 py-1.5 border-2 border-primary text-primary hover:text-secondary hover:border-secondary rounded-full text-xs font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        @click="handleOpenModal"
      >
        BIO
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
