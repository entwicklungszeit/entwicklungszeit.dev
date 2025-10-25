<template>
  <div class="relative w-full aspect-video bg-black rounded-xl overflow-hidden" :data-video-id="videoId">
    <!-- GDPR Compliant Preview with Modal -->
    <div v-if="!isIframeLoaded" class="relative w-full h-full flex items-center justify-center overflow-hidden">
      <!-- Prefetch the thumbnail -->
      <link rel="prefetch" :href="thumbnailUrl" as="image" />
      <link rel="prefetch" :href="fallbackThumbnailUrl" as="image" />

      <img
        ref="previewImageRef"
        :src="useFallbackImage ? fallbackThumbnailUrl : thumbnailUrl"
        :alt="title"
        class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 ease-out"
        style="filter: blur(8px) brightness(0.7);"
        loading="eager"
        @load="handleImageLoad"
        @error="handleImageError"
      />

      <!-- Modal Dialog Container -->
      <div class="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
        <div class="flex flex-col items-center gap-6 p-8 rounded-2xl border border-white/60 w-full max-w-[420px]"
             style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.99) 0%, rgba(249, 250, 251, 0.99) 100%); box-shadow: 0 25px 100px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.8); animation: modal-slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <div class="text-center flex flex-col gap-2">
            <h3 class="text-xl font-bold text-gray-800 m-0" style="letter-spacing: -0.5px;">Externes Video</h3>
            <p class="text-sm text-gray-600 leading-relaxed m-0">
              Dieses Video wird von YouTube bereitgestellt. Durch das Abspielen akzeptieren Sie die Datenschutzbedingungen von YouTube.
            </p>
          </div>

          <button
            class="relative flex items-center justify-center gap-2 px-8 py-4 text-white border-none rounded-xl cursor-pointer font-bold text-base transition-all duration-300 min-w-[200px] overflow-hidden"
            style="background: linear-gradient(135deg, #FF0000 0%, #CC0000 100%); box-shadow: 0 10px 30px rgba(255, 0, 0, 0.3), 0 0 0 0 rgba(255, 0, 0, 0.2);"
            aria-label="Externen Inhalt von YouTube abspielen"
            :data-video-id="videoId"
            :data-title="title"
            @click="handlePlayClick"
          >
            <span class="relative z-10 flex items-center gap-2">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span class="font-bold whitespace-nowrap">Video abspielen</span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Iframe container - iframe will be injected here after consent -->
    <div v-if="isIframeLoaded" class="absolute inset-0 w-full h-full fade-in bg-red-500">
      <iframe
        :src="iframeSrc"
        :title="title"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        :loading="loading"
        class="absolute inset-0 w-full h-full border-none"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Props {
  videoId: string;
  title?: string;
  loading?: 'lazy' | 'eager';
}

const props = withDefaults(defineProps<Props>(), {
  title: 'YouTube Video',
  loading: 'lazy'
});

// GDPR consent storage key
const STORAGE_KEY = 'youtube-consent-accepted';

// Reactive state
const isIframeLoaded = ref(false);
const imageLoaded = ref(false);
const useFallbackImage = ref(false);
const shouldAutoplay = ref(false);

// Template refs
const previewImageRef = ref<HTMLImageElement | null>(null);

// Computed properties
const thumbnailUrl = computed(() =>
  `https://img.youtube.com/vi/${props.videoId}/maxresdefault.jpg`
);

const fallbackThumbnailUrl = computed(() =>
  `https://img.youtube.com/vi/${props.videoId}/hqdefault.jpg`
);

const iframeSrc = computed(() => {
  const baseUrl = `https://www.youtube-nocookie.com/embed/${props.videoId}?rel=0`;
  return shouldAutoplay.value ? `${baseUrl}&autoplay=1` : baseUrl;
});

// Methods
const handleImageLoad = () => {
  imageLoaded.value = true;
  // Show the image with a slight delay for smooth transition
  setTimeout(() => {
    if (previewImageRef.value) {
      previewImageRef.value.style.opacity = '1';
    }
  }, 100);
};

const handleImageError = () => {
  useFallbackImage.value = true;
};

const handlePlayClick = () => {
  // Store consent in localStorage
    localStorage.setItem(STORAGE_KEY, 'true');

  // Set autoplay to true for fresh consent
  shouldAutoplay.value = true;
  isIframeLoaded.value = true;
};

const checkExistingConsent = () => {
  // Check if user has already given consent
  const consent = localStorage.getItem(STORAGE_KEY);
    if (consent === 'true') {
      // Load iframe but don't autoplay on reload
      shouldAutoplay.value = false;
      isIframeLoaded.value = true;
    }
};

// Lifecycle
onMounted(() => {
  checkExistingConsent();
});
</script>

<style scoped>
/* Custom animations and pseudo-elements that can't be done with Tailwind */
@keyframes modal-slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-iframe {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.play-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease-out;
}

.play-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 50px rgba(255, 0, 0, 0.4), 0 0 0 6px rgba(255, 0, 0, 0.1);
}

.play-button:hover::before {
  transform: translateX(100%);
}

.play-button:active {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
}

.play-button:focus {
  outline: none;
  box-shadow: 0 10px 30px rgba(255, 0, 0, 0.3), 0 0 0 8px rgba(255, 0, 0, 0.15);
}

.fade-in {
  animation: fade-in-iframe 0.6s ease-out forwards;
  opacity: 1;
}
</style>
