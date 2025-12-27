<template>
  <div
    v-if="props.showConfigModal"
    class="fixed inset-0 z-10 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="$emit('close')"
      ></div>

      <div
        class="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
      >
        <form @submit.prevent="saveConfig">
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
              Configuration de la section Catégories
            </h3>
            <div class="space-y-6">
              <div>
                <label class="inline-flex items-center">
                  <input
                    v-model="configForm.is_enabled"
                    type="checkbox"
                    :disabled="isLoading"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                  <span class="ml-2 text-sm text-gray-900"
                    >Activer la section Catégories</span
                  >
                </label>
              </div>
              <span
                v-if="configForm.is_enabled"
                class="text-sm text-gray-500"
                >Cette section sera visible sur le site.</span
              >
              <span
                v-else
                class="text-sm text-gray-500"
                >Cette section sera masquée sur le site.</span
              >
            </div>
          </div>
          <div
            class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
          >
            <button
              type="submit"
              :disabled="isLoading"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="isLoading"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Enregistrer la configuration
            </button>
            <button
              type="button"
              :disabled="isLoading"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              @click="$emit('close')"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
    
    <script setup>
import { ref, defineProps, defineEmits, watchEffect } from "vue";

const props = defineProps({
  showConfigModal: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  configData: {
    type: Object,
    default: () => ({
      is_enabled: true,
    }),
  },
});

const emit = defineEmits(["close", "save"]);

const configForm = ref({
  is_enabled: true,
});

// Update form when configData changes
watchEffect(() => {
  if (props.configData) {
    configForm.value = { ...props.configData };
  }
});

const saveConfig = () => {
  emit("save", configForm.value);
};
</script>