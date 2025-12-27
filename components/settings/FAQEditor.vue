<template>
  <div class="space-y-3">
    <div class="bg-white shadow overflow-hidden relative">
      <!-- Toggle visibility -->
      <button @click="toggleSectionVisibility" class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all" :title="sectionData.is_active ? 'Masquer' : 'Afficher'">
        <Icon :name="sectionData.is_active ? 'heroicons-outline:eye' : 'heroicons-outline:eye-off'" class="h-5 w-5 text-gray-700" />
      </button>

      <!-- Hidden placeholder -->
      <div v-if="!sectionData.is_active" class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
        <div class="text-center">
          <Icon name="heroicons-outline:question-mark-circle" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">FAQ masquée</h3>
          <p class="mt-1 text-sm text-gray-500">Cliquez sur l'icône d'œil pour afficher</p>
        </div>
      </div>

      <!-- FAQ Preview -->
      <div v-else class="p-8 bg-gradient-to-br grid from-gray-50 to-gray-100">
        <!-- Badge -->
        <div class="relative inline-block border-2 border-transparent rounded-full transition-all hover:border-blue-400 mb-6">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
            <Icon name="ph:question-fill" class="w-4 h-4 text-blue-600" />
            <span class="text-sm font-semibold text-blue-600">{{ getCurrentContent().badge_text }}</span>
          </div>
          <button type="button" @click="openFieldEditor('badge_text')" class="absolute -top-2 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all transform hover:scale-110">
            <Icon class="w-3 h-3" name="heroicons-outline:pencil-alt" />
          </button>
          <div class="text-xs text-blue-500 opacity-75 mt-1 text-center">Cliquez pour modifier</div>
        </div>

        <!-- Title -->
        <div class="relative border-2 border-transparent rounded-lg transition-all hover:border-blue-400 px-4 py-2 inline-block mb-4">
          <h2 class="text-4xl font-bold text-gray-900">{{ getCurrentContent().title }}</h2>
          <button type="button" @click="openFieldEditor('title')" class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all transform hover:scale-110">
            <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
          </button>
          <div class="text-xs text-blue-500 opacity-75 mt-1">Cliquez pour modifier</div>
        </div>

        <!-- Subtitle -->
        <div class="relative border-2 border-transparent rounded-lg transition-all hover:border-blue-400 px-4 py-2 inline-block">
          <p class="text-xl text-gray-600">{{ getCurrentContent().subtitle }}</p>
          <button type="button" @click="openFieldEditor('subtitle')" class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all transform hover:scale-110">
            <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
          </button>
          <div class="text-xs text-blue-500 opacity-75 mt-1">Cliquez pour modifier</div>
        </div>

        <!-- Help Card -->
        <div class="mt-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Icon name="ph:lightbulb-fill" class="w-6 h-6 text-blue-600" />
            </div>
            <div class="flex-1">
              <div class="relative border-2 border-transparent rounded transition-all hover:border-blue-400 px-2 py-1 inline-block mb-2">
                <h3 class="font-bold text-gray-900">{{ getCurrentContent().help_card_title }}</h3>
                <button type="button" @click="openFieldEditor('help_card_title')" class="absolute -top-2 -right-2 bg-blue-600 hover:bg-blue-700 p-1 rounded-full text-white shadow-lg transition-all transform hover:scale-110">
                  <Icon class="w-3 h-3" name="heroicons-outline:pencil-alt" />
                </button>
              </div>
              <div class="relative border-2 border-transparent rounded transition-all hover:border-blue-400 px-2 py-1 inline-block">
                <p class="text-sm text-gray-600">{{ getCurrentContent().help_card_description }}</p>
                <button type="button" @click="openFieldEditor('help_card_description')" class="absolute -top-2 -right-2 bg-blue-600 hover:bg-blue-700 p-1 rounded-full text-white shadow-lg transition-all transform hover:scale-110">
                  <Icon class="w-3 h-3" name="heroicons-outline:pencil-alt" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State Message -->
        <div class="mt-8 bg-gray-100 rounded-2xl p-6 border-2 border-dashed border-gray-300">
          <div class="relative border-2 border-transparent rounded transition-all hover:border-blue-400 px-2 py-1 inline-block mb-2">
            <p class="font-semibold text-gray-900">{{ getCurrentContent().no_questions_title }}</p>
            <button type="button" @click="openFieldEditor('no_questions_title')" class="absolute -top-2 -right-2 bg-blue-600 hover:bg-blue-700 p-1 rounded-full text-white shadow-lg transition-all transform hover:scale-110">
              <Icon class="w-3 h-3" name="heroicons-outline:pencil-alt" />
            </button>
          </div>
          <div class="relative border-2 border-transparent rounded transition-all hover:border-blue-400 px-2 py-1 inline-block">
            <p class="text-sm text-gray-600">{{ getCurrentContent().no_questions_description }}</p>
            <button type="button" @click="openFieldEditor('no_questions_description')" class="absolute -top-2 -right-2 bg-blue-600 hover:bg-blue-700 p-1 rounded-full text-white shadow-lg transition-all transform hover:scale-110">
              <Icon class="w-3 h-3" name="heroicons-outline:pencil-alt" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading/Saving indicator -->
    <div v-if="saving" class="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
      <Icon name="heroicons-outline:refresh" class="w-4 h-4 animate-spin" />
      <span class="text-sm">Enregistrement...</span>
    </div>

    <!-- Edit Modal -->
    <div v-if="showFieldModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showFieldModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Modifier {{ getFieldLabel(currentField) }}</h3>
          <button @click="showFieldModal = false" class="text-gray-400 hover:text-gray-500"><Icon name="heroicons-outline:x" class="h-5 w-5" /></button>
        </div>
        <textarea v-model="tempFieldValue" rows="3" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" @keyup.ctrl.enter="saveFieldValue" ref="fieldInput"></textarea>
        <div class="mt-4 flex justify-end space-x-3">
          <button type="button" class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" @click="showFieldModal = false"><Icon name="heroicons-outline:x" class="mr-1.5 h-4 w-4" />Annuler</button>
          <button type="button" :disabled="saving" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50" @click="saveFieldValue"><Icon :name="saving ? 'heroicons-outline:refresh' : 'heroicons-outline:check'" class="mr-1.5 h-4 w-4" :class="{ 'animate-spin': saving }" />{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { fetchSection } = useContentSections()
const supabase = useSupabaseClient()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()
const { editorLanguage } = useEditorLanguage()

const defaultSectionData = { badge_text: 'FAQ', title: 'Questions Fréquentes', subtitle: 'Trouvez des réponses aux questions les plus courantes', help_card_title: "Besoin d'aide ?", help_card_description: "Contactez-nous si vous ne trouvez pas votre réponse", no_questions_title: 'Aucune question disponible', no_questions_description: 'Les questions fréquentes seront bientôt disponibles' }

const loading = ref(true)
const saving = ref(false)
const sectionData = ref({ section_key: 'faq', section_type: 'faq_header', is_active: true, content_translations: { en: { ...defaultSectionData }, fr: { ...defaultSectionData }, ar: { ...defaultSectionData } } })

const showFieldModal = ref(false)
const currentField = ref('')
const tempFieldValue = ref('')
const fieldInput = ref(null)

const getCurrentContent = () => sectionData.value.content_translations?.[editorLanguage.value] || defaultSectionData

const loadSectionData = async () => {
  loading.value = true
  try {
    const { data, error } = await fetchSection('faq')
    if (error) throw error
    if (data) sectionData.value = data
    else {
      const { data: newSection, error: createError } = await supabase.from('content_sections').insert({ section_key: 'faq', section_type: 'faq_header', content_translations: { en: { ...defaultSectionData }, fr: { ...defaultSectionData }, ar: { ...defaultSectionData } }, is_active: true, display_order: 5 }).select().single()
      if (createError) throw createError
      sectionData.value = newSection
    }
  } catch (error) {
    console.error(error); showError('Erreur')
  } finally {
    loading.value = false
  }
}

const saveSectionData = async () => {
  saving.value = true
  try {
    const { data, error } = await supabase.from('content_sections').upsert({ section_key: 'faq', section_type: 'faq_header', content_translations: sectionData.value.content_translations, is_active: sectionData.value.is_active, display_order: 5 }, { onConflict: 'section_key' }).select().single()
    if (error) throw error
    sectionData.value = data
    showSuccess('Section enregistrée')
  } catch (error) {
    console.error(error); showError('Erreur')
  } finally {
    saving.value = false
  }
}

const toggleSectionVisibility = async () => { sectionData.value.is_active = !sectionData.value.is_active; await saveSectionData() }

const openFieldEditor = (field) => {
  currentField.value = field
  tempFieldValue.value = getCurrentContent()[field] || defaultSectionData[field]
  showFieldModal.value = true
  nextTick(() => { if (fieldInput.value) { fieldInput.value.focus(); if (fieldInput.value.select) fieldInput.value.select() } })
}

const saveFieldValue = async () => {
  if (!sectionData.value.content_translations[editorLanguage.value]) sectionData.value.content_translations[editorLanguage.value] = {}
  sectionData.value.content_translations[editorLanguage.value][currentField.value] = tempFieldValue.value
  showFieldModal.value = false
  await saveSectionData()
}

const getFieldLabel = (field) => {
  const labels = { badge_text: 'le badge', title: 'le titre', subtitle: 'le sous-titre', help_card_title: "le titre d'aide", help_card_description: "la description d'aide", no_questions_title: 'le titre vide', no_questions_description: 'la description vide' }
  return labels[field] || field
}

onMounted(async () => { await loadSectionData() })
</script>