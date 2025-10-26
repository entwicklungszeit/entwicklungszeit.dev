<script setup lang="ts">
const APPLE_PODCASTS_URL = 'https://podcasts.apple.com/de/podcast/entwicklungszeit/id1549753595';
</script>

<template>
  <a
    :href="APPLE_PODCASTS_URL"
    target="_blank"
    rel="noopener noreferrer"
    class="apple-cta-card group relative block w-full max-w-[280px] aspect-square"
    aria-label="Podcast auf Apple Podcasts hören"
  >
    <div
      class="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex flex-col items-center justify-center p-6 text-white"
    >
      <!-- Apple Podcasts Icon -->
      <div class="mb-4 transform transition-transform duration-500 group-hover:scale-110">
        <svg
          class="w-16 h-16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 0C5.372 0 0 5.372 0 12c0 6.627 5.372 12 12 12 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm0 2.667c5.155 0 9.333 4.178 9.333 9.333 0 5.154-4.178 9.333-9.333 9.333-5.155 0-9.333-4.179-9.333-9.333 0-5.155 4.178-9.333 9.333-9.333zm0 3.706a5.627 5.627 0 00-5.627 5.627c0 1.044.285 2.021.78 2.856l.937-1.406a4.096 4.096 0 01-.56-2.106 4.096 4.096 0 014.097-4.097 4.096 4.096 0 014.096 4.097c0 .848-.257 1.635-.697 2.288l.93 1.398a5.627 5.627 0 00-4.33-8.657h.374zm0 3.294c-1.288 0-2.333 1.045-2.333 2.333 0 .85.455 1.595 1.135 2.005l-.001 4.328h2.398v-4.328a2.334 2.334 0 001.135-2.005c0-1.288-1.045-2.333-2.333-2.333z"/>
        </svg>
      </div>

      <!-- Text content -->
      <div class="text-center">
        <h3 class="text-xl font-bold mb-2">Apple Podcasts</h3>
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
.apple-cta-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.apple-cta-card:hover,
.apple-cta-card:focus-visible {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.15),
    0 10px 10px -5px rgba(0, 0, 0, 0.08);
  transform: translateY(-6px);
}

.apple-cta-card:focus-visible {
  outline: none;
}
</style>
