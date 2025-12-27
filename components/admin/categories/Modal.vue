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
        @click="close"
      ></div>

      <div
        class="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 sm:align-middle"
      >
        <form @submit.prevent="saveCategory" @keydown.enter="handleEnterKey">
          <div>
            <!-- Language Tabs -->
            <div class="border-b border-gray-200 mb-6">
              <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  type="button"
                  @click="currentLanguage = lang.code"
                  :class="[
                    currentLanguage === lang.code
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
                  ]"
                >
                  <span>{{ lang.flag }}</span>
                  <span>{{ lang.name }}</span>
                  <span v-if="lang.code === 'en'" class="ml-1 text-red-500">*</span>
                </button>
              </nav>
            </div>

            <div class="space-y-6">
              <!-- Media Upload (Image or Video) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Média de la catégorie
                </label>
                
                <!-- Media Type Selector -->
                <div class="flex gap-4 mb-4">
                  <label class="inline-flex items-center">
                    <input
                      v-model="localForm.media_type"
                      type="radio"
                      value="image"
                      :disabled="props.isLoading"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-900">📸 Image</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input
                      v-model="localForm.media_type"
                      type="radio"
                      value="video"
                      :disabled="props.isLoading"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-900">🎥 Vidéo</span>
                  </label>
                </div>

                <!-- Image Upload -->
                <div v-if="localForm.media_type === 'image'" class="flex items-center gap-4">
                  <div class="relative h-20 w-20">
                    <NuxtImg
                      v-if="props.form.image_url && !props.imageLoading"
                      :src="props.form.image_url"
                      class="h-20 w-20 rounded-lg object-cover"
                      alt="Image de catégorie"
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
                        @click="props.form.image_url = ''; localForm.image_url = ''"
                        class="ml-2 text-sm text-red-600 hover:text-red-500"
                        :disabled="props.imageLoading"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Video Upload -->
                <div v-if="localForm.media_type === 'video'">
                  <div v-if="localForm.video_url" class="mb-4">
                    <video
                      :src="localForm.video_url"
                      class="w-full max-h-48 rounded-lg object-cover"
                      controls
                      preload="metadata"
                    >
                      Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                    <button
                      type="button"
                      @click="removeVideo"
                      class="mt-2 text-sm text-red-600 hover:text-red-500"
                      :disabled="props.videoLoading"
                    >
                      Supprimer la vidéo
                    </button>
                  </div>
                  <div v-else>
                    <label
                      :class="[
                        'inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50',
                        props.videoLoading
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer',
                      ]"
                    >
                      <span v-if="!props.videoLoading">Télécharger une vidéo</span>
                      <span v-else class="flex items-center">
                        <svg
                          class="animate-spin h-4 w-4 mr-2 text-blue-600"
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
                        Chargement...
                      </span>
                      <input
                        type="file"
                        class="hidden"
                        accept="video/*"
                        @change="handleVideoUpload"
                        :disabled="props.videoLoading"
                      />
                    </label>
                    <p class="mt-1 text-xs text-gray-500">
                      Formats acceptés: MP4, WebM, MOV. Taille maximale: 50MB
                    </p>
                  </div>
                </div>
              </div>

              <!-- Name (per language) -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Nom ({{ getCurrentLanguageName() }})
                  <span v-if="currentLanguage === 'en'" class="text-red-500">*</span>
                </label>
                <input
                  v-model="localForm.name_translations[currentLanguage]"
                  type="text"
                  :required="currentLanguage === 'en'"
                  :disabled="props.isLoading"
                  @input="handleNameInput"
                  @keydown.enter.prevent
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  :placeholder="getPlaceholder('name')"
                />
                <p class="mt-1 text-xs text-gray-500">
                  {{ currentLanguage === 'en' ? 'Requis - utilisé pour générer le slug' : 'Optionnel - laissez vide pour utiliser la version anglaise' }}
                </p>
              </div>

              <!-- Slug (shared, auto-generated from EN name) -->
              <div v-if="currentLanguage === 'en'">
                <label class="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <div class="mt-1 flex rounded-md shadow-sm">
                  <input
                    v-model="localForm.slug"
                    type="text"
                    required
                    :disabled="props.isLoading"
                    @input="handleSlugInput"
                    @keydown.enter.prevent
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
                  URL unique de la catégorie, générée automatiquement à partir du nom anglais
                </p>
              </div>

              <!-- Description (per language) -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Description ({{ getCurrentLanguageName() }})
                </label>
                <ClientOnly>
                  <PluginsRichText
                    v-model:content="localForm.description_translations[currentLanguage]"
                    :readonly="props.isLoading"
                    :placeholder="getPlaceholder('description')"
                  />
                  <template #fallback>
                    <div
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-24 bg-gray-50 flex items-center justify-center text-gray-400 text-sm"
                    >
                      Chargement de l'éditeur...
                    </div>
                  </template>
                </ClientOnly>
                <p class="mt-1 text-xs text-gray-500">
                  {{ currentLanguage === 'en' ? 'Optionnel' : 'Optionnel - laissez vide pour utiliser la version anglaise' }}
                </p>
              </div>

              <!-- Settings (shown only on EN tab) -->
              <div v-if="currentLanguage === 'en'" class="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label class="inline-flex items-center">
                    <input
                      v-model="localForm.is_active"
                      type="checkbox"
                      :disabled="props.isLoading"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed"
                    />
                    <span class="ml-2 text-sm text-gray-900">Actif</span>
                  </label>
                </div>
                <div>
                  <label class="inline-flex items-center">
                    <input
                      v-model="localForm.is_featured"
                      type="checkbox"
                      :disabled="props.isLoading"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed"
                    />
                    <span class="ml-2 text-sm text-gray-900">En vedette</span>
                  </label>
                  <p class="ml-6 text-xs text-gray-500">
                    Les catégories en vedette apparaissent sur la page d'accueil
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div
            class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
          >
            <button
              type="submit"
              :disabled="
                props.isLoading ||
                props.videoLoading ||
                isCheckingSlug ||
                isSlugUnique === false ||
                !!slugError ||
                !localForm.name_translations.en
              "
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
                  : "Créer la catégorie"
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
import { ref, watch, onMounted, computed } from "vue";

const props = defineProps({
  category: {
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
      video_url: "",
      media_type: "image",
      is_active: true,
      is_featured: false,
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
  videoLoading: {
    type: Boolean,
    default: false,
  },
  showModal: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "save",
  "close",
  "handleImageUpload",
  "handleVideoUpload",
  "checkSlug"
]);

// Language management - English first and default
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇩🇿' },
];

const currentLanguage = ref('en');

// Local form with translation structure
const localForm = ref({
  id: null,
  name_translations: {
    en: '',
    fr: '',
    ar: ''
  },
  slug: '',
  description_translations: {
    en: '',
    fr: '',
    ar: ''
  },
  image_url: '',
  video_url: '',
  media_type: 'image',
  is_active: true,
  is_featured: false
});

// Slug validation states
const isSlugUnique = ref(null);
const isCheckingSlug = ref(false);
const slugError = ref("");
const slugManuallyEdited = ref(false);

// Helper functions
const getCurrentLanguageName = () => {
  return languages.find(l => l.code === currentLanguage.value)?.name || '';
};

const getPlaceholder = (field) => {
  if (currentLanguage.value === 'en') return '';
  
  const enValue = field === 'name' 
    ? localForm.value.name_translations.en 
    : localForm.value.description_translations.en;
    
  return enValue || `Entrez ${field === 'name' ? 'le nom' : 'la description'} en ${getCurrentLanguageName()}`;
};

// Slug functions
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const makeSlugUnique = (baseSlug) => {
  const timestamp = Date.now().toString(36).substring(-4);
  return `${baseSlug}-${timestamp}`;
};

const validateSlug = (slug) => {
  if (!slug) {
    slugError.value = "Le slug est requis";
    return false;
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    slugError.value =
      "Format de slug invalide (utilisez uniquement des lettres, chiffres et tirets)";
    return false;
  }
  slugError.value = "";
  return true;
};

const checkSlugUniqueness = async (slug) => {
  if (!validateSlug(slug)) return;

  isCheckingSlug.value = true;

  emit("checkSlug", {
    slug,
    callback: (isUnique) => {
      isSlugUnique.value = isUnique;
      isCheckingSlug.value = false;

      if (!isUnique && !slugManuallyEdited.value) {
        localForm.value.slug = makeSlugUnique(slug);
        checkSlugUniqueness(localForm.value.slug);
      }
    },
  });
};

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

// Event handlers
const handleEnterKey = (event) => {
  // Allow Enter on submit button
  if (event.target.type === 'submit') {
    return;
  }
  // Prevent Enter on all other elements
  event.preventDefault();
};

const handleNameInput = () => {
  if (!slugManuallyEdited.value && currentLanguage.value === 'en') {
    const newSlug = slugify(localForm.value.name_translations.en);
    localForm.value.slug = newSlug;
    debouncedCheckSlug(newSlug);
  }
};

const handleSlugInput = () => {
  slugManuallyEdited.value = true;
  debouncedCheckSlug(localForm.value.slug);
};

const saveCategory = () => {
  if (isCheckingSlug.value || isSlugUnique.value === false || slugError.value) {
    return;
  }
  
  // Sync localForm to props.form before saving
  props.form.name_translations = { ...localForm.value.name_translations };
  props.form.description_translations = { ...localForm.value.description_translations };
  props.form.slug = localForm.value.slug;
  props.form.image_url = localForm.value.image_url;
  props.form.video_url = localForm.value.video_url;
  props.form.media_type = localForm.value.media_type;
  props.form.is_active = localForm.value.is_active;
  props.form.is_featured = localForm.value.is_featured;
  
  emit("save");
};

const handleImageUpload = (event) => {
  emit("handleImageUpload", event);
};

const handleVideoUpload = (event) => {
  emit("handleVideoUpload", event);
};

const removeVideo = () => {
  localForm.value.video_url = '';
  props.form.video_url = '';
};

const close = () => {
  isSlugUnique.value = null;
  slugError.value = "";
  slugManuallyEdited.value = false;
  currentLanguage.value = 'en';
  emit("close");
};

// Initialize form from props
const initializeForm = () => {
  if (props.form.id) {
    // Editing existing category
    localForm.value = {
      id: props.form.id,
      name_translations: props.form.name_translations || { en: '', fr: '', ar: '' },
      slug: props.form.slug || '',
      description_translations: props.form.description_translations || { en: '', fr: '', ar: '' },
      image_url: props.form.image_url || '',
      video_url: props.form.video_url || '',
      media_type: props.form.media_type || (props.form.video_url ? 'video' : 'image'),
      is_active: props.form.is_active ?? true,
      is_featured: props.form.is_featured ?? false
    };
  } else {
    // Creating new category
    localForm.value = {
      id: null,
      name_translations: { en: '', fr: '', ar: '' },
      slug: '',
      description_translations: { en: '', fr: '', ar: '' },
      image_url: '',
      video_url: '',
      media_type: 'image',
      is_active: true,
      is_featured: false
    };
  }
};

// Watch for modal opening
watch(
  () => props.showModal,
  (isVisible) => {
    if (isVisible) {
      initializeForm();
      currentLanguage.value = 'en';
      
      if (localForm.value.slug) {
        validateSlug(localForm.value.slug);
        debouncedCheckSlug(localForm.value.slug);
      }
    }
  }
);

// Watch for image_url changes from parent (after upload)
watch(
  () => props.form.image_url,
  (newUrl) => {
    if (newUrl !== localForm.value.image_url) {
      localForm.value.image_url = newUrl;
    }
  }
);

// Watch for video_url changes from parent (after upload)
watch(
  () => props.form.video_url,
  (newUrl) => {
    if (newUrl !== localForm.value.video_url) {
      localForm.value.video_url = newUrl;
    }
  }
);

onMounted(() => {
  if (props.showModal) {
    initializeForm();
  }
});
</script>

<style lang="scss" scoped>
</style>
