<template>
  <div class="space-y-3">
    <!-- Preview Section -->
    <div class="bg-white shadow overflow-hidden relative">
      <!-- Toggle and Edit buttons -->
      <div class="absolute top-4 right-4 z-10 flex gap-2">
        <button
          @click="openSectionEditor('mission')"
          class="p-2 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
          title="Modifier la mission"
        >
          <Icon class="h-5 w-5 text-white" name="heroicons-outline:pencil-alt" />
        </button>
      </div>

      <!-- Preview Content -->
      <section class="py-20 bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-8">
            <!-- Mission Card -->
            <div class="group relative bg-white rounded-3xl p-12 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
              <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:scale-150 transition-transform duration-700"></div>

              <div class="relative z-10">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 mb-6 shadow-lg shadow-primary-600/20">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>

                <div class="relative">
                  <h3 class="text-3xl font-bold text-gray-900 mb-4">{{ currentMission.title }}</h3>
                  <div class="text-gray-600 leading-relaxed text-lg prose prose-lg" v-html="currentMission.content"></div>
                  <button
                    @click="openSectionEditor('mission')"
                    class="absolute -top-3 -right-10 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Vision Card -->
            <div class="group relative bg-white rounded-3xl p-12 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
              <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:scale-150 transition-transform duration-700"></div>

              <div class="relative z-10">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 mb-6 shadow-lg shadow-primary-600/20">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </div>

                <div class="relative">
                  <h3 class="text-3xl font-bold text-gray-900 mb-4">{{ currentVision.title }}</h3>
                  <div class="text-gray-600 leading-relaxed text-lg prose prose-lg" v-html="currentVision.content"></div>
                  <button
                    @click="openSectionEditor('vision')"
                    class="absolute -top-3 -right-10 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
                  </button>
                </div>
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
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showEditModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 transform transition-all max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Modifier {{ editingSection === 'mission' ? 'la mission' : 'la vision' }}
          </h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-500">
            <Icon name="heroicons-outline:x" class="h-5 w-5" />
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              v-model="tempSectionData.title"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              ref="titleInput"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
            <ClientOnly>
              <PluginsRichText v-model:content="tempSectionData.content" :readonly="saving" />
              <template #fallback>
                <div class="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-48 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
                  Chargement de l'éditeur...
                </div>
              </template>
            </ClientOnly>
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
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            @click="saveSectionData"
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
const { fetchSectionByKey } = useAboutUs()
const { editorLanguage } = useEditorLanguage()
const supabase = useSupabaseClient()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()

const missionData = ref({
  section_key: 'our_mission',
  is_active: true,
  title_translations: {},
  content_translations: {}
})

const visionData = ref({
  section_key: 'our_vision',
  is_active: true,
  title_translations: {},
  content_translations: {}
})

const loading = ref(true)
const saving = ref(false)
const showEditModal = ref(false)
const editingSection = ref('')
const tempSectionData = ref({ title: '', content: '' })
const titleInput = ref(null)

const currentMission = computed({
  get: () => ({
    title: missionData.value.title_translations?.[editorLanguage.value] || '',
    content: missionData.value.content_translations?.[editorLanguage.value] || ''
  }),
  set: (val) => {
    missionData.value.title_translations[editorLanguage.value] = val.title
    missionData.value.content_translations[editorLanguage.value] = val.content
  }
})

const currentVision = computed({
  get: () => ({
    title: visionData.value.title_translations?.[editorLanguage.value] || '',
    content: visionData.value.content_translations?.[editorLanguage.value] || ''
  }),
  set: (val) => {
    visionData.value.title_translations[editorLanguage.value] = val.title
    visionData.value.content_translations[editorLanguage.value] = val.content
  }
})

const loadData = async () => {
  loading.value = true
  try {
    const [mission, vision] = await Promise.all([
      fetchSectionByKey('our_mission'),
      fetchSectionByKey('our_vision')
    ])

    if (mission.data) missionData.value = mission.data
    if (vision.data) visionData.value = vision.data
  } catch (error) {
    console.error('Error loading data:', error)
    showError('Impossible de charger les données')
  } finally {
    loading.value = false
  }
}

const saveAll = async () => {
  saving.value = true
  try {
    await Promise.all([
      supabase
        .from('about_us_sections')
        .update({
          title_translations: missionData.value.title_translations,
          content_translations: missionData.value.content_translations
        })
        .eq('section_key', 'our_mission'),
      supabase
        .from('about_us_sections')
        .update({
          title_translations: visionData.value.title_translations,
          content_translations: visionData.value.content_translations
        })
        .eq('section_key', 'our_vision')
    ])
    showSuccess('Modifications enregistrées avec succès')
  } catch (error) {
    console.error('Error saving:', error)
    showError('Erreur lors de l\'enregistrement')
  } finally {
    saving.value = false
  }
}

const openSectionEditor = (section) => {
  editingSection.value = section
  if (section === 'mission') {
    tempSectionData.value = {
      title: currentMission.value.title,
      content: currentMission.value.content
    }
  } else {
    tempSectionData.value = {
      title: currentVision.value.title,
      content: currentVision.value.content
    }
  }
  showEditModal.value = true

  nextTick(() => {
    if (titleInput.value) {
      titleInput.value.focus()
      if (titleInput.value.select) {
        titleInput.value.select()
      }
    }
  })
}

const saveSectionData = async () => {
  if (editingSection.value === 'mission') {
    missionData.value.title_translations[editorLanguage.value] = tempSectionData.value.title
    missionData.value.content_translations[editorLanguage.value] = tempSectionData.value.content
  } else {
    visionData.value.title_translations[editorLanguage.value] = tempSectionData.value.title
    visionData.value.content_translations[editorLanguage.value] = tempSectionData.value.content
  }

  showEditModal.value = false
  await saveAll()
}

onMounted(loadData)
watch(editorLanguage, loadData)

defineExpose({ saveAll })
</script>