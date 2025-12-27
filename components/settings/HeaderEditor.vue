<template>
  <div class="space-y-3">
    <!-- Prévisualisation de l'en-tête avec édition en direct -->
    <div class="bg-white shadow overflow-hidden relative">
      <!-- Toggle visibility button -->
      <button
        @click="toggleHeaderVisibility"
        class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        :title="heroData.is_active ? 'Masquer l\'en-tête' : 'Afficher l\'en-tête'"
      >
        <Icon
          v-if="heroData.is_active"
          class="h-5 w-5 text-gray-700"
          name="heroicons-outline:eye"
        />
        <Icon
          v-else
          class="h-5 w-5 text-gray-700"
          name="heroicons-outline:eye-off"
        />
      </button>

      <!-- Show collapsed placeholder when header is hidden -->
      <div
        v-if="!heroData.is_active"
        class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg"
      >
        <div class="text-center">
          <Icon
            name="heroicons-outline:photo"
            class="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 class="mt-2 text-sm font-medium text-gray-900">En-tête masqué</h3>
          <p class="mt-1 text-sm text-gray-500">
            Cliquez sur l'icône d'œil pour afficher l'en-tête
          </p>
        </div>
      </div>

      <!-- Header content when visible -->
      <div v-if="heroData.is_active" class="relative">
        <div
          class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"
        ></div>

        <!-- Prévisualisation de l'en-tête -->
        <div class="relative min-h-[80vh] w-full overflow-hidden">
          <!-- Arrière-plan avec effet parallaxe -->
          <div class="absolute inset-0 w-full h-full">
            <!-- Video Background -->
            <div v-if="getCurrentContent().background_video && !previewVideoError" class="absolute inset-0 w-full h-full">
              <video
                ref="previewVideoElement"
                :key="getCurrentContent().background_video"
                :src="getCurrentContent().background_video"
                autoplay
                loop
                muted
                playsinline
                preload="auto"
                class="w-full h-full object-cover"
                @loadeddata="onPreviewVideoLoaded"
                @error="onPreviewVideoError"
              />
            </div>
            <!-- Image Background (fallback) -->
            <div
              v-else
              class="absolute inset-0 w-full h-[120%] bg-cover bg-center"
              :style="{
                backgroundImage: `url(${getCurrentContent().background_image || defaultHeroData.background_image})`,
              }"
            ></div>
            <!-- Superposition sombre pour lisibilité -->
            <div class="absolute inset-0 bg-black/40"></div>
          </div>

          <!-- Contenu de l'en-tête -->
          <div
            class="relative mt-[15%] min-h-[60vh] max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
          >
            <div class="min-h-[60vh] flex items-center justify-center">
              <div class="max-w-2xl text-white text-center">
                <!-- Titre éditable avec bouton d'édition toujours visible -->
                <div class="relative mb-1 border-2 border-transparent rounded-lg transition-all duration-300 hover:border-blue-400 px-4 py-2">
                  <h1
                    class="text-4xl sm:text-5xl font-semibold tracking-wide leading-tight text-white drop-shadow-md"
                    v-text="getCurrentContent().title || defaultHeroData.title"
                  ></h1>
                  <button
                    @click="openFieldEditor('title')"
                    class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                    title="Modifier le titre"
                  >
                    <Icon
                      class="w-4 h-4"
                      name="heroicons-outline:pencil-alt"
                    />
                  </button>
                  <div class="text-xs text-blue-200 opacity-75 mt-1">Cliquez pour modifier le titre</div>
                </div>

                <!-- Sous-titre éditable avec bouton d'édition toujours visible -->
                <div class="relative mt-6 mb-1 border-2 border-transparent rounded-lg transition-all duration-300 hover:border-blue-400 px-4 py-2">
                  <p
                    class="text-lg sm:text-xl font-light leading-relaxed tracking-wide opacity-90 transition-all duration-500 ease-out text-white drop-shadow-md"
                    v-html="getCurrentContent().subtitle || defaultHeroData.subtitle"
                  ></p>
                  <button
                    @click="openFieldEditor('subtitle')"
                    class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                    title="Modifier le sous-titre"
                  >
                    <Icon
                      class="w-4 h-4"
                      name="heroicons-outline:pencil-alt"
                    />
                  </button>
                  <div class="text-xs text-blue-200 opacity-75 mt-1">Cliquez pour modifier le sous-titre</div>
                </div>

                <!-- Bouton éditable avec indication d'édition -->
                <div class="relative mt-12 border-2 border-transparent px-2 py-3 rounded-lg transition-all duration-300 hover:border-blue-400 inline-block">
                  <span
                    role="button"
                    @click="openFieldEditor('button_text')"
                    class="rounded-full border bg-primary text-contrast1 border-primary px-8 py-3.5 text-xl font-medium tracking-wide transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 relative overflow-hidden cursor-pointer"
                  >
                    {{ getCurrentContent().button_text || defaultHeroData.button_text }}
                  </span>
                  <button
                    @click="openFieldEditor('button_text')"
                    class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                    title="Modifier le texte du bouton"
                  >
                    <Icon
                      class="w-4 h-4"
                      name="heroicons-outline:pencil-alt"
                    />
                  </button>
                  <div class="text-xs text-blue-200 opacity-75 mt-2">Cliquez pour modifier le bouton</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bouton amélioré pour changer l'image/vidéo d'arrière-plan -->
          <button
            @click="openMediaUploader()"
            class="absolute top-4 left-4 p-3 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg text-white shadow-lg flex items-center space-x-2 transition-all duration-300 animate-pulse-slow"
          >
            <Icon class="w-4 h-4" name="heroicons-outline:film" />
            <span>Modifier le média de fond</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading/Saving indicator -->
    <div v-if="loading || saving" class="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
      <Icon name="heroicons-outline:refresh" class="w-4 h-4 animate-spin" />
      <span class="text-sm">{{ loading ? 'Chargement...' : 'Enregistrement...' }}</span>
    </div>

    <!-- Modal d'édition de champ -->
    <div
      v-if="showFieldModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showFieldModal = false"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Modifier {{ getFieldLabel(currentField) }}
          </h3>
          <button @click="showFieldModal = false" class="text-gray-400 hover:text-gray-500">
            <Icon name="heroicons-outline:x" class="h-5 w-5" />
          </button>
        </div>
        
        <input
          v-if="currentField === 'title' || currentField === 'button_text'"
          v-model="tempFieldValue"
          type="text"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          @keyup.enter="saveFieldValue"
          ref="fieldInput"
        />
        <ClientOnly v-else>
          <PluginsRichText v-model:content="tempFieldValue" />
          <template #fallback>
            <div
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-24 bg-gray-50 flex items-center justify-center text-gray-400 text-sm"
            >
              Chargement de l'éditeur...
            </div>
          </template>
        </ClientOnly>
        <div class="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            @click="showFieldModal = false"
          >
            <Icon name="heroicons-outline:x" class="mr-1.5 h-4 w-4" />
            Annuler
          </button>
          <button
            type="button"
            :disabled="saving"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            @click="saveFieldValue"
          >
            <Icon 
              :name="saving ? 'heroicons-outline:refresh' : 'heroicons-outline:check'" 
              class="mr-1.5 h-4 w-4"
              :class="{ 'animate-spin': saving }"
            />
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal d'upload de média (image ou vidéo) -->
    <div
      v-if="showMediaModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showMediaModal = false"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Modifier le média d'arrière-plan
          </h3>
          <button @click="showMediaModal = false" class="text-gray-400 hover:text-gray-500">
            <Icon name="heroicons-outline:x" class="h-5 w-5" />
          </button>
        </div>

        <!-- Media Type Tabs -->
        <div class="mb-4 border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeMediaTab = 'image'"
              type="button"
              :class="[
                activeMediaTab === 'image'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              ]"
            >
              📸 Image
            </button>
            <button
              @click="activeMediaTab = 'video'"
              type="button"
              :class="[
                activeMediaTab === 'video'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              ]"
            >
              🎥 Vidéo
            </button>
          </nav>
        </div>
        
        <!-- Image Tab -->
        <div v-if="activeMediaTab === 'image'" class="mt-1">
          <div class="flex flex-col space-y-4">
            <div 
              class="relative bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center"
              :class="{'border-blue-400': getCurrentContent().background_image}"
            >
              <div v-if="uploadingMedia" class="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
                <div class="flex flex-col items-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p class="mt-2 text-sm text-blue-600 font-medium">Téléchargement en cours...</p>
                </div>
              </div>
              
              <div v-if="getCurrentContent().background_image && !uploadingMedia" class="w-full">
                <NuxtImg
                  :src="getCurrentContent().background_image"
                  alt="Image d'arrière-plan"
                  class="h-48 w-full object-cover rounded-lg shadow-md"
                />
              </div>
              <div v-else-if="!uploadingMedia" class="py-8">
                <Icon name="heroicons-outline:photograph" class="mx-auto h-12 w-12 text-gray-400" />
                <p class="mt-2 text-sm text-gray-500 text-center">Aucune image sélectionnée</p>
              </div>
            </div>
            
            <div class="flex flex-col space-y-2">
              <label
                for="modal-file-hero-image"
                class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                :class="{ 'opacity-50 cursor-not-allowed': uploadingMedia }"
              >
                <Icon name="heroicons-outline:upload" class="mr-1.5 h-4 w-4" />
                <span v-if="uploadingMedia">Téléchargement...</span>
                <span v-else>Sélectionner une image</span>
                <input
                  id="modal-file-hero-image"
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="handleImageUpload"
                  :disabled="uploadingMedia"
                />
              </label>
              
              <button
                v-if="getCurrentContent().background_image && !uploadingMedia"
                type="button"
                @click="removeImage"
                class="inline-flex items-center justify-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
              >
                <Icon name="heroicons-outline:trash" class="mr-1.5 h-4 w-4" />
                Supprimer l'image
              </button>
              
              <p class="mt-2 text-sm text-gray-500 flex items-center">
                <Icon name="heroicons-outline:information-circle" class="mr-1.5 h-4 w-4 text-blue-500" />
                Taille recommandée : 1920x1080px (PNG, JPG)
              </p>
              
              <p
                v-if="uploadError"
                class="mt-1 text-sm text-red-600 flex items-center"
              >
                <Icon name="heroicons-outline:exclamation-circle" class="mr-1.5 h-4 w-4" />
                {{ uploadError }}
              </p>
            </div>
          </div>
        </div>

        <!-- Video Tab -->
        <div v-if="activeMediaTab === 'video'" class="mt-1">
          <div class="flex flex-col space-y-4">
            <div 
              class="relative bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center"
              :class="{'border-blue-400': getCurrentContent().background_video}"
            >
              <div v-if="uploadingMedia" class="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
                <div class="flex flex-col items-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p class="mt-2 text-sm text-blue-600 font-medium">Téléchargement en cours...</p>
                </div>
              </div>
              
              <div v-if="getCurrentContent().background_video && !uploadingMedia" class="w-full">
                <video
                  :key="getCurrentContent().background_video"
                  :src="getCurrentContent().background_video"
                  class="h-48 w-full object-cover rounded-lg shadow-md"
                  controls
                  preload="metadata"
                />
              </div>
              <div v-else-if="!uploadingMedia" class="py-8">
                <Icon name="heroicons-outline:film" class="mx-auto h-12 w-12 text-gray-400" />
                <p class="mt-2 text-sm text-gray-500 text-center">Aucune vidéo sélectionnée</p>
              </div>
            </div>
            
            <div class="flex flex-col space-y-2">
              <label
                for="modal-file-hero-video"
                class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                :class="{ 'opacity-50 cursor-not-allowed': uploadingMedia }"
              >
                <Icon name="heroicons-outline:upload" class="mr-1.5 h-4 w-4" />
                <span v-if="uploadingMedia">Téléchargement...</span>
                <span v-else>Sélectionner une vidéo</span>
                <input
                  id="modal-file-hero-video"
                  type="file"
                  class="hidden"
                  accept="video/*"
                  @change="handleVideoUpload"
                  :disabled="uploadingMedia"
                />
              </label>
              
              <button
                v-if="getCurrentContent().background_video && !uploadingMedia"
                type="button"
                @click="removeVideo"
                class="inline-flex items-center justify-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
              >
                <Icon name="heroicons-outline:trash" class="mr-1.5 h-4 w-4" />
                Supprimer la vidéo
              </button>
              
              <p class="mt-2 text-sm text-gray-500 flex items-center">
                <Icon name="heroicons-outline:information-circle" class="mr-1.5 h-4 w-4 text-blue-500" />
                Formats: MP4, WebM, MOV. Max: 50MB
              </p>
              
              <p
                v-if="uploadError"
                class="mt-1 text-sm text-red-600 flex items-center"
              >
                <Icon name="heroicons-outline:exclamation-circle" class="mr-1.5 h-4 w-4" />
                {{ uploadError }}
              </p>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            :disabled="uploadingMedia"
            class="inline-flex items-center px-4 py-2 disabled:opacity-45 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            @click="showMediaModal = false"
          >
            <Icon name="heroicons-outline:check" class="mr-1.5 h-4 w-4" />
            Terminer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { fetchSection, updateSection } = useContentSections()
const supabase = useSupabaseClient()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()
const { editorLanguage } = useEditorLanguage()

// Valeurs par défaut pour l'en-tête
const defaultHeroData = {
  title: "Bienvenue dans notre magasin",
  subtitle: "Découvrez des produits incroyables à des prix avantageux",
  button_text: "Voir les produits",
  background_image: "/images/placeholders/hero.jpg",
  background_video: "",
}

// State
const loading = ref(true)
const saving = ref(false)
const heroData = ref({
  section_key: 'hero',
  section_type: 'hero',
  is_active: true,
  content_translations: {
    en: { ...defaultHeroData },
    fr: { ...defaultHeroData },
    ar: { ...defaultHeroData }
  }
})

// Modal state
const showFieldModal = ref(false)
const showMediaModal = ref(false)
const currentField = ref("")
const tempFieldValue = ref("")
const fieldInput = ref(null)
const uploadingMedia = ref(false)
const uploadError = ref(null)
const activeMediaTab = ref('image')

// Video refs and error state
const previewVideoElement = ref(null)
const previewVideoError = ref(false)

// Get current language content
const getCurrentContent = () => {
  return heroData.value.content_translations?.[editorLanguage.value] || defaultHeroData
}

// Video event handlers for preview
const onPreviewVideoLoaded = () => {
  console.log('[HeaderEditor] Preview video loaded successfully')
  previewVideoError.value = false
  
  // Ensure video plays
  if (previewVideoElement.value) {
    previewVideoElement.value.play().catch(err => {
      console.warn('[HeaderEditor] Preview video autoplay failed:', err)
    })
  }
}

const onPreviewVideoError = (event) => {
  console.error('[HeaderEditor] Preview video failed to load:', event)
  console.error('[HeaderEditor] Video source:', getCurrentContent().background_video)
  previewVideoError.value = true
}

// Load hero section data
const loadHeroData = async () => {
  loading.value = true
  try {
    const { data, error } = await fetchSection('hero')
    
    if (error) throw error
    
    if (data) {
      heroData.value = data
      console.log('[HeaderEditor] Hero data loaded:', data)
      console.log('[HeaderEditor] Editor language:', editorLanguage.value)
      console.log('[HeaderEditor] Current content:', getCurrentContent())
      
      // Ensure all languages have content
      const languages = ['fr', 'ar', 'en']
      languages.forEach(lang => {
        if (!heroData.value.content_translations[lang]) {
          heroData.value.content_translations[lang] = { ...defaultHeroData }
        }
      })
    } else {
      // Create default hero section if it doesn't exist
      const { data: newSection, error: createError } = await supabase
        .from('content_sections')
        .insert({
          section_key: 'hero',
          section_type: 'hero',
          content_translations: {
            en: { ...defaultHeroData },
            fr: { ...defaultHeroData },
            ar: { ...defaultHeroData }
          },
          is_active: true,
          display_order: 0
        })
        .select()
        .single()
      
      if (createError) throw createError
      heroData.value = newSection
    }
  } catch (error) {
    console.error('Error loading hero data:', error)
    showError('Impossible de charger les données de l\'en-tête')
  } finally {
    loading.value = false
  }
}

// Save hero section
const saveHeroData = async () => {
  saving.value = true
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .upsert({
        section_key: 'hero',
        section_type: 'hero',
        content_translations: heroData.value.content_translations,
        is_active: heroData.value.is_active,
        display_order: 0
      }, {
        onConflict: 'section_key'
      })
      .select()
      .single()
    
    if (error) throw error
    
    heroData.value = data
    showSuccess('En-tête enregistré avec succès')
    console.log('[HeaderEditor] Hero data saved:', data)
  } catch (error) {
    console.error('Error saving hero data:', error)
    showError('Erreur lors de l\'enregistrement de l\'en-tête')
  } finally {
    saving.value = false
  }
}

// Toggle header visibility
const toggleHeaderVisibility = async () => {
  heroData.value.is_active = !heroData.value.is_active
  await saveHeroData()
}

// Open field editor
const openFieldEditor = (field) => {
  currentField.value = field
  tempFieldValue.value = getCurrentContent()[field] || defaultHeroData[field]
  showFieldModal.value = true
  
  nextTick(() => {
    if (fieldInput.value) {
      fieldInput.value.focus()
      if (fieldInput.value.select) {
        fieldInput.value.select()
      }
    }
  })
}

// Save field value
const saveFieldValue = async () => {
  if (!heroData.value.content_translations[editorLanguage.value]) {
    heroData.value.content_translations[editorLanguage.value] = {}
  }
  
  heroData.value.content_translations[editorLanguage.value][currentField.value] = tempFieldValue.value
  showFieldModal.value = false
  await saveHeroData()
}

// Open media uploader
const openMediaUploader = () => {
  showMediaModal.value = true
}

// Handle image upload
const handleImageUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  uploadError.value = null
  uploadingMedia.value = true

  try {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('L\'image doit faire moins de 5 Mo')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `hero-${Date.now()}.${fileExt}`
    const filePath = `hero/${fileName}`

    // Delete old file if exists
    const oldImage = getCurrentContent().background_image
    if (oldImage && oldImage.includes('supabase')) {
      const oldFileName = oldImage.split('/').pop()
      if (oldFileName) {
        await supabase.storage.from('site').remove([`hero/${oldFileName}`])
      }
    }

    // Upload new file
    const { error: uploadErr } = await supabase.storage
      .from('site')
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600',
      })

    if (uploadErr) throw uploadErr

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('site')
      .getPublicUrl(filePath)

    console.log('[HeaderEditor] Image uploaded:', publicUrl)

    // Update content
    if (!heroData.value.content_translations[editorLanguage.value]) {
      heroData.value.content_translations[editorLanguage.value] = {}
    }
    heroData.value.content_translations[editorLanguage.value].background_image = publicUrl
    
    // Clear video when image is uploaded
    heroData.value.content_translations[editorLanguage.value].background_video = ''
    
    await saveHeroData()
  } catch (error) {
    console.error('Upload error:', error)
    uploadError.value = error.message || 'Erreur lors du téléchargement de l\'image'
  } finally {
    uploadingMedia.value = false
    event.target.value = ''
  }
}

// Handle video upload
const handleVideoUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  uploadError.value = null
  uploadingMedia.value = true

  try {
    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('La vidéo doit faire moins de 50 Mo')
    }

    // Check file type
    if (!file.type.startsWith('video/')) {
      throw new Error('Seuls les fichiers vidéo sont acceptés')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `hero-${Date.now()}.${fileExt}`
    const filePath = `hero/${fileName}`

    console.log('[HeaderEditor] Uploading video:', fileName)

    // Delete old video if exists
    const oldVideo = getCurrentContent().background_video
    if (oldVideo && oldVideo.includes('supabase')) {
      const oldFileName = oldVideo.split('/').pop()
      if (oldFileName) {
        await supabase.storage.from('site').remove([`hero/${oldFileName}`])
      }
    }

    // Upload new file
    const { error: uploadErr } = await supabase.storage
      .from('site')
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600',
      })

    if (uploadErr) throw uploadErr

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('site')
      .getPublicUrl(filePath)

    console.log('[HeaderEditor] Video uploaded successfully:', publicUrl)

    // Update content
    if (!heroData.value.content_translations[editorLanguage.value]) {
      heroData.value.content_translations[editorLanguage.value] = {}
    }
    heroData.value.content_translations[editorLanguage.value].background_video = publicUrl
    
    // Clear image when video is uploaded
    heroData.value.content_translations[editorLanguage.value].background_image = ''
    
    await saveHeroData()
  } catch (error) {
    console.error('[HeaderEditor] Video upload error:', error)
    uploadError.value = error.message || 'Erreur lors du téléchargement de la vidéo'
  } finally {
    uploadingMedia.value = false
    event.target.value = ''
  }
}

// Remove image
const removeImage = async () => {
  if (!getCurrentContent().background_image) return

  uploadingMedia.value = true
  uploadError.value = null

  try {
    const fileName = getCurrentContent().background_image.split('/').pop()
    if (!fileName) throw new Error('Nom de fichier invalide')

    const { error } = await supabase.storage
      .from('site')
      .remove([`hero/${fileName}`])

    if (error) throw error

    heroData.value.content_translations[editorLanguage.value].background_image = ''
    await saveHeroData()
  } catch (error) {
    console.error('Deletion error:', error)
    uploadError.value = 'Impossible de supprimer l\'image'
  } finally {
    uploadingMedia.value = false
  }
}

// Remove video
const removeVideo = async () => {
  if (!getCurrentContent().background_video) return

  uploadingMedia.value = true
  uploadError.value = null

  try {
    const fileName = getCurrentContent().background_video.split('/').pop()
    if (!fileName) throw new Error('Nom de fichier invalide')

    const { error } = await supabase.storage
      .from('site')
      .remove([`hero/${fileName}`])

    if (error) throw error

    heroData.value.content_translations[editorLanguage.value].background_video = ''
    await saveHeroData()
  } catch (error) {
    console.error('Deletion error:', error)
    uploadError.value = 'Impossible de supprimer la vidéo'
  } finally {
    uploadingMedia.value = false
  }
}

// Get field label
const getFieldLabel = (field) => {
  const labels = {
    title: 'le titre',
    subtitle: 'le sous-titre',
    button_text: 'le texte du bouton',
  }
  return labels[field] || field
}

// Watch for video URL changes
watch(() => getCurrentContent().background_video, (newVideo) => {
  if (newVideo) {
    console.log('[HeaderEditor] Video URL changed:', newVideo)
    previewVideoError.value = false
  }
})

// Load data on mount
onMounted(async () => {
  await loadHeroData()
})
</script>

<style scoped>
/* Animation de pulse lente pour les boutons d'action */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite;
}

/* Ensure video renders properly */
video {
  pointer-events: none;
}
</style>
