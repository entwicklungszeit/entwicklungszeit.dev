<script setup lang="ts">
const SPOTIFY_PODCAST_URL = 'https://open.spotify.com/show/0FIDXWiMc1D21hKWCxr4mI';
</script>

<template>
  <a
    :href="SPOTIFY_PODCAST_URL"
    target="_blank"
    rel="noopener noreferrer"
    class="spotify-cta-card group relative block w-full max-w-[280px] aspect-square"
    aria-label="Podcast auf Spotify hören"
  >
    <div
      class="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 flex flex-col items-center justify-center p-6 text-white"
    >
      <!-- Spotify Icon -->
      <div class="mb-4 transform transition-transform duration-500 group-hover:scale-110">
        <svg
          class="w-16 h-16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      </div>

      <!-- Text content -->
      <div class="text-center">
        <h3 class="text-xl font-bold mb-2">Auf Spotify</h3>
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
.spotify-cta-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.spotify-cta-card:hover,
.spotify-cta-card:focus-visible {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.15),
    0 10px 10px -5px rgba(0, 0, 0, 0.08);
  transform: translateY(-6px);
}

.spotify-cta-card:focus-visible {
  outline: none;
}
</style>
