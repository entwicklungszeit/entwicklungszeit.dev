<template>
  <div class="youtube-embed-container">
    <!-- GDPR Compliant Preview -->
    <div v-if="gdprCompliant && shouldShowPreview" class="gdpr-preview-container">
      <link rel="prefetch" :href="thumbnailUrl" as="image" />
      <link rel="prefetch" :href="fallbackThumbnailUrl" as="image" />

      <img
        :src="thumbnailUrl"
        :alt="title"
        class="preview-image"
        loading="eager"
        @load="onImageLoad"
        @error="onImageError"
      />

      <!-- Modal Dialog Container -->
      <div class="modal-backdrop">
        <div class="modal-content">
          <div class="modal-text-content">
            <h3 class="modal-title">Externes Video</h3>
            <p class="modal-description">
              Dieses Video wird von YouTube bereitgestellt. Durch das Abspielen akzeptieren Sie die Datenschutzbedingungen von YouTube.
            </p>
          </div>

          <button
            class="play-button"
            aria-label="Externen Inhalt von YouTube abspielen"
            @click="handleConsent"
          >
            <span class="button-content">
              <svg class="button-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span class="button-text">Video abspielen</span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Iframe Container -->
    <div v-if="!gdprCompliant || !shouldShowPreview" ref="iframeContainer" class="iframe-container">
      <iframe
        v-if="iframeSrc"
        class="youtube-iframe"
        :src="iframeSrc"
        :title="title"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        :loading="loading"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useYouTubeConsent } from '../composables/useYouTubeConsent';

interface Props {
  videoId: string;
  title?: string;
  loading?: 'lazy' | 'eager';
  gdprCompliant?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'YouTube Video',
  loading: 'lazy',
  gdprCompliant: false,
});

const thumbnailUrl = computed(() => `https://img.youtube.com/vi/${props.videoId}/maxresdefault.jpg`);
const fallbackThumbnailUrl = computed(() => `https://img.youtube.com/vi/${props.videoId}/hqdefault.jpg`);

const { hasConsent, shouldShowPreview, checkConsent, giveConsent, loadIframe } = useYouTubeConsent();
const iframeContainer = ref<HTMLDivElement | null>(null);
const imageSrc = ref(props.gdprCompliant ? thumbnailUrl.value : '');
const iframeSrc = ref<string | null>(null);

const handleConsent = () => {
  giveConsent();
  loadIframeIntoContainer();
};

const loadIframeIntoContainer = () => {
  if (typeof document === 'undefined' || !iframeContainer.value) return;

  const iframe = loadIframe(props.videoId, props.title);
  iframeContainer.value.innerHTML = '';
  iframeContainer.value.appendChild(iframe);
  iframeSrc.value = `https://www.youtube-nocookie.com/embed/${props.videoId}?rel=0`;
};

const onImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (img) img.style.opacity = '1';
};

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (img) img.src = fallbackThumbnailUrl.value;
};

onMounted(() => {
  if (props.gdprCompliant) {
    if (checkConsent()) {
      loadIframeIntoContainer();
    }
  } else {
    iframeSrc.value = `https://www.youtube-nocookie.com/embed/${props.videoId}?rel=0`;
  }
});
</script>

<style scoped>
.youtube-embed-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}

.youtube-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  transition: opacity 0.6s ease-out;
}

.youtube-iframe.hidden {
  opacity: 0;
  pointer-events: none;
}

.youtube-iframe.visible {
  opacity: 1;
  pointer-events: auto;
}

.gdpr-preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.gdpr-preview-container.hidden {
  display: none;
}

.preview-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(8px) brightness(0.7);
  opacity: 0;
  transition: opacity 0.3s ease-out;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 20;
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px 32px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.99) 0%, rgba(249, 250, 251, 0.99) 100%);
  border-radius: 20px;
  box-shadow: 0 25px 100px rgba(0, 0, 0, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.6);
  max-width: 90%;
  width: 100%;
  max-width: 420px;
  animation: modal-slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

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

.modal-text-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  letter-spacing: -0.5px;
}

.modal-description {
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.play-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #FF0000 0%, #CC0000 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 10px 30px rgba(255, 0, 0, 0.3),
              0 0 0 0 rgba(255, 0, 0, 0.2);
  overflow: hidden;
  min-width: 200px;
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
  transform: translateY(-3px);
  box-shadow: 0 15px 50px rgba(255, 0, 0, 0.4),
              0 0 0 6px rgba(255, 0, 0, 0.1);
}

.play-button:hover::before {
  transform: translateX(100%);
}

.play-button:active {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
}

.play-button:focus {
  outline: none;
  box-shadow: 0 10px 30px rgba(255, 0, 0, 0.3),
              0 0 0 8px rgba(255, 0, 0, 0.15);
}

.button-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
}

.button-icon {
  width: 20px;
  height: 20px;
}

.button-text {
  font-weight: 700;
  white-space: nowrap;
}

.iframe-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.6s ease-out;
  display: block;
}

.iframe-container.fade-in {
  animation: fade-in-iframe 0.6s ease-out forwards;
}

.iframe-container iframe {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  border: none;
  display: block;
}

@keyframes fade-in-iframe {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.youtube-iframe.fade-in {
  animation: fade-in-iframe 0.6s ease-out forwards;
}
</style>
