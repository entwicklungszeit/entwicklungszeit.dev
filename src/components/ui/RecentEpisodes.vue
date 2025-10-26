<script setup lang="ts">
import { onMounted } from 'vue';
import { useEpisodes } from '../../composables/useEpisodes';
import EpisodeCarousel from './EpisodeCarousel.vue';

const { episodes, loading, error, fetchEpisodes } = useEpisodes(5);

onMounted(() => {
  fetchEpisodes();
});
</script>

<template>
  <div class="relative">
    <!-- Loading state -->
    <div v-if="loading" class="flex gap-4 md:gap-6 lg:gap-8 justify-center">
      <div
        v-for="n in 4"
        :key="n"
        class="w-full md:w-1/2 lg:w-1/4 max-w-[280px] aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-xl"
        aria-hidden="true"
      />
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="text-center text-gray-500 py-12"
      role="alert"
    >
      <p>Fehler beim Laden der Folgen</p>
      <p class="text-sm mt-2">{{ error }}</p>
    </div>

    <!-- Carousel with episodes -->
    <EpisodeCarousel 
      v-else-if="episodes.length > 0" 
      :episodes="episodes"
    />

    <!-- Empty state -->
    <div
      v-else
      class="text-center text-gray-500 py-12"
    >
      <p>Keine Episoden verfügbar</p>
    </div>
  </div>
</template>

<style scoped>
/* Smooth loading animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

