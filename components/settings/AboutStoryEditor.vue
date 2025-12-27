<template>
  <div class="space-y-3">
    <!-- Preview Section with Toggle -->
    <div class="bg-white shadow overflow-hidden relative">
      <!-- Toggle visibility and Edit buttons -->
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
          <Icon
            v-if="sectionData.is_active"
            class="h-5 w-5 text-gray-700"
            name="heroicons-outline:eye"
          />
          <Icon
            v-else
            class="h-5 w-5 text-gray-700"
            name="heroicons-outline:eye-off"
          />
        </button>
      </div>

      <!-- Hidden State -->
      <div
        v-if="!sectionData.is_active"
        class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg"
      >
        <div class="text-center">
          <Icon name="heroicons-outline:document-text" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Section masquée</h3>
          <p class="mt-1 text-sm text-gray-500">Cliquez sur l'icône d'œil pour afficher</p>
        </div>
      </div>

      <!-- Preview Content -->
      <section v-if="sectionData.is_active" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <!-- Title with edit button -->
            <div class="relative inline-block mb-6">
              <h2 class="text-4xl font-bold text-gray-900">{{ currentContent.title }}</h2>
              <button
                @click="openFieldEditor('title')"
                class="absolute -top-3 -right-10 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                title="Modifier le titre"
              >
                <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
              </button>
            </div>

            <!-- Content with edit button -->
            <div class="relative max-w-4xl mx-auto">
              <div class="text-lg text-gray-600 leading-relaxed prose prose-lg mx-auto" v-html="currentContent.content"></div>
              <button
                @click="openFieldEditor('content')"
                class="absolute -top-3 -right-10 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                title="Modifier le contenu"
              >
                <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
              </button>
              <div class="text-xs text-blue-600 mt-2">Cliquez pour modifier</div>
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
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 transform transition-all">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Modifier {{ getFieldLabel(currentField) }}
          </h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-500">
            <Icon name="heroicons-outline:x" class="h-5 w-5" />
          </button>
        </div>

        <!-- Title input -->
        <input
          v-if="currentField === 'title'"
          v-model="tempFieldValue"
          type="text"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          @keyup.enter="saveFieldValue"
          ref="fieldInput"
        />

        <!-- Content rich text editor -->
        <ClientOnly v-else>
          <PluginsRichText v-model:content="tempFieldValue" :readonly="saving" />
          <template #fallback>
            <div class="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-48 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
              Chargement de l'éditeur...
            </div>
          </template>
        </ClientOnly>

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
const { fetchSectionByKey } = useAboutUs()
const { editorLanguage } = useEditorLanguage()
const supabase = useSupabaseClient()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()

const sectionData = ref({
  section_key: 'our_story',
  is_active: true,
  title_translations: {},
  content_translations: {},
  additional_data: {}
})

const loading = ref(true)
const saving = ref(false)
const showEditModal = ref(false)
const currentField = ref('')
const tempFieldValue = ref('')
const fieldInput = ref(null)

const currentContent = computed({
  get: () => ({
    title: sectionData.value.title_translations?.[editorLanguage.value] || '',
    content: sectionData.value.content_translations?.[editorLanguage.value] || ''
  }),
  set: (val) => {
    sectionData.value.title_translations[editorLanguage.value] = val.title
    sectionData.value.content_translations[editorLanguage.value] = val.content
  }
})

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await fetchSectionByKey('our_story')
    if (data) {
      sectionData.value = data
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showError('Impossible de charger les données')
  } finally {
    loading.value = false
  }
}

const save = async () => {
  saving.value = true
  try {
    const { error } = await supabase
      .from('about_us_sections')
      .update({
        title_translations: sectionData.value.title_translations,
        content_translations: sectionData.value.content_translations,
        additional_data: sectionData.value.additional_data,
        is_active: sectionData.value.is_active
      })
      .eq('section_key', 'our_story')

    if (error) throw error
    showSuccess('Modifications enregistrées avec succès')
  } catch (error) {
    console.error('Error saving:', error)
    showError('Erreur lors de l\'enregistrement')
  } finally {
    saving.value = false
  }
}

const toggleVisibility = async () => {
  sectionData.value.is_active = !sectionData.value.is_active
  await save()
}

const openFieldEditor = (field) => {
  currentField.value = field
  tempFieldValue.value = currentContent.value[field] || ''
  showEditModal.value = true

  nextTick(() => {
    if (fieldInput.value) {
      fieldInput.value.focus()
      if (fieldInput.value.select) {
        fieldInput.value.select()
      }
    }
  })
}

const saveFieldValue = async () => {
  if (!sectionData.value.title_translations[editorLanguage.value]) {
    sectionData.value.title_translations[editorLanguage.value] = ''
  }
  if (!sectionData.value.content_translations[editorLanguage.value]) {
    sectionData.value.content_translations[editorLanguage.value] = ''
  }

  if (currentField.value === 'title') {
    sectionData.value.title_translations[editorLanguage.value] = tempFieldValue.value
  } else {
    sectionData.value.content_translations[editorLanguage.value] = tempFieldValue.value
  }

  showEditModal.value = false
  await save()
}

const getFieldLabel = (field) => {
  const labels = {
    title: 'le titre',
    content: 'le contenu',
  }
  return labels[field] || field
}

onMounted(loadData)
watch(editorLanguage, loadData)

defineExpose({ save })
</script>