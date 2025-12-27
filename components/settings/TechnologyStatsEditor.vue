<template>
  <div class="bg-white shadow-lg rounded-xl overflow-hidden">
    <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Icon name="heroicons-outline:chart-bar" class="h-6 w-6 text-white" />
        <h3 class="text-lg font-semibold text-white">Stats Section</h3>
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
            class="px-4 py-2 rounded-lg bg-white text-indigo-600 hover:bg-gray-100 transition-all flex items-center gap-2"
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
      <TechnologyStats :section="sectionData" />
    </div>

    <!-- Edit Mode -->
    <div v-if="isEditing && sectionData.is_active" class="p-6 space-y-6">
      <!-- Color scheme automatically uses app colors -->
      <div class="p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-3">
          <Icon name="heroicons-outline:color-swatch" class="w-5 h-5 text-primary" />
          <div>
            <p class="text-sm font-medium text-gray-700">Using Primary App Colors</p>
            <p class="text-xs text-gray-500">Background and text colors match your site theme</p>
          </div>
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
          <label class="block text-sm font-medium text-gray-700">Statistics</label>
          <button @click="addStat" class="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">
            <Icon name="heroicons-outline:plus" class="h-4 w-4 inline mr-1" />
            Add Stat
          </button>
        </div>
        <div class="space-y-4">
          <div v-for="(stat, index) in stats" :key="index" class="p-4 bg-gray-50 rounded-lg space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Stat {{ index + 1 }}</span>
              <button @click="removeStat(index)" class="text-red-600 hover:text-red-700">
                <Icon name="heroicons-outline:trash" class="h-4 w-4" />
              </button>
            </div>
            
            <!-- Icon Picker -->
            <SettingsIconPicker v-model="stat.icon" label="Icon" />
            
            <input v-model="stat.value" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300" placeholder="Value (e.g., 1000+)" />
            <input v-model="stat.label_translations[editorLanguage]" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300" placeholder="Label" />
            <textarea v-model="stat.description_translations[editorLanguage]" rows="2" class="w-full px-3 py-2 rounded-lg border border-gray-300" placeholder="Description (optional)"></textarea>
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
const sectionData = ref({ technology_id: props.technologyId, section_key: 'tech_stats', section_type: 'stats', is_active: true, title_translations: { ar: '', en: '', fr: '' }, content_translations: { ar: '', en: '', fr: '' }, background_color: 'rgb(var(--primary-color))', text_color: 'rgb(var(--primary-contrast-color))', additional_data: { stats: [] } })
const editData = ref({})

const stats = computed(() => editData.value.additional_data?.stats || [])
const getCurrentLanguageName = () => languages.find(l => l.code === editorLanguage.value)?.name || ''

const loadData = async () => {
  try {
    const { data } = await fetchSectionByKey(props.technologyId, 'tech_stats')
    if (data) sectionData.value = { ...sectionData.value, ...data }
  } catch (error) {
    console.error(error)
  }
}

const startEdit = () => {
  editData.value = JSON.parse(JSON.stringify(sectionData.value))
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

const addStat = () => {
  if (!editData.value.additional_data.stats) editData.value.additional_data.stats = []
  editData.value.additional_data.stats.push({ icon: 'heroicons-outline:chart-bar', value: '', label_translations: { ar: '', en: '', fr: '' }, description_translations: { ar: '', en: '', fr: '' } })
}

const removeStat = (index) => {
  editData.value.additional_data.stats.splice(index, 1)
}

onMounted(loadData)
watch(() => props.technologyId, loadData)
</script>