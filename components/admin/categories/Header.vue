<template>
    <!-- En-tête -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl md:text-2xl font-medium text-gray-900">Catégories</h1>
        <p class="mt-2 text-sm text-gray-700">
          Gérez vos catégories de produits
        </p>
      </div>
      <div class="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <div>
          <!-- Config Button -->
          <button
            @click="openConfigModal"
            :disabled="isLoading"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Configurer la section
          </button>
  
          <!-- Configuration Modal -->
          <AdminCategoriesConfigModal
            :showConfigModal="showConfigModal"
            :isLoading="isLoading"
            :configData="configData"
            @close="closeConfigModal"
            @save="saveConfig"
          />
        </div>
        <button
          @click="openModal()"
          :disabled="isLoading || !isEnabled"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ajouter une catégorie
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    isLoading: {
      type: Boolean,
      default: false,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    showConfigModal: {
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
  
  const emit = defineEmits(["openModal", "saveConfig", "close", "openConfigModal"]);
  
  const openModal = () => {
    emit("openModal");
  };
  
  const openConfigModal = () => {
    emit("openConfigModal");
  };
  
  const saveConfig = (config) => {
    emit("saveConfig", config);
  };
  const closeConfigModal = () => {
    emit("closeConfigModal");
  };
  </script>
  
  <style scoped>
  </style>