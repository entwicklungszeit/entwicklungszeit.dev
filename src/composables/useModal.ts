import { ref, onMounted, onUnmounted } from 'vue';

export function useModal() {
  const isOpen = ref(false);

  const open = () => {
    isOpen.value = true;
    // Prevent body scroll when modal is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const close = () => {
    isOpen.value = false;
    // Restore body scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  const toggle = () => {
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  };

  // Handle escape key
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) {
      close();
    }
  };

  // Handle click outside
  const handleClickOutside = (e: MouseEvent, container: HTMLElement) => {
    if (!container.contains(e.target as Node)) {
      close();
    }
  };

  onMounted(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', handleEscape);
    }
  });

  onUnmounted(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', handleEscape);
      // Ensure body scroll is restored
      document.body.style.overflow = '';
    }
  });

  return {
    isOpen,
    open,
    close,
    toggle,
    handleClickOutside,
  };
}
