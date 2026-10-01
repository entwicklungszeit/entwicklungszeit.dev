<template>
  <table class="w-full border-separate border-spacing-0 table-fixed text-left">
    <caption class="sr-only">
      {{ caption }}
    </caption>
    <colgroup>
      <col />
      <col class="w-[88px] sm:w-[152px] md:w-[168px]" />
      <col class="w-[80px] sm:w-[136px] md:w-[152px]" />
    </colgroup>
    <thead>
      <tr>
        <th scope="col" class="bg-paper"><span class="sr-only">Angebot</span></th>
        <th
          scope="col"
          class="bg-highlight-ink text-white text-center text-sm sm:text-[15px] font-semibold leading-tight px-2 py-4 rounded-t-[20px]"
        >
          {{ labels.ours }}
        </th>
        <th
          scope="col"
          class="bg-paper text-ink-soft text-center text-sm sm:text-[15px] font-semibold leading-tight px-2 py-4"
        >
          {{ labels.others }}
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="group in groups" :key="group.title">
        <tr>
          <th
            scope="colgroup"
            colspan="3"
            class="bg-paper pt-8 pb-2.5 pr-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft"
          >
            {{ group.title }}
          </th>
        </tr>
        <tr v-for="row in group.rows" :key="row.title">
          <th scope="row" class="bg-paper border-t border-rule py-4 pr-4 font-normal align-middle">
            <span class="block text-base font-semibold text-ink leading-snug">{{ row.title }}</span>
            <span class="block text-sm text-ink-soft leading-snug mt-0.5">{{ row.description }}</span>
          </th>
          <td class="relative bg-highlight-tint border-t border-[#F0D6C3] py-4 text-center align-middle">
            <ComparisonMark :value="row.ours" />
          </td>
          <td class="relative bg-paper border-t border-rule py-4 text-center align-middle">
            <ComparisonMark :value="row.others" />
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { ComparisonGroup, ComparisonLabels } from '../types/comparison';
import ComparisonMark from './ComparisonMark.vue';

withDefaults(
  defineProps<{
    groups: ComparisonGroup[];
    labels: ComparisonLabels;
    caption?: string;
  }>(),
  { caption: 'Vergleich: Entwicklungszeit und andere Anbieter' }
);
</script>
