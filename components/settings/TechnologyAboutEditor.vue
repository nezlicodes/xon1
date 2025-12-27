<template>
  <AdminEditorCard
    title="About Section"
    subtitle="Detailed description with images and key points"
    icon="heroicons-outline:information-circle"
    color="green"
    :is-editing="isEditing"
    :is-active="sectionData.is_active"
    :saving="saving"
    @edit="startEdit"
    @save="saveChanges"
    @cancel="cancelEdit"
    @toggle-visibility="toggleVisibility"
  >
    <template #preview>
      <TechnologyAbout :section="sectionData" />
    </template>
    
    <template #edit>
      <div class="space-y-6">
        <!-- Color Scheme -->
        <AdminColorSelector
          v-model:background="editData.background_color"
          v-model:text="editData.text_color"
        />

        <!-- Content Fields -->
        <div class="grid grid-cols-1 gap-6">
          <AdminFormField
            v-model="editData.title_translations[editorLanguage]"
            type="text"
            label="Section Title"
            placeholder="About Our Technology"
            :language-code="editorLanguage"
            :language-name="getCurrentLanguageName()"
            help="Give this section a clear, descriptive title"
          />

          <AdminFormField
            v-model="editData.content_translations[editorLanguage]"
            type="textarea"
            label="Description"
            :rows="6"
            placeholder="Write a detailed description about this technology..."
            :language-code="editorLanguage"
            :language-name="getCurrentLanguageName()"
            help="Explain the technology in detail, its benefits, and how it works"
          />
        </div>

        <!-- Media Section -->
        <div class="space-y-6">
          <h4 class="text-lg font-semibold text-gray-800 border-b pb-2">Media & Layout</h4>
          
          <AdminFormField
            v-model="imagePosition"
            type="select"
            label="Image Position"
            :options="[
              { value: 'right', label: 'Right side' },
              { value: 'left', label: 'Left side' }
            ]"
            help="Choose where to position the image relative to the text"
          />
          
          <!-- Main Image -->
          <AdminFormField
            type="file"
            label="Main Image"
            placeholder="Upload an image that represents this technology"
            accept="image/*"
            :uploading="uploadingImage"
            :upload-progress="imageProgress"
            :file-preview="editData.image_url"
            file-type="image"
            help="Recommended: 800x600px or higher, JPG/PNG format"
            @file-selected="uploadImage"
            @remove-file="editData.image_url = ''"
          />

          <AdminFormField
            v-model="editData.image_url"
            type="url"
            label="Or paste image URL"
            placeholder="https://example.com/image.jpg"
            help="Alternative to uploading - paste a direct link to an image"
          />

          <!-- Optional Video -->
          <AdminFormField
            type="file"
            label="Video (Optional)"
            placeholder="Upload a video demonstration"
            accept="video/*"
            :uploading="uploadingVideo"
            :upload-progress="videoProgress"
            :file-preview="editData.video_url"
            file-type="video"
            help="Optional: Show the technology in action with a video"
            @file-selected="uploadVideo"
            @remove-file="editData.video_url = ''"
          />

          <AdminFormField
            v-model="editData.video_url"
            type="url"
            label="Or paste video URL"
            placeholder="https://example.com/video.mp4"
            help="Alternative to uploading - paste a direct link to a video"
          />
        </div>

        <!-- Key Points -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-lg font-semibold text-gray-800">Key Points</h4>
            <button 
              @click="addKeyPoint" 
              class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
              <Icon name="heroicons-outline:plus" class="h-4 w-4" />
              Add Point
            </button>
          </div>
          
          <div v-if="!keyPoints?.length" class="text-center py-8 text-gray-400">
            <Icon name="heroicons-outline:light-bulb" class="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No key points yet</p>
            <p class="text-sm">Add bullet points to highlight important features</p>
          </div>
          
          <div class="space-y-3">
            <div 
              v-for="(point, index) in keyPoints" 
              :key="index" 
              class="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3"
            >
              <Icon name="heroicons-outline:check-circle" class="h-5 w-5 text-green-600 flex-shrink-0" />
              <AdminFormField
                v-model="point.text_translations[editorLanguage]"
                type="text"
                placeholder="Enter a key benefit or feature"
                :language-code="editorLanguage"
                :language-name="getCurrentLanguageName()"
                class="flex-1"
              />
              <button 
                @click="removeKeyPoint(index)" 
                class="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all flex-shrink-0"
              >
                <Icon name="heroicons-outline:trash" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </AdminEditorCard>
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
const sectionData = ref({ technology_id: props.technologyId, section_key: 'tech_about', section_type: 'about', is_active: true, title_translations: { ar: '', en: '', fr: '' }, content_translations: { ar: '', en: '', fr: '' }, background_color: 'rgb(255, 255, 255)', text_color: 'rgb(17, 24, 39)', image_url: '', video_url: '', additional_data: { image_position: 'right', key_points: [] } })
const editData = ref({})

const imagePosition = computed({ get: () => editData.value.additional_data?.image_position || 'right', set: (val) => { if (!editData.value.additional_data) editData.value.additional_data = {}; editData.value.additional_data.image_position = val } })
const keyPoints = computed(() => editData.value.additional_data?.key_points || [])
const getCurrentLanguageName = () => languages.find(l => l.code === editorLanguage.value)?.name || ''

const loadData = async () => {
  try {
    const { data } = await fetchSectionByKey(props.technologyId, 'tech_about')
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

const uploadImage = async (file) => {
  if (!file) return
  if (!file.type.startsWith('image/')) { showError('Please select an image'); return }
  if (file.size > 5 * 1024 * 1024) { showError('Image must be less than 5MB'); return }

  uploadingImage.value = true
  imageProgress.value = 0
  try {
    const fileExt = file.name.split('.').pop()
    const filePath = `technologies/${props.technologyId}/about-${Date.now()}.${fileExt}`
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
  }
}

const uploadVideo = async (file) => {
  if (!file) return
  if (!file.type.startsWith('video/')) { showError('Please select a video'); return }
  if (file.size > 50 * 1024 * 1024) { showError('Video must be less than 50MB'); return }

  uploadingVideo.value = true
  videoProgress.value = 0
  try {
    const fileExt = file.name.split('.').pop()
    const filePath = `technologies/${props.technologyId}/about-video-${Date.now()}.${fileExt}`
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
  }
}

const addKeyPoint = () => {
  if (!editData.value.additional_data.key_points) editData.value.additional_data.key_points = []
  editData.value.additional_data.key_points.push({ text_translations: { ar: '', en: '', fr: '' } })
}

const removeKeyPoint = (index) => {
  editData.value.additional_data.key_points.splice(index, 1)
}

onMounted(loadData)
watch(() => props.technologyId, loadData)
</script>