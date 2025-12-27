<template>
  <div
    v-if="props.showModal"
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
        @click="props.showModal = false"
      ></div>

      <div
        class="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
      >
        <form @submit.prevent="saveCollection">
          <div>
            <div class="space-y-6">
              <!-- Image Upload -->
              <div>
                <div class="flex items-center gap-4">
                  <div class="relative h-20 w-20">
                    <NuxtImg
                      v-if="props.form.image_url && !props.imageLoading"
                      :src="props.form.image_url"
                      class="h-20 w-20 rounded-lg object-cover"
                      alt="Image de collection"
                    />
                    <div
                      v-if="props.imageLoading"
                      class="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center"
                    >
                      <svg
                        class="animate-spin h-6 w-6 text-blue-600"
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
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Image de la collection
                    </label>
                    <div class="mt-1 flex items-center">
                      <label
                        :class="[
                          'inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50',
                          props.imageLoading
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer',
                        ]"
                      >
                        <span>Télécharger une image</span>
                        <input
                          type="file"
                          class="hidden"
                          accept="image/*"
                          @change="handleImageUpload"
                          :disabled="props.imageLoading"
                        />
                      </label>
                      <button
                        v-if="props.form.image_url"
                        type="button"
                        @click="props.form.image_url = ''"
                        class="ml-2 text-sm text-red-600 hover:text-red-500"
                        :disabled="props.imageLoading"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  v-model="props.form.name"
                  type="text"
                  required
                  :disabled="props.isLoading"
                  @input="handleNameInput"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <div class="mt-1 flex rounded-md shadow-sm">
                  <input
                    v-model="props.form.slug"
                    type="text"
                    required
                    :disabled="props.isLoading"
                    @input="handleSlugInput"
                    class="block w-full rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    :class="{ 'border-red-300': slugError }"
                  />
                  <span
                    v-if="isCheckingSlug"
                    class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                  >
                    <svg
                      class="animate-spin h-4 w-4 text-blue-600"
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
                  </span>
                  <span
                    v-else-if="isSlugUnique === false"
                    class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-red-50 text-red-500 text-sm"
                  >
                    Utilisé
                  </span>
                  <span
                    v-else-if="isSlugUnique === true"
                    class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-green-50 text-green-500 text-sm"
                  >
                    Disponible
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                  >
                    Slug
                  </span>
                </div>
                <p v-if="slugError" class="mt-1 text-sm text-red-600">
                  {{ slugError }}
                </p>
                <p v-else class="mt-1 text-xs text-gray-500">
                  URL unique de la collection, générée automatiquement à partir du nom
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <ClientOnly>
                  <PluginsRichText
                    v-model:content="props.form.description"
                    :readonly="props.isLoading"
                    placeholder="Entrez la description de la catégorie..."
                 
                  />
                  <template #fallback>
                    <div
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-24 bg-gray-50 flex items-center justify-center text-gray-400 text-sm"
                    >
                      Chargement de l'éditeur...
                    </div>
                  </template>
                </ClientOnly>
              </div>

              <div>
                <label class="inline-flex items-center">
                  <input
                    v-model="props.form.is_active"
                    type="checkbox"
                    :disabled="props.isLoading"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                  <span class="ml-2 text-sm text-gray-900">Actif</span>
                </label>
              </div>
            </div>
          </div>
          <div
            class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
          >
            <button
              type="submit"
              :disabled="props.isLoading || isCheckingSlug || isSlugUnique === false || !!slugError"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="props.isLoading"
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
              {{
                props.form.id
                  ? "Enregistrer les modifications"
                  : "Créer la collection"
              }}
            </button>
            <button
              type="button"
              :disabled="props.isLoading"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              @click="close"
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
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  collection: {
    type: Object,
    default: () => ({}),
  },
  form: {
    type: Object,
    default: () => ({
      name: "",
      slug: "",
      description: "",
      image_url: "",
      is_active: true,
    }),
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  imageLoading: {
    type: Boolean,
    default: false,
  },
  showModal: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["save", "close", "handleImageUpload", "checkSlug"]);

// Added slug validation states
const isSlugUnique = ref(null);
const isCheckingSlug = ref(false);
const slugError = ref('');
const slugManuallyEdited = ref(false);

// Slug functions
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalize special characters (é -> e)
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/[^\w\-]+/g, '') // Remove non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-+/, '') // Trim dashes from start
    .replace(/-+$/, ''); // Trim dashes from end
};

const makeSlugUnique = (baseSlug) => {
  const timestamp = Date.now().toString(36).substring(-4);
  return `${baseSlug}-${timestamp}`;
};

// Check if slug is valid format
const validateSlug = (slug) => {
  if (!slug) {
    slugError.value = 'Le slug est requis';
    return false;
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    slugError.value = 'Format de slug invalide (utilisez uniquement des lettres, chiffres et tirets)';
    return false;
  }
  slugError.value = '';
  return true;
};

// Check if slug is unique in database
const checkSlugUniqueness = async (slug) => {
  if (!validateSlug(slug)) return;
  
  isCheckingSlug.value = true;
  
  try {
    // Here we're emitting an event to the parent to handle the actual database check
    // The parent component should set isSlugUnique when it receives the result
    emit('checkSlug', {
      slug, 
      callback: (isUnique) => {
        isSlugUnique.value = isUnique;
        
        // If slug isn't unique and wasn't manually edited, suggest a unique alternative
        if (!isUnique && !slugManuallyEdited.value) {
          props.form.slug = makeSlugUnique(slug);
          // Check the new slug
          checkSlugUniqueness(props.form.slug);
        }
      }
    });
  } catch (error) {
    console.error('Error checking slug uniqueness:', error);
    isSlugUnique.value = null;
  } finally {
    isCheckingSlug.value = false;
  }
};

// Debounce function for slug checking
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const debouncedCheckSlug = debounce(checkSlugUniqueness, 500);

// Event handlers for inputs
const handleNameInput = () => {
  if (!slugManuallyEdited.value) {
    const newSlug = slugify(props.form.name);
    props.form.slug = newSlug;
    debouncedCheckSlug(newSlug);
  }
};

const handleSlugInput = () => {
  slugManuallyEdited.value = true;
  debouncedCheckSlug(props.form.slug);
};

const saveCollection = () => {
  if (isCheckingSlug.value || isSlugUnique.value === false || slugError.value) {
    return;
  }
  emit("save", props.collection);
};

const handleImageUpload = () => {
  emit("handleImageUpload", event);
};

const close = () => {
  // Reset slug validation state when closing
  isSlugUnique.value = null;
  slugError.value = '';
  slugManuallyEdited.value = false;
  emit("close");
};

// Watch for form changes when modal is shown
watch(() => props.showModal, (isVisible) => {
  if (isVisible && props.form.name && !props.form.slug) {
    // Auto-generate slug from name when modal is opened with name but no slug
    props.form.slug = slugify(props.form.name);
    debouncedCheckSlug(props.form.slug);
  }
});

// Watch slug field for changes
watch(() => props.form.slug, (newSlug) => {
  if (newSlug && !isCheckingSlug.value) {
    validateSlug(newSlug);
  }
});

// Initialize slug check if a slug already exists when component mounts
onMounted(() => {
  if (props.form.slug) {
    validateSlug(props.form.slug);
    debouncedCheckSlug(props.form.slug);
  }
});
</script>

<style lang="scss" scoped>
</style>