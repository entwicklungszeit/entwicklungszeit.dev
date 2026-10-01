<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 48 48"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="offerIconStrokeWidth(size)"
    class="offer-icon"
    aria-hidden="true"
    focusable="false"
  >
    <template v-for="(shape, i) in offerIcons[offer]" :key="i">
      <circle
        v-if="shape.circle"
        :cx="shape.circle.cx"
        :cy="shape.circle.cy"
        :r="shape.circle.r"
        :fill="color(shape.tone)"
        stroke="none"
      />
      <path v-else :d="shape.d" :stroke="color(shape.tone)" :opacity="shape.opacity" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { offerIcons, offerIconStrokeWidth, type OfferIconName } from '../data/navigation';

withDefaults(defineProps<{ offer: OfferIconName; size?: number }>(), { size: 20 });

const color = (tone: 'ink' | 'accent') => (tone === 'ink' ? 'currentColor' : 'var(--offer-accent)');
</script>

<style scoped>
.offer-icon {
  --offer-accent: #d9692a;
  flex-shrink: 0;
}
</style>
