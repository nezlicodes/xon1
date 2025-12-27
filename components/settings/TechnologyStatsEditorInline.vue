<template>
  <div class="space-y-3">
    <!-- Stats Section Preview with Inline Editing -->
    <div class="bg-white shadow overflow-hidden relative">
      <!-- Toggle visibility button -->
      <button
        @click="toggleVisibility"
        class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        :title="sectionData.is_active ? 'Hide Stats Section' : 'Show Stats Section'"
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
            name="heroicons-outline:chart-bar"
            class="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Stats Section Hidden</h3>
          <p class="mt-1 text-sm text-gray-500">
            Click the eye icon to show the stats section
          </p>
        </div>
      </div>

      <!-- Stats content when visible -->
      <div v-if="sectionData.is_active" 
           class="py-16 px-6"
           :style="{ backgroundColor: sectionData.background_color || 'rgb(var(--primary-color))' }">
        
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0); background-size: 40px 40px;"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Header -->
          <div class="text-center mb-16">
          
            <!-- Editable Title -->
            <div class="relative mb-4 group inline-block">
              <h2 
                class="text-3xl md:text-4xl font-bold mb-4 transition-all duration-300 group-hover:ring-2 group-hover:ring-white/30 rounded-lg p-4"
                :style="{ color: sectionData.text_color || 'rgb(var(--primary-contrast-color))' }"
                v-text="getCurrentContent().title || 'Click to add title'"
              />
              <button
                @click="openFieldEditor('title')"
                class="absolute -top-2 -right-2 bg-primary hover:bg-primary-600 p-2 rounded-full text-contrast1 shadow-lg transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                title="Edit title"
              >
                <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
              </button>
              <div class="text-xs opacity-75 mt-1" :style="{ color: sectionData.text_color || 'rgb(var(--primary-contrast-color))' }">
                Click to edit title
              </div>
            </div>
            
            <p class="text-lg opacity-90 max-w-3xl mx-auto">
              {{ getCurrentContent().content || 'Click to add description' }}
            </p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <!-- Stat Items -->
            <div 
              v-for="(stat, index) in stats" 
              :key="index"
              class="text-center group cursor-pointer relative"
              @click="editStat(index)"
            >
              <div class="transition-all duration-300 group-hover:ring-2 group-hover:ring-white/30 rounded-lg p-4">
                
                <!-- Number -->
                <div 
                  class="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-105 transition-transform"
                  :style="{ color: sectionData.text_color || 'rgb(var(--primary-contrast-color))' }"
                >
                  {{ stat.number || '0' }}
                </div>
                
                <!-- Label -->
                <div 
                  class="text-lg opacity-90"
                  :style="{ color: sectionData.text_color || 'rgb(var(--primary-contrast-color))' }"
                >
                  {{ stat.label_translations?.[editorLanguage] || 'Stat Label' }}
                </div>
                
                <!-- Description -->
                <div 
                  v-if="stat.description_translations?.[editorLanguage]"
                  class="text-sm opacity-80 mt-2"
                  :style="{ color: sectionData.text_color || 'rgb(var(--primary-contrast-color))' }"
                >
                  {{ stat.description_translations[editorLanguage] }}
                </div>
                
                <!-- Edit Button -->
                <Icon 
                  class="absolute -top-2 -right-2 w-6 h-6 bg-primary text-contrast1 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all" 
                  name="heroicons-outline:pencil" 
                />
              </div>
            </div>

            <!-- Add Stat Card -->
            <div 
              class="cursor-pointer group text-center"
              @click="addStat"
            >
              <div class="transition-all duration-300 group-hover:ring-2 group-hover:ring-white/30 rounded-lg p-4 border-2 border-dashed border-white/30 group-hover:border-white/60">
                <div class="mb-4 flex justify-center">
                  <div class="p-3 rounded-lg bg-white/10 group-hover:bg-white/20">
                    <Icon name="heroicons-outline:plus" class="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 class="text-xl font-semibold mb-3 text-white/80 group-hover:text-white">
                  Add Stat
                </h3>
                <p class="text-sm text-white/60 group-hover:text-white/80">
                  Click to add a new statistic
                </p>
              </div>
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
        </div>

      </div>
    </div>

    <!-- Field Editor Modal -->
    <div v-if="editingField !== null" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeFieldEditor">
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ getModalTitle() }}
        </h3>
        
        <!-- Section Title -->
        <div v-if="editingField === 'title'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Section Title ({{ getCurrentLanguageName() }})
          </label>
          <input
            v-model="editData.title_translations[editorLanguage]"
            type="text"
            placeholder="Statistics"
            class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
          />
        </div>

        <!-- Stat Editor -->
        <div v-else-if="typeof editingField === 'number'" class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Number/Value</label>
            <input
              v-model="editData.additional_data.stats[editingField].number"
              type="text"
              placeholder="100+"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Label ({{ getCurrentLanguageName() }})
            </label>
            <input
              v-model="editData.additional_data.stats[editingField].label_translations[editorLanguage]"
              type="text"
              placeholder="Happy Customers"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Description ({{ getCurrentLanguageName() }}) - Optional
            </label>
            <textarea
              v-model="editData.additional_data.stats[editingField].description_translations[editorLanguage]"
              rows="2"
              placeholder="Brief description..."
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
            />
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button
            v-if="typeof editingField === 'number'"
            @click="removeStat(editingField)"
            class="px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
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
  section_key: 'tech_stats',
  section_type: 'stats',
  is_active: true,
  title_translations: { ar: '', en: '', fr: '' },
  content_translations: { ar: '', en: '', fr: '' },
  background_color: 'rgb(var(--primary-color))',
  text_color: 'rgb(var(--primary-contrast-color))',
  additional_data: { 
    stats: [] 
  }
})

const stats = computed(() => sectionData.value.additional_data?.stats || [])

const getCurrentLanguageName = () => languages.find(l => l.code === editorLanguage.value)?.name || ''

const getCurrentContent = () => ({
  title: sectionData.value.title_translations?.[editorLanguage.value] || ''
})

const getModalTitle = () => {
  if (editingField.value === 'title') return 'Edit Section Title'
  if (typeof editingField.value === 'number') return 'Edit Statistic'
  return 'Edit'
}

const loadData = async () => {
  if (!props.technologyId) return
  
  try {
    const { data } = await fetchSectionByKey(props.technologyId, 'tech_stats')
    if (data) {
      // Ensure additional_data exists and has proper structure
      if (!data.additional_data) {
        data.additional_data = { stats: [] }
      }
      if (!data.additional_data.stats) {
        data.additional_data.stats = []
      }
      sectionData.value = { ...sectionData.value, ...data }
      console.log('Loaded Stats section data:', sectionData.value)
    } else {
      console.log('No Stats section data found, using defaults')
    }
  } catch (error) {
    console.error('Error loading Stats section data:', error)
  }
}

const toggleVisibility = async () => {
  sectionData.value.is_active = !sectionData.value.is_active
  await saveSection()
}

const openFieldEditor = (field) => {
  editingField.value = field
  editData.value = JSON.parse(JSON.stringify(sectionData.value))
}

const editStat = (index) => {
  editingField.value = index
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

const addStat = () => {
  if (!sectionData.value.additional_data) sectionData.value.additional_data = {}
  if (!sectionData.value.additional_data.stats) sectionData.value.additional_data.stats = []
  
  sectionData.value.additional_data.stats.push({
    number: '',
    label_translations: { ar: '', en: '', fr: '' },
    description_translations: { ar: '', en: '', fr: '' }
  })
  
  // Automatically open editor for new stat
  editStat(sectionData.value.additional_data.stats.length - 1)
}

const removeStat = (index) => {
  sectionData.value.additional_data.stats.splice(index, 1)
  closeFieldEditor()
  saveSection()
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