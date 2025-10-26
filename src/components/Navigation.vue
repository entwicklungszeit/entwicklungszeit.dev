<template>
  <div class="navigation-container flex items-center w-full justify-end md:justify-normal">
    <!-- Desktop Navigation -->
    <nav aria-label="Main navigation" class="hidden md:flex items-center w-full">
      <div class="flex-1"></div>
      <ul class="flex items-center gap-3 sm:gap-4">
        <li>
          <a
            href="/"
            :class="[
              'relative px-4 py-2 text-sm transition-all duration-300',
              isHomePage
                ? 'font-bold text-primary scale-105'
                : 'font-medium text-gray-900 hover:text-primary'
            ]"
            aria-label="Podcast"
            :aria-current="isHomePage ? 'page' : undefined"
          >
            Podcast
            <span
              v-if="isHomePage"
              class="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary rounded-full"
            ></span>
          </a>
        </li>
        <li>
          <a
            href="/angebote"
            :class="[
              'relative px-4 py-2 text-sm transition-all duration-300',
              isAngebotePage
                ? 'font-bold text-primary scale-105'
                : 'font-medium text-gray-900 hover:text-primary'
            ]"
            aria-label="Begleitung"
            :aria-current="isAngebotePage ? 'page' : undefined"
          >
            Begleitung
            <span
              v-if="isAngebotePage"
              class="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary rounded-full"
            ></span>
          </a>
        </li>
        <li>
          <a
            href="#contact"
            class="relative px-4 py-2 text-sm font-medium text-gray-900 transition-colors duration-300 hover:text-primary"
            aria-label="Kontakt"
            @click="handleScrollToContact"
          >
            Kontakt
          </a>
        </li>
      </ul>
      <div class="flex-1 flex justify-end">
        <Button
          href="https://calendly.com/gregor-entwicklungszeit/30min"
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          aria-label="Termin buchen (öffnet neues Fenster)"
          data-astro-prefetch="false"
        >
          Termin buchen
        </Button>
      </div>
    </nav>

    <!-- Mobile Menu Button -->
    <button
      id="mobile-menu-button"
      class="md:hidden p-2 rounded-md text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-300"
      aria-label="Menü öffnen"
      :aria-expanded="isMenuOpen"
      aria-controls="mobile-menu"
      @click="openMenu"
    >
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  </div>

  <!-- Mobile Menu Overlay -->
  <div
    v-if="isMenuOpen"
    id="mobile-menu"
    class="fixed inset-0 z-[60] md:hidden"
    aria-label="Mobile navigation menu"
    @click="handleMenuClick"
  >
    <!-- Light Backdrop -->
    <div
      class="absolute inset-0 bg-white/60"
      id="mobile-menu-backdrop"
    ></div>

    <!-- Menu Panel -->
    <div
      class="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white transform transition-transform duration-300 ease-in-out z-10"
      id="mobile-menu-panel"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between h-16 px-6 bg-white">
        <h2 class="text-lg font-semibold text-gray-900">Menü</h2>
        <button
          id="mobile-menu-close"
          class="p-2 rounded-md text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-300"
          aria-label="Menü schließen"
          @click="closeMenu"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="px-6 py-8 bg-white">
        <ul class="space-y-6">
          <li>
            <a
              href="/"
              :class="[
                'block relative px-4 py-3 text-base rounded-md transition-all duration-300 transform',
                isHomePage
                  ? 'font-bold text-primary bg-gradient-to-r from-primary/10 to-secondary/10 shadow-md scale-105 border-l-4 border-primary'
                  : 'font-medium text-gray-900 hover:bg-gray-100 hover:translate-x-1'
              ]"
              :aria-current="isHomePage ? 'page' : undefined"
              @click="handleLinkClick"
            >
              <span class="flex items-center gap-2">
                <span v-if="isHomePage" class="text-lg">▶</span>
                Podcast
              </span>
              <span
                v-if="isHomePage"
                class="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-secondary to-tertiary rounded-l-md"
              ></span>
            </a>
          </li>
          <li>
            <a
              href="/angebote"
              :class="[
                'block relative px-4 py-3 text-base rounded-md transition-all duration-300 transform',
                isAngebotePage
                  ? 'font-bold text-primary bg-gradient-to-r from-primary/10 to-secondary/10 shadow-md scale-105 border-l-4 border-primary'
                  : 'font-medium text-gray-900 hover:bg-gray-100 hover:translate-x-1'
              ]"
              :aria-current="isAngebotePage ? 'page' : undefined"
              @click="handleLinkClick"
            >
              <span class="flex items-center gap-2">
                <span v-if="isAngebotePage" class="text-lg">▶</span>
                Angebote
              </span>
              <span
                v-if="isAngebotePage"
                class="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-secondary to-tertiary rounded-l-md"
              ></span>
            </a>
          </li>
          <li>
            <a
              href="#contact"
              class="block relative px-4 py-3 text-base font-medium rounded-md transition-all duration-300 transform text-gray-900 hover:bg-gray-100 hover:translate-x-1"
              aria-label="Kontakt"
              @click="handleScrollToContactMobile"
            >
              Kontakt
            </a>
          </li>
          <li class="pt-4">
            <Button
              href="https://calendly.com/gregor-entwicklungszeit/30min"
              target="_blank"
              rel="noopener noreferrer"
              size="md"
              class="w-full"
              aria-label="Termin buchen (öffnet neues Fenster)"
              data-astro-prefetch="false"
            >
              Termin buchen
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Button from './ui/Button.vue';

// Props
interface Props {
  currentPath?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currentPath: '/'
});

// Reactive state
const isMenuOpen = ref(false);

// Computed properties
const isHomePage = computed(() => props.currentPath === '/' || props.currentPath === '');
const isAngebotePage = computed(() => props.currentPath === '/angebote' || props.currentPath === '/angebote/');

// Methods
const openMenu = () => {
  isMenuOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeMenu = () => {
  isMenuOpen.value = false;
  document.body.style.overflow = '';
};

const handleMenuClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const menu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('mobile-menu-backdrop');

  if (target === menu || target === backdrop) {
    closeMenu();
  }
};

const handleLinkClick = () => {
  closeMenu();
  // Scroll to top after navigation
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);
};

const handleScrollToContact = (event: MouseEvent) => {
  event.preventDefault();
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const handleScrollToContactMobile = (event: MouseEvent) => {
  event.preventDefault();
  closeMenu();
  setTimeout(() => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
};

// Global click handler for outside clicks
const handleGlobalClick = (event: MouseEvent) => {
  if (!isMenuOpen.value) return;

  const target = event.target as HTMLElement;
  const menuPanel = document.getElementById('mobile-menu-panel');
  const menuButton = document.getElementById('mobile-menu-button');

  if (menuPanel && !menuPanel.contains(target) &&
      menuButton && !menuButton.contains(target)) {
    closeMenu();
  }
};

// Keyboard handler
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMenuOpen.value) {
    closeMenu();
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleGlobalClick);
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick);
  document.removeEventListener('keydown', handleKeydown);
  // Clean up body overflow
  document.body.style.overflow = '';
});
</script>

<style scoped>
#mobile-menu-panel {
  transform: translateX(100%);
  background-color: #ffffff !important;
  opacity: 1 !important;
}

#mobile-menu-panel:not(.-translate-x-full) {
  transform: translateX(0);
}

#mobile-menu-backdrop {
  background-color: rgba(255, 255, 255, 0.6) !important;
}
</style>
