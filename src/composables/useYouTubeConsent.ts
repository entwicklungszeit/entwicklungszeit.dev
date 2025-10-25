import { ref, onMounted } from 'vue';

const STORAGE_KEY = 'youtube-consent-accepted';

export function useYouTubeConsent() {
  const hasConsent = ref(false);
  const shouldShowPreview = ref(true);

  const checkConsent = () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
    hasConsent.value = localStorage.getItem(STORAGE_KEY) === 'true';
    return hasConsent.value;
  };

  const giveConsent = () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, 'true');
    hasConsent.value = true;
    shouldShowPreview.value = false;
  };

  const loadIframe = (videoId: string, title: string): HTMLIFrameElement => {
    if (typeof document === 'undefined') throw new Error('Document is not available');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`;
    iframe.title = title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('style', 'width: 100%; height: 100%;');

    return iframe;
  };

  onMounted(() => {
    checkConsent();
  });

  return {
    hasConsent,
    shouldShowPreview,
    checkConsent,
    giveConsent,
    loadIframe,
  };
}
