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
        class="max-w-2xl w-full bg-white rounded-lg shadow-xl m-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto p-0"
      >
        <div class="relative">
          <!-- Close button -->
          <button
            type="button"
            class="absolute right-4 top-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center"
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

          <!-- Modal Content -->
          <div class="p-8 space-y-8">
            <!-- Centered Header -->
            <div class="flex flex-col items-center text-center space-y-4">
              <img
                :src="testimonial.portraitImage.src"
                :alt="testimonial.portraitImage.alt"
                class="w-28 h-28 rounded-full object-cover shadow-lg"
                width="112"
                height="112"
              />
              <div class="space-y-3">
                <h3 class="font-display text-2xl font-bold text-gray-900 tracking-tight">
                  {{ testimonial.firstName }} {{ testimonial.lastName }}
                </h3>
                <p class="text-lg text-gray-600 font-medium">
                  {{ testimonial.company
                    ? `${testimonial.jobTitle} @ ${testimonial.company}`
                    : testimonial.jobTitle }}
                </p>
              </div>
            </div>

            <!-- Bio Section -->
            <div v-if="testimonial.bio" class="prose prose-lg max-w-none">
              <div class="bg-gray-50 rounded-xl p-8 leading-relaxed max-h-[40vh] overflow-y-auto modal-bio-container">
                <p class="text-gray-700 text-lg">{{ testimonial.bio }}</p>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-center p-6 border-t border-gray-100">
            <a
              :href="testimonial.projectLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center text-primary bg-primary-light/10 hover:bg-primary-light/20 font-medium rounded-lg px-6 py-3 text-center focus:ring-4 focus:outline-none focus:ring-blue-300 transition-all duration-200"
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
