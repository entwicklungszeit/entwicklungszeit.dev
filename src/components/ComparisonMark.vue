<template>
  <span
    class="inline-flex items-center justify-center w-[34px] h-[34px] rounded-full"
    :class="value ? 'bg-primary text-white' : 'bg-[#EFEBE3] text-ink-soft'"
  >
    <svg
      v-if="value"
      viewBox="0 0 24 24"
      class="w-[18px] h-[18px]"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
    <svg
      v-else
      viewBox="0 0 24 24"
      class="w-4 h-4"
      fill="none"
      stroke="currentColor"
      stroke-width="2.6"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  </span>
  <span class="sr-only">{{ value ? 'Ja' : 'Nein' }}</span>
</template>

<script setup lang="ts">
defineProps<{ value: boolean }>();
</script>
