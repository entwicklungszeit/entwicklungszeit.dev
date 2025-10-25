import { ref, computed } from 'vue';
import type { GalleryConfig } from '../types/gallery';

export function useGallery(config: GalleryConfig) {
  const currentIndex = ref(config.currentIndex);
  const totalPages = ref(config.totalPages);
  const isAnimating = ref(false);

  const canGoPrev = computed(() => currentIndex.value > 0);
  const canGoNext = computed(() => currentIndex.value < totalPages.value - 1);

  const navigate = (direction: 'prev' | 'next') => {
    if (isAnimating.value) return;

    const newIndex = direction === 'next'
      ? (currentIndex.value + 1) % totalPages.value
      : (currentIndex.value - 1 + totalPages.value) % totalPages.value;

    goToPage(newIndex);
  };

  const goToPage = (index: number) => {
    if (isAnimating.value || index === currentIndex.value) return;

    isAnimating.value = true;
    currentIndex.value = index;

    // Reset animation lock
    setTimeout(() => {
      isAnimating.value = false;
    }, 500);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.value = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.value = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchEndX.value - touchStartX.value;
    const absDistance = Math.abs(swipeDistance);

    if (absDistance > minSwipeDistance) {
      if (swipeDistance > 0) {
        navigate('prev');
      } else {
        navigate('next');
      }
    }
  };

  const touchStartX = ref(0);
  const touchEndX = ref(0);
  const minSwipeDistance = 50;

  return {
    currentIndex,
    totalPages,
    isAnimating,
    canGoPrev,
    canGoNext,
    navigate,
    goToPage,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
