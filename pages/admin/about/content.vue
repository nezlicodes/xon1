<template>
  <div class="pt-3 px-4 sm:p-6">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl md:text-2xl font-medium text-gray-900">
          About Page Content
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          Gérez les sections Features et Certifications (multilingue)
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mt-6 border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="activeTab = 'features'"
          :class="[
            activeTab === 'features'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
          ]"
        >
          Features
        </button>
        <button
          @click="activeTab = 'certifications'"
          :class="[
            activeTab === 'certifications'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
          ]"
        >
          Certifications
        </button>
      </nav>
    </div>

    <!-- Features Tab -->
    <div v-show="activeTab === 'features'" class="mt-6">
      <!-- Features Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-medium text-gray-900">Section Features</h2>
        <button
          @click="addFeature"
          :disabled="isLoading"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Ajouter Feature
        </button>
      </div>

      <!-- Feature Image -->
      <div class="bg-white shadow sm:rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
            Image de la section
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                URL de l'image
              </label>
              <input
                v-model="featuresSection.image_url"
                type="url"
                :disabled="isLoading"
                placeholder="https://example.com/image.jpg"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div v-if="featuresSection.image_url" class="mt-4">
              <NuxtImg
                :src="featuresSection.image_url"
                alt="Feature image preview"
                class="h-48 w-auto object-cover rounded-lg shadow-md"
              />
            </div>
            <div>
              <button
                @click="saveFeatureImage"
                :disabled="isLoading"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Enregistrer l'image
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Features List -->
      <div class="bg-white shadow sm:rounded-lg">
        <ul role="list" class="divide-y divide-gray-200">
          <li
            v-for="(feature, index) in features"
            :key="index"
            class="px-4 py-4 sm:px-6 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">
                  {{ feature.number }} - {{ feature.title_fr || 'Sans titre' }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  {{ feature.description_fr?.substring(0, 100) }}...
                </p>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editFeature(index)"
                  class="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  Modifier
                </button>
                <button
                  @click="deleteFeature(index)"
                  class="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Certifications Tab -->
    <div v-show="activeTab === 'certifications'" class="mt-6">
      <!-- Certifications Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-medium text-gray-900">Section Certifications</h2>
        <button
          @click="addCertification"
          :disabled="isLoading"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Ajouter Certification
        </button>
      </div>

      <!-- Certifications List -->
      <div class="bg-white shadow sm:rounded-lg">
        <ul role="list" class="divide-y divide-gray-200">
          <li
            v-for="(cert, index) in certifications"
            :key="index"
            class="px-4 py-4 sm:px-6 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4 flex-1">
                <div class="flex-shrink-0">
                  <NuxtImg
                    v-if="cert.logo_url"
                    :src="cert.logo_url"
                    alt="Logo"
                    class="h-12 w-12 rounded-full object-contain bg-white border border-gray-200"
                  />
                  <div
                    v-else
                    class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <span class="text-gray-400 text-xs">Logo</span>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">
                    {{ cert.title_fr || 'Sans titre' }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ cert.description_fr?.substring(0, 100) }}...
                  </p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editCertification(index)"
                  class="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  Modifier
                </button>
                <button
                  @click="deleteCertification(index)"
                  class="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Feature/Certification Edit Modal -->
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
          <form @submit.prevent="saveItem">
            <!-- Language Tabs -->
            <div class="border-b border-gray-200 mb-6">
              <nav class="-mb-px flex space-x-8">
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

            <div class="space-y-6">
              <!-- Feature specific fields -->
              <div v-if="modalType === 'feature'" class="space-y-4">
                <div v-if="currentLanguage === 'fr'">
                  <label class="block text-sm font-medium text-gray-700">
                    Numéro
                  </label>
                  <input
                    v-model="currentItem.number"
                    type="text"
                    required
                    placeholder="01"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <!-- Certification specific fields -->
              <div v-if="modalType === 'certification'" class="space-y-4">
                <div v-if="currentLanguage === 'fr'">
                  <label class="block text-sm font-medium text-gray-700">
                    URL du logo
                  </label>
                  <input
                    v-model="currentItem.logo_url"
                    type="url"
                    placeholder="/certifications/logo.png"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <div v-if="currentItem.logo_url" class="mt-2">
                    <NuxtImg
                      :src="currentItem.logo_url"
                      alt="Logo preview"
                      class="h-16 w-16 object-contain rounded-full bg-white border border-gray-200"
                    />
                  </div>
                </div>
              </div>

              <!-- Common fields -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Titre ({{ getCurrentLanguageName() }})
                </label>
                <input
                  v-model="currentItem[`title_${currentLanguage}`]"
                  type="text"
                  :required="currentLanguage === 'fr'"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Description ({{ getCurrentLanguageName() }})
                </label>
                <textarea
                  v-model="currentItem[`description_${currentLanguage}`]"
                  rows="4"
                  :required="currentLanguage === 'fr'"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                ></textarea>
              </div>
            </div>

            <div
              class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
            >
              <button
                type="submit"
                :disabled="isLoading"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm disabled:opacity-50"
              >
                Enregistrer
              </button>
              <button
                type="button"
                :disabled="isLoading"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                @click="closeModal"
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
const activeTab = ref('features');
const isLoading = ref(false);
const showModal = ref(false);
const modalType = ref('feature'); // 'feature' or 'certification'
const currentItem = ref({});
const editingIndex = ref(-1);

// Data
const featuresSection = ref({
  id: null,
  image_url: '',
  additional_data: { features: [] }
});

const certificationsSection = ref({
  id: null,
  additional_data: { certifications: [] }
});

const features = computed(() => featuresSection.value.additional_data?.features || []);
const certifications = computed(() => certificationsSection.value.additional_data?.certifications || []);

// Helper functions
const getCurrentLanguageName = () => {
  return languages.find(l => l.code === currentLanguage.value)?.name || '';
};

// Fetch data
const fetchData = async () => {
  isLoading.value = true;
  try {
    // Fetch features section
    const { data: featuresData, error: featuresError } = await supabase
      .from('about_us_sections')
      .select('*')
      .eq('section_key', 'about_features')
      .single();

    if (featuresError && featuresError.code !== 'PGRST116') throw featuresError;
    if (featuresData) {
      featuresSection.value = featuresData;
    }

    // Fetch certifications section
    const { data: certsData, error: certsError } = await supabase
      .from('about_us_sections')
      .select('*')
      .eq('section_key', 'about_certifications')
      .single();

    if (certsError && certsError.code !== 'PGRST116') throw certsError;
    if (certsData) {
      certificationsSection.value = certsData;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    showError('Impossible de charger les données');
  } finally {
    isLoading.value = false;
  }
};

// Feature Image
const saveFeatureImage = async () => {
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from('about_us_sections')
      .update({
        image_url: featuresSection.value.image_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', featuresSection.value.id);

    if (error) throw error;
    showSuccess('Image enregistrée avec succès');
  } catch (error) {
    console.error('Error saving image:', error);
    showError('Impossible de sauvegarder l\'image');
  } finally {
    isLoading.value = false;
  }
};

// Feature CRUD
const addFeature = () => {
  modalType.value = 'feature';
  currentItem.value = {
    number: '',
    title_fr: '',
    title_en: '',
    title_ar: '',
    description_fr: '',
    description_en: '',
    description_ar: ''
  };
  editingIndex.value = -1;
  currentLanguage.value = 'fr';
  showModal.value = true;
};

const editFeature = (index) => {
  modalType.value = 'feature';
  currentItem.value = { ...features.value[index] };
  editingIndex.value = index;
  currentLanguage.value = 'fr';
  showModal.value = true;
};

const deleteFeature = (index) => {
  showConfirmation({
    title: 'Supprimer feature',
    message: 'Êtes-vous sûr de vouloir supprimer ce feature?',
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    onConfirm: async () => {
      isLoading.value = true;
      try {
        const newFeatures = features.value.filter((_, i) => i !== index);
        const { error } = await supabase
          .from('about_us_sections')
          .update({
            additional_data: { features: newFeatures },
            updated_at: new Date().toISOString()
          })
          .eq('id', featuresSection.value.id);

        if (error) throw error;
        await fetchData();
        showSuccess('Feature supprimé avec succès');
      } catch (error) {
        console.error('Error deleting feature:', error);
        showError('Impossible de supprimer le feature');
      } finally {
        isLoading.value = false;
      }
    }
  });
};

// Certification CRUD
const addCertification = () => {
  modalType.value = 'certification';
  currentItem.value = {
    logo_url: '',
    title_fr: '',
    title_en: '',
    title_ar: '',
    description_fr: '',
    description_en: '',
    description_ar: ''
  };
  editingIndex.value = -1;
  currentLanguage.value = 'fr';
  showModal.value = true;
};

const editCertification = (index) => {
  modalType.value = 'certification';
  currentItem.value = { ...certifications.value[index] };
  editingIndex.value = index;
  currentLanguage.value = 'fr';
  showModal.value = true;
};

const deleteCertification = (index) => {
  showConfirmation({
    title: 'Supprimer certification',
    message: 'Êtes-vous sûr de vouloir supprimer cette certification?',
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    onConfirm: async () => {
      isLoading.value = true;
      try {
        const newCerts = certifications.value.filter((_, i) => i !== index);
        const { error } = await supabase
          .from('about_us_sections')
          .update({
            additional_data: { certifications: newCerts },
            updated_at: new Date().toISOString()
          })
          .eq('id', certificationsSection.value.id);

        if (error) throw error;
        await fetchData();
        showSuccess('Certification supprimée avec succès');
      } catch (error) {
        console.error('Error deleting certification:', error);
        showError('Impossible de supprimer la certification');
      } finally {
        isLoading.value = false;
      }
    }
  });
};

// Save item
const saveItem = async () => {
  isLoading.value = true;
  try {
    if (modalType.value === 'feature') {
      const newFeatures = [...features.value];
      if (editingIndex.value >= 0) {
        newFeatures[editingIndex.value] = currentItem.value;
      } else {
        newFeatures.push(currentItem.value);
      }

      const { error } = await supabase
        .from('about_us_sections')
        .update({
          additional_data: { features: newFeatures },
          updated_at: new Date().toISOString()
        })
        .eq('id', featuresSection.value.id);

      if (error) throw error;
    } else {
      const newCerts = [...certifications.value];
      if (editingIndex.value >= 0) {
        newCerts[editingIndex.value] = currentItem.value;
      } else {
        newCerts.push(currentItem.value);
      }

      const { error } = await supabase
        .from('about_us_sections')
        .update({
          additional_data: { certifications: newCerts },
          updated_at: new Date().toISOString()
        })
        .eq('id', certificationsSection.value.id);

      if (error) throw error;
    }

    await fetchData();
    showModal.value = false;
    showSuccess(
      editingIndex.value >= 0
        ? 'Mise à jour réussie'
        : 'Ajout réussi'
    );
  } catch (error) {
    console.error('Error saving item:', error);
    showError('Impossible de sauvegarder');
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;
  currentLanguage.value = 'fr';
};

// Initial fetch
onMounted(fetchData);

useHead({
  title: 'About Content',
  meta: [
    {
      name: 'description',
      content: 'Gérez les sections Features et Certifications'
    }
  ]
});
</script>