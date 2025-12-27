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
          <Icon name="heroicons-outline:folder-open" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Catégories masquées</h3>
          <p class="mt-1 text-sm text-gray-500">Cliquez sur l'icône d'œil pour afficher</p>
        </div>
      </div>

      <!-- Section Preview -->
      <section v-if="sectionData.is_active" class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Title -->
          <div class="text-center mb-12 grid">
            <div class="relative mb-4 border-2 border-transparent rounded-lg transition-all hover:border-blue-400 px-4 py-2 inline-block">
              <h2 class="text-3xl md:text-4xl font-bold text-gray-900">{{ getCurrentContent().title }}</h2>
              <button type="button" @click="openFieldEditor('title')" class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all transform hover:scale-110">
                <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
              </button>
              <div class="text-xs text-blue-500 opacity-75 mt-1">Cliquez pour modifier</div>
            </div>

            <!-- Subtitle -->
            <div class="relative border-2 border-transparent rounded-lg transition-all hover:border-blue-400 px-4 py-2 inline-block">
              <p class="text-lg text-gray-600" v-html="getCurrentContent().subtitle"></p>
              <button type="button" @click="openFieldEditor('subtitle')" class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all transform hover:scale-110">
                <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
              </button>
              <div class="text-xs text-blue-500 opacity-75 mt-1">Cliquez pour modifier</div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="categoriesLoading" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="i in 4" :key="i" class="animate-pulse bg-white rounded-lg h-64"></div>
          </div>

          <!-- Categories Grid -->
          <div v-else-if="categories.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="category in categories.slice(0, 4)" :key="category.id" class="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div class="aspect-square overflow-hidden bg-gray-200">
                <NuxtImg v-if="category.image_url" :src="category.image_url" :alt="category.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400"><Icon name="heroicons-outline:photograph" class="w-16 h-16" /></div>
              </div>
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">{{ category.name }}</h3>
                <p v-if="category.description" class="text-sm text-gray-600 mt-2 line-clamp-2">{{ category.description }}</p>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <Icon name="heroicons-outline:folder-open" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p class="text-gray-500 mb-4">Aucune catégorie populaire</p>
            <NuxtLink to="/admin/categories" class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
              <Icon name="heroicons-outline:plus" class="w-4 h-4" />Gérer les catégories
            </NuxtLink>
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
    <div v-if="showFieldModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showFieldModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Modifier {{ getFieldLabel(currentField) }}</h3>
          <button @click="showFieldModal = false" class="text-gray-400 hover:text-gray-500"><Icon name="heroicons-outline:x" class="h-5 w-5" /></button>
        </div>
        <input v-if="currentField === 'title'" v-model="tempFieldValue" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" @keyup.enter="saveFieldValue" ref="fieldInput" />
        <ClientOnly v-else-if="currentField === 'subtitle'">
          <PluginsRichText v-model:content="tempFieldValue" />
          <template #fallback><div class="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-24 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">Chargement...</div></template>
        </ClientOnly>
        <div class="mt-4 flex justify-end space-x-3">
          <button type="button" class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" @click="showFieldModal = false"><Icon name="heroicons-outline:x" class="mr-1.5 h-4 w-4" />Annuler</button>
          <button type="button" :disabled="saving" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50" @click="saveFieldValue"><Icon :name="saving ? 'heroicons-outline:refresh' : 'heroicons-outline:check'" class="mr-1.5 h-4 w-4" :class="{ 'animate-spin': saving }" />{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()
const { fetchCategories } = useCategories()
const { editorLanguage } = useEditorLanguage()

const defaultContent = {
  en: { title: 'Featured Categories', subtitle: 'Explore our most popular product categories' },
  fr: { title: 'Catégories populaires', subtitle: 'Découvrez nos catégories de produits les plus populaires' },
  ar: { title: 'الفئات المميزة', subtitle: 'استكشف فئات المنتجات الأكثر شعبية' }
}

const sectionData = ref({ id: null, section_key: 'featured_categories', is_active: true, content_translations: defaultContent })
const categories = ref([])
const categoriesLoading = ref(true)
const showFieldModal = ref(false)
const currentField = ref('')
const tempFieldValue = ref('')
const fieldInput = ref(null)
const loading = ref(false)
const saving = ref(false)

const getCurrentContent = () => sectionData.value.content_translations?.[editorLanguage.value] || defaultContent[editorLanguage.value]

const loadSectionData = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase.from('content_sections').select('*').eq('section_key', 'featured_categories').single()
    if (error && error.code !== 'PGRST116') throw error
    if (data) sectionData.value = data
    else {
      const { data: newSection, error: createError } = await supabase.from('content_sections').insert({ section_key: 'featured_categories', section_type: 'featured_categories', content_translations: defaultContent, is_active: true, display_order: 4 }).select().single()
      if (createError) throw createError
      sectionData.value = newSection
    }
  } catch (error) {
    console.error(error); showError('Erreur')
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  categoriesLoading.value = true
  try {
    const { data } = await fetchCategories({ featured: true, active: true })
    if (data) categories.value = data
  } catch (error) {
    console.error(error)
  } finally {
    categoriesLoading.value = false
  }
}

const saveSectionData = async () => {
  saving.value = true
  try {
    const { data, error } = await supabase.from('content_sections').upsert({ section_key: 'featured_categories', section_type: 'featured_categories', content_translations: sectionData.value.content_translations, is_active: sectionData.value.is_active, display_order: 4 }, { onConflict: 'section_key' }).select().single()
    if (error) throw error
    sectionData.value = data
    showSuccess('Section enregistrée')
  } catch (error) {
    console.error(error); showError('Erreur')
  } finally {
    saving.value = false
  }
}

const openFieldEditor = (field) => {
  currentField.value = field
  tempFieldValue.value = getCurrentContent()[field] || defaultContent[editorLanguage.value][field]
  showFieldModal.value = true
  nextTick(() => { if (fieldInput.value) { fieldInput.value.focus(); if (fieldInput.value.select) fieldInput.value.select() } })
}

const saveFieldValue = async () => {
  if (!sectionData.value.content_translations[editorLanguage.value]) sectionData.value.content_translations[editorLanguage.value] = {}
  sectionData.value.content_translations[editorLanguage.value][currentField.value] = tempFieldValue.value
  showFieldModal.value = false
  await saveSectionData()
}

const toggleSectionVisibility = async () => { sectionData.value.is_active = !sectionData.value.is_active; await saveSectionData() }
const getFieldLabel = (field) => field === 'title' ? 'le titre' : 'le sous-titre'

onMounted(async () => { await loadSectionData(); await loadCategories() })
</script>