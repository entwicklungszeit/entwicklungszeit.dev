<template>
  <div class="flex justify-center gap-2 mt-4">
    <button
      v-for="(_, index) in Array.from({ length: totalPages })"
      :key="index"
      :class="[
        'w-2.5',
        'h-2.5',
        'rounded-full',
        'transition-colors',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary/50',
        index === currentPage ? 'bg-primary' : 'bg-gray-300'
      ]"
      :aria-label="`Gehe zu Seite ${index + 1}`"
      :aria-current="index === currentPage ? 'true' : undefined"
      @click="handlePageChange(index)"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  totalPages: number;
  currentPage: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  pageChange: [page: number];
}>();

const handlePageChange = (page: number) => {
  emit('pageChange', page);
};
</script>
