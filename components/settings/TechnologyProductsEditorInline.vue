<template>
  <div class="space-y-3">
    <!-- Products Section Preview with Inline Editing -->
    <div class="bg-white shadow overflow-hidden relative">
      <!-- Toggle visibility button -->
      <button
        @click="toggleVisibility"
        class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        :title="sectionData.is_active ? 'Hide Products Section' : 'Show Products Section'"
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

      <!-- Show collapsed placeholder when hidden -->
      <div
        v-if="!sectionData.is_active"
        class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg"
      >
        <div class="text-center">
          <Icon
            name="heroicons-outline:cube"
            class="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Products Section Hidden</h3>
          <p class="mt-1 text-sm text-gray-500">
            Click the eye icon to show the products section
          </p>
        </div>
      </div>

      <!-- Products content when visible -->
      <div v-if="sectionData.is_active" 
           class="py-16 px-6"
           :style="{ backgroundColor: sectionData.background_color || 'rgb(var(--secondary-color))' }">
        
        <div class="max-w-7xl mx-auto">
          
          <!-- Editable Title -->
          <div class="text-center mb-12">
            <div class="relative mb-6 group inline-block">
              <h2 
                class="text-3xl sm:text-4xl font-bold mb-4 transition-all duration-300 group-hover:ring-2 group-hover:ring-primary/30 rounded-lg p-4"
                :style="{ color: sectionData.text_color || 'rgb(var(--secondary-contrast-color))' }"
                v-text="getCurrentContent().title || 'Click to add title'"
              />
              <button
                @click="openFieldEditor('title')"
                class="absolute -top-2 -right-2 bg-primary hover:bg-primary-600 p-2 rounded-full text-contrast1 shadow-lg transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                title="Edit title"
              >
                <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
              </button>
              <div class="text-xs opacity-75 mt-1" :style="{ color: sectionData.text_color || 'rgb(var(--secondary-contrast-color))' }">
                Click to edit title
              </div>
            </div>

            <!-- Editable Description -->
            <div class="relative group inline-block">
              <p 
                class="text-lg max-w-3xl mx-auto mb-6 transition-all duration-300 group-hover:ring-2 group-hover:ring-primary/30 rounded-lg p-4"
                :style="{ color: sectionData.text_color || 'rgb(var(--secondary-contrast-color))' }"
                v-text="getCurrentContent().content || 'Click to add description'"
              />
              <button
                @click="openFieldEditor('content')"
                class="absolute -top-2 -right-2 bg-primary hover:bg-primary-600 p-2 rounded-full text-contrast1 shadow-lg transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                title="Edit description"
              >
                <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
              </button>
              <div class="text-xs opacity-75 mt-1" :style="{ color: sectionData.text_color || 'rgb(var(--secondary-contrast-color))' }">
                Click to edit description
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <!-- Product Cards -->
            <div 
              v-for="(product, index) in 6" 
              :key="index"
              class="group cursor-pointer relative"
            >
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transition-all duration-300 group-hover:bg-white/20 border border-white/20">
                
                <!-- Product Image Placeholder -->
                <div class="mb-4 mx-auto w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon name="heroicons-outline:cube" class="h-10 w-10 text-white/60" />
                </div>
                
                <!-- Product Name -->
                <h3 
                  class="text-xl font-semibold mb-2"
                  :style="{ color: sectionData.text_color || 'rgb(var(--secondary-contrast-color))' }"
                >
                  Product {{ index + 1 }}
                </h3>
                
                <!-- Product Description -->
                <p 
                  class="text-sm opacity-80 mb-4"
                  :style="{ color: sectionData.text_color || 'rgb(var(--secondary-contrast-color))' }"
                >
                  Sample product description
                </p>
                
                <!-- Learn More Button -->
                <button 
                  class="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-all"
                >
                  Learn More
                </button>
              </div>
            </div>

          </div>

          <!-- View All Products Button -->
          <div v-if="sectionData.additional_data?.show_view_all" class="text-center mt-12">
            <div class="relative group inline-block">
              <button 
                class="px-8 py-3 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium transition-all duration-300 border-2 border-white/30 hover:border-white/50"
                @click="editViewAll"
              >
                {{ viewAllText || 'View All Products' }}
              </button>
              <Icon 
                class="absolute -top-1 -right-1 w-5 h-5 bg-primary text-contrast1 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all" 
                name="heroicons-outline:pencil" 
              />
            </div>
          </div>

        </div>

        <!-- Controls -->
        <div class="absolute bottom-4 left-4 space-y-2">
          <div 
            v-if="showColorPicker"
            class="absolute bottom-12 left-0 bg-white rounded-lg shadow-xl p-4 min-w-[300px] z-20"
          >
            <h4 class="text-sm font-medium text-gray-700 mb-3">Colors</h4>
            <div class="space-y-3">
              <button
                @click="sectionData.background_color = 'rgb(var(--primary-color))'; sectionData.text_color = 'rgb(var(--primary-contrast-color))'; saveSection(); showColorPicker = false"
                class="w-full p-3 rounded-lg border-2 border-primary bg-primary text-contrast1 text-sm font-medium"
              >
                Primary Colors
              </button>
              <button
                @click="sectionData.background_color = 'rgb(var(--secondary-color))'; sectionData.text_color = 'rgb(var(--secondary-contrast-color))'; saveSection(); showColorPicker = false"
                class="w-full p-3 rounded-lg border-2 border-secondary bg-secondary text-contrast2 text-sm font-medium"
              >
                Secondary Colors
              </button>
              <button
                @click="sectionData.background_color = 'rgb(var(--background-color))'; sectionData.text_color = 'rgb(var(--text-color))'; saveSection(); showColorPicker = false"
                class="w-full p-3 rounded-lg border-2 border-gray-300 bg-background text-mgray text-sm font-medium"
              >
                Body Colors
              </button>
            </div>
          </div>
          
          <button
            @click="showColorPicker = !showColorPicker"
            class="bg-white/90 backdrop-blur-sm hover:bg-white px-3 py-2 rounded-lg text-gray-700 text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
          >
            <Icon name="heroicons-outline:color-swatch" class="w-4 h-4" />
            Colors
          </button>

          <button
            @click="toggleViewAll"
            class="bg-white/90 backdrop-blur-sm hover:bg-white px-3 py-2 rounded-lg text-gray-700 text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
          >
            <Icon name="heroicons-outline:link" class="w-4 h-4" />
            {{ sectionData.additional_data?.show_view_all ? 'Hide' : 'Show' }} View All
          </button>
        </div>

      </div>
    </div>

    <!-- Field Editor Modal -->
    <div v-if="editingField !== null" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeFieldEditor">
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ getModalTitle() }}
        </h3>
        
        <!-- Section Title/Content -->
        <div v-if="editingField === 'title'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Section Title ({{ getCurrentLanguageName() }})
          </label>
          <input
            v-model="editData.title_translations[editorLanguage]"
            type="text"
            placeholder="Related Products"
            class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
          />
        </div>
        
        <div v-else-if="editingField === 'content'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Description ({{ getCurrentLanguageName() }})
          </label>
          <textarea
            v-model="editData.content_translations[editorLanguage]"
            rows="4"
            placeholder="Explore our products that use this technology..."
            class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
          />
        </div>

        <!-- View All Settings -->
        <div v-else-if="editingField === 'viewall'" class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Button Text</label>
            <input
              v-model="editData.additional_data.view_all_text"
              type="text"
              placeholder="View All Products"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Link</label>
            <input
              v-model="editData.additional_data.view_all_link"
              type="url"
              placeholder="/products"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
            />
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="closeFieldEditor"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="saveField"
            class="px-4 py-2 bg-primary text-contrast1 rounded-lg hover:bg-primary-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ technologyId: String })
const { editorLanguage } = useEditorLanguage()
const { fetchSectionByKey, updateSection, createSection } = useTechnologies()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'en', name: 'English' }
]

const editingField = ref(null)
const showColorPicker = ref(false)
const editData = ref({})

const sectionData = ref({
  technology_id: props.technologyId,
  section_key: 'tech_products',
  section_type: 'products',
  is_active: true,
  title_translations: { ar: '', en: '', fr: '' },
  content_translations: { ar: '', en: '', fr: '' },
  background_color: 'rgb(var(--secondary-color))',
  text_color: 'rgb(var(--secondary-contrast-color))',
  additional_data: { 
    show_view_all: false,
    view_all_link: '/products',
    view_all_text: 'View All Products'
  }
})

const viewAllText = computed(() => sectionData.value.additional_data?.view_all_text || 'View All Products')

const getCurrentLanguageName = () => languages.find(l => l.code === editorLanguage.value)?.name || ''

const getCurrentContent = () => ({
  title: sectionData.value.title_translations?.[editorLanguage.value] || '',
  content: sectionData.value.content_translations?.[editorLanguage.value] || ''
})

const getModalTitle = () => {
  if (editingField.value === 'title') return 'Edit Section Title'
  if (editingField.value === 'content') return 'Edit Section Description'
  if (editingField.value === 'viewall') return 'Edit View All Button'
  return 'Edit'
}

const loadData = async () => {
  if (!props.technologyId) return
  
  try {
    const { data } = await fetchSectionByKey(props.technologyId, 'tech_products')
    if (data) {
      // Ensure additional_data exists and has proper structure
      if (!data.additional_data) {
        data.additional_data = { 
          show_view_all: false,
          view_all_link: '/products',
          view_all_text: 'View All Products'
        }
      }
      sectionData.value = { ...sectionData.value, ...data }
      console.log('Loaded Products section data:', sectionData.value)
    } else {
      console.log('No Products section data found, using defaults')
    }
  } catch (error) {
    console.error('Error loading Products section data:', error)
  }
}

const toggleVisibility = async () => {
  sectionData.value.is_active = !sectionData.value.is_active
  await saveSection()
}

const toggleViewAll = async () => {
  if (!sectionData.value.additional_data) sectionData.value.additional_data = {}
  sectionData.value.additional_data.show_view_all = !sectionData.value.additional_data.show_view_all
  await saveSection()
}

const openFieldEditor = (field) => {
  editingField.value = field
  editData.value = JSON.parse(JSON.stringify(sectionData.value))
}

const editViewAll = () => {
  editingField.value = 'viewall'
  editData.value = JSON.parse(JSON.stringify(sectionData.value))
}

const closeFieldEditor = () => {
  editingField.value = null
  editData.value = {}
}

const saveField = async () => {
  sectionData.value = JSON.parse(JSON.stringify(editData.value))
  await saveSection()
  closeFieldEditor()
}

const saveSection = async (showNotification = true) => {
  try {
    if (sectionData.value.id) {
      await updateSection(sectionData.value.id, sectionData.value)
    } else {
      const { data } = await createSection(sectionData.value)
      if (data) sectionData.value.id = data.id
    }
    if (showNotification) {
      showSuccess('Saved successfully')
    }
  } catch (error) {
    console.error(error)
    showError('Failed to save')
  }
}

onMounted(loadData)
watch(() => props.technologyId, loadData)

// Auto-save when colors change (without notification)
watch(() => [sectionData.value.background_color, sectionData.value.text_color], 
  () => {
    if (sectionData.value.id) {
      saveSection(false)
    }
  }, 
  { deep: true }
)
</script>