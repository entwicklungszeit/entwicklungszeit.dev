import { ref, computed } from 'vue';

/**
 * Composable for managing carousel state and navigation
 * Follows Single Responsibility Principle - only handles carousel logic
 */
export function useCarousel() {
  const currentPage = ref(0);
  const itemsPerPage = ref(1);
  const totalPages = ref(0);
  const isAnimating = ref(false);

  const touchStartX = ref(0);
  const touchEndX = ref(0);
  const minSwipeDistance = 50;
  const isSwiping = ref(false);

  const canGoPrev = computed(() => currentPage.value > 0);
  const canGoNext = computed(() => currentPage.value < totalPages.value - 1);

  /**
   * Navigate by a relative amount (e.g., -1 for previous, 1 for next)
   */
  const navigate = (direction: number) => {
    if (isAnimating.value) return;

    const newPage = currentPage.value + direction;

    if (newPage >= 0 && newPage < totalPages.value) {
      goToPage(newPage);
    }
  };

  /**
   * Navigate to a specific page
   */
  const goToPage = (page: number) => {
    if (isAnimating.value || page === currentPage.value) return;
    if (page < 0 || page >= totalPages.value) return;

    isAnimating.value = true;
    currentPage.value = page;

    // Reset animation lock after transition
    setTimeout(() => {
      isAnimating.value = false;
    }, 300);
  };

  /**
   * Touch event handlers for mobile swipe gestures
   */
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.value = e.touches[0].clientX;
    touchEndX.value = e.touches[0].clientX;
    isSwiping.value = true;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping.value) return;
    touchEndX.value = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isSwiping.value) return;

    isSwiping.value = false;
    const swipeDistance = touchStartX.value - touchEndX.value;
    const absDistance = Math.abs(swipeDistance);

    if (absDistance > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped left - go to next
        navigate(1);
      } else {
        // Swiped right - go to previous
        navigate(-1);
      }
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
  };
}
