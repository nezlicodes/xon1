<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="p-2 bg-green-50 rounded-lg">
          <Icon name="heroicons-outline:information-circle" class="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900">Section À Propos</h3>
          <p class="text-sm text-gray-500">Présentez votre entreprise et vos valeurs</p>
        </div>
      </div>
      <button
        @click="toggleVisibility"
        type="button"
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        :title="section.is_active ? 'Masquer la section' : 'Afficher la section'"
      >
        <Icon
          :name="section.is_active ? 'heroicons-outline:eye' : 'heroicons-outline:eye-off'"
          class="h-5 w-5"
          :class="section.is_active ? 'text-green-600' : 'text-gray-400'"
        />
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="px-6 py-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-green-100 border-t-green-600"></div>
    </div>

    <!-- Hidden State -->
    <div v-else-if="!section.is_active" class="px-6 py-12">
      <div class="text-center">
        <Icon name="heroicons-outline:information-circle" class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Section masquée</h3>
        <p class="mt-1 text-sm text-gray-500">Cliquez sur l'icône d'œil pour afficher</p>
      </div>
    </div>

    <!-- Editor Content -->
    <div v-else class="p-6 space-y-6">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Titre</label>
        <input
          v-model="section.content_translations[editorLanguage].title"
          type="text"
          class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
          placeholder="Ex: À Propos de Nous"
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          v-model="section.content_translations[editorLanguage].description"
          rows="4"
          class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
          placeholder="Décrivez votre entreprise..."
        ></textarea>
      </div>

      <!-- Save Button -->
      <div class="flex items-center justify-between pt-4 border-t">
        <div v-if="hasChanges" class="flex items-center text-sm text-amber-600">
          <Icon name="heroicons-outline:exclamation-circle" class="w-4 h-4 mr-1" />
          Modifications non enregistrées
        </div>
        <div class="flex-1 flex justify-end">
          <button
            @click="saveSection"
            :disabled="saving || !hasChanges"
            type="button"
            :class="[
              'inline-flex items-center px-6 py-2 rounded-lg text-sm font-medium transition-colors',
              saving || !hasChanges
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            ]"
          >
            <Icon
              :name="saving ? 'heroicons-outline:refresh' : 'heroicons-outline:check'"
              class="w-4 h-4 mr-2"
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
const supabase = useSupabaseClient()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()
const { editorLanguage } = useEditorLanguage()

const SECTION_KEY = 'about_section'

const loading = ref(true)
const saving = ref(false)

const section = ref({
  id: null,
  section_key: SECTION_KEY,
  is_active: true,
  content_translations: {
    fr: { title: '', description: '' },
    ar: { title: '', description: '' },
    en: { title: '', description: '' }
  }
})

const originalSection = ref(null)

const hasChanges = computed(() => {
  if (!originalSection.value) return false
  return JSON.stringify(section.value) !== JSON.stringify(originalSection.value)
})

const loadSection = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .eq('section_key', SECTION_KEY)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (data) {
      section.value = {
        id: data.id,
        section_key: data.section_key,
        is_active: data.is_active ?? true,
        content_translations: data.content_translations || {
          fr: { title: '', description: '' },
          ar: { title: '', description: '' },
          en: { title: '', description: '' }
        }
      }
    } else {
      await createDefaultSection()
    }

    originalSection.value = JSON.parse(JSON.stringify(section.value))
  } catch (error) {
    console.error('Error loading section:', error)
    showError('Impossible de charger la section')
  } finally {
    loading.value = false
  }
}

const createDefaultSection = async () => {
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .insert({
        section_key: SECTION_KEY,
        is_active: true,
        content_translations: {
          fr: { title: 'À Propos de Nous', description: 'Notre histoire et nos valeurs' },
          ar: { title: 'من نحن', description: 'قصتنا وقيمنا' },
          en: { title: 'About Us', description: 'Our story and values' }
        }
      })
      .select()
      .single()

    if (error) throw error

    section.value = data
    originalSection.value = JSON.parse(JSON.stringify(data))
  } catch (error) {
    console.error('Error creating section:', error)
    showError('Erreur lors de la création de la section')
  }
}

const toggleVisibility = async () => {
  section.value.is_active = !section.value.is_active
  await saveSection()
}

const saveSection = async () => {
  saving.value = true
  try {
    const { error } = await supabase
      .from('content_sections')
      .update({
        is_active: section.value.is_active,
        content_translations: section.value.content_translations,
        updated_at: new Date().toISOString()
      })
      .eq('id', section.value.id)

    if (error) throw error

    originalSection.value = JSON.parse(JSON.stringify(section.value))
    showSuccess('Section enregistrée avec succès')
  } catch (error) {
    console.error('Error saving section:', error)
    showError('Erreur lors de l\'enregistrement')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadSection()
})
</script>