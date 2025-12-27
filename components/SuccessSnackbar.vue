
<template>
  <Transition
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isVisible"
      class="fixed bottom-4 right-4 z-50 flex items-center max-w-xs sm:max-w-sm w-full p-4 mb-4 text-gray-50 bg-green-500 rounded-lg shadow"
      role="alert"
    >
      <div
        class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg"
      >
        <svg
          class="w-5 h-5 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <div class="ml-3 text-sm font-normal">{{ message }}</div>
      <button
        @click="hide"
        type="button"
        class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
        aria-label="Close"
      >
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  </Transition>
</template>
  
  <script setup>
import { onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    default: 3000,
  },
  autoHide: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close"]);

const hide = () => {
  emit("close");
};

let timeoutId = null;

const setupAutoHide = () => {
  if (props.autoHide && props.isVisible) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      hide();
    }, props.duration);
  }
};

watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal) {
      setupAutoHide();
    } else {
      clearTimeout(timeoutId);
    }
  }
);

onMounted(() => {
  setupAutoHide();
});

onUnmounted(() => {
  clearTimeout(timeoutId);
});
</script>