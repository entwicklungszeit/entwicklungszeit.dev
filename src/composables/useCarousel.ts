import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { CarouselConfig } from '../types/carousel';

export function useCarousel(config: CarouselConfig) {
  const currentPage = ref(config.currentPage);
  const itemsPerPage = ref(config.itemsPerPage);
  const totalPages = ref(config.totalPages);
  const isAnimating = ref(false);

  const touchStartX = ref(0);
  const touchEndX = ref(0);
  const minSwipeDistance = 50;
  const isSwiping = ref(false);

  const canGoPrev = computed(() => currentPage.value > 0);
  const canGoNext = computed(() => currentPage.value < totalPages.value - 1);

  const navigate = (direction: 'prev' | 'next') => {
    if (isAnimating.value) return;

    const newPage = direction === 'next'
      ? currentPage.value + 1
      : currentPage.value - 1;

    if (newPage >= 0 && newPage < totalPages.value) {
      goToPage(newPage);
    }
  };

  const goToPage = (page: number) => {
    if (isAnimating.value || page === currentPage.value) return;

    isAnimating.value = true;
    currentPage.value = page;

    // Reset animation lock
    setTimeout(() => {
      isAnimating.value = false;
    }, 500);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.value = e.touches[0].clientX;
    isSwiping.value = true;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping.value) return;
    touchEndX.value = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isSwiping.value) return;

    isSwiping.value = false;
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

  const handleKeyboard = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') navigate('prev');
    if (e.key === 'ArrowRight') navigate('next');
  };

  const updateItemsPerPage = (width: number) => {
    if (width >= 1024) {
      itemsPerPage.value = 4;
    } else if (width >= 768) {
      itemsPerPage.value = 2;
    } else {
      itemsPerPage.value = 1;
    }
  };

  const updateTotalPages = (totalItems: number) => {
    totalPages.value = Math.ceil(totalItems / itemsPerPage.value);

    // Ensure current page is valid
    if (currentPage.value >= totalPages.value) {
      currentPage.value = Math.max(0, totalPages.value - 1);
    }
  };

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    isAnimating,
    canGoPrev,
    canGoNext,
    navigate,
    goToPage,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleKeyboard,
    updateItemsPerPage,
    updateTotalPages,
  };
}
