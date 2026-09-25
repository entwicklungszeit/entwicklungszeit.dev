<template>
  <div class="navigation-container flex items-center flex-1 justify-end md:justify-normal">
    <!-- Desktop Navigation -->
    <nav aria-label="Main navigation" class="hidden md:flex items-center flex-1 justify-end">
      <ul class="flex items-center gap-3 sm:gap-4">
        <li v-for="item in navItems" :key="item.href" class="group relative">
          <a
            :href="item.href"
            :class="[
              'relative px-4 py-2 text-sm transition-colors duration-300',
              isActive(item.href)
                ? 'font-semibold text-ink'
                : 'font-medium text-ink-soft hover:text-ink'
            ]"
            :aria-label="item.label"
            :aria-current="isActive(item.href) ? 'page' : undefined"
          >
            {{ item.label }}
            <span
              v-if="isActive(item.href)"
              class="absolute -bottom-1 left-4 right-4 h-px bg-primary"
            ></span>
          </a>
          <ul
            v-if="item.children"
            class="absolute left-0 top-full hidden min-w-[16rem] pt-2 group-hover:block group-focus-within:block"
          >
            <li class="border border-rule bg-paper py-2 shadow-md">
              <a
                v-for="child in item.children"
                :key="child.href"
                :href="child.href"
                :class="[
                  'block px-4 py-2 text-sm transition-colors duration-300',
                  isActive(child.href)
                    ? 'font-semibold text-ink'
                    : 'font-medium text-ink-soft hover:bg-rule/30 hover:text-ink'
                ]"
                :aria-current="isActive(child.href) ? 'page' : undefined"
              >
                {{ child.label }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <!-- Mobile Menu Button -->
    <button
      id="mobile-menu-button"
      class="md:hidden p-2 rounded-md text-ink hover:bg-rule/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-300"
      :aria-label="isMenuOpen ? 'Menü schließen' : 'Menü öffnen'"
      :aria-expanded="isMenuOpen"
      aria-controls="mobile-menu"
      @click="toggleMenu"
    >
      <svg
        v-if="!isMenuOpen"
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
      <svg
        v-else
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

  <!-- Mobile Menu Overlay -->
  <div
    v-if="isMenuOpen"
    id="mobile-menu"
    class="fixed inset-x-0 top-16 h-[calc(100vh-4rem)] z-[60] md:hidden"
    aria-label="Mobile navigation menu"
    @click="handleMenuClick"
  >
    <!-- Light Backdrop -->
    <div
      class="absolute inset-0 bg-ink/20"
      id="mobile-menu-backdrop"
    ></div>

    <!-- Menu Panel -->
    <div
      class="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-paper transform transition-transform duration-300 ease-in-out z-10 overflow-y-auto"
      id="mobile-menu-panel"
      @click.stop
    >
      <!-- Navigation Links -->
      <nav class="px-6 py-8">
        <ul class="space-y-2">
          <li v-for="item in navItems" :key="item.href">
            <a
              :href="item.href"
              :class="[
                'block px-4 py-3 text-base rounded-md transition-colors duration-300',
                isActive(item.href)
                  ? 'font-semibold text-ink bg-rule/40'
                  : 'font-medium text-ink-soft hover:bg-rule/30 hover:text-ink'
              ]"
              :aria-current="isActive(item.href) ? 'page' : undefined"
              @click="handleLinkClick"
            >
              {{ item.label }}
            </a>
            <ul v-if="item.children" class="mt-1 space-y-1 pl-4">
              <li v-for="child in item.children" :key="child.href">
                <a
                  :href="child.href"
                  :class="[
                    'block px-4 py-2 text-sm rounded-md transition-colors duration-300',
                    isActive(child.href)
                      ? 'font-semibold text-ink bg-rule/40'
                      : 'font-medium text-ink-soft hover:bg-rule/30 hover:text-ink'
                  ]"
                  :aria-current="isActive(child.href) ? 'page' : undefined"
                  @click="handleLinkClick"
                >
                  {{ child.label }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { navItems } from '../data/navigation';
import { isClickOutsideAll } from '../lib/isClickOutside';

// Props
interface Props {
  currentPath?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currentPath: '/'
});

// Reactive state
const isMenuOpen = ref(false);

// A nav item is active if the current path matches it exactly, or (for
// non-root items) if the current path is nested under it, e.g. `/blog/my-post`
// keeps the `/blog` nav item highlighted.
const isActive = (href: string): boolean => {
  const currentPath = props.currentPath || '/';

  if (href === '/') {
    return currentPath === '/' || currentPath === '';
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
};

// Methods
const openMenu = () => {
  isMenuOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeMenu = () => {
  isMenuOpen.value = false;
  document.body.style.overflow = '';
};

const toggleMenu = () => {
  if (isMenuOpen.value) {
    closeMenu();
  } else {
    openMenu();
  }
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

// Global click handler for outside clicks.
const handleGlobalClick = (event: MouseEvent) => {
  if (!isMenuOpen.value) return;

  const menuPanel = document.getElementById('mobile-menu-panel');
  const menuButton = document.getElementById('mobile-menu-button');

  if (isClickOutsideAll(event.composedPath(), [menuPanel, menuButton])) {
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
