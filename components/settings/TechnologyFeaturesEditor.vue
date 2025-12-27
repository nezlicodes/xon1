<template>
  <div class="bg-white shadow-lg rounded-xl overflow-hidden">
    <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Icon name="heroicons-outline:sparkles" class="h-6 w-6 text-white" />
        <h3 class="text-lg font-semibold text-white">Features Section</h3>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="!isEditing"
          @click="startEdit"
          class="px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all flex items-center gap-2"
        >
          <Icon name="heroicons-outline:pencil" class="h-4 w-4" />
          Edit
        </button>
        <template v-else>
          <button @click="cancelEdit" class="px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all">
            Cancel
          </button>
          <button
            @click="saveChanges"
            :disabled="saving"
            class="px-4 py-2 rounded-lg bg-white text-purple-600 hover:bg-gray-100 transition-all flex items-center gap-2"
          >
            <Icon v-if="saving" name="heroicons-outline:refresh" class="h-4 w-4 animate-spin" />
            <Icon v-else name="heroicons-outline:check" class="h-4 w-4" />
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </template>
        <button @click="toggleVisibility" class="px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all">
          <Icon :name="sectionData.is_active ? 'heroicons-outline:eye' : 'heroicons-outline:eye-off'" class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Preview Mode -->
    <div v-if="!isEditing && sectionData.is_active" class="p-6">
      <TechnologyFeatures :section="sectionData" />
    </div>

    <!-- Edit Mode -->
    <div v-if="isEditing && sectionData.is_active" class="p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
          <input v-model="editData.background_color" type="color" class="w-full h-12 rounded-lg border-2 border-gray-300 cursor-pointer" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
          <input v-model="editData.text_color" type="color" class="w-full h-12 rounded-lg border-2 border-gray-300 cursor-pointer" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Title ({{ getCurrentLanguageName() }})</label>
        <input v-model="editData.title_translations[editorLanguage]" type="text" class="w-full px-4 py-3 rounded-lg border-2 border-gray-300" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Description ({{ getCurrentLanguageName() }})</label>
        <textarea v-model="editData.content_translations[editorLanguage]" rows="3" class="w-full px-4 py-3 rounded-lg border-2 border-gray-300"></textarea>
      </div>

      <div>
        <div class="flex items-center justify-between mb-3">
          <label class="block text-sm font-medium text-gray-700">Features</label>
          <button @click="addFeature" class="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700">
            <Icon name="heroicons-outline:plus" class="h-4 w-4 inline mr-1" />
            Add Feature
          </button>
        </div>
        <div class="space-y-4">
          <div v-for="(feature, index) in features" :key="index" class="p-4 bg-gray-50 rounded-lg space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Feature {{ index + 1 }}</span>
              <button @click="removeFeature(index)" class="text-red-600 hover:text-red-700">
                <Icon name="heroicons-outline:trash" class="h-4 w-4" />
              </button>
            </div>
            
            <!-- Icon Picker -->
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <button
                type="button"
                @click="toggleIconPicker(index)"
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all flex items-center justify-between bg-white"
              >
                <div class="flex items-center gap-3">
                  <Icon v-if="feature.icon" :name="feature.icon" class="h-5 w-5 text-gray-700" />
                  <span class="text-gray-700">{{ getIconLabel(feature.icon) || 'Select an icon' }}</span>
                </div>
                <Icon name="heroicons-outline:chevron-down" class="h-5 w-5 text-gray-400" :class="{ 'rotate-180': openIconPickers[index] }" />
              </button>

              <!-- Dropdown -->
              <div
                v-if="openIconPickers[index]"
                v-click-outside="() => closeIconPicker(index)"
                class="absolute z-50 mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto"
              >
                <!-- Search -->
                <div class="sticky top-0 bg-white p-3 border-b">
                  <input
                    v-model="iconSearchQuery"
                    type="text"
                    placeholder="Search icons..."
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    @click.stop
                  />
                </div>

                <!-- Icon List -->
                <div class="p-2">
                  <button
                    v-for="icon in filteredIcons"
                    :key="icon.value"
                    type="button"
                    @click="selectIcon(index, icon.value)"
                    class="w-full px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-3 transition-colors"
                    :class="{ 'bg-blue-50': feature.icon === icon.value }"
                  >
                    <Icon :name="icon.value" class="h-5 w-5 text-gray-700" />
                    <span class="text-sm text-gray-700">{{ icon.label }}</span>
                  </button>
                  <div v-if="filteredIcons.length === 0" class="px-3 py-4 text-center text-gray-500 text-sm">
                    No icons found
                  </div>
                </div>
              </div>
            </div>
            
            <input v-model="feature.title_translations[editorLanguage]" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300" placeholder="Title" />
            <textarea v-model="feature.description_translations[editorLanguage]" rows="2" class="w-full px-3 py-2 rounded-lg border border-gray-300" placeholder="Description"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!sectionData.is_active" class="p-12 text-center text-gray-400">
      <Icon name="heroicons-outline:eye-off" class="h-12 w-12 mx-auto mb-3" />
      <p>Section is hidden</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ technologyId: String })
const { editorLanguage } = useEditorLanguage()
const { fetchSectionByKey, updateSection, createSection } = useTechnologies()
const { showError, showSuccess } = useErrorModal()

const languages = [{ code: 'fr', name: 'Français' }, { code: 'ar', name: 'العربية' }, { code: 'en', name: 'English' }]
const isEditing = ref(false)
const saving = ref(false)
const sectionData = ref({ technology_id: props.technologyId, section_key: 'tech_features', section_type: 'features', is_active: true, title_translations: { ar: '', en: '', fr: '' }, content_translations: { ar: '', en: '', fr: '' }, background_color: 'rgb(249, 250, 251)', text_color: 'rgb(17, 24, 39)', additional_data: { features: [] } })
const editData = ref({})
const openIconPickers = ref({})
const iconSearchQuery = ref('')

const features = computed(() => editData.value.additional_data?.features || [])
const getCurrentLanguageName = () => languages.find(l => l.code === editorLanguage.value)?.name || ''

const loadData = async () => {
  try {
    const { data } = await fetchSectionByKey(props.technologyId, 'tech_features')
    if (data) sectionData.value = { ...sectionData.value, ...data }
  } catch (error) {
    console.error(error)
  }
}

const startEdit = () => {
  editData.value = JSON.parse(JSON.stringify(sectionData.value))
  // Ensure additional_data structure exists
  if (!editData.value.additional_data) {
    editData.value.additional_data = { features: [] }
  }
  if (!editData.value.additional_data.features) {
    editData.value.additional_data.features = []
  }
  isEditing.value = true
}

const cancelEdit = () => {
  editData.value = {}
  isEditing.value = false
}

const saveChanges = async () => {
  saving.value = true
  try {
    if (editData.value.id) {
      await updateSection(editData.value.id, editData.value)
    } else {
      const { data } = await createSection(editData.value)
      if (data) editData.value.id = data.id
    }
    sectionData.value = JSON.parse(JSON.stringify(editData.value))
    isEditing.value = false
    showSuccess('Saved successfully')
  } finally {
    saving.value = false
  }
}

const toggleVisibility = async () => {
  sectionData.value.is_active = !sectionData.value.is_active
  try {
    if (sectionData.value.id) await updateSection(sectionData.value.id, { is_active: sectionData.value.is_active })
  } catch (error) {
    console.error(error)
  }
}

const addFeature = () => {
  if (!editData.value.additional_data) editData.value.additional_data = {}
  if (!editData.value.additional_data.features) editData.value.additional_data.features = []
  editData.value.additional_data.features.push({ icon: 'heroicons-outline:sparkles', title_translations: { ar: '', en: '', fr: '' }, description_translations: { ar: '', en: '', fr: '' } })
}

const removeFeature = (index) => {
  editData.value.additional_data.features.splice(index, 1)
}

const icons = [
  { value: 'heroicons-outline:sparkles', label: 'Sparkles' },
  { value: 'heroicons-outline:lightning-bolt', label: 'Lightning Bolt' },
  { value: 'heroicons-outline:fire', label: 'Fire' },
  { value: 'heroicons-outline:star', label: 'Star' },
  { value: 'heroicons-outline:heart', label: 'Heart' },
  { value: 'heroicons-outline:shield-check', label: 'Shield Check' },
  { value: 'heroicons-outline:badge-check', label: 'Badge Check' },
  { value: 'heroicons-outline:check-circle', label: 'Check Circle' },
  { value: 'heroicons-outline:globe-alt', label: 'Globe' },
  { value: 'heroicons-outline:trending-up', label: 'Trending Up' },
  { value: 'heroicons-outline:chart-bar', label: 'Chart Bar' },
  { value: 'heroicons-outline:chart-pie', label: 'Chart Pie' },
  { value: 'heroicons-outline:currency-dollar', label: 'Dollar' },
  { value: 'heroicons-outline:clock', label: 'Clock' },
  { value: 'heroicons-outline:users', label: 'Users' },
  { value: 'heroicons-outline:user-group', label: 'User Group' },
  { value: 'heroicons-outline:truck', label: 'Truck' },
  { value: 'heroicons-outline:cube', label: 'Cube' },
  { value: 'heroicons-outline:cog', label: 'Cog/Settings' },
  { value: 'heroicons-outline:chip', label: 'Chip' },
  { value: 'heroicons-outline:desktop-computer', label: 'Desktop' },
  { value: 'heroicons-outline:device-mobile', label: 'Mobile' },
  { value: 'heroicons-outline:light-bulb', label: 'Light Bulb' },
  { value: 'heroicons-outline:eye', label: 'Eye' },
  { value: 'heroicons-outline:photograph', label: 'Photo' },
  { value: 'heroicons-outline:video-camera', label: 'Video' },
  { value: 'heroicons-outline:microphone', label: 'Microphone' },
  { value: 'heroicons-outline:speaker-phone', label: 'Speaker' },
  { value: 'heroicons-outline:bell', label: 'Bell' },
  { value: 'heroicons-outline:mail', label: 'Mail' },
  { value: 'heroicons-outline:inbox', label: 'Inbox' },
  { value: 'heroicons-outline:paper-airplane', label: 'Send' },
  { value: 'heroicons-outline:download', label: 'Download' },
  { value: 'heroicons-outline:upload', label: 'Upload' },
  { value: 'heroicons-outline:cloud', label: 'Cloud' },
  { value: 'heroicons-outline:server', label: 'Server' },
  { value: 'heroicons-outline:database', label: 'Database' },
  { value: 'heroicons-outline:code', label: 'Code' },
  { value: 'heroicons-outline:terminal', label: 'Terminal' },
  { value: 'heroicons-outline:beaker', label: 'Beaker' },
  { value: 'heroicons-outline:puzzle', label: 'Puzzle' },
  { value: 'heroicons-outline:lock-closed', label: 'Lock' },
  { value: 'heroicons-outline:key', label: 'Key' },
  { value: 'heroicons-outline:adjustments', label: 'Adjustments' },
  { value: 'heroicons-outline:refresh', label: 'Refresh' }
]

const filteredIcons = computed(() => {
  if (!iconSearchQuery.value) return icons
  const query = iconSearchQuery.value.toLowerCase()
  return icons.filter(icon => icon.label.toLowerCase().includes(query))
})

const getIconLabel = (value) => {
  return icons.find(i => i.value === value)?.label
}

const toggleIconPicker = (index) => {
  if (openIconPickers.value[index]) {
    closeIconPicker(index)
  } else {
    // Close all others
    openIconPickers.value = {}
    openIconPickers.value[index] = true
  }
}

const closeIconPicker = (index) => {
  openIconPickers.value[index] = false
  iconSearchQuery.value = ''
}

const selectIcon = (index, value) => {
  editData.value.additional_data.features[index].icon = value
  closeIconPicker(index)
}

// Click outside directive
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

onMounted(loadData)
watch(() => props.technologyId, loadData)
</script>