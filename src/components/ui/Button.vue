<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :target="target"
    :rel="rel"
    :type="href ? undefined : type"
    :disabled="href ? undefined : (disabled || loading)"
    :aria-label="ariaLabel"
    :aria-current="ariaCurrent"
    :aria-busy="loading"
    :role="role"
    :class="buttonClasses"
    v-bind="href ? (disabled ? { 'aria-disabled': 'true', role: 'button' } : {}) : {}"
  >
    <svg
      v-if="loading"
      class="w-4 h-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <span class="relative z-10 flex items-center justify-center w-full">
      <slot />
    </span>

    <div
      v-if="variant !== 'outline' && !disabled && !loading"
      class="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 hover:opacity-100 transition-opacity duration-300"
    />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  href?: string;
  variant?: 'primary' | 'gradient' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  target?: string;
  rel?: string;
  class?: string;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean;
  role?: 'button' | 'menuitem' | 'link' | 'presentation' | 'none';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  class: ''
});

const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium relative overflow-hidden transform transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary';

const sizeStyles = {
  sm: 'px-4 py-2 text-sm gap-2',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-3'
};

const variantStyles = {
  primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-hover hover:shadow-primary/20 active:scale-95',
  gradient: 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-hover hover:shadow-primary/20 active:scale-95',
  outline: 'bg-transparent border-2 border-current text-primary hover:bg-primary/5 active:scale-95'
};

const disabledStyles = 'opacity-60 cursor-not-allowed';

const buttonClasses = computed(() => [
  baseStyles,
  sizeStyles[props.size],
  variantStyles[props.variant],
  props.disabled || props.loading ? disabledStyles : 'hover:scale-105',
  props.class
]);
</script>
