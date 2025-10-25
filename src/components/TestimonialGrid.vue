<template>
  <div class="w-full">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
      <TestimonialCard
        v-for="testimonial in (shuffledTestimonials.length > 0 ? shuffledTestimonials : testimonials)"
        :key="`${testimonial.firstName}-${testimonial.lastName}`"
        :testimonial="testimonial"
        @open-modal="handleOpenModal"
      />
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
import { ref, computed, onMounted } from 'vue';
import TestimonialCard from './TestimonialCard.vue';
import TestimonialModal from './TestimonialModal.vue';
import type { Testimonial } from '../types/testimonial';

interface Props {
  testimonials: Testimonial[];
}

const props = defineProps<Props>();

const isModalOpen = ref(false);
const selectedTestimonial = ref<Testimonial | null>(null);
const shuffledTestimonials = ref<Testimonial[]>([]);

// Shuffle testimonials only on client-side to avoid hydration mismatch
onMounted(() => {
  shuffledTestimonials.value = [...props.testimonials].sort(() => Math.random() - 0.5);
});

const handleOpenModal = (testimonial: Testimonial) => {
  selectedTestimonial.value = testimonial;
  isModalOpen.value = true;
};

const handleCloseModal = () => {
  isModalOpen.value = false;
};
</script>
