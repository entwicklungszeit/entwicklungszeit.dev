<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Episode } from '../../types/episode';

interface Props {
  episode: Episode;
}

const props = defineProps<Props>();

const imageLoaded = ref(false);
const imageError = ref(false);
const imgRef = ref<HTMLImageElement | null>(null);

const FALLBACK_IMAGE =
  'https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/42889269/f3920f44c23f9537.jpg';

/**
 * Prefetch image to ensure it's loaded before displaying
 * Follows Single Responsibility - only handles image loading
 */
const prefetchImage = () => {
  const img = new Image();

  img.onload = () => {
    imageLoaded.value = true;
  };

  img.onerror = () => {
    imageError.value = true;
    imageLoaded.value = true;
  };

  img.src = props.episode.thumbnail;
};

onMounted(() => {
  prefetchImage();
});

const handleImageError = () => {
  if (imgRef.value) {
    imgRef.value.src = FALLBACK_IMAGE;
  }
};
</script>

<template>
  <a
    :href="episode.link"
    target="_blank"
    rel="noopener noreferrer"
    class="episode-card group relative block w-full max-w-[280px] aspect-square"
    :aria-label="episode.title"
  >
    <!-- Loading skeleton -->
    <div
      v-if="!imageLoaded"
      class="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-xl"
      aria-hidden="true"
    />

    <!-- Episode image -->
    <div
      class="relative h-full w-full overflow-hidden rounded-xl transition-opacity duration-300"
      :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }"
    >
      <img
        ref="imgRef"
        :src="episode.thumbnail"
        :alt="episode.title"
        :title="episode.description"
        width="280"
        height="280"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        @error="handleImageError"
      />

      <!-- Overlay on hover -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
      >
        <div class="text-white">
          <p class="text-sm font-semibold line-clamp-2">{{ episode.title }}</p>
        </div>
      </div>
    </div>

    <!-- Focus ring for accessibility -->
    <div
      class="absolute inset-0 rounded-xl ring-2 ring-primary ring-offset-2 opacity-0 group-focus-visible:opacity-100 pointer-events-none transition-opacity"
      aria-hidden="true"
    />
  </a>
</template>

<style scoped>
.episode-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.episode-card:hover,
.episode-card:focus-visible {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-6px);
}

.episode-card:focus-visible {
  outline: none;
}
</style>
