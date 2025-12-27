<template>
  <div class="space-y-3">
    <!-- Hero Section Preview with Inline Editing -->
    <div class="bg-white shadow overflow-hidden relative">
      <!-- Toggle visibility button -->
      <button
        @click="toggleVisibility"
        class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        :title="sectionData.is_active ? 'Hide Hero Section' : 'Show Hero Section'"
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
            name="heroicons-outline:photograph"
            class="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Hero Section Hidden</h3>
          <p class="mt-1 text-sm text-gray-500">
            Click the eye icon to show the hero section
          </p>
        </div>
      </div>

      <!-- Hero content when visible -->
      <div v-if="sectionData.is_active" class="relative">
        <!-- Background with overlay -->
        <div class="relative min-h-[70vh] w-full overflow-hidden"
             :style="{ backgroundColor: sectionData.background_color || 'rgb(var(--primary-color))' }">
          
          <!-- Background Image/Video -->
          <div v-if="sectionData.image_url || sectionData.video_url" class="absolute inset-0">
            <video 
              v-if="sectionData.video_url"
              :src="sectionData.video_url"
              autoplay 
              loop 
              muted 
              playsinline
              class="w-full h-full object-cover"
            />
            <div 
              v-else-if="sectionData.image_url"
              class="w-full h-full bg-cover bg-center"
              :style="{ backgroundImage: `url(${sectionData.image_url})` }"
            />
            <!-- Dark overlay for text readability -->
            <div class="absolute inset-0 bg-black/40"></div>
          </div>

          <!-- Hero Content -->
          <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            
            <!-- Editable Title -->
            <div class="relative mb-6 group">
              <h1 
                class="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up transition-all duration-300 group-hover:ring-2 group-hover:ring-white/30 rounded-lg p-4"
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

            <!-- Editable Subtitle -->
            <div class="relative mb-8 group">
              <p 
                class="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-200 transition-all duration-300 group-hover:ring-2 group-hover:ring-white/30 rounded-lg p-4"
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
            <div class="flex flex-wrap gap-4 justify-center animate-fade-in-up animation-delay-400">
              <div
                v-for="(button, index) in sectionData.additional_data?.buttons || []"
                :key="index"
                class="relative group cursor-pointer"
                @click="editButton(index)"
              >
                <button
                  class="inline-flex items-center px-8 py-3 border-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 border-current bg-current bg-opacity-20 hover:bg-opacity-30"
                >
                  {{ getButtonText(button) || 'Button Text' }}
                  <Icon name="heroicons-outline:arrow-right" class="ml-2 h-5 w-5" />
                </button>
                <Icon 
                  class="absolute -top-1 -right-1 w-5 h-5 bg-primary text-contrast1 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all" 
                  name="heroicons-outline:pencil" 
                />
              </div>
              
              <!-- Add Button -->
<!--               <button
                @click="addButton"
                class="px-8 py-3 rounded-lg font-medium border-2 border-dashed border-white/50 text-white/70 hover:border-white hover:text-white transition-all duration-300 flex items-center gap-2"
              >
                <Icon name="heroicons-outline:plus" class="w-4 h-4" />
                Add Button
              </button> -->
            </div>
          </div>

          <!-- Media Upload Area -->
          <div class="absolute bottom-4 left-4 space-y-2 z-30">
            <button
              @click.stop="openMediaEditor"
              class="bg-white/90 backdrop-blur-sm hover:bg-white px-3 py-2 rounded-lg text-gray-800 text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <Icon name="heroicons-outline:photograph" class="w-4 h-4" />
              Change Background
            </button>
            
            <!-- Color Picker - Simplified -->
            <div 
              v-if="showColorPicker"
              class="absolute bottom-12 left-0 bg-white rounded-lg shadow-xl p-4 min-w-[300px] z-40"
              @click.stop
            >
              <h4 class="text-sm font-medium text-gray-700 mb-3">Colors</h4>
              <div class="space-y-3">
                <button
                  @click.stop="setColors('primary')"
                  class="w-full p-3 rounded-lg border-2 border-primary bg-primary text-contrast1 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Primary Colors
                </button>
                <button
                  @click.stop="setColors('secondary')"
                  class="w-full p-3 rounded-lg border-2 border-secondary bg-secondary text-contrast2 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Secondary Colors
                </button>
                <button
                  @click.stop="setColors('body')"
                  class="w-full p-3 rounded-lg border-2 border-gray-300 bg-background text-mgray text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Body Colors
                </button>
              </div>
            </div>
            
            <button
              @click.stop="showColorPicker = !showColorPicker"
              class="bg-white/90 backdrop-blur-sm hover:bg-white px-3 py-2 rounded-lg text-gray-800 text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <Icon name="heroicons-outline:color-swatch" class="w-4 h-4" />
              Colors
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Field Editor Modal -->
    <div v-if="editingField" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeFieldEditor">
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
            placeholder="Enter an engaging title"
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
            placeholder="Enter description"
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
              placeholder="Learn More"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Button Link</label>
            <input
              v-model="editData.additional_data.buttons[parseInt(editingField.split('-')[1])].link"
              type="text"
              placeholder="/products or https://example.com"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Button Style</label>
            <div class="grid grid-cols-1 gap-3">
              <button
                @click="editData.additional_data.buttons[parseInt(editingField.split('-')[1])].style = 'primary'"
                :class="editData.additional_data.buttons[parseInt(editingField.split('-')[1])].style === 'primary' ? 'ring-2 ring-primary' : ''"
                class="p-3 rounded-lg bg-primary text-contrast1 font-medium transition-all"
              >
                Primary
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

    <!-- Media Editor Modal -->
    <div v-if="showMediaEditor" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]" @click.self="showMediaEditor = false">
      <div class="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-semibold text-gray-800">Change Background</h3>
              <p class="text-sm text-gray-500 mt-1">Upload or select background media</p>
            </div>
            <button
              @click="showMediaEditor = false"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Icon name="heroicons-outline:x" class="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <!-- Media Tabs -->
        <div class="p-6">
          <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            <button
              @click="activeMediaTab = 'image'"
              :class="[
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                activeMediaTab === 'image' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              ]"
            >
              <Icon name="heroicons-outline:photograph" class="h-4 w-4 inline mr-2" />
              Background Image
            </button>
            <button
              @click="activeMediaTab = 'video'"
              :class="[
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                activeMediaTab === 'video' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              ]"
            >
              <Icon name="heroicons-outline:video-camera" class="h-4 w-4 inline mr-2" />
              Background Video
            </button>
            <button
              @click="activeMediaTab = 'none'"
              :class="[
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                activeMediaTab === 'none' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              ]"
            >
              <Icon name="heroicons-outline:ban" class="h-4 w-4 inline mr-2" />
              No Media
            </button>
          </div>

          <!-- Image Tab -->
          <div v-if="activeMediaTab === 'image'" class="space-y-6">
            <div class="space-y-4">
              <!-- Image Upload -->
              <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700">Upload Background Image</label>
                <label class="cursor-pointer block">
                  <div class="px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary transition-colors">
                    <Icon name="heroicons-outline:cloud-upload" class="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p class="text-sm font-medium text-gray-700">Click to upload image</p>
                    <p class="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                  </div>
                  <input type="file" accept="image/*" class="hidden" @change="uploadImage($event.target.files[0])" />
                </label>
                
                <!-- Upload Progress -->
                <div v-if="uploadingImage" class="space-y-2">
                  <div class="flex items-center gap-2 text-sm text-primary">
                    <Icon name="heroicons-outline:refresh" class="h-4 w-4 animate-spin" />
                    <span>Uploading... {{ imageUploadProgress }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-primary h-2 rounded-full transition-all duration-300" :style="{ width: imageUploadProgress + '%' }"></div>
                  </div>
                </div>
              </div>

              <!-- URL Input -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Or paste image URL</label>
                <input
                  v-model="tempImageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                />
                <p class="text-xs text-gray-500">Alternative to uploading - paste a direct link</p>
              </div>
            </div>

            <!-- Image Preview -->
            <div v-if="tempImageUrl || sectionData.image_url" class="space-y-4">
              <h4 class="text-lg font-medium text-gray-800">Preview</h4>
              <div class="relative">
                <img 
                  :src="tempImageUrl || sectionData.image_url" 
                  alt="Background preview" 
                  class="w-full h-64 object-cover rounded-lg border"
                />
                <div class="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                  <div class="text-white text-center">
                    <h5 class="font-semibold">Background Preview</h5>
                    <p class="text-sm opacity-80">Content will appear over this image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Video Tab -->
          <div v-if="activeMediaTab === 'video'" class="space-y-6">
            <div class="space-y-4">
              <!-- Video Upload -->
              <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700">Upload Background Video</label>
                <label class="cursor-pointer block">
                  <div class="px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary transition-colors">
                    <Icon name="heroicons-outline:video-camera" class="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p class="text-sm font-medium text-gray-700">Click to upload video</p>
                    <p class="text-xs text-gray-500 mt-1">MP4 up to 50MB</p>
                  </div>
                  <input type="file" accept="video/*" class="hidden" @change="uploadVideo($event.target.files[0])" />
                </label>
                
                <!-- Upload Progress -->
                <div v-if="uploadingVideo" class="space-y-2">
                  <div class="flex items-center gap-2 text-sm text-primary">
                    <Icon name="heroicons-outline:refresh" class="h-4 w-4 animate-spin" />
                    <span>Uploading... {{ videoUploadProgress }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-primary h-2 rounded-full transition-all duration-300" :style="{ width: videoUploadProgress + '%' }"></div>
                  </div>
                </div>
              </div>

              <!-- URL Input -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Or paste video URL</label>
                <input
                  v-model="tempVideoUrl"
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                />
                <p class="text-xs text-gray-500">Alternative to uploading - paste a direct link</p>
              </div>
            </div>

            <!-- Video Preview -->
            <div v-if="tempVideoUrl || sectionData.video_url" class="space-y-4">
              <h4 class="text-lg font-medium text-gray-800">Preview</h4>
              <video 
                :src="tempVideoUrl || sectionData.video_url" 
                class="w-full h-64 object-cover rounded-lg border"
                controls
                muted
              />
            </div>
          </div>

          <!-- No Media Tab -->
          <div v-if="activeMediaTab === 'none'" class="text-center py-12">
            <Icon name="heroicons-outline:ban" class="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h4 class="text-lg font-medium text-gray-800 mb-2">No Background Media</h4>
            <p class="text-gray-500">The section will use only the background color</p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-6 border-t border-gray-200 bg-gray-50">
          <div class="flex justify-end gap-3">
            <button
              @click="showMediaEditor = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="applyMediaChanges"
              class="px-6 py-2 bg-primary text-contrast1 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Apply Changes
            </button>
          </div>
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
  section_key: 'tech_hero',
  section_type: 'hero',
  is_active: true,
  title_translations: { ar: '', en: '', fr: '' },
  content_translations: { ar: '', en: '', fr: '' },
  background_color: 'rgb(var(--primary-color))',
  text_color: 'rgb(var(--primary-contrast-color))',
  image_url: '',
  video_url: '',
  additional_data: { buttons: [] }
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

const removeButton = (index) => {
  sectionData.value.additional_data.buttons.splice(index, 1)
  closeFieldEditor()
  saveSection()
}

const setColors = async (colorScheme) => {
  switch (colorScheme) {
    case 'primary':
      sectionData.value.background_color = 'rgb(var(--primary-color))'
      sectionData.value.text_color = 'rgb(var(--primary-contrast-color))'
      break
    case 'secondary':
      sectionData.value.background_color = 'rgb(var(--secondary-color))'
      sectionData.value.text_color = 'rgb(var(--secondary-contrast-color))'
      break
    case 'body':
      sectionData.value.background_color = 'rgb(var(--background-color))'
      sectionData.value.text_color = 'rgb(var(--text-color))'
      break
  }
  await saveSection()
  showColorPicker.value = false
}

const loadData = async () => {
  if (!props.technologyId) return
  
  try {
    const { data } = await fetchSectionByKey(props.technologyId, 'tech_hero')
    if (data) {
      // Ensure additional_data exists and has proper structure
      if (!data.additional_data) {
        data.additional_data = { buttons: [] }
      }
      if (!data.additional_data.buttons) {
        data.additional_data.buttons = []
      }
      sectionData.value = { ...sectionData.value, ...data }
      console.log('Loaded section data:', sectionData.value)
    } else {
      console.log('No section data found, using defaults')
    }
  } catch (error) {
    console.error('Error loading section data:', error)
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

const editButton = (index) => {
  editingField.value = `button-${index}`
  editData.value = JSON.parse(JSON.stringify(sectionData.value))
}

const showMediaEditor = ref(false)
const activeMediaTab = ref('image')
const tempImageUrl = ref('')
const tempVideoUrl = ref('')
const uploadingImage = ref(false)
const uploadingVideo = ref(false)
const imageUploadProgress = ref(0)
const videoUploadProgress = ref(0)

// Initialize Supabase
const supabaseUrl = useRuntimeConfig().public.supabaseUrl
const supabaseKey = useRuntimeConfig().public.supabaseAnonKey
const supabase = useSupabaseClient()

const openMediaEditor = () => {
  // Initialize with current values
  if (sectionData.value.image_url) {
    activeMediaTab.value = 'image'
    tempImageUrl.value = sectionData.value.image_url
  } else if (sectionData.value.video_url) {
    activeMediaTab.value = 'video' 
    tempVideoUrl.value = sectionData.value.video_url
  } else {
    activeMediaTab.value = 'none'
  }
  showMediaEditor.value = true
}

const uploadImage = async (file) => {
  if (!file || !file.type.startsWith('image/')) {
    showError('Please select an image file')
    return
  }
  
  if (file.size > 5 * 1024 * 1024) {
    showError('Image must be less than 5MB')
    return
  }

  uploadingImage.value = true
  imageUploadProgress.value = 0

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${props.technologyId}/hero-bg-${Date.now()}.${fileExt}`
    const filePath = `technologies/${fileName}`

    const { error } = await supabase.storage.from('site').upload(filePath, file)
    if (error) throw error

    const { data: { publicUrl } } = supabase.storage.from('site').getPublicUrl(filePath)
    tempImageUrl.value = publicUrl
    tempVideoUrl.value = '' // Clear video when image is selected
    imageUploadProgress.value = 100
    
    setTimeout(() => { imageUploadProgress.value = 0 }, 1000)
  } catch (error) {
    console.error(error)
    showError('Failed to upload image')
  } finally {
    uploadingImage.value = false
  }
}

const uploadVideo = async (file) => {
  if (!file || !file.type.startsWith('video/')) {
    showError('Please select a video file')
    return
  }
  
  if (file.size > 50 * 1024 * 1024) {
    showError('Video must be less than 50MB')
    return
  }

  uploadingVideo.value = true
  videoUploadProgress.value = 0

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${props.technologyId}/hero-video-${Date.now()}.${fileExt}`
    const filePath = `technologies/${fileName}`

    const { error } = await supabase.storage.from('site').upload(filePath, file)
    if (error) throw error

    const { data: { publicUrl } } = supabase.storage.from('site').getPublicUrl(filePath)
    tempVideoUrl.value = publicUrl
    tempImageUrl.value = '' // Clear image when video is selected
    videoUploadProgress.value = 100
    
    setTimeout(() => { videoUploadProgress.value = 0 }, 1000)
  } catch (error) {
    console.error(error)
    showError('Failed to upload video')
  } finally {
    uploadingVideo.value = false
  }
}

const applyMediaChanges = async () => {
  if (activeMediaTab.value === 'image') {
    sectionData.value.image_url = tempImageUrl.value
    sectionData.value.video_url = ''
  } else if (activeMediaTab.value === 'video') {
    sectionData.value.video_url = tempVideoUrl.value
    sectionData.value.image_url = ''
  } else {
    sectionData.value.image_url = ''
    sectionData.value.video_url = ''
  }
  
  await saveSection()
  showMediaEditor.value = false
  
  // Reset temp values
  tempImageUrl.value = ''
  tempVideoUrl.value = ''
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

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

.animation-delay-400 {
  animation-delay: 0.4s;
  opacity: 0;
}
</style>