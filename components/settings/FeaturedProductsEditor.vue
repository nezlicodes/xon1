<template>
  <div class="space-y-3">
    <!-- Prévisualisation de la section Produits avec édition en direct -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg relative">
      <!-- Toggle visibility button -->
      <button
        @click="toggleFeaturedProductsVisibility"
        class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        :title="
          formData.featured_products_visible === 'true'
            ? 'Masquer la section produits populaires'
            : 'Afficher la section produits populaires'
        "
      >
        <Icon
          v-if="formData.featured_products_visible === 'true'"
          class="h-5 w-5 text-gray-700"
          name="heroicons-outline:eye"
        />
        <Icon
          v-else
          class="h-5 w-5 text-gray-700"
          name="heroicons-outline:eye-off"
        />
      </button>

      <!-- Show collapsed placeholder when section is hidden -->
      <div
        v-if="formData.featured_products_visible !== 'true'"
        class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg"
      >
        <div class="text-center">
          <Icon
            name="heroicons-outline:information-circle"
            class="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            Section "Produits populaires" masquée
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Cliquez sur l'icône d'œil pour afficher cette section
          </p>
        </div>
      </div>

      <!-- Content when visible -->
      <div
        v-if="formData.featured_products_visible === 'true'"
        class="relative p-6 bg-background text-mgray"
      >
        <!-- Titre et sous-titre -->
        <div class="mt-12 mb-8 text-center">
          <!-- Titre éditable avec bouton d'édition toujours visible -->
          <div
            class="relative border-2 border-transparent rounded-lg transition-all duration-300 hover:border-blue-400 px-4 py-2"
          >
            <h2 class="text-3xl font-medium text-mgray tracking-tight mb-3">
              {{
                formData.featured_products_title ||
                defaultSectionData.featured_products_title
              }}
            </h2>
            <div
              class="w-24 h-1.5 bg-gradient-to-r from-blue-500/60 via-blue-500 to-blue-500/60 mx-auto mt-4 rounded-full"
            ></div>
            <button
              type="button"
              @click="openFieldEditor('featured_products_title')"
              class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
              title="Modifier le titre"
            >
              <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
            </button>
            <div class="text-xs text-blue-500 opacity-75 mt-1 text-center">
              Cliquez pour modifier le titre
            </div>
          </div>

          <!-- Sous-titre éditable -->
          <div
            class="relative border-2 border-transparent rounded-lg transition-all duration-300 hover:border-blue-400 px-4 py-2 mt-2"
          >
            <p
              v-html="
                formData.featured_products_subtitle ||
                defaultSectionData.featured_products_subtitle
              "
              class="mt-1 text-mgray font-light"
            ></p>
            <button
              type="button"
              @click="openFieldEditor('featured_products_subtitle')"
              class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
              title="Modifier le sous-titre"
            >
              <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
            </button>
            <div class="text-xs text-blue-500 opacity-75 mt-1 text-center">
              Cliquez pour modifier le sous-titre
            </div>
          </div>
        </div>
        <NuxtLink
          to="/admin/products"
          class="pb-2 pt-5 flex items-center justify-end mb-4 gap-2"
        >
          <Icon
            name="heroicons-outline:arrow-left"
            class="text-sm text-blue-600 hover:text-blue-500"
          />
          <span class="text-sm text-blue-600 hover:text-blue-500"
            >Gérer les produits</span
          >
        </NuxtLink>
        <!-- Aperçu simplifié des produits (non éditable) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div v-for="n in 3" :key="`product-preview-${n}`" class="space-y-3">
            <div class="aspect-square rounded-lg bg-gray-200"></div>
            <div class="space-y-2">
              <div class="h-3 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'édition de champ -->
    <div
      v-if="showFieldModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showFieldModal = false"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Modifier {{ getFieldLabel(currentField) }}
          </h3>
          <button
            @click="showFieldModal = false"
            class="text-gray-400 hover:text-gray-500"
          >
            <Icon name="heroicons-outline:x" class="h-5 w-5" />
          </button>
        </div>

        <input
          v-if="currentField === 'featured_products_title'"
          v-model="tempFieldValue"
          type="text"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          @keyup.enter="saveFieldValue"
          ref="fieldInput"
        />

        <ClientOnly v-else-if="currentField === 'featured_products_subtitle'">
          <PluginsRichText v-model:content="tempFieldValue" />
          <template #fallback>
            <div
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-24 bg-gray-50 flex items-center justify-center text-gray-400 text-sm"
            >
              Chargement de l'éditeur...
            </div>
          </template>
        </ClientOnly>

        <div class="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            @click="showFieldModal = false"
          >
            <Icon name="heroicons-outline:x" class="mr-1.5 h-4 w-4" />
            Annuler
          </button>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            @click="saveFieldValue"
          >
            <Icon name="heroicons-outline:check" class="mr-1.5 h-4 w-4" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script setup>
import { ref, computed, nextTick } from "vue";

const props = defineProps({
  formData: Object,
  uploadingFiles: Object,
  uploadErrors: Object,
});

const emit = defineEmits([
  "update:formData",
  "handleImageUpload",
  "removeImage",
]);

// Valeurs par défaut pour la section produits populaires
const defaultSectionData = {
  featured_products_title: "Nos produits populaires",
  featured_products_subtitle:
    "Découvrez notre sélection de produits les plus appréciés",
};

// État des modals
const showFieldModal = ref(false);
const currentField = ref("");
const tempFieldValue = ref("");
const fieldInput = ref(null);

// Fonction pour ouvrir l'éditeur de champ
const openFieldEditor = (field) => {
  currentField.value = field;
  tempFieldValue.value = props.formData[field] || defaultSectionData[field];
  showFieldModal.value = true;

  // Focus sur le champ d'entrée après l'ouverture du modal
  nextTick(() => {
    if (fieldInput.value) {
      fieldInput.value.focus();
      if (fieldInput.value.select) {
        fieldInput.value.select();
      }
    }
  });
};

// Fonction pour enregistrer la valeur du champ
const saveFieldValue = () => {
  emit("update:formData", {
    ...props.formData,
    [currentField.value]: tempFieldValue.value,
  });
  showFieldModal.value = false;
};

// Fonction pour basculer la visibilité de la section produits populaires
const toggleFeaturedProductsVisibility = () => {
  const newVisibility =
    props.formData.featured_products_visible === "true" ? "false" : "true";
  emit("update:formData", {
    ...props.formData,
    featured_products_visible: newVisibility,
  });
};

// Obtenir le libellé du champ
const getFieldLabel = (field) => {
  const labels = {
    featured_products_title: "le titre",
    featured_products_subtitle: "le sous-titre",
  };
  return labels[field] || field;
};
</script>

<style scoped>
/* Animation de pulse lente pour les boutons d'action */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite;
}
</style>