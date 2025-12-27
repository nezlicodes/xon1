<template>
  <div class="space-y-3">
    <!-- CTA Section Preview with Inline Editing -->
    <div class="bg-white shadow overflow-hidden relative">
      <!-- Toggle visibility button -->
      <button
        @click="toggleVisibility"
        class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        :title="sectionData.is_active ? 'Hide CTA Section' : 'Show CTA Section'"
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
            name="heroicons-outline:cursor-click"
            class="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Call-to-Action Section Hidden</h3>
          <p class="mt-1 text-sm text-gray-500">
            Click the eye icon to show the CTA section
          </p>
        </div>
      </div>

      <!-- CTA content when visible -->
      <div v-if="sectionData.is_active" 
           class="py-16 px-6"
           :style="{ backgroundColor: sectionData.background_color || 'rgb(var(--primary-color))' }">
        
        <div class="max-w-4xl mx-auto text-center">
          
          <!-- Editable Title -->
          <div class="relative mb-6 group">
            <h2 
              class="text-3xl sm:text-4xl font-bold mb-4 transition-all duration-300 group-hover:ring-2 group-hover:ring-white/30 rounded-lg p-4"
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

          <!-- Editable Description -->
          <div class="relative mb-8 group">
            <p 
              class="text-lg sm:text-xl max-w-3xl mx-auto mb-8 transition-all duration-300 group-hover:ring-2 group-hover:ring-white/30 rounded-lg p-4"
              :style="{ color: sectionData.text_color || 'rgb(var(--primary-contrast-color))' }"
              v-text="getCurrentContent().content || 'Click to add description'"
            />
            <button
              @click="openFieldEditor('content')"
              class="absolute -top-2 -right-2 bg-primary hover:bg-primary-600 p-2 rounded-full text-contrast1 shadow-lg transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
              title="Edit description"
            >
              <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
            </button>
            <div class="text-xs opacity-75 mt-1" :style="{ color: sectionData.text_color || 'rgb(var(--primary-contrast-color))' }">
              Click to edit description
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap justify-center gap-4">
            <div
              v-for="(button, index) in sectionData.additional_data?.buttons || []"
              :key="index"
              class="relative group cursor-pointer"
              @click="editButton(index)"
            >
              <button
                :class="button.style === 'primary' 
                  ? 'bg-white text-primary hover:bg-gray-100' 
                  : 'border-2 border-white text-white hover:bg-white hover:text-primary'"
                class="px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
              >
                {{ getButtonText(button) || 'Button Text' }}
                <Icon name="heroicons-outline:arrow-right" class="h-5 w-5" />
              </button>
              <Icon 
                class="absolute -top-1 -right-1 w-5 h-5 bg-primary text-contrast1 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all" 
                name="heroicons-outline:pencil" 
              />
            </div>
            
            <!-- Add Button -->
            <button
              @click="addButton"
              class="px-8 py-3 rounded-lg font-semibold border-2 border-dashed border-white/50 text-white/70 hover:border-white hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <Icon name="heroicons-outline:plus" class="w-5 h-5" />
              Add Button
            </button>
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
        
        <!-- Title Field -->
        <div v-if="editingField === 'title'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Title ({{ getCurrentLanguageName() }})
          </label>
          <input
            v-model="editData.title_translations[editorLanguage]"
            type="text"
            placeholder="Ready to Get Started?"
            class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
          />
        </div>
        
        <!-- Content Field -->
        <div v-else-if="editingField === 'content'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Description ({{ getCurrentLanguageName() }})
          </label>
          <textarea
            v-model="editData.content_translations[editorLanguage]"
            rows="4"
            placeholder="Contact us today to learn more about our technology solutions..."
            class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
          />
        </div>

        <!-- Button Editor -->
        <div v-else-if="editingField && editingField.startsWith('button-')" class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Button Text ({{ getCurrentLanguageName() }})
            </label>
            <input
              v-model="editData.additional_data.buttons[parseInt(editingField.split('-')[1])].text_translations[editorLanguage]"
              type="text"
              placeholder="Get Started"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Button Link</label>
            <input
              v-model="editData.additional_data.buttons[parseInt(editingField.split('-')[1])].link"
              type="text"
              placeholder="/contact or https://example.com"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Button Style</label>
            <div class="grid grid-cols-1 gap-3">
              <button
                @click="editData.additional_data.buttons[parseInt(editingField.split('-')[1])].style = 'primary'"
                class="p-3 rounded-lg bg-white text-primary border-2 border-primary font-medium transition-all ring-2 ring-primary"
              >
                Primary Button Style
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button
            v-if="editingField && editingField.startsWith('button-')"
            @click="removeButton(parseInt(editingField.split('-')[1]))"
            class="px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50"
          >
            Delete Button
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
  section_key: 'tech_cta',
  section_type: 'cta',
  is_active: true,
  title_translations: { ar: '', en: '', fr: '' },
  content_translations: { ar: '', en: '', fr: '' },
  background_color: 'rgb(var(--primary-color))',
  text_color: 'rgb(var(--primary-contrast-color))',
  additional_data: { 
    buttons: [] 
  }
})

const getCurrentLanguageName = () => languages.find(l => l.code === editorLanguage.value)?.name || ''

const getCurrentContent = () => ({
  title: sectionData.value.title_translations?.[editorLanguage.value] || '',
  content: sectionData.value.content_translations?.[editorLanguage.value] || ''
})

const getButtonText = (button) => button.text_translations?.[editorLanguage.value] || ''

const getModalTitle = () => {
  if (editingField.value === 'title') return 'Edit Title'
  if (editingField.value === 'content') return 'Edit Description'
  if (editingField.value && editingField.value.startsWith('button-')) return 'Edit Button'
  return 'Edit'
}

const loadData = async () => {
  if (!props.technologyId) return
  
  try {
    const { data } = await fetchSectionByKey(props.technologyId, 'tech_cta')
    if (data) {
      // Ensure additional_data exists and has proper structure
      if (!data.additional_data) {
        data.additional_data = { buttons: [] }
      }
      if (!data.additional_data.buttons) {
        data.additional_data.buttons = []
      }
      sectionData.value = { ...sectionData.value, ...data }
      console.log('Loaded CTA section data:', sectionData.value)
    } else {
      console.log('No CTA section data found, using defaults')
    }
  } catch (error) {
    console.error('Error loading CTA section data:', error)
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

const editButton = (index) => {
  editingField.value = `button-${index}`
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

const addButton = () => {
  if (!sectionData.value.additional_data) sectionData.value.additional_data = {}
  if (!sectionData.value.additional_data.buttons) sectionData.value.additional_data.buttons = []
  sectionData.value.additional_data.buttons.push({
    text_translations: { ar: '', en: '', fr: '' },
    link: '',
    style: 'primary'
  })
  
  // Automatically open editor for new button
  editButton(sectionData.value.additional_data.buttons.length - 1)
}

const removeButton = (index) => {
  sectionData.value.additional_data.buttons.splice(index, 1)
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