
<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform opacity-0 scale-95"
    enter-to-class="transform opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform opacity-100 scale-100"
    leave-to-class="transform opacity-0 scale-95"
  >
    <div
      v-if="isVisible"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop with blur effect -->
      <div
        class="fixed inset-0 bg-mgray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        @click="closeModal"
      ></div>

      <!-- Modal Panel -->
      <div
        class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          @click.stop
        >
          <div class="bg-white px-6 py-6 sm:p-6">
            <div class="sm:flex sm:items-start">
              <!-- Error Icon with subtle animation -->
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-50 sm:mx-0 sm:h-10 sm:w-10"
              >
                <svg
                  class="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  class="text-lg font-medium leading-6 text-mgray-900"
                  id="modal-title"
                >
                  Error
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-mgray-600">
                    {{ errorMessage }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-mgray-50 px-6 py-4 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              @click="closeModal"
              class="inline-flex w-full justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto transition-colors"
              aria-label="Close error message"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
  
<script setup>
const props = defineProps({
  errorMessage: {
    type: String,
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>
