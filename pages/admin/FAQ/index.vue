<template>
  <div class="pt-3 px-4 sm:p-6">
    <!-- En-tête avec boutons d'action -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl md:text-2xl font-medium text-gray-900">
          FAQ - Questions & Réponses
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          Gérez les questions et réponses de votre FAQ (multilingue)
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:flex space-x-2">
        <!-- Bouton de configuration -->
        <button
          @click="openConfigModal()"
          :disabled="isLoading"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Configurer
        </button>

        <!-- Bouton d'ajout -->
        <button
          @click="openModal()"
          :disabled="isLoading"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ajouter une question
        </button>
      </div>
    </div>

    <!-- Status Card -->
    <div class="mt-4 bg-white shadow sm:rounded-lg" v-if="configData">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Configuration de la FAQ
            </h3>
            <div class="mt-2 text-sm text-gray-500">
              <p>{{ configData.faq_enabled ? 'Section activée' : 'Section désactivée' }}</p>
            </div>
          </div>
          <span
            :class="[
              configData.faq_enabled
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800',
              'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
            ]"
          >
            {{ configData.faq_enabled ? "Activé" : "Désactivé" }}
          </span>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div
      class="mt-6 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
    >
      <div class="flex-grow max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une question..."
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <select
          v-model="filterStatus"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="true">Actifs</option>
          <option value="false">Inactifs</option>
        </select>
      </div>
    </div>

    <!-- Tableau -->
    <div class="mt-8 flex flex-col">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div
            class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
          >
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Question (FR)
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Ordre
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Statut
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Langues
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="item in filteredItems" :key="item.id">
                  <td class="px-3 py-4 text-sm text-gray-900 max-w-md">
                    <div class="font-medium truncate">
                      {{ item.question_translations?.fr || 'Sans titre' }}
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ item.display_order || "-" }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      :class="[
                        item.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800',
                        'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                      ]"
                    >
                      {{ item.is_active ? "Actif" : "Inactif" }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div class="flex gap-1">
                      <span v-if="item.question_translations?.fr" class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">FR</span>
                      <span v-if="item.question_translations?.ar" class="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">AR</span>
                      <span v-if="item.question_translations?.en" class="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">EN</span>
                    </div>
                  </td>
                  <td
                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                  >
                    <button
                      @click="openModal(item)"
                      :disabled="isLoading"
                      class="text-blue-600 hover:text-blue-900 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Modifier
                    </button>
                    <button
                      @click="deleteItem(item)"
                      :disabled="isLoading"
                      class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredItems.length === 0">
                  <td
                    colspan="5"
                    class="px-3 py-8 text-sm text-gray-500 text-center"
                  >
                    Aucune question trouvée
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'édition/création avec langues -->
    <div
      v-if="showModal"
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
          @click="showModal = false"
        ></div>

        <div
          class="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6 sm:align-middle"
        >
          <form @submit.prevent="saveItem">
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
                </button>
              </nav>
            </div>

            <div>
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Question ({{ getCurrentLanguageName() }})
                  </label>
                  <input
                    v-model="localForm.question_translations[currentLanguage]"
                    type="text"
                    :required="currentLanguage === 'fr'"
                    :disabled="isLoading"
                    :placeholder="getPlaceholder('question')"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p class="mt-1 text-xs text-gray-500">
                    {{ currentLanguage === 'fr' ? 'Requis' : 'Optionnel - laissez vide pour utiliser la version française' }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Réponse ({{ getCurrentLanguageName() }})
                  </label>
                  <ClientOnly>
                    <PluginsRichText
                      v-model:content="localForm.answer_translations[currentLanguage]"
                      :readonly="isLoading"
                      :placeholder="getPlaceholder('answer')"
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
                    {{ currentLanguage === 'fr' ? 'Optionnel' : 'Optionnel - laissez vide pour utiliser la version française' }}
                  </p>
                </div>

                <!-- Settings (shown only on FR tab) -->
                <div v-if="currentLanguage === 'fr'" class="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Ordre d'affichage
                    </label>
                    <input
                      v-model.number="localForm.display_order"
                      type="number"
                      min="0"
                      :disabled="isLoading"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label class="inline-flex items-center">
                      <input
                        v-model="localForm.is_active"
                        type="checkbox"
                        :disabled="isLoading"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed"
                      />
                      <span class="ml-2 text-sm text-gray-900">Actif</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div
              class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
            >
              <button
                type="submit"
                :disabled="isLoading || !localForm.question_translations.fr"
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
                {{
                  localForm.id
                    ? "Enregistrer les modifications"
                    : "Créer la question"
                }}
              </button>
              <button
                type="button"
                :disabled="isLoading"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                @click="closeModal"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de configuration -->
    <div
      v-if="showConfigModal"
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
          @click="showConfigModal = false"
        ></div>

        <div
          class="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
        >
          <form @submit.prevent="saveConfig">
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
                Configuration de la section FAQ
              </h3>
              <div class="space-y-6">
                <div>
                  <label class="inline-flex items-center">
                    <input
                      v-model="configForm.faq_enabled"
                      type="checkbox"
                      :disabled="isLoading"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed"
                    />
                    <span class="ml-2 text-sm font-medium text-gray-900"
                      >Activer la section FAQ</span
                    >
                  </label>
                  <p class="mt-1 text-xs text-gray-500 ml-6">
                    La section FAQ apparaîtra sur votre site
                  </p>
                </div>
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
                @click="showConfigModal = false"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, computed } from "vue";

const { showConfirmation } = useConfirmationModal();
const { showError } = useErrorModal();
const { showSuccess } = useSuccessSnackbar();

const supabase = useSupabaseClient();

// Language management
const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇩🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

const currentLanguage = ref('fr');

// State
const items = ref([]);
const showModal = ref(false);
const isLoading = ref(false);
const searchQuery = ref("");
const filterStatus = ref("");

// Local form with translation structure
const localForm = ref({
  id: null,
  question_translations: { fr: '', ar: '', en: '' },
  answer_translations: { fr: '', ar: '', en: '' },
  display_order: 0,
  is_active: true,
});

const configData = ref(null);
const showConfigModal = ref(false);
const configForm = ref({
  faq_enabled: true,
});

// Helper functions
const getCurrentLanguageName = () => {
  return languages.find(l => l.code === currentLanguage.value)?.name || '';
};

const getPlaceholder = (field) => {
  if (currentLanguage.value === 'fr') return '';
  
  const frValue = field === 'question' 
    ? localForm.value.question_translations.fr 
    : localForm.value.answer_translations.fr;
    
  return frValue || `Entrez ${field === 'question' ? 'la question' : 'la réponse'} en ${getCurrentLanguageName()}`;
};

// Filtered items
const filteredItems = computed(() => {
  let result = [...items.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(item => {
      const frQuestion = item.question_translations?.fr || '';
      const frAnswer = item.answer_translations?.fr || '';
      return frQuestion.toLowerCase().includes(query) || frAnswer.toLowerCase().includes(query);
    });
  }

  if (filterStatus.value !== "") {
    const isActive = filterStatus.value === "true";
    result = result.filter((item) => item.is_active === isActive);
  }

  return result;
});

// Fetch configuration
const fetchConfig = async () => {
  try {
    const { data, error } = await supabase
      .from("features_config")
      .select("faq_enabled")
      .single();

    if (error && error.code !== "PGRST116") throw error;

    if (data) {
      configData.value = data;
      configForm.value.faq_enabled = data.faq_enabled ?? true;
    }
  } catch (error) {
    console.error("Error loading FAQ config:", error);
    showError("Impossible de charger la configuration");
  }
};

// Save configuration
const saveConfig = async () => {
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("features_config")
      .update({
        faq_enabled: configForm.value.faq_enabled,
        updated_at: new Date().toISOString(),
      })
      .eq('id', configData.value.id);

    if (error) throw error;

    await fetchConfig();
    showConfigModal.value = false;
    showSuccess('Configuration mise à jour');
  } catch (error) {
    console.error("Error saving config:", error);
    showError("Impossible de sauvegarder la configuration");
  } finally {
    isLoading.value = false;
  }
};

// Open configuration modal
const openConfigModal = () => {
  if (configData.value) {
    configForm.value.faq_enabled = configData.value.faq_enabled ?? true;
  }
  showConfigModal.value = true;
};

// Fetch FAQ items
const fetchItems = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("display_order");

    if (error) throw error;

    items.value = data || [];
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    showError("Impossible de charger les questions FAQ");
  } finally {
    isLoading.value = false;
  }
};

// Open modal
const openModal = (item = null) => {
  if (item) {
    localForm.value = {
      id: item.id,
      question_translations: item.question_translations || { fr: '', ar: '', en: '' },
      answer_translations: item.answer_translations || { fr: '', ar: '', en: '' },
      display_order: item.display_order || 0,
      is_active: item.is_active ?? true,
    };
  } else {
    localForm.value = {
      id: null,
      question_translations: { fr: '', ar: '', en: '' },
      answer_translations: { fr: '', ar: '', en: '' },
      display_order: 0,
      is_active: true,
    };
  }
  currentLanguage.value = 'fr';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentLanguage.value = 'fr';
};

// Save FAQ item
const saveItem = async () => {
  isLoading.value = true;
  try {
    const faqData = {
      question_translations: localForm.value.question_translations,
      answer_translations: localForm.value.answer_translations,
      display_order: localForm.value.display_order,
      is_active: localForm.value.is_active,
    };

    const { error } = localForm.value.id
      ? await supabase
          .from("faqs")
          .update(faqData)
          .eq("id", localForm.value.id)
      : await supabase.from("faqs").insert(faqData);

    if (error) throw error;

    showModal.value = false;
    await fetchItems();
    showSuccess(
      localForm.value.id
        ? "Question mise à jour avec succès"
        : "Question créée avec succès"
    );
  } catch (error) {
    console.error("Error saving FAQ:", error);
    showError("Impossible d'enregistrer la question");
  } finally {
    isLoading.value = false;
  }
};

// Delete FAQ item
const deleteItem = async (item) => {
  showConfirmation({
    title: "Supprimer la question",
    message: "Êtes-vous sûr de vouloir supprimer cette question?",
    confirmText: "Supprimer",
    cancelText: "Annuler",
    onConfirm: async () => {
      isLoading.value = true;
      try {
        const { error } = await supabase
          .from("faqs")
          .delete()
          .eq("id", item.id);

        if (error) throw error;

        await fetchItems();
        showSuccess("Question supprimée avec succès");
      } catch (error) {
        console.error("Error deleting FAQ:", error);
        showError("Impossible de supprimer la question");
      } finally {
        isLoading.value = false;
      }
    },
  });
};

// Initial fetch
onMounted(async () => {
  await fetchConfig();
  await fetchItems();
});

useHead({
  title: "Questions FAQ",
  meta: [
    {
      name: "description",
      content: "Gérez les questions et réponses de votre FAQ",
    },
  ],
});
</script>