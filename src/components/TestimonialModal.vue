<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="handleClose"
    >
      <dialog
        ref="dialogRef"
        :open="isOpen"
        class="max-w-2xl w-full bg-paper-raised border border-rule rounded-sm m-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto p-0"
      >
        <div class="relative">
          <!-- Close button -->
          <button
            type="button"
            class="absolute z-10 right-4 top-4 text-ink-faint bg-transparent hover:bg-rule hover:text-ink rounded-sm text-sm p-1.5 inline-flex items-center"
            aria-label="Close modal"
            @click="handleClose"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>

          <!-- Accent Header -->
          <div
            class="relative overflow-hidden flex items-center gap-5 px-8 pt-8 pb-7 pr-14 bg-highlight-tint border-b border-rule"
          >
            <div
              class="relative w-20 h-20 flex-none rounded-full overflow-hidden border-[3px] border-paper-raised shadow-[0_6px_18px_rgba(30,58,138,0.25)]"
            >
              <img
                :src="testimonial.portraitImage.src"
                :alt="testimonial.portraitImage.alt"
                class="w-full h-full object-cover block grayscale contrast-[1.05]"
                width="80"
                height="80"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-primary mix-blend-multiply opacity-[0.55]"></div>
            </div>
            <div class="relative z-[1]">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-highlight-ink mb-1.5">
                Stimme
              </p>
              <h3 class="font-serif text-[26px] leading-[1.15] font-normal text-ink">
                {{ testimonial.firstName }} {{ testimonial.lastName }}
              </h3>
              <p class="text-[13px] text-ink-soft mt-1">
                {{ testimonial.company
                  ? `${testimonial.jobTitle} @ ${testimonial.company}`
                  : testimonial.jobTitle }}
              </p>
            </div>
            <svg
              class="absolute right-7 -bottom-[18px] text-highlight opacity-[0.22]"
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M4 17.5c0-4.6 2-8.4 6-10.5l1 1.6c-2.3 1.4-3.4 3.2-3.6 5.2H10V20H4v-2.5zm10 0c0-4.6 2-8.4 6-10.5l1 1.6c-2.3 1.4-3.4 3.2-3.6 5.2H20V20h-6v-2.5z"
              />
            </svg>
          </div>

          <!-- Modal Content -->
          <div class="p-8 space-y-8">
            <!-- Review -->
            <p class="font-serif italic text-xl leading-[1.55] text-ink whitespace-pre-line">
              „{{ testimonial.reviewText.trim() }}“
            </p>

            <!-- Bio Section -->
            <div v-if="testimonial.bio" class="prose prose-lg max-w-none">
              <div class="bg-paper rounded-sm p-8 leading-relaxed max-h-[40vh] overflow-y-auto modal-bio-container">
                <p class="text-ink-soft text-lg">{{ testimonial.bio }}</p>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-center p-6 border-t border-rule">
            <a
              :href="testimonial.projectLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center text-primary bg-primary/10 hover:bg-primary/20 font-medium rounded-sm px-6 py-3 text-center focus:ring-2 focus:outline-none focus:ring-primary transition-colors duration-200"
            >
              Mehr zu {{ testimonial.firstName }} {{ testimonial.lastName }}
              <svg
                class="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </dialog>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useModal } from '../composables/useModal';
import type { Testimonial } from '../types/testimonial';

interface Props {
  testimonial: Testimonial;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const { close } = useModal();
const dialogRef = ref<HTMLDialogElement | null>(null);

const handleClose = () => {
  close();
  emit('close');
};

watch(() => props.isOpen, (isOpen) => {
  if (isOpen && dialogRef.value) {
    dialogRef.value.showModal();
  } else if (dialogRef.value) {
    dialogRef.value.close();
  }
});
</script>

<style scoped>
dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-bio-container::-webkit-scrollbar {
  width: 6px;
}

.modal-bio-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.modal-bio-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.modal-bio-container::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>
