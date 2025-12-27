<template>
  <div class="bg-white shadow-lg rounded-xl overflow-hidden">
    <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Icon name="heroicons-outline:cursor-click" class="h-6 w-6 text-white" />
        <h3 class="text-lg font-semibold text-white">Call-to-Action Section</h3>
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
            class="px-4 py-2 rounded-lg bg-white text-red-600 hover:bg-gray-100 transition-all flex items-center gap-2"
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
      <TechnologyCallToAction :section="sectionData" />
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

      <!-- Background Image -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
        <div class="flex gap-3 mb-3">
          <label class="flex-1 cursor-pointer">
            <div class="px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 transition-all text-center">
              <Icon name="heroicons-outline:photograph" class="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <span class="text-sm text-gray-600">Upload Image</span>
              <input type="file" accept="image/*" class="hidden" @change="uploadImage" :disabled="uploadingImage" />
            </div>
          </label>
          <input v-model="editData.image_url" type="url" class="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300" placeholder="Or paste URL" />
        </div>
        <div v-if="uploadingImage" class="mb-3">
          <div class="flex items-center gap-2 text-sm text-red-600">
            <Icon name="heroicons-outline:refresh" class="h-4 w-4 animate-spin" />
            <span>Uploading... {{ imageProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div class="bg-red-600 h-2 rounded-full transition-all" :style="{ width: imageProgress + '%' }"></div>
          </div>
        </div>
        <div v-if="editData.image_url" class="relative">
          <NuxtImg :src="editData.image_url" class="w-full h-40 object-cover rounded-lg" />
          <button @click="editData.image_url = ''" class="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <Icon name="heroicons-outline:trash" class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Background Video -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Background Video (optional)</label>
        <div class="flex gap-3 mb-3">
          <label class="flex-1 cursor-pointer">
            <div class="px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 transition-all text-center">
              <Icon name="heroicons-outline:video-camera" class="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <span class="text-sm text-gray-600">Upload Video</span>
              <input type="file" accept="video/*" class="hidden" @change="uploadVideo" :disabled="uploadingVideo" />
            </div>
          </label>
          <input v-model="editData.video_url" type="url" class="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300" placeholder="Or paste URL" />
        </div>
        <div v-if="uploadingVideo" class="mb-3">
          <div class="flex items-center gap-2 text-sm text-red-600">
            <Icon name="heroicons-outline:refresh" class="h-4 w-4 animate-spin" />
            <span>Uploading... {{ videoProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div class="bg-red-600 h-2 rounded-full transition-all" :style="{ width: videoProgress + '%' }"></div>
          </div>
        </div>
        <div v-if="editData.video_url" class="relative">
          <video :src="editData.video_url" class="w-full h-40 rounded-lg" controls></video>
          <button @click="editData.video_url = ''" class="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <Icon name="heroicons-outline:trash" class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- CTA Buttons -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <label class="block text-sm font-medium text-gray-700">CTA Buttons</label>
          <button @click="addButton" class="px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700">
            <Icon name="heroicons-outline:plus" class="h-4 w-4 inline mr-1" />
            Add Button
          </button>
        </div>
        <div class="space-y-3">
          <div v-for="(button, index) in buttons" :key="index" class="p-4 bg-gray-50 rounded-lg space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Button {{ index + 1 }}</span>
              <button @click="removeButton(index)" class="text-red-600 hover:text-red-700">
                <Icon name="heroicons-outline:trash" class="h-4 w-4" />
              </button>
            </div>
            <input v-model="button.text_translations[editorLanguage]" type="text" class="w-full px-3 py-2 rounded-lg border" placeholder="Button text" />
            <input v-model="button.link" type="text" class="w-full px-3 py-2 rounded-lg border" placeholder="Link" />
            <div class="grid grid-cols-2 gap-3">
              <select v-model="button.style" class="px-3 py-2 rounded-lg border">
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </select>
              <SettingsIconPicker v-model="button.icon" label="" />
            </div>
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
const supabase = useSupabaseClient()

const languages = [{ code: 'fr', name: 'Français' }, { code: 'ar', name: 'العربية' }, { code: 'en', name: 'English' }]
const isEditing = ref(false)
const saving = ref(false)
const uploadingImage = ref(false)
const imageProgress = ref(0)
const uploadingVideo = ref(false)
const videoProgress = ref(0)
const sectionData = ref({ technology_id: props.technologyId, section_key: 'tech_cta', section_type: 'cta', is_active: true, title_translations: { ar: '', en: '', fr: '' }, content_translations: { ar: '', en: '', fr: '' }, background_color: 'rgb(17, 24, 39)', text_color: 'rgb(255, 255, 255)', image_url: '', video_url: '', additional_data: { buttons: [] } })
const editData = ref({})

const buttons = computed(() => editData.value.additional_data?.buttons || [])
const getCurrentLanguageName = () => languages.find(l => l.code === editorLanguage.value)?.name || ''

const loadData = async () => {
  try {
    const { data } = await fetchSectionByKey(props.technologyId, 'tech_cta')
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

const uploadImage = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) { showError('Please select an image'); return }
  if (file.size > 5 * 1024 * 1024) { showError('Image must be less than 5MB'); return }

  uploadingImage.value = true
  imageProgress.value = 0
  try {
    const fileExt = file.name.split('.').pop()
    const filePath = `technologies/${props.technologyId}/cta-${Date.now()}.${fileExt}`
    const { error } = await supabase.storage.from('site').upload(filePath, file, { cacheControl: '3600' })
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from('site').getPublicUrl(filePath)
    editData.value.image_url = publicUrl
    imageProgress.value = 100
  } catch (error) {
    console.error(error)
    showError('Failed to upload')
  } finally {
    uploadingImage.value = false
    imageProgress.value = 0
    event.target.value = ''
  }
}

const uploadVideo = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (!file.type.startsWith('video/')) { showError('Please select a video'); return }
  if (file.size > 50 * 1024 * 1024) { showError('Video must be less than 50MB'); return }

  uploadingVideo.value = true
  videoProgress.value = 0
  try {
    const fileExt = file.name.split('.').pop()
    const filePath = `technologies/${props.technologyId}/cta-video-${Date.now()}.${fileExt}`
    const { error } = await supabase.storage.from('site').upload(filePath, file, { cacheControl: '3600' })
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from('site').getPublicUrl(filePath)
    editData.value.video_url = publicUrl
    videoProgress.value = 100
  } catch (error) {
    console.error(error)
    showError('Failed to upload')
  } finally {
    uploadingVideo.value = false
    videoProgress.value = 0
    event.target.value = ''
  }
}

const addButton = () => {
  if (!editData.value.additional_data.buttons) editData.value.additional_data.buttons = []
  editData.value.additional_data.buttons.push({ text_translations: { ar: '', en: '', fr: '' }, link: '', style: 'primary', icon: 'heroicons-outline:arrow-right' })
}

const removeButton = (index) => {
  editData.value.additional_data.buttons.splice(index, 1)
}

onMounted(loadData)
watch(() => props.technologyId, loadData)
</script>