<template>
  <button
    v-show="isVisible"
    aria-label="Scroll to top"
    class="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-white bg-opacity-80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 text-gray-700 hover:text-primary transition-all duration-300 opacity-0 translate-y-10 pointer-events-none"
    :class="{
      'opacity-100 translate-y-0 pointer-events-auto': isVisible
    }"
    @click="scrollToTop"
  >
    <span class="sr-only">Nach oben scrollen</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 10l7-7m0 0l7 7m-7-7v18"
      ></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  targetSelector?: string;
  offset?: number;
}

const props = withDefaults(defineProps<Props>(), {
  targetSelector: 'body',
  offset: 0,
});

const isVisible = ref(false);
const prefersReducedMotion = ref(false);
const scrollBehavior = computed(() => prefersReducedMotion.value ? 'auto' : 'smooth');

const scrollToTop = () => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const target = document.querySelector(props.targetSelector);
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - props.offset;

  window.scrollTo({
    top: targetPosition,
    behavior: scrollBehavior.value,
  });

  setTimeout(() => {
    const target = document.querySelector(props.targetSelector);
    if (!target) return;

    const firstFocusable = target.querySelector(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'
    );
    if (firstFocusable) {
      (firstFocusable as HTMLElement).focus();
    }
  }, prefersReducedMotion.value ? 0 : 800);
};

const handleScroll = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  isVisible.value = scrollY > 300;
};

let intersectionObserver: IntersectionObserver | null = null;

onMounted(() => {
  // Check for client-side
  if (typeof window === 'undefined') return;

  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      rootMargin: '0px 0px -80% 0px',
    };

    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          handleScroll();
          window.addEventListener('scroll', handleScroll, { passive: true });
        } else {
          window.removeEventListener('scroll', handleScroll);
          isVisible.value = false;
        }
      });
    }, observerOptions);

    const firstSection = document.querySelector('section') as HTMLElement | null;
    if (firstSection) {
      intersectionObserver.observe(firstSection);
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  } else {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (intersectionObserver) {
    intersectionObserver.disconnect();
  }
});
</script>
