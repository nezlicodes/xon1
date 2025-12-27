<template>
  <div class="pt-3 px-4 sm:p-6">
    <!-- En-tête -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl md:text-2xl font-medium text-gray-900">Témoignages</h1>
        <p class="mt-2 text-sm text-gray-700">
          Gérez les témoignages de vos clients (multilingue)
        </p>
      </div>
      
      <!-- Bouton de configuration -->
      <div class="mt-4 sm:mt-0 sm:ml-4 sm:flex-none">
        <button
          @click="openConfigModal()"
          :disabled="isLoading"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed mr-2"
        >
          Configurer
        </button>
      </div>
      
      <!-- Bouton d'ajout -->
      <div class="mt-4 sm:mt-0 sm:ml-2 sm:flex-none">
        <button
          @click="openModal()"
          :disabled="isLoading"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ajouter un témoignage
        </button>
      </div>
    </div>

    <!-- Status Card -->
    <div class="mt-4 bg-white shadow sm:rounded-lg" v-if="configData">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Configuration des Témoignages
            </h3>
            <div class="mt-2 text-sm text-gray-500">
              <p>{{ configData.testimonials_enabled ? 'Section activée' : 'Section désactivée' }}</p>
            </div>
          </div>
          <span
            :class="[
              configData.testimonials_enabled
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800',
              'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
            ]"
          >
            {{ configData.testimonials_enabled ? "Activé" : "Désactivé" }}
          </span>
        </div>
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
                    Client
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Contenu (FR)
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Note
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
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Ordre
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="testimonial in testimonials" :key="testimonial.id">
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    {{ testimonial.customer_name }}
                  </td>
                  <td class="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {{ testimonial.content_translations?.fr || 'Sans contenu' }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div class="flex items-center">
                      <span v-for="i in 5" :key="i">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          class="w-4 h-4"
                          :class="i <= testimonial.rating ? 'text-yellow-400' : 'text-gray-200'"
                        >
                          <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      :class="[
                        testimonial.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800',
                        'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                      ]"
                    >
                      {{ testimonial.is_active ? "Actif" : "Inactif" }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div class="flex gap-1">
                      <span v-if="testimonial.content_translations?.fr" class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">FR</span>
                      <span v-if="testimonial.content_translations?.ar" class="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">AR</span>
                      <span v-if="testimonial.content_translations?.en" class="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">EN</span>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    {{ testimonial.display_order || "-" }}
                  </td>
                  <td
                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                  >
                    <button
                      @click="openModal(testimonial)"
                      :disabled="isLoading"
                      class="text-blue-600 hover:text-blue-900 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Modifier
                    </button>
                    <button
                      @click="deleteTestimonial(testimonial)"
                      :disabled="isLoading"
                      class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
                <tr v-if="testimonials.length === 0">
                  <td colspan="7" class="px-3 py-8 text-sm text-gray-500 text-center">
                    Aucun témoignage disponible
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal avec Language Tabs -->
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
          @click="closeModal"
        ></div>

        <div
          class="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6 sm:align-middle"
        >
          <form @submit.prevent="saveTestimonial">
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
                <!-- Customer Name (shown on all tabs, but only editable on FR) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Nom du client
                  </label>
                  <input
                    v-model="localForm.customer_name"
                    type="text"
                    required
                    :disabled="isLoading || currentLanguage !== 'fr'"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p v-if="currentLanguage !== 'fr'" class="mt-1 text-xs text-gray-500">
                    Modifiable uniquement sur l'onglet Français
                  </p>
                </div>

                <!-- Customer Title (per language) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Titre du client ({{ getCurrentLanguageName() }})
                  </label>
                  <input
                    v-model="localForm.customer_title_translations[currentLanguage]"
                    type="text"
                    :disabled="isLoading"
                    :placeholder="getTitlePlaceholder()"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p class="mt-1 text-xs text-gray-500">
                    {{ currentLanguage === 'fr' ? 'Optionnel' : 'Optionnel - laissez vide pour utiliser la version française' }}
                  </p>
                </div>

                <!-- Content (per language) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Contenu du témoignage ({{ getCurrentLanguageName() }})
                  </label>
                  <textarea
                    v-model="localForm.content_translations[currentLanguage]"
                    rows="4"
                    :required="currentLanguage === 'fr'"
                    :disabled="isLoading"
                    :placeholder="getContentPlaceholder()"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  ></textarea>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ currentLanguage === 'fr' ? 'Requis' : 'Optionnel - laissez vide pour utiliser la version française' }}
                  </p>
                </div>

                <!-- Settings (shown only on FR tab) -->
                <div v-if="currentLanguage === 'fr'" class="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Note (1-5 étoiles)
                    </label>
                    <div class="flex items-center">
                      <button 
                        v-for="i in 5"
                        :key="i"
                        type="button"
                        @click="localForm.rating = i"
                        class="focus:outline-none"
                        :disabled="isLoading"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          class="w-6 h-6"
                          :class="i <= localForm.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'"
                        >
                          <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

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
                :disabled="isLoading || !localForm.content_translations.fr"
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
                    : "Créer le témoignage"
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
                Configuration de la section Témoignages
              </h3>
              <div class="space-y-6">
                <div>
                  <label class="inline-flex items-center">
                    <input
                      v-model="configForm.testimonials_enabled"
                      type="checkbox"
                      :disabled="isLoading"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed"
                    />
                    <span class="ml-2 text-sm font-medium text-gray-900"
                      >Activer la section témoignages</span
                    >
                  </label>
                  <p class="mt-1 text-xs text-gray-500 ml-6">
                    La section témoignages apparaîtra sur votre site
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
const testimonials = ref([]);
const configData = ref(null);
const showModal = ref(false);
const showConfigModal = ref(false);
const isLoading = ref(false);

// Local form with translation structure
const localForm = ref({
  id: null,
  customer_name: '',
  customer_title_translations: { fr: '', ar: '', en: '' },
  content_translations: { fr: '', ar: '', en: '' },
  rating: 5,
  is_active: true,
  display_order: 0,
  image_url: null,
});

const configForm = ref({
  testimonials_enabled: true,
});

// Helper functions
const getCurrentLanguageName = () => {
  return languages.find(l => l.code === currentLanguage.value)?.name || '';
};

const getTitlePlaceholder = () => {
  if (currentLanguage.value === 'fr') return 'Ex: Client Fidèle, Designer...';
  
  const frValue = localForm.value.customer_title_translations.fr;
  return frValue || `Entrez le titre en ${getCurrentLanguageName()}`;
};

const getContentPlaceholder = () => {
  if (currentLanguage.value === 'fr') return 'Entrez le témoignage en français';
  
  const frValue = localForm.value.content_translations.fr;
  return frValue || `Entrez le témoignage en ${getCurrentLanguageName()}`;
};

// Fetch testimonials
const fetchTestimonials = async () => {
  isLoading.value = true;

  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order");

    if (error) throw error;
    testimonials.value = data || [];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    showError("Impossible de charger les témoignages");
  } finally {
    isLoading.value = false;
  }
};

// Fetch configuration
const fetchConfig = async () => {
  try {
    const { data, error } = await supabase
      .from("features_config")
      .select("testimonials_enabled")
      .single();

    if (error && error.code !== "PGRST116") throw error;

    if (data) {
      configData.value = data;
      configForm.value.testimonials_enabled = data.testimonials_enabled ?? true;
    }
  } catch (error) {
    console.error("Error fetching config:", error);
    showError("Impossible de charger la configuration");
  }
};

// Open modal
const openModal = (testimonial = null) => {
  if (testimonial) {
    localForm.value = {
      id: testimonial.id,
      customer_name: testimonial.customer_name,
      customer_title_translations: testimonial.customer_title_translations || { fr: '', ar: '', en: '' },
      content_translations: testimonial.content_translations || { fr: '', ar: '', en: '' },
      rating: testimonial.rating || 5,
      is_active: testimonial.is_active ?? true,
      display_order: testimonial.display_order || 0,
      image_url: testimonial.image_url || null,
    };
  } else {
    localForm.value = {
      id: null,
      customer_name: '',
      customer_title_translations: { fr: '', ar: '', en: '' },
      content_translations: { fr: '', ar: '', en: '' },
      rating: 5,
      is_active: true,
      display_order: 0,
      image_url: null,
    };
  }
  currentLanguage.value = 'fr';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentLanguage.value = 'fr';
};

// Open config modal
const openConfigModal = () => {
  if (configData.value) {
    configForm.value.testimonials_enabled = configData.value.testimonials_enabled ?? true;
  }
  showConfigModal.value = true;
};

// Save testimonial
const saveTestimonial = async () => {
  isLoading.value = true;
  try {
    const testimonialData = {
      customer_name: localForm.value.customer_name,
      customer_title_translations: localForm.value.customer_title_translations,
      content_translations: localForm.value.content_translations,
      rating: localForm.value.rating,
      is_active: localForm.value.is_active,
      display_order: localForm.value.display_order,
      image_url: localForm.value.image_url,
    };

    const { error } = localForm.value.id
      ? await supabase
          .from("testimonials")
          .update(testimonialData)
          .eq("id", localForm.value.id)
      : await supabase.from("testimonials").insert(testimonialData);

    if (error) throw error;

    showModal.value = false;
    await fetchTestimonials();
    showSuccess(
      localForm.value.id
        ? "Témoignage mis à jour avec succès"
        : "Témoignage créé avec succès"
    );
  } catch (error) {
    console.error("Error saving testimonial:", error);
    showError("Impossible d'enregistrer le témoignage");
  } finally {
    isLoading.value = false;
  }
};

// Save configuration
const saveConfig = async () => {
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("features_config")
      .update({
        testimonials_enabled: configForm.value.testimonials_enabled,
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

// Delete testimonial
const deleteTestimonial = async (testimonial) => {
  showConfirmation({
    title: "Supprimer le témoignage",
    message: "Êtes-vous sûr de vouloir supprimer ce témoignage ?",
    confirmText: "Supprimer",
    cancelText: "Annuler",
    onConfirm: async () => {
      isLoading.value = true;
      try {
        const { error } = await supabase
          .from("testimonials")
          .delete()
          .eq("id", testimonial.id);

        if (error) throw error;

        await fetchTestimonials();
        showSuccess("Témoignage supprimé avec succès");
      } catch (error) {
        console.error("Error deleting testimonial:", error);
        showError("Impossible de supprimer le témoignage");
      } finally {
        isLoading.value = false;
      }
    },
  });
};

// Initial fetch
onMounted(async () => {
  await fetchConfig();
  await fetchTestimonials();
});

useHead({
  title: "Gestion des témoignages",
  meta: [
    {
      name: "description",
      content: "Gérez les témoignages de vos clients",
    },
  ],
});
</script>