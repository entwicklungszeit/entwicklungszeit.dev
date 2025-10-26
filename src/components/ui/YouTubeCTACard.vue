<script setup lang="ts">
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@entwicklungszeit';
</script>

<template>
  <a
    :href="YOUTUBE_CHANNEL_URL"
    target="_blank"
    rel="noopener noreferrer"
    class="youtube-cta-card group relative block w-full max-w-[280px] aspect-square"
    aria-label="Alle Episoden auf YouTube ansehen"
  >
    <div
      class="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex flex-col items-center justify-center p-6 text-white"
    >
      <!-- YouTube Icon -->
      <div class="mb-4 transform transition-transform duration-500 group-hover:scale-110">
        <svg
          class="w-16 h-16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </div>

      <!-- Text content -->
      <div class="text-center">
        <h3 class="text-xl font-bold mb-2">Auf YouTube</h3>
        <p class="text-sm opacity-90">hören</p>
      </div>

      <!-- Arrow icon -->
      <div class="absolute bottom-4 right-4 transform transition-transform duration-300 group-hover:translate-x-1">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </div>

      <!-- Animated background effect -->
      <div
        class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"
        aria-hidden="true"
      />
    </div>

    <!-- Focus ring for accessibility -->
    <div
      class="absolute inset-0 rounded-xl ring-2 ring-primary ring-offset-2 opacity-0 group-focus-visible:opacity-100 pointer-events-none transition-opacity"
      aria-hidden="true"
    />
  </a>
</template>

<style scoped>
.youtube-cta-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.youtube-cta-card:hover,
.youtube-cta-card:focus-visible {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.15),
    0 10px 10px -5px rgba(0, 0, 0, 0.08);
  transform: translateY(-6px);
}

.youtube-cta-card:focus-visible {
  outline: none;
}
</style>
