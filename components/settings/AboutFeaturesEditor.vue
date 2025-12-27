<template>
  <div class="space-y-3">
    <!-- Preview Section with Toggle -->
    <div class="bg-white shadow overflow-hidden relative">
      <!-- Toggle visibility and Edit buttons -->
      <div class="absolute top-4 right-4 z-10 flex gap-2">
        <button
          @click="openImageEditor"
          class="p-2 bg-green-600 hover:bg-green-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
          title="Modifier l'image"
        >
          <Icon class="h-5 w-5 text-white" name="heroicons-outline:photograph" />
        </button>
        <button
          @click="toggleVisibility"
          class="p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
          :title="sectionData.is_active ? 'Masquer la section' : 'Afficher la section'"
        >
          <Icon v-if="sectionData.is_active" class="h-5 w-5 text-gray-700" name="heroicons-outline:eye" />
          <Icon v-else class="h-5 w-5 text-gray-700" name="heroicons-outline:eye-off" />
        </button>
      </div>

      <!-- Hidden State -->
      <div v-if="!sectionData.is_active" class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
        <div class="text-center">
          <Icon name="heroicons-outline:lightning-bolt" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Section masquée</h3>
          <p class="mt-1 text-sm text-gray-500">Cliquez sur l'icône d'œil pour afficher</p>
        </div>
      </div>

      <!-- Preview Content -->
      <section v-if="sectionData.is_active" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="relative group">
              <NuxtImg
                :src="sectionData.image_url || 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80'"
                alt="Features"
                class="w-full h-auto object-cover rounded-2xl shadow-2xl"
              />
              <button
                @click="openImageEditor"
                class="absolute top-2 right-2 bg-green-600 hover:bg-green-700 p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <Icon class="w-4 h-4" name="heroicons-outline:photograph" />
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              <div v-for="(feature, index) in features" :key="index" class="flex flex-col relative group">
                <div class="text-5xl font-bold text-gray-900 mb-4">{{ feature.number }}</div>
                <h3 class="text-xl font-bold text-primary-600 mb-3">{{ feature[`title_${editorLanguage}`] }}</h3>
                <div class="text-gray-500 text-sm leading-relaxed prose prose-sm" v-html="feature[`description_${editorLanguage}`]"></div>
                <button
                  @click="openFeatureEditor(index)"
                  class="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Icon class="w-3 h-3" name="heroicons-outline:pencil-alt" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Loading/Saving indicator -->
    <div v-if="loading || saving" class="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
      <Icon name="heroicons-outline:refresh" class="w-4 h-4 animate-spin" />
      <span class="text-sm">{{ loading ? 'Chargement...' : 'Enregistrement...' }}</span>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 transform transition-all max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingImage ? 'Modifier l\'image' : editingFeature !== null ? `Modifier la caractéristique ${editingFeature + 1}` : 'Modifier' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
            <Icon name="heroicons-outline:x" class="h-5 w-5" />
          </button>
        </div>

        <!-- Image Upload Component -->
        <div v-if="editingImage">
          <PluginsImageUpload
            v-model="tempImageUrl"
            alt="Feature image"
            bucket="site"
            folder="about/features"
          />
        </div>

        <!-- Feature fields -->
        <div v-else-if="editingFeature !== null" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Numéro</label>
            <input
              v-model="tempFeature.number"
              type="text"
              placeholder="01"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              v-model="tempFeature.title"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <ClientOnly>
              <PluginsRichText v-model:content="tempFeature.description" :readonly="saving" />
              <template #fallback>
                <div class="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-32 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
                  Chargement...
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>

        <div class="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            @click="closeModal"
          >
            <Icon name="heroicons-outline:x" class="mr-1.5 h-4 w-4" />
            Annuler
          </button>
          <button
            type="button"
            :disabled="saving"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
            @click="editingImage ? saveImageUrl() : saveFieldValue()"
          >
            <Icon
              :name="saving ? 'heroicons-outline:refresh' : 'heroicons-outline:check'"
              class="mr-1.5 h-4 w-4"
              :class="{ 'animate-spin': saving }"
            />
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { fetchSectionByKey } = useAboutUs();
const { editorLanguage } = useEditorLanguage();
const supabase = useSupabaseClient();
const { showError } = useErrorModal();
const { showSuccess } = useSuccessSnackbar();

const sectionData = ref({
  section_key: 'about_features',
  is_active: true,
  image_url: '',
  title_translations: {},
  content_translations: {},
  additional_data: { features: [] }
});

const loading = ref(true);
const saving = ref(false);
const showEditModal = ref(false);
const editingFeature = ref(null);
const editingImage = ref(false);
const tempImageUrl = ref('');
const tempFeature = ref({ number: '', title: '', description: '' });

const features = computed(() => sectionData.value.additional_data?.features || []);

const loadData = async () => {
  loading.value = true;
  try {
    const { data } = await fetchSectionByKey('about_features');
    if (data) {
      sectionData.value = {
        section_key: data.section_key,
        is_active: data.is_active,
        image_url: data.image_url || '',
        title_translations: data.title_translations,
        content_translations: data.content_translations,
        additional_data: data.additional_data || { features: [] }
      };
    }
  } catch (error) {
    console.error('Error loading data:', error);
    showError('Impossible de charger les données');
  } finally {
    loading.value = false;
  }
};

const save = async () => {
  saving.value = true;
  try {
    const { error } = await supabase
      .from('about_us_sections')
      .update({
        image_url: sectionData.value.image_url,
        title_translations: sectionData.value.title_translations,
        content_translations: sectionData.value.content_translations,
        additional_data: sectionData.value.additional_data,
        is_active: sectionData.value.is_active
      })
      .eq('section_key', 'about_features');

    if (error) throw error;
    showSuccess('Modifications enregistrées avec succès');
  } catch (error) {
    console.error('Error saving:', error);
    showError('Erreur lors de l\'enregistrement');
  } finally {
    saving.value = false;
  }
};

const toggleVisibility = async () => {
  sectionData.value.is_active = !sectionData.value.is_active;
  await save();
};

const openImageEditor = () => {
  editingImage.value = true;
  editingFeature.value = null;
  tempImageUrl.value = sectionData.value.image_url || '';
  showEditModal.value = true;
};

const saveImageUrl = async () => {
  sectionData.value.image_url = tempImageUrl.value;
  showEditModal.value = false;
  editingImage.value = false;
  await save();
};

const openFeatureEditor = (index) => {
  editingImage.value = false;
  editingFeature.value = index;
  const feature = features.value[index];
  tempFeature.value = {
    number: feature.number || '',
    title: feature[`title_${editorLanguage.value}`] || '',
    description: feature[`description_${editorLanguage.value}`] || ''
  };
  showEditModal.value = true;
};

const saveFieldValue = async () => {
  if (editingFeature.value !== null) {
    const feature = features.value[editingFeature.value];
    feature.number = tempFeature.value.number;
    feature[`title_${editorLanguage.value}`] = tempFeature.value.title;
    feature[`description_${editorLanguage.value}`] = tempFeature.value.description;
  }

  showEditModal.value = false;
  editingFeature.value = null;
  await save();
};

const closeModal = () => {
  showEditModal.value = false;
  editingImage.value = false;
  editingFeature.value = null;
};

// Watch tempImageUrl to save automatically
watch(tempImageUrl, (newVal) => {
  if (editingImage.value && newVal) {
    sectionData.value.image_url = newVal;
  }
});

onMounted(loadData);

defineExpose({ save });
</script>