<template>
  <div class="space-y-3">
    <!-- Features Section Preview with Inline Editing - WYSIWYG -->
    <div class="bg-white shadow overflow-hidden relative rounded-xl">
      
      <!-- Floating Control Bar -->
      <div class="absolute top-4 right-4 z-50 flex items-center gap-2">
        <!-- Visibility Toggle -->
        <button
          @click="toggleVisibility"
          class="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-300"
          :title="sectionData.is_active ? 'Hide Features Section' : 'Show Features Section'"
        >
          <Icon
            :name="sectionData.is_active ? 'heroicons-outline:eye' : 'heroicons-outline:eye-off'"
            class="h-5 w-5 text-gray-700"
          />
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
              class="w-full p-3 rounded-lg border-2 border-gray-300 bg-background text-mgray text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Body Colors
            </button>
          </div>
        </div>

        <!-- Add Feature Button -->
        <button
          @click="addFeature"
          class="px-3 py-2 bg-primary text-contrast1 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium hover:bg-primary-600 transition-all duration-300"
        >
          <Icon name="heroicons-outline:plus" class="w-4 h-4" />
          Add Feature
        </button>
      </div>

      <!-- Collapsed State -->
      <div
        v-if="!sectionData.is_active"
        class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg"
      >
        <div class="text-center">
          <Icon name="heroicons-outline:star" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Features Section Hidden</h3>
          <p class="mt-1 text-sm text-gray-500">Click the eye icon to show the features section</p>
        </div>
      </div>

      <!-- WYSIWYG Section Preview - Matches Front-End Exactly -->
      <section
        v-if="sectionData.is_active"
        class="py-20 md:py-28 relative overflow-hidden"
        :style="{
          backgroundColor: sectionData.background_color || 'rgb(249, 250, 251)',
          color: sectionData.text_color || 'rgb(17, 24, 39)'
        }"
      >
        <!-- Background decoration -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <!-- Header -->
          <div class="text-center mb-16 md:mb-20">
            <!-- Editable Title -->
            <div class="relative mb-6 inline-block group">
              <h2 class="text-4xl md:text-5xl font-bold">
                {{ currentTitle || 'Click to add title' }}
              </h2>
              <button
                @click="openFieldEditor('title')"
                class="absolute -top-3 -right-12 bg-primary p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                title="Edit title"
              >
                <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
              </button>
            </div>

            <!-- Editable Description -->
            <div class="relative inline-block group max-w-3xl">
              <p 
                class="text-lg md:text-xl opacity-80 leading-relaxed"
                :style="{ color: sectionData.text_color || 'rgb(17, 24, 39)' }"
              >
                {{ currentContent || 'Click to add description' }}
              </p>
              <button
                @click="openFieldEditor('content')"
                class="absolute -top-2 -right-10 bg-primary p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                title="Edit description"
              >
                <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
              </button>
            </div>

            <!-- Section Media (Image or Video) -->
            <div class="mt-10 max-w-4xl mx-auto">
              <!-- Loading Indicator -->
              <div v-if="uploadingSection" class="rounded-2xl overflow-hidden shadow-2xl border border-primary/10 bg-gray-100 flex items-center justify-center" style="min-height: 300px;">
                <div class="text-center">
                  <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                  <p class="text-gray-600 font-medium">Uploading media...</p>
                  <p class="text-sm text-gray-400 mt-2">Please wait</p>
                </div>
              </div>

              <!-- Section Media Display -->
              <div v-else-if="sectionData.additional_data?.section_media_url" class="relative group">
                <div class="rounded-2xl overflow-hidden shadow-2xl border border-primary/10">
                  <img
                    v-if="sectionData.additional_data.section_media_type === 'image'"
                    :src="sectionData.additional_data.section_media_url"
                    :alt="currentTitle"
                    class="w-full h-auto object-cover"
                  />
                  <video
                    v-else-if="sectionData.additional_data.section_media_type === 'video'"
                    :src="sectionData.additional_data.section_media_url"
                    class="w-full h-auto"
                    controls
                    autoplay
                    loop
                    muted
                    playsinline
                  />
                </div>
                <!-- Edit/Remove Buttons -->
                <button
                  @click="removeSectionMedia"
                  class="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove media"
                >
                  <Icon name="heroicons-outline:trash" class="w-5 h-5" />
                </button>
                <button
                  @click="openFieldEditor('section_media')"
                  class="absolute top-4 left-4 bg-primary hover:bg-primary-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Change media"
                >
                  <Icon name="heroicons-outline:pencil" class="w-5 h-5" />
                </button>
              </div>

              <!-- Add Section Media Button -->
              <button
                v-else
                @click="openFieldEditor('section_media')"
                class="w-full rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary p-12 transition-all duration-300 group hover:bg-primary/5"
              >
                <div class="flex flex-col items-center space-y-3">
                  <div class="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-100 group-hover:from-primary/20 group-hover:to-primary/10 rounded-2xl flex items-center justify-center transition-all">
                    <Icon name="heroicons-outline:photograph" class="w-8 h-8 text-gray-400 group-hover:text-primary" />
                  </div>
                  <div class="text-center">
                    <p class="text-lg font-semibold text-gray-700 group-hover:text-primary">Add Hero Media</p>
                    <p class="text-sm text-gray-500">Upload an image or video for the header</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Features Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <!-- Feature Items -->
            <div
              v-for="(feature, index) in features"
              :key="index"
              class="group relative"
            >
              <!-- Feature Card - Matches Front-End Exactly -->
              <div
                @click="editFeature(index)"
                class="h-full rounded-2xl border p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/30 cursor-pointer bg-white"
              >
                <!-- Loading Indicator -->
                <div v-if="uploadingFeatures[index]" class="mb-6 -mx-8 -mt-8 rounded-t-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center" style="height: 192px;">
                  <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-3"></div>
                    <p class="text-sm font-medium text-gray-700">Uploading...</p>
                  </div>
                </div>

                <!-- Media (Image or Video) -->
                <div v-else-if="feature.media_url" class="mb-6 -mx-8 -mt-8 rounded-t-2xl overflow-hidden">
                  <img
                    v-if="feature.media_type === 'image'"
                    :src="feature.media_url"
                    :alt="feature.title_translations?.[editorLanguage] || 'Feature'"
                    class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <video
                    v-else-if="feature.media_type === 'video'"
                    :src="feature.media_url"
                    class="w-full h-48 object-cover"
                    autoplay
                    loop
                    muted
                    playsinline
                  />
                </div>

                <!-- Icon (if no media) -->
                <div
                  v-if="!feature.media_url && !uploadingFeatures[index]"
                  class="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg"
                >
                  <Icon
                    v-if="feature.icon"
                    :name="feature.icon"
                    class="h-8 w-8 text-white"
                  />
                  <Icon v-else name="heroicons-outline:sparkles" class="h-8 w-8 text-white" />
                </div>

                <!-- Content -->
                <div class="space-y-4">
                  <!-- Title -->
                  <h3 
                    class="text-xl md:text-2xl font-bold leading-tight group-hover transition-colors duration-300"
                    :style="{ color: sectionData.text_color || 'rgb(17, 24, 39)' }"
                  >
                    {{ feature.title_translations?.[editorLanguage] || 'Click to add title' }}
                  </h3>

                  <!-- Description -->
                  <p 
                    class="text-sm md:text-base opacity-75 leading-relaxed"
                    :style="{ color: sectionData.text_color || 'rgb(17, 24, 39)' }"
                  >
                    {{ feature.description_translations?.[editorLanguage] || 'Click to add description' }}
                  </p>
                </div>

                <!-- Hover decoration -->
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/70 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-2xl"></div>

                <!-- Edit indicator -->
                <div class="absolute -top-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                  <Icon name="heroicons-outline:pencil" class="w-4 h-4" />
                </div>
              </div>
            </div>

            <!-- Add Feature Card -->
            <div class="group relative">
              <div
                @click="addFeature"
                class="h-full rounded-2xl border-2 border-dashed border-gray-300 p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary cursor-pointer hover:bg-primary/5 flex items-center justify-center min-h-[300px]"
              >
                <div class="text-center space-y-4">
                  <div class="w-16 h-16 mx-auto bg-gradient-to-br from-gray-200 to-gray-100 group-hover:from-primary/20 group-hover:to-primary/10 rounded-2xl flex items-center justify-center transition-all duration-500">
                    <Icon name="heroicons-outline:plus" class="h-8 w-8 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-500 group-hover:text-primary transition-colors mb-2">
                      Add Feature
                    </h3>
                    <p class="text-sm text-gray-400">
                      Click to add a new feature
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="features.length === 0" class="text-center py-20">
            <Icon name="heroicons-outline:star" class="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p class="text-lg text-gray-600 mb-6">No features yet</p>
            <button
              @click="addFeature"
              class="px-6 py-3 bg-primary text-contrast1 rounded-lg hover:bg-primary-600 transition-all shadow-lg"
            >
              Add Your First Feature
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Field Editor Modal -->
    <div v-if="editingField !== null" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" @click.self="closeFieldEditor">
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">
          {{ getModalTitle() }}
        </h3>
        
        <!-- Section Title -->
        <AdminFormField
          v-if="editingField === 'title'"
          v-model="editData.title_translations[editorLanguage]"
          type="text"
          label="Section Title"
          placeholder="Key Features"
          :language-code="editorLanguage"
          :language-name="getCurrentLanguageName()"
        />
        
        <!-- Section Content -->
        <AdminFormField
          v-else-if="editingField === 'content'"
          v-model="editData.content_translations[editorLanguage]"
          type="textarea"
          label="Description"
          :rows="4"
          placeholder="Describe the main benefits..."
          :language-code="editorLanguage"
          :language-name="getCurrentLanguageName()"
        />

        <!-- Section Media Editor -->
        <div v-else-if="editingField === 'section_media'" class="space-y-4">
          <label class="block text-sm font-medium text-gray-700">Hero Media (Image or Video)</label>
          <p class="text-sm text-gray-500 mb-4">Add a prominent image or video below the description</p>
          
          <!-- Loading Indicator -->
          <div v-if="uploadingSection" class="border-2 border-primary/20 rounded-lg p-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div class="text-center">
              <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
              <p class="text-gray-700 font-medium text-lg">Uploading media...</p>
              <p class="text-sm text-gray-500 mt-2">This may take a moment</p>
            </div>
          </div>

          <!-- Current Media Preview -->
          <div v-else-if="editData.additional_data?.section_media_url" class="relative group">
            <img
              v-if="editData.additional_data.section_media_type === 'image'"
              :src="editData.additional_data.section_media_url"
              alt="Section media"
              class="w-full h-64 object-cover rounded-lg"
            />
            <video
              v-else-if="editData.additional_data.section_media_type === 'video'"
              :src="editData.additional_data.section_media_url"
              class="w-full h-64 object-cover rounded-lg"
              controls
            />
            <button
              @click="removeSectionMediaFromEdit"
              class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
              title="Remove media"
            >
              <Icon name="heroicons-outline:trash" class="w-4 h-4" />
            </button>
          </div>

          <!-- Upload Input -->
          <div v-if="!uploadingSection" class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
            <input
              type="file"
              @change="handleSectionMediaUpload"
              accept="image/*,video/*"
              class="hidden"
              id="section-media-upload"
            />
            <label
              for="section-media-upload"
              class="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Icon name="heroicons-outline:cloud-upload" class="w-8 h-8 text-gray-400" />
              <span class="text-sm text-gray-600">Click to upload image or video</span>
              <span class="text-xs text-gray-400">PNG, JPG, MP4, WebM up to 10MB</span>
            </label>
          </div>
        </div>

        <!-- Feature Editor -->
        <div v-else-if="typeof editingField === 'number'" class="space-y-4">
          <!-- Media Upload Section -->
          <div class="space-y-3">
            <label class="block text-sm font-medium text-gray-700">Feature Media (Image or Video)</label>
            
            <!-- Loading Indicator -->
            <div v-if="uploadingModalFeature" class="border-2 border-primary/20 rounded-lg p-8 bg-gradient-to-br from-primary/5 to-primary/10">
              <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-3"></div>
                <p class="text-gray-700 font-medium">Uploading media...</p>
                <p class="text-xs text-gray-500 mt-2">Please wait</p>
              </div>
            </div>

            <!-- Current Media Preview -->
            <div v-else-if="editData.additional_data.features[editingField].media_url" class="relative group">
              <img
                v-if="editData.additional_data.features[editingField].media_type === 'image'"
                :src="editData.additional_data.features[editingField].media_url"
                alt="Feature media"
                class="w-full h-48 object-cover rounded-lg"
              />
              <video
                v-else-if="editData.additional_data.features[editingField].media_type === 'video'"
                :src="editData.additional_data.features[editingField].media_url"
                class="w-full h-48 object-cover rounded-lg"
                controls
              />
              <button
                @click="removeMedia(editingField)"
                class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
                title="Remove media"
              >
                <Icon name="heroicons-outline:trash" class="w-4 h-4" />
              </button>
            </div>

            <!-- Upload Input -->
            <div v-if="!uploadingModalFeature" class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                @change="handleMediaUpload($event, editingField)"
                accept="image/*,video/*"
                class="hidden"
                :id="`media-upload-${editingField}`"
              />
              <label
                :for="`media-upload-${editingField}`"
                class="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Icon name="heroicons-outline:cloud-upload" class="w-8 h-8 text-gray-400" />
                <span class="text-sm text-gray-600">Click to upload image or video</span>
                <span class="text-xs text-gray-400">PNG, JPG, MP4, WebM up to 10MB</span>
              </label>
            </div>
          </div>

          <!-- Icon Picker (only shown if no media) -->
          <SettingsIconPicker 
            v-if="!editData.additional_data.features[editingField].media_url && !uploadingModalFeature"
            v-model="editData.additional_data.features[editingField].icon" 
            label="Icon (shown when no media is uploaded)" 
          />
          
          <!-- Title -->
          <AdminFormField
            v-model="editData.additional_data.features[editingField].title_translations[editorLanguage]"
            type="text"
            label="Feature Title"
            placeholder="Feature name"
            :language-code="editorLanguage"
            :language-name="getCurrentLanguageName()"
          />
          
          <!-- Description -->
          <AdminFormField
            v-model="editData.additional_data.features[editingField].description_translations[editorLanguage]"
            type="textarea"
            label="Feature Description"
            :rows="3"
            placeholder="Describe this feature..."
            :language-code="editorLanguage"
            :language-name="getCurrentLanguageName()"
          />
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button
            v-if="typeof editingField === 'number'"
            @click="removeFeature(editingField)"
            class="px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50"
          >
            Delete Feature
          </button>
          <button
            @click="closeFieldEditor"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            :disabled="uploadingSection || uploadingModalFeature"
          >
            Cancel
          </button>
          <button
            @click="saveField"
            class="px-4 py-2 bg-primary text-contrast1 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="uploadingSection || uploadingModalFeature"
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
const uploadingFeatures = ref({})
const uploadingModalFeature = ref(false)
const uploadingSection = ref(false)

const sectionData = ref({
  technology_id: props.technologyId,
  section_key: 'tech_features',
  section_type: 'features',
  is_active: true,
  title_translations: { ar: '', en: '', fr: '' },
  content_translations: { ar: '', en: '', fr: '' },
  background_color: 'rgb(249, 250, 251)',
  text_color: 'rgb(17, 24, 39)',
  additional_data: { 
    features: [],
    section_media_url: '',
    section_media_type: ''
  }
})

const features = computed(() => sectionData.value.additional_data?.features || [])
const currentTitle = computed(() => sectionData.value.title_translations?.[editorLanguage.value] || '')
const currentContent = computed(() => sectionData.value.content_translations?.[editorLanguage.value] || '')

const getCurrentLanguageName = () => languages.find(l => l.code === editorLanguage.value)?.name || ''

const getModalTitle = () => {
  if (editingField.value === 'title') return 'Edit Section Title'
  if (editingField.value === 'content') return 'Edit Section Description'
  if (editingField.value === 'section_media') return 'Edit Hero Media'
  if (typeof editingField.value === 'number') return 'Edit Feature'
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

const handleSectionMediaUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 10 * 1024 * 1024) {
    showError('File size must be less than 10MB')
    return
  }

  uploadingSection.value = true
  
  const mediaType = file.type.startsWith('image/') ? 'image' : 'video'

  const reader = new FileReader()
  reader.onload = (e) => {
    if (!editData.value.additional_data) editData.value.additional_data = {}
    editData.value.additional_data.section_media_url = e.target.result
    editData.value.additional_data.section_media_type = mediaType
    uploadingSection.value = false
  }
  reader.onerror = () => {
    showError('Failed to upload media')
    uploadingSection.value = false
  }
  reader.readAsDataURL(file)
}

const removeSectionMedia = async () => {
  if (!sectionData.value.additional_data) sectionData.value.additional_data = {}
  sectionData.value.additional_data.section_media_url = ''
  sectionData.value.additional_data.section_media_type = ''
  await saveSection()
}

const removeSectionMediaFromEdit = () => {
  if (!editData.value.additional_data) editData.value.additional_data = {}
  editData.value.additional_data.section_media_url = ''
  editData.value.additional_data.section_media_type = ''
}

const handleMediaUpload = async (event, featureIndex) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 10 * 1024 * 1024) {
    showError('File size must be less than 10MB')
    return
  }

  uploadingModalFeature.value = true
  uploadingFeatures.value[featureIndex] = true
  
  const mediaType = file.type.startsWith('image/') ? 'image' : 'video'

  const reader = new FileReader()
  reader.onload = (e) => {
    editData.value.additional_data.features[featureIndex].media_url = e.target.result
    editData.value.additional_data.features[featureIndex].media_type = mediaType
    
    if (sectionData.value.additional_data?.features[featureIndex]) {
      sectionData.value.additional_data.features[featureIndex].media_url = e.target.result
      sectionData.value.additional_data.features[featureIndex].media_type = mediaType
    }
    
    uploadingModalFeature.value = false
    uploadingFeatures.value[featureIndex] = false
  }
  reader.onerror = () => {
    showError('Failed to upload media')
    uploadingModalFeature.value = false
    uploadingFeatures.value[featureIndex] = false
  }
  reader.readAsDataURL(file)
}

const removeMedia = (featureIndex) => {
  editData.value.additional_data.features[featureIndex].media_url = ''
  editData.value.additional_data.features[featureIndex].media_type = ''
}

const loadData = async () => {
  if (!props.technologyId) return
  
  try {
    const { data } = await fetchSectionByKey(props.technologyId, 'tech_features')
    if (data) {
      if (!data.additional_data) {
        data.additional_data = { features: [], section_media_url: '', section_media_type: '' }
      }
      if (!data.additional_data.features) {
        data.additional_data.features = []
      }
      if (!data.additional_data.section_media_url) {
        data.additional_data.section_media_url = ''
      }
      if (!data.additional_data.section_media_type) {
        data.additional_data.section_media_type = ''
      }
      sectionData.value = { ...sectionData.value, ...data }
    }
  } catch (error) {
    console.error('Error loading Features section data:', error)
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

const editFeature = (index) => {
  editingField.value = index
  editData.value = JSON.parse(JSON.stringify(sectionData.value))
}

const closeFieldEditor = () => {
  editingField.value = null
  editData.value = {}
  uploadingSection.value = false
  uploadingModalFeature.value = false
}

const saveField = async () => {
  if (uploadingSection.value || uploadingModalFeature.value) {
    return
  }
  
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

const addFeature = () => {
  if (!sectionData.value.additional_data) sectionData.value.additional_data = {}
  if (!sectionData.value.additional_data.features) sectionData.value.additional_data.features = []
  
  sectionData.value.additional_data.features.push({
    icon: 'heroicons-outline:sparkles',
    title_translations: { ar: '', en: '', fr: '' },
    description_translations: { ar: '', en: '', fr: '' },
    media_url: '',
    media_type: ''
  })
  
  editFeature(sectionData.value.additional_data.features.length - 1)
}

const removeFeature = (index) => {
  sectionData.value.additional_data.features.splice(index, 1)
  closeFieldEditor()
  saveSection()
}

onMounted(loadData)
watch(() => props.technologyId, loadData)
</script>

<style scoped>
.text-primary-600 {
  color: rgb(var(--primary-color));
}

h2,
h3 {
  text-wrap: balance;
}
</style>