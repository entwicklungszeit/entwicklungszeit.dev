<template>
  <div class="w-full">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
      <TestimonialCard
        v-for="testimonial in shuffledTestimonials"
        :key="`${testimonial.firstName}-${testimonial.lastName}`"
        :testimonial="testimonial"
        @open-modal="handleOpenModal"
      />
    </div>
    <TestimonialModal
      :testimonial="selectedTestimonial"
      :is-open="isModalOpen"
      @close="handleCloseModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TestimonialCard from './TestimonialCard.vue';
import TestimonialModal from './TestimonialModal.vue';
import type { Testimonial } from '../types/testimonial';

interface Props {
  testimonials: Testimonial[];
}

const props = defineProps<Props>();

const shuffledTestimonials = computed(() => {
  return [...props.testimonials].sort(() => Math.random() - 0.5);
});

const isModalOpen = ref(false);
const selectedTestimonial = ref<Testimonial | null>(null);

const handleOpenModal = (testimonial: Testimonial) => {
  selectedTestimonial.value = testimonial;
  isModalOpen.value = true;
};

const handleCloseModal = () => {
  isModalOpen.value = false;
};
</script>
