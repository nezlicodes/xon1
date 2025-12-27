<template>
  <div class="min-h-screen bg-background">
    <div v-if="technology" class="max-w-7xl mx-auto">
      <!-- Header with Language Selector -->
      <div class="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100 px-6 py-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-4">
            <NuxtLink to="/admin/technologies" class="text-gray-600 hover:text-primary transition-colors">
              <Icon name="heroicons-outline:arrow-left" class="h-6 w-6" />
            </NuxtLink>
            <div>
              <h1 class="text-3xl font-bold text-mgray">Edit Technology</h1>
              <p v-if="technology" class="text-sm text-mgray-600 mt-1 flex items-center gap-2">
                <Icon name="heroicons-outline:cog" class="h-4 w-4" />
                {{ getTranslation(technology.name_translations) }}
              </p>
            </div>
          </div>

          <!-- Language Selector -->
          <div class="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <Icon name="heroicons-outline:translate" class="w-5 h-5 text-primary" />
            <div class="flex gap-2">
              <button
                v-for="lang in languages"
                :key="lang.code"
                @click="setLanguage(lang.code)"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  editorLanguage === lang.code
                    ? 'bg-primary text-contrast1 shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                ]"
              >
                {{ lang.flag }} {{ lang.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Basic Info -->
      <div class="px-6 py-6">
        <div class="bg-white shadow-sm rounded-xl border border-gray-100 p-6 mb-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 rounded-lg bg-primary bg-opacity-10">
              <Icon name="heroicons-outline:information-circle" class="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-mgray">Basic Information</h2>
              <p class="text-sm text-mgray-600">Core details about this technology</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminFormField
              v-model="technology.name_translations[editorLanguage]"
              type="text"
              label="Technology Name"
              placeholder="Enter technology name"
              :language-code="editorLanguage"
              :language-name="getCurrentLanguageName()"
              help="The main name that will appear throughout the site"
              @update:model-value="handleSave"
            />
            
            <AdminFormField
              v-model="technology.slug"
              type="text"
              label="URL Slug"
              placeholder="technology-name"
              help="Used in the URL (e.g., /technologies/technology-name)"
              @update:model-value="handleSave"
            />
            
            <div class="md:col-span-2">
              <AdminFormField
                v-model="technology.short_description_translations[editorLanguage]"
                type="textarea"
                label="Short Description"
                :rows="3"
                placeholder="A brief overview of this technology..."
                :language-code="editorLanguage"
                :language-name="getCurrentLanguageName()"
                help="Brief summary that appears in listings and previews"
                @update:model-value="handleSave"
              />
            </div>
            
    
            <!-- Status -->
            <div class="md:col-span-2">
              <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  v-model="technology.is_active"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  @change="handleSave"
                />
                <div>
                  <span class="text-sm font-medium text-gray-700">Publish Technology</span>
                  <p class="text-xs text-gray-500">Make this technology visible on the website</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sections Editor - Inline Editing Style -->
        <div class="space-y-6">
          <SettingsTechnologyHeroEditorInline :technology-id="technologyId" />
          <SettingsTechnologyAboutEditorInline :technology-id="technologyId" />
          <SettingsTechnologyFeaturesEditorInline :technology-id="technologyId" />
          <SettingsTechnologyProductsEditorInline :technology-id="technologyId" />
          
          <!-- Featured Products Selector -->
          <AdminTechnologiesProductSelector
            :technology-id="technologyId"
            v-model="featuredProducts"
            @update:modelValue="updateFeaturedProducts"
          />
          
          <SettingsTechnologyStatsEditorInline :technology-id="technologyId" />
          <SettingsTechnologyCTAEditorInline :technology-id="technologyId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const route = useRoute()
const { editorLanguage, setLanguage } = useEditorLanguage()
const { updateTechnology, getTranslation } = useTechnologies()
const { showError } = useErrorModal()
const supabase = useSupabaseClient()

const technologyId = computed(() => route.params.id)
const technology = ref(null)
const featuredProducts = ref([])
const saving = ref(false)
const saveTimeout = ref(null)
const uploadingLogo = ref(false)
const logoProgress = ref(0)
const uploadingCover = ref(false)
const coverProgress = ref(0)

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇩🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

const getCurrentLanguageName = () => {
  return languages.find(l => l.code === editorLanguage.value)?.name || ''
}

const loadTechnology = async () => {
  try {
    const { data, error } = await supabase
      .from('technologies')
      .select('*')
      .eq('id', technologyId.value)
      .single()

    if (error) throw error
    technology.value = data
  } catch (error) {
    console.error(error)
    showError('Failed to load technology')
  }
}

const uploadLogo = async (file) => {
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showError('Please select an image file')
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    showError('Logo size should be less than 2MB')
    return
  }

  uploadingLogo.value = true
  logoProgress.value = 0

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${technologyId.value}/logo-${Date.now()}.${fileExt}`
    const filePath = `technologies/${fileName}`

    const { data, error } = await supabase.storage
      .from('site')
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage.from('site').getPublicUrl(filePath)
    technology.value.logo_url = publicUrl
    logoProgress.value = 100
    await save()
  } catch (error) {
    console.error('Upload error:', error)
    showError('Failed to upload logo')
  } finally {
    uploadingLogo.value = false
    logoProgress.value = 0
  }
}

const uploadCover = async (file) => {
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showError('Please select an image file')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    showError('Cover image size should be less than 5MB')
    return
  }

  uploadingCover.value = true
  coverProgress.value = 0

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${technologyId.value}/cover-${Date.now()}.${fileExt}`
    const filePath = `technologies/${fileName}`

    const { data, error } = await supabase.storage
      .from('site')
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage.from('site').getPublicUrl(filePath)
    technology.value.cover_image_url = publicUrl
    coverProgress.value = 100
    await save()
  } catch (error) {
    console.error('Upload error:', error)
    showError('Failed to upload cover image')
  } finally {
    uploadingCover.value = false
    coverProgress.value = 0
  }
}

const removeLogo = () => {
  technology.value.logo_url = ''
  handleSave()
}

const removeCover = () => {
  technology.value.cover_image_url = ''
  handleSave()
}

const save = async () => {
  if (!technology.value) return
  saving.value = true
  try {
    const { error } = await updateTechnology(technology.value.id, technology.value)
    if (error) throw error
  } catch (error) {
    console.error(error)
    showError('Failed to save')
  } finally {
    saving.value = false
  }
}

const handleSave = () => {
  if (saveTimeout.value) clearTimeout(saveTimeout.value)
  saveTimeout.value = setTimeout(save, 1000)
}

// Featured Products Management
const loadFeaturedProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('technology_featured_products')
      .select(`
        display_order,
        products (
          id,
          name_translations,
          slug,
          price,
          is_featured
        )
      `)
      .eq('technology_id', technologyId.value)
      .order('display_order')

    if (error) {
      if (error.code === 'PGRST205') {
        console.log('🏗️ technology_featured_products table does not exist yet. Using empty selection.')
        featuredProducts.value = []
        return
      }
      throw error
    }
    
    featuredProducts.value = data?.map(item => ({
      ...item.products,
      display_order: item.display_order
    })) || []
  } catch (error) {
    console.error('Error loading featured products:', error)
    featuredProducts.value = []
  }
}

const updateFeaturedProducts = async (products) => {
  try {
    // Check if table exists first
    const { error: checkError } = await supabase
      .from('technology_featured_products')
      .select('id')
      .limit(1)
    
    if (checkError && checkError.code === 'PGRST205') {
      console.warn('🏗️ technology_featured_products table does not exist. Please run the migration first.')
      showError('Featured products table not set up yet. Please contact admin to run database migration.')
      return
    }

    // Delete existing relationships
    await supabase
      .from('technology_featured_products')
      .delete()
      .eq('technology_id', technologyId.value)

    // Insert new relationships
    if (products.length > 0) {
      const insertData = products.map((product, index) => ({
        technology_id: technologyId.value,
        product_id: product.id,
        display_order: index + 1
      }))

      const { error } = await supabase
        .from('technology_featured_products')
        .insert(insertData)

      if (error) throw error
    }

    featuredProducts.value = products
    console.log('Featured products updated successfully')
  } catch (error) {
    console.error('Error updating featured products:', error)
    showError('Failed to update featured products')
  }
}

onMounted(() => {
  loadTechnology()
  loadFeaturedProducts()
})

useHead({
  title: 'Edit Technology - Admin'
})
</script>