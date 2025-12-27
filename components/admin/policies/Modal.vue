<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="$emit('close')"
      ></div>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6"
      >
        <form @submit.prevent="handleSubmit">
          <!-- Header -->
          <div class="mb-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
              {{ form.id ? 'Modifier la politique' : 'Ajouter une politique' }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Remplissez les informations dans toutes les langues disponibles
            </p>
          </div>

          <!-- Language Tabs -->
          <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                v-for="lang in languages"
                :key="lang.code"
                type="button"
                @click="currentLang = lang.code"
                :class="[
                  currentLang === lang.code
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center'
                ]"
              >
                <span :class="lang.flagClass" class="mr-2"></span>
                {{ lang.label }}
                <span
                  v-if="!localForm.title_translations[lang.code] || !localForm.content_translations[lang.code]"
                  class="ml-2 text-xs text-red-500"
                >
                  •
                </span>
              </button>
            </nav>
          </div>

          <div class="space-y-6">
            <!-- Policy Type (only for new policies) -->
            <div v-if="!form.id">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Type de politique *
              </label>
              <select
                v-model="localForm.policy_type"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                @change="generateSlug"
              >
                <option value="">Sélectionner un type</option>
                <option value="shipping">Livraison</option>
                <option value="return">Retour</option>
                <option value="privacy">Confidentialité</option>
                <option value="terms">Conditions d'utilisation</option>
                <option value="warranty">Garantie</option>
                <option value="cookies">Cookies</option>
              </select>
              <p class="mt-1 text-xs text-gray-500">
                Le type ne peut pas être modifié après la création
              </p>
            </div>
            
            <!-- Policy Type (readonly for existing) -->
            <div v-else>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Type de politique
              </label>
              <input
                type="text"
                :value="getPolicyTypeLabel(localForm.policy_type)"
                readonly
                disabled
                class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm cursor-not-allowed"
              />
            </div>

            <!-- Slug -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL) *
              </label>
              <input
                v-model="localForm.slug"
                type="text"
                required
                placeholder="shipping-policy"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                pattern="[a-z0-9-]+"
                @input="validateSlug"
              />
              <p class="mt-1 text-xs text-gray-500">
                Utilisez uniquement des lettres minuscules, chiffres et tirets. Ex: shipping-policy
              </p>
            </div>

            <!-- Title (per language) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Titre ({{ getCurrentLanguageLabel() }}) *
              </label>
              <input
                v-model="localForm.title_translations[currentLang]"
                type="text"
                required
                :placeholder="`Titre en ${getCurrentLanguageLabel()}`"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <!-- Content (per language) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Contenu ({{ getCurrentLanguageLabel() }}) *
              </label>
              <ClientOnly>
                <RichTextEditor
                  v-model="localForm.content_translations[currentLang]"
                  :placeholder="`Contenu de la politique en ${getCurrentLanguageLabel()}...`"
                />
                <template #fallback>
                  <div class="h-48 bg-gray-50 rounded-md flex items-center justify-center">
                    <div class="text-sm text-gray-500">Chargement de l'éditeur...</div>
                  </div>
                </template>
              </ClientOnly>
              <p class="mt-1 text-xs text-gray-500">
                Utilisez l'éditeur pour formater votre texte avec des titres, listes, etc.
              </p>
            </div>

            <!-- Status -->
            <div class="flex items-center">
              <input
                v-model="localForm.is_active"
                id="is_active"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label for="is_active" class="ml-2 block text-sm text-gray-900">
                Politique active (visible sur le site)
              </label>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
            <button
              type="button"
              @click="$emit('close')"
              :disabled="isLoading"
              class="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <svg
                v-if="isLoading"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {{ isLoading ? 'Enregistrement...' : (form.id ? 'Mettre à jour' : 'Créer') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  form: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'save']);

// Language configuration
const languages = [
  { code: 'fr', label: 'Français', flagClass: '🇫🇷' },
  { code: 'en', label: 'English', flagClass: '🇬🇧' },
  { code: 'ar', label: 'العربية', flagClass: '🇩🇿' },
];

// State
const currentLang = ref('fr');
const localForm = ref({
  id: null,
  policy_type: '',
  title_translations: { fr: '', ar: '', en: '' },
  content_translations: { fr: '', ar: '', en: '' },
  slug: '',
  is_active: true,
});

// Watch for prop changes
watch(() => props.form, (newForm) => {
  localForm.value = {
    id: newForm.id,
    policy_type: newForm.policy_type,
    title_translations: { ...newForm.title_translations },
    content_translations: { ...newForm.content_translations },
    slug: newForm.slug,
    is_active: newForm.is_active,
  };
}, { immediate: true, deep: true });

// Get current language label
const getCurrentLanguageLabel = () => {
  const lang = languages.find(l => l.code === currentLang.value);
  return lang ? lang.label : '';
};

// Get policy type label
const getPolicyTypeLabel = (type) => {
  const labels = {
    shipping: 'Livraison',
    return: 'Retour',
    privacy: 'Confidentialité',
    terms: 'Conditions d\'utilisation',
    warranty: 'Garantie',
    cookies: 'Cookies',
  };
  return labels[type] || type;
};

// Generate slug from policy type
const generateSlug = () => {
  if (!localForm.value.id && localForm.value.policy_type && !localForm.value.slug) {
    localForm.value.slug = `${localForm.value.policy_type}-policy`;
  }
};

// Validate slug format
const validateSlug = (event) => {
  let value = event.target.value;
  value = value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  localForm.value.slug = value;
};

// Form validation
const isFormValid = computed(() => {
  if (!localForm.value.policy_type || !localForm.value.slug) {
    return false;
  }

  // At least one language should have title and content
  const hasAtLeastOneComplete = languages.some(lang => 
    localForm.value.title_translations[lang.code]?.trim() &&
    localForm.value.content_translations[lang.code]?.trim()
  );

  return hasAtLeastOneComplete;
});

// Handle form submission
const handleSubmit = () => {
  if (!isFormValid.value) return;
  emit('save', localForm.value);
};

// Reset to French tab when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    currentLang.value = 'fr';
  }
});
</script>
