<template>
  <div class="space-y-3">
    <!-- Hero Section Preview with Inline Editing - WYSIWYG -->
    <div class="bg-white shadow overflow-hidden relative rounded-xl">
      
      <!-- Floating Control Bar -->
      <div class="absolute top-4 right-4 z-50 flex items-center gap-2">
        <!-- Visibility Toggle -->
        <button
          @click="toggleVisibility"
          class="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-300"
          :title="sectionData.is_active ? 'Hide Hero Section' : 'Show Hero Section'"
        >
          <Icon
            :name="sectionData.is_active ? 'heroicons-outline:eye' : 'heroicons-outline:eye-off'"
            class="h-5 w-5 text-gray-700"
          />
        </button>

        <!-- Background Button -->
        <button
          @click="openBackgroundEditor"
          class="px-3 py-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium text-gray-700 transition-all duration-300"
        >
          <Icon name="heroicons-outline:photograph" class="w-4 h-4" />
          {{ sectionData.video_url || sectionData.image_url ? 'Change' : 'Add' }} Background
        </button>

        <!-- Color Picker -->
        <div class="relative">
          <button
            @click="showColorPicker = !showColorPicker"
            class="px-3 py-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium text-gray-700 transition-all duration-300"
          >
            <Icon name="heroicons-outline:color-swatch" class="w-4 h-4" />
            Colors
          </button>
          
          <div v-if="showColorPicker" class="absolute right-0 top-12 bg-white rounded-lg shadow-xl p-4 min-w-[300px] space-y-3 z-50">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Color Scheme</h4>
            <button
              @click="applyColorScheme('primary')"
              class="w-full p-3 rounded-lg border-2 border-primary bg-primary text-contrast1 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Primary Colors
            </button>
            <button
              @click="applyColorScheme('secondary')"
              class="w-full p-3 rounded-lg border-2 border-secondary bg-secondary text-contrast2 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Secondary Colors
            </button>
            <button
              @click="applyColorScheme('body')"
              class="w-full p-3 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Body Colors
            </button>
          </div>
        </div>
      </div>

      <!-- Collapsed State -->
      <div
        v-if="!sectionData.is_active"
        class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg"
      >
        <div class="text-center">
          <Icon name="heroicons-outline:document-text" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Hero Section Hidden</h3>
          <p class="mt-1 text-sm text-gray-500">Click the eye icon to show the hero section</p>
        </div>
      </div>

      <!-- WYSIWYG Section Preview - Matches Front-End Exactly -->
      <section
        v-if="sectionData.is_active"
        class="relative min-h-[80vh] pt-32 flex items-center justify-center overflow-hidden"
        :style="{
          backgroundColor: sectionData.background_color || 'rgb(249, 250, 251)',
          color: sectionData.text_color || 'rgb(17, 24, 39)'
        }"
      >
        <!-- Background Media -->
        <div
          v-if="sectionData.video_url || sectionData.image_url || uploadingBackground"
          class="absolute inset-0 z-0"
        >
          <!-- Loading Indicator -->
          <div v-if="uploadingBackground" class="w-full h-full bg-black/10 flex items-center justify-center">
            <div class="text-center">
              <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
              <p class="font-medium text-white">Uploading background...</p>
              <p class="text-sm text-white/80 mt-2">{{ uploadProgress }}%</p>
            </div>
          </div>

          <!-- Background Video -->
          <video
            v-else-if="sectionData.video_url"
            :src="sectionData.video_url"
            autoplay
            loop
            muted
            playsinline
            class="w-full h-full object-cover"
          />

          <!-- Background Image -->
          <img
            v-else-if="sectionData.image_url"
            :src="sectionData.image_url"
            alt="About us background"
            class="w-full h-full object-cover"
          />

          <!-- Dark overlay for better text readability -->
          <div class="absolute inset-0 bg-black opacity-40"></div>

          <!-- Edit/Remove buttons for background -->
          <div class="absolute top-4 left-4 z-10 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
            <button
              @click="openBackgroundEditor"
              class="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
              title="Change background"
            >
              <Icon name="heroicons-outline:pencil" class="w-5 h-5 text-gray-700" />
            </button>
            <button
              @click="removeBackground"
              class="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all"
              title="Remove background"
            >
              <Icon name="heroicons-outline:trash" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Decorative elements (only if no background media) -->
        <div v-else class="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            class="absolute -top-40 -right-40 w-80 h-80 opacity-5 rounded-full blur-3xl" 
            :style="{ backgroundColor: sectionData.text_color || 'currentColor' }"
          ></div>
          <div 
            class="absolute -bottom-40 -left-40 w-80 h-80 opacity-5 rounded-full blur-3xl" 
            :style="{ backgroundColor: sectionData.text_color || 'currentColor' }"
          ></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <!-- Editable Title -->
          <div class="relative mb-6 inline-block group">
            <h1 class="text-5xl md:text-6xl font-bold animate-fade-in-up">
              {{ currentTitle || 'Click to add title' }}
            </h1>
            <button
              @click="openFieldEditor('title')"
              class="absolute -top-3 -right-12 bg-white p-2 rounded-full text-gray-700 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              title="Edit title"
            >
              <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
            </button>
          </div>

          <!-- Editable Subtitle -->
          <div class="relative inline-block group max-w-3xl mb-8">
            <p class="text-xl md:text-2xl opacity-90 animate-fade-in-up animation-delay-200">
              {{ currentContent || 'Click to add subtitle' }}
            </p>
            <button
              @click="openFieldEditor('content')"
              class="absolute -top-2 -right-10 bg-white p-2 rounded-full text-gray-700 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              title="Edit subtitle"
            >
              <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
            </button>
          </div>

          <!-- CTA Button -->
          <div class="animate-fade-in-up animation-delay-400 relative block group">
            <NuxtLink
              v-if="sectionData.additional_data?.cta_text?.[editorLanguage] && sectionData.additional_data?.cta_link"
              :to="sectionData.additional_data.cta_link"
              @click.prevent="openFieldEditor('cta')"
              class="inline-flex items-center px-8 py-3 bg-primary text-contrast1  border-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 border-current bg-opacity-20 hover:bg-opacity-30 cursor-pointer"
            >
              {{ currentCtaText || 'Learn More' }}
              <Icon name="heroicons-outline:arrow-right" class="ml-2 h-5 w-5" />
            </NuxtLink>
            <button
              v-else
              @click="openFieldEditor('cta')"
              class="px-8 py-3 rounded-lg font-medium border-2 border-dashed border-current opacity-50 hover:opacity-100 transition-all duration-300 flex items-center gap-2"
            >
              <Icon name="heroicons-outline:plus" class="w-4 h-4" />
              Add CTA Button
            </button>
            
            <!-- Edit indicator -->
            <button
              v-if="sectionData.additional_data?.cta_text?.[editorLanguage]"
              @click="openFieldEditor('cta')"
              class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-700 px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs font-medium whitespace-nowrap"
            >
              <Icon name="heroicons-outline:pencil" class="w-3 h-3 inline mr-1" />
              Edit Button
            </button>
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Icon name="heroicons-outline:chevron-down" class="h-8 w-8" />
        </div>
      </section>
    </div>

    <!-- Field Editor Modal -->
    <div v-if="editingField !== null" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" @click.self="closeFieldEditor">
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">
            {{ getModalTitle() }}
          </h3>
          <button
            @click="closeFieldEditor"
            class="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Icon name="heroicons-outline:x" class="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <!-- Title Editor -->
        <AdminFormField
          v-if="editingField === 'title'"
          v-model="editData.title_translations[editorLanguage]"
          type="text"
          label="Hero Title"
          placeholder="About Us"
          :language-code="editorLanguage"
          :language-name="getCurrentLanguageName()"
        />
        
        <!-- Content Editor -->
        <AdminFormField
          v-else-if="editingField === 'content'"
          v-model="editData.content_translations[editorLanguage]"
          type="textarea"
          label="Hero Subtitle"
          :rows="3"
          placeholder="Learn more about our company..."
          :language-code="editorLanguage"
          :language-name="getCurrentLanguageName()"
        />

        <!-- CTA Editor -->
        <div v-else-if="editingField === 'cta'" class="space-y-4">
          <AdminFormField
            v-model="editData.additional_data.cta_text[editorLanguage]"
            type="text"
            label="Button Text"
            placeholder="Learn More"
            :language-code="editorLanguage"
            :language-name="getCurrentLanguageName()"
          />
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Button Link</label>
            <input
              v-model="editData.additional_data.cta_link"
              type="text"
              placeholder="/about or https://example.com"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <p class="text-xs text-gray-500">Internal link (e.g. /contact) or external URL</p>
          </div>

          <button
            v-if="editData.additional_data?.cta_text?.[editorLanguage] || editData.additional_data?.cta_link"
            @click="removeCta"
            class="w-full px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
          >
            Remove CTA Button
          </button>
        </div>

        <!-- Background Media Editor -->
        <div v-else-if="editingField === 'background'" class="space-y-4">
          <!-- Media Type Tabs -->
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
              Image
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
              Video
            </button>
          </div>

          <!-- Loading Indicator -->
          <div v-if="uploadingBackground" class="border-2 border-primary/20 rounded-lg p-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div class="text-center">
              <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
              <p class="text-gray-700 font-medium text-lg">Uploading...</p>
              <p class="text-sm text-gray-500 mt-2">{{ uploadProgress }}%</p>
            </div>
          </div>

          <!-- Image Tab -->
          <div v-else-if="activeMediaTab === 'image'" class="space-y-4">
            <!-- Current Image Preview -->
            <div v-if="tempImageUrl" class="relative group">
              <img
                :src="tempImageUrl"
                alt="Background preview"
                class="w-full h-64 object-cover rounded-lg"
              />
              <button
                @click="tempImageUrl = ''"
                class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
              >
                <Icon name="heroicons-outline:trash" class="w-4 h-4" />
              </button>
            </div>

            <!-- Upload Button -->
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                @change="handleImageUpload"
                accept="image/*"
                class="hidden"
                id="image-upload"
              />
              <label for="image-upload" class="cursor-pointer flex flex-col items-center space-y-2">
                <Icon name="heroicons-outline:cloud-upload" class="w-8 h-8 text-gray-400" />
                <span class="text-sm text-gray-600">Click to upload image</span>
                <span class="text-xs text-gray-400">PNG, JPG up to 10MB</span>
              </label>
            </div>

            <!-- URL Input -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Or paste image URL</label>
              <input
                v-model="tempImageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>

          <!-- Video Tab -->
          <div v-else-if="activeMediaTab === 'video'" class="space-y-4">
            <!-- Current Video Preview -->
            <div v-if="tempVideoUrl" class="relative group">
              <video
                :src="tempVideoUrl"
                class="w-full h-64 object-cover rounded-lg"
                controls
              />
              <button
                @click="tempVideoUrl = ''"
                class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
              >
                <Icon name="heroicons-outline:trash" class="w-4 h-4" />
              </button>
            </div>

            <!-- Upload Button -->
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                @change="handleVideoUpload"
                accept="video/*"
                class="hidden"
                id="video-upload"
              />
              <label for="video-upload" class="cursor-pointer flex flex-col items-center space-y-2">
                <Icon name="heroicons-outline:cloud-upload" class="w-8 h-8 text-gray-400" />
                <span class="text-sm text-gray-600">Click to upload video</span>
                <span class="text-xs text-gray-400">MP4, WebM up to 50MB</span>
              </label>
            </div>

            <!-- URL Input -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Or paste video URL</label>
              <input
                v-model="tempVideoUrl"
                type="url"
                placeholder="https://example.com/video.mp4"
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="closeFieldEditor"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            :disabled="uploadingBackground"
          >
            Cancel
          </button>
          <button
            @click="saveField"
            class="px-4 py-2 bg-primary text-contrast1 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="uploadingBackground"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { editorLanguage } = useEditorLanguage()
const { fetchSectionByKey } = useAboutUs()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()
const supabase = useSupabaseClient()

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'en', name: 'English' }
]

const editingField = ref(null)
const showColorPicker = ref(false)
const editData = ref({})
const uploadingBackground = ref(false)
const uploadProgress = ref(0)
const activeMediaTab = ref('image')
const tempImageUrl = ref('')
const tempVideoUrl = ref('')

const sectionData = ref({
  section_key: 'about_hero',
  section_type: 'hero',
  is_active: true,
  title_translations: { ar: '', en: '', fr: '' },
  content_translations: { ar: '', en: '', fr: '' },
  background_color: 'rgb(249, 250, 251)',
  text_color: 'rgb(17, 24, 39)',
  video_url: '',
  image_url: '',
  additional_data: {
    cta_text: { ar: '', en: '', fr: '' },
    cta_link: ''
  }
})

const currentTitle = computed(() => sectionData.value.title_translations?.[editorLanguage.value] || '')
const currentContent = computed(() => sectionData.value.content_translations?.[editorLanguage.value] || '')
const currentCtaText = computed(() => sectionData.value.additional_data?.cta_text?.[editorLanguage.value] || '')

const getCurrentLanguageName = () => languages.find(l => l.code === editorLanguage.value)?.name || ''

const getModalTitle = () => {
  if (editingField.value === 'title') return 'Edit Hero Title'
  if (editingField.value === 'content') return 'Edit Hero Subtitle'
  if (editingField.value === 'cta') return 'Edit CTA Button'
  if (editingField.value === 'background') return 'Edit Background Media'
  return 'Edit'
}

const applyColorScheme = (scheme) => {
  if (scheme === 'primary') {
    sectionData.value.background_color = 'rgb(var(--primary-color))'
    sectionData.value.text_color = 'rgb(var(--primary-contrast-color))'
  } else if (scheme === 'secondary') {
    sectionData.value.background_color = 'rgb(var(--secondary-color))'
    sectionData.value.text_color = 'rgb(var(--secondary-contrast-color))'
  } else if (scheme === 'body') {
    sectionData.value.background_color = 'rgb(249, 250, 251)'
    sectionData.value.text_color = 'rgb(17, 24, 39)'
  }
  showColorPicker.value = false
  saveSection()
}

// Image upload handler
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showError('Please select an image file')
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    showError('Image must be less than 10MB')
    return
  }

  uploadingBackground.value = true
  uploadProgress.value = 0

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `about/hero-bg-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('site')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('site')
      .getPublicUrl(fileName)

    tempImageUrl.value = publicUrl
    tempVideoUrl.value = ''
    uploadProgress.value = 100
  } catch (error) {
    console.error('Upload error:', error)
    showError('Failed to upload image')
  } finally {
    uploadingBackground.value = false
    uploadProgress.value = 0
  }
}

// Video upload handler
const handleVideoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('video/')) {
    showError('Please select a video file')
    return
  }

  if (file.size > 50 * 1024 * 1024) {
    showError('Video must be less than 50MB')
    return
  }

  uploadingBackground.value = true
  uploadProgress.value = 0

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `about/hero-video-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('site')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('site')
      .getPublicUrl(fileName)

    tempVideoUrl.value = publicUrl
    tempImageUrl.value = ''
    uploadProgress.value = 100
  } catch (error) {
    console.error('Upload error:', error)
    showError('Failed to upload video')
  } finally {
    uploadingBackground.value = false
    uploadProgress.value = 0
  }
}

const removeBackground = async () => {
  sectionData.value.video_url = ''
  sectionData.value.image_url = ''
  await saveSection()
}

const removeCta = () => {
  editData.value.additional_data.cta_text = { ar: '', en: '', fr: '' }
  editData.value.additional_data.cta_link = ''
}

const openBackgroundEditor = () => {
  editingField.value = 'background'
  if (sectionData.value.image_url) {
    activeMediaTab.value = 'image'
    tempImageUrl.value = sectionData.value.image_url
  } else if (sectionData.value.video_url) {
    activeMediaTab.value = 'video'
    tempVideoUrl.value = sectionData.value.video_url
  }
}

const loadData = async () => {
  try {
    const { data } = await fetchSectionByKey('about_hero')
    if (data) {
      if (!data.additional_data) {
        data.additional_data = {
          cta_text: { ar: '', en: '', fr: '' },
          cta_link: ''
        }
      }
      if (!data.additional_data.cta_text) {
        data.additional_data.cta_text = { ar: '', en: '', fr: '' }
      }
      
      sectionData.value = { 
        ...sectionData.value, 
        ...data,
        video_url: data.video_url || '',
        image_url: data.image_url || ''
      }
    }
  } catch (error) {
    console.error('Error loading Hero section data:', error)
  }
}

const toggleVisibility = async () => {
  sectionData.value.is_active = !sectionData.value.is_active
  await saveSection()
}

const openFieldEditor = (field) => {
  editingField.value = field
  editData.value = JSON.parse(JSON.stringify(sectionData.value))
  
  if (!editData.value.additional_data) {
    editData.value.additional_data = {
      cta_text: { ar: '', en: '', fr: '' },
      cta_link: ''
    }
  }
  if (!editData.value.additional_data.cta_text) {
    editData.value.additional_data.cta_text = { ar: '', en: '', fr: '' }
  }
}

const closeFieldEditor = () => {
  editingField.value = null
  editData.value = {}
  uploadingBackground.value = false
  tempImageUrl.value = ''
  tempVideoUrl.value = ''
}

const saveField = async () => {
  if (uploadingBackground.value) return
  
  if (editingField.value === 'background') {
    if (activeMediaTab.value === 'image') {
      sectionData.value.image_url = tempImageUrl.value
      sectionData.value.video_url = ''
    } else if (activeMediaTab.value === 'video') {
      sectionData.value.video_url = tempVideoUrl.value
      sectionData.value.image_url = ''
    }
  } else {
    sectionData.value = JSON.parse(JSON.stringify(editData.value))
  }
  
  await saveSection()
  closeFieldEditor()
}

const saveSection = async (showNotification = true) => {
  try {
    const dataToSave = {
      section_key: sectionData.value.section_key,
      section_type: sectionData.value.section_type,
      is_active: sectionData.value.is_active,
      title_translations: sectionData.value.title_translations,
      content_translations: sectionData.value.content_translations,
      background_color: sectionData.value.background_color,
      text_color: sectionData.value.text_color,
      video_url: sectionData.value.video_url || null,
      image_url: sectionData.value.image_url || null,
      additional_data: sectionData.value.additional_data
    }

    if (sectionData.value.id) {
      const { error } = await supabase
        .from('about_us_sections')
        .update(dataToSave)
        .eq('id', sectionData.value.id)
      
      if (error) throw error
    } else {
      const { data, error } = await supabase
        .from('about_us_sections')
        .insert(dataToSave)
        .select()
        .single()
      
      if (error) throw error
      if (data) sectionData.value.id = data.id
    }
    
    if (showNotification) {
      showSuccess('Saved successfully')
    }
  } catch (error) {
    console.error('Save error:', error)
    showError(`Failed to save: ${error.message}`)
  }
}

onMounted(loadData)

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