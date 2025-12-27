<template>
  <div class="space-y-3">
    <!-- Preview Section with Toggle -->
    <div class="bg-white shadow overflow-hidden relative">
      <!-- Toggle visibility button -->
      <div class="absolute top-4 right-4 z-10 flex gap-2">
        <button
          @click="openFieldEditor('title')"
          class="p-2 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
          title="Modifier le titre"
        >
          <Icon class="h-5 w-5 text-white" name="heroicons-outline:pencil-alt" />
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
          <Icon name="heroicons-outline:shield-check" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Section masquée</h3>
          <p class="mt-1 text-sm text-gray-500">Cliquez sur l'icône d'œil pour afficher</p>
        </div>
      </div>

      <!-- Preview Content -->
      <section v-if="sectionData.is_active" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <div class="relative inline-block">
              <h2 class="text-4xl font-bold text-gray-900 mb-4">{{ currentContent.title }}</h2>
              <button
                @click="openFieldEditor('title')"
                class="absolute -top-3 -right-10 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all"
              >
                <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
              </button>
            </div>
            <p class="text-lg text-gray-600">{{ currentContent.content }}</p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <div v-for="(cert, index) in certifications" :key="index" class="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 relative">
              <!-- Logo -->
              <div class="flex justify-center mb-6">
                <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
                  <NuxtImg
                    v-if="cert.logo_url"
                    :src="cert.logo_url"
                    :alt="cert[`title_${editorLanguage}`]"
                    class="w-16 h-16 object-contain"
                  />
                  <Icon v-else name="heroicons-outline:shield-check" class="w-16 h-16 text-gray-300" />
                </div>
              </div>

              <!-- Title -->
              <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">{{ cert[`title_${editorLanguage}`] }}</h3>

              <!-- Description -->
              <div class="text-gray-600 text-sm leading-relaxed text-justify prose prose-sm" v-html="cert[`description_${editorLanguage}`]"></div>

              <!-- Edit button -->
              <button
                @click="openCertificationEditor(index)"
                class="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <Icon class="w-3 h-3" name="heroicons-outline:pencil-alt" />
              </button>
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
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showEditModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 transform transition-all max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingCertification !== null ? `Modifier la certification ${editingCertification + 1}` : `Modifier ${getFieldLabel(currentField)}` }}
          </h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-500">
            <Icon name="heroicons-outline:x" class="h-5 w-5" />
          </button>
        </div>

        <!-- Section Title/Content fields -->
        <div v-if="editingCertification === null">
          <div v-if="currentField === 'content'">
            <textarea
              v-model="tempFieldValue"
              rows="3"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              ref="fieldInput"
            ></textarea>
          </div>
          <div v-else>
            <input
              v-model="tempFieldValue"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              @keyup.enter="saveFieldValue"
              ref="fieldInput"
            />
          </div>
        </div>

        <!-- Certification fields -->
        <div v-else class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Logo</label>
            <PluginsImageUpload
              v-model="tempCertification.logo_url"
              alt="Certification logo"
              bucket="site"
              folder="about/certifications"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              v-model="tempCertification.title"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="tempCertification.description"
              rows="6"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            ></textarea>
          </div>
        </div>

        <div class="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            @click="showEditModal = false"
          >
            <Icon name="heroicons-outline:x" class="mr-1.5 h-4 w-4" />
            Annuler
          </button>
          <button
            type="button"
            :disabled="saving"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
            @click="saveFieldValue"
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
  section_key: 'about_certifications',
  is_active: true,
  title_translations: {},
  content_translations: {},
  additional_data: { certifications: [] }
});

const loading = ref(true);
const saving = ref(false);
const showEditModal = ref(false);
const currentField = ref('');
const tempFieldValue = ref('');
const fieldInput = ref(null);
const editingCertification = ref(null);
const tempCertification = ref({ logo_url: '', title: '', description: '' });

const currentContent = computed({
  get: () => ({
    title: sectionData.value.title_translations?.[editorLanguage.value] || '',
    content: sectionData.value.content_translations?.[editorLanguage.value] || ''
  }),
  set: (val) => {
    sectionData.value.title_translations[editorLanguage.value] = val.title;
    sectionData.value.content_translations[editorLanguage.value] = val.content;
  }
});

const certifications = computed(() => sectionData.value.additional_data?.certifications || []);

const loadData = async () => {
  loading.value = true;
  try {
    const { data } = await fetchSectionByKey('about_certifications');
    if (data) {
      sectionData.value = {
        section_key: data.section_key,
        is_active: data.is_active,
        title_translations: data.title_translations,
        content_translations: data.content_translations,
        additional_data: data.additional_data || { certifications: [] }
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
        title_translations: sectionData.value.title_translations,
        content_translations: sectionData.value.content_translations,
        additional_data: sectionData.value.additional_data,
        is_active: sectionData.value.is_active
      })
      .eq('section_key', 'about_certifications');

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

const openFieldEditor = (field) => {
  currentField.value = field;
  tempFieldValue.value = currentContent.value[field] || '';
  editingCertification.value = null;
  showEditModal.value = true;

  nextTick(() => {
    if (fieldInput.value) {
      fieldInput.value.focus();
      if (fieldInput.value.select) {
        fieldInput.value.select();
      }
    }
  });
};

const openCertificationEditor = (index) => {
  editingCertification.value = index;
  const cert = certifications.value[index];
  tempCertification.value = {
    logo_url: cert.logo_url || '',
    title: cert[`title_${editorLanguage.value}`] || '',
    description: cert[`description_${editorLanguage.value}`] || ''
  };
  showEditModal.value = true;
};

const saveFieldValue = async () => {
  if (editingCertification.value !== null) {
    // Save certification
    const cert = certifications.value[editingCertification.value];
    cert.logo_url = tempCertification.value.logo_url;
    cert[`title_${editorLanguage.value}`] = tempCertification.value.title;
    cert[`description_${editorLanguage.value}`] = tempCertification.value.description;
  } else {
    // Save section field
    if (currentField.value === 'title') {
      sectionData.value.title_translations[editorLanguage.value] = tempFieldValue.value;
    } else {
      sectionData.value.content_translations[editorLanguage.value] = tempFieldValue.value;
    }
  }

  showEditModal.value = false;
  await save();
};

const getFieldLabel = (field) => {
  const labels = {
    title: 'le titre',
    content: 'le sous-titre',
  };
  return labels[field] || field;
};

onMounted(loadData);
watch(editorLanguage, () => {
  currentContent.value = {
    title: sectionData.value.title_translations?.[editorLanguage.value] || '',
    content: sectionData.value.content_translations?.[editorLanguage.value] || ''
  };
});

defineExpose({ save });
</script>