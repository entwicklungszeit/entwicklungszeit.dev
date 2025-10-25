<template>
  <div class="faq-accordion">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="accordion-item"
    >
      <input
        :id="`accordion-${index}`"
        type="checkbox"
        :checked="openIndex === index"
        class="accordion-input"
        @change="toggleAccordion(index)"
      />
      <label
        :for="`accordion-${index}`"
        class="accordion-header"
        tabindex="0"
        @keydown.enter.prevent="toggleAccordion(index)"
        @keydown.space.prevent="toggleAccordion(index)"
      >
        {{ item.question }}
        <span class="accordion-icon" aria-hidden="true" />
      </label>
      <div class="accordion-content">
        <div class="accordion-content-inner">
          <ul v-if="Array.isArray(item.answer)" class="list-disc pl-5 space-y-2">
            <li v-for="(answerItem, idx) in item.answer" :key="idx">
              {{ answerItem }}
            </li>
          </ul>
          <p v-else class="whitespace-pre-line">{{ item.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FaqItem } from '../../types/faq';

interface Props {
  items: FaqItem[];
}

defineProps<Props>();

const openIndex = ref<number | null>(null);

const toggleAccordion = (index: number) => {
  if (openIndex.value === index) {
    // If clicking the same item, close it
    openIndex.value = null;
  } else {
    // Open the clicked item
    openIndex.value = index;
  }
};
</script>

<style scoped>
.faq-accordion {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.accordion-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  background: white;
  overflow: hidden;
}

.accordion-input {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.accordion-header:hover {
  background: #f9fafb;
}

.accordion-icon {
  width: 1.25rem;
  height: 1.25rem;
  position: relative;
  flex-shrink: 0;
  aspect-ratio: 1 / 1;
}

.accordion-icon::before,
.accordion-icon::after {
  content: '';
  position: absolute;
  background: #4b5563;
  transition: transform 0.3s ease;
}

.accordion-icon::before {
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  transform: translateY(-50%);
}

.accordion-icon::after {
  top: 0;
  left: 50%;
  width: 2px;
  height: 100%;
  transform: translateX(-50%);
}

.accordion-content {
  max-height: 0;
  padding: 0 1.25rem;
  overflow: hidden;
  transition: all 0.35s ease-out;
  opacity: 0;
}

.accordion-content-inner {
  padding: 0 0 1.25rem 0;
  color: #4b5563;
  line-height: 1.6;
}

.accordion-input:checked + .accordion-header {
  border-bottom: 1px solid #e5e7eb;
}

.accordion-input:checked + .accordion-header .accordion-icon::after {
  transform: translateX(-50%) rotate(90deg);
}

.accordion-input:checked ~ .accordion-content {
  max-height: 100vh;
  opacity: 1;
  padding: 1.25rem;
}

.accordion-input:not(:checked) ~ .accordion-content {
  max-height: 0;
  opacity: 0;
  padding: 0 1.25rem;
}

.accordion-header:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: -2px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.accordion-input:checked ~ .accordion-content .accordion-content-inner {
  animation: slideDown 0.35s ease-out;
}

.accordion-content {
  transition:
    max-height 0.35s ease-out,
    opacity 0.35s ease-out,
    padding 0.35s ease-out;
}
</style>
