<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-semibold text-gray-800">Media Editor</h3>
            <p class="text-sm text-gray-500 mt-1">Upload or select background media</p>
          </div>
          <button
            @click="$emit('close')"
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
            @click="activeTab = 'image'"
            :class="[
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
              activeTab === 'image' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            <Icon name="heroicons-outline:photograph" class="h-4 w-4 inline mr-2" />
            Background Image
          </button>
          <button
            @click="activeTab = 'video'"
            :class="[
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
              activeTab === 'video' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            <Icon name="heroicons-outline:video-camera" class="h-4 w-4 inline mr-2" />
            Background Video
          </button>
          <button
            @click="activeTab = 'none'"
            :class="[
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
              activeTab === 'none' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            <Icon name="heroicons-outline:ban" class="h-4 w-4 inline mr-2" />
            No Media
          </button>
        </div>

        <!-- Image Tab -->
        <div v-if="activeTab === 'image'" class="space-y-6">
          <!-- Upload Area -->
          <div class="space-y-4">
            <h4 class="text-lg font-medium text-gray-800">Upload New Image</h4>
            
            <AdminFormField
              type="file"
              label=""
              placeholder="Upload a background image"
              accept="image/*"
              :uploading="uploadingImage"
              :upload-progress="imageProgress"
              help="Recommended: 1920x1080px or higher, JPG/PNG format, under 5MB"
              @file-selected="uploadImage"
            />

            <AdminFormField
              v-model="imageUrl"
              type="url"
              label="Or paste image URL"
              placeholder="https://example.com/image.jpg"
              help="Alternative to uploading - paste a direct link to an image"
            />
          </div>

          <!-- Current Image Preview -->
          <div v-if="currentImageUrl || imageUrl" class="space-y-4">
            <h4 class="text-lg font-medium text-gray-800">Preview</h4>
            <div class="relative">
              <img 
                :src="imageUrl || currentImageUrl" 
                alt="Background preview" 
                class="w-full h-64 object-cover rounded-lg border"
                @error="handleImageError"
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
        <div v-if="activeTab === 'video'" class="space-y-6">
          <!-- Upload Area -->
          <div class="space-y-4">
            <h4 class="text-lg font-medium text-gray-800">Upload New Video</h4>
            
            <AdminFormField
              type="file"
              label=""
              placeholder="Upload a background video"
              accept="video/*"
              :uploading="uploadingVideo"
              :upload-progress="videoProgress"
              help="Recommended: MP4 format, under 50MB, keep it short for better performance"
              @file-selected="uploadVideo"
            />

            <AdminFormField
              v-model="videoUrl"
              type="url"
              label="Or paste video URL"
              placeholder="https://example.com/video.mp4"
              help="Alternative to uploading - paste a direct link to a video"
            />
          </div>

          <!-- Current Video Preview -->
          <div v-if="currentVideoUrl || videoUrl" class="space-y-4">
            <h4 class="text-lg font-medium text-gray-800">Preview</h4>
            <div class="relative">
              <video 
                :src="videoUrl || currentVideoUrl" 
                class="w-full h-64 object-cover rounded-lg border"
                controls
                muted
                @error="handleVideoError"
              />
              <div class="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                Background Video
              </div>
            </div>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <Icon name="heroicons-outline:information-circle" class="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div class="text-sm text-yellow-800">
                  <p class="font-medium">Video Background Tips:</p>
                  <ul class="mt-2 space-y-1 list-disc list-inside">
                    <li>Keep videos short (10-30 seconds) and loop seamlessly</li>
                    <li>Ensure good contrast with text overlay</li>
                    <li>Consider mobile users - videos use more data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Media Tab -->
        <div v-if="activeTab === 'none'" class="text-center py-12">
          <Icon name="heroicons-outline:ban" class="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h4 class="text-lg font-medium text-gray-800 mb-2">No Background Media</h4>
          <p class="text-gray-500">The section will use only the background color</p>
        </div>

        <!-- Error Messages -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center gap-3">
            <Icon name="heroicons-outline:exclamation-circle" class="h-5 w-5 text-red-600" />
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-6 border-t border-gray-200 bg-gray-50">
        <div class="flex justify-end gap-3">
          <button
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="applyChanges"
            :disabled="loading"
            class="px-6 py-2 bg-primary text-contrast1 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Icon 
              v-if="loading" 
              name="heroicons-outline:refresh" 
              class="h-4 w-4 animate-spin" 
            />
            {{ loading ? 'Applying...' : 'Apply Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { createClient } from '@supabase/supabase-js'

const props = defineProps({
  technologyId: String,
  currentImageUrl: { type: String, default: '' },
  currentVideoUrl: { type: String, default: '' }
})

const emit = defineEmits(['close', 'update'])

// Initialize Supabase client
const supabaseUrl = useRuntimeConfig().public.supabaseUrl
const supabaseKey = useRuntimeConfig().public.supabaseAnonKey
const supabase = createClient(supabaseUrl, supabaseKey)

// Reactive state
const activeTab = ref('image')
const imageUrl = ref('')
const videoUrl = ref('')
const uploadingImage = ref(false)
const uploadingVideo = ref(false)
const imageProgress = ref(0)
const videoProgress = ref(0)
const loading = ref(false)
const error = ref('')

// Initialize with current values
onMounted(() => {
  if (props.currentImageUrl) {
    activeTab.value = 'image'
    imageUrl.value = props.currentImageUrl
  } else if (props.currentVideoUrl) {
    activeTab.value = 'video'
    videoUrl.value = props.currentVideoUrl
  } else {
    activeTab.value = 'none'
  }
})

const uploadImage = async (file) => {
  if (!file) return
  
  // Validate file
  if (!file.type.startsWith('image/')) {
    error.value = 'Please select an image file'
    return
  }
  
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Image must be less than 5MB'
    return
  }

  uploadingImage.value = true
  imageProgress.value = 0
  error.value = ''

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${props.technologyId}/background-${Date.now()}.${fileExt}`
    const filePath = `technologies/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('site')
      .upload(filePath, file, { 
        cacheControl: '3600',
        upsert: false 
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('site')
      .getPublicUrl(filePath)
    
    imageUrl.value = publicUrl
    imageProgress.value = 100
    
    // Clear video if image is selected
    videoUrl.value = ''
    
    setTimeout(() => {
      imageProgress.value = 0
    }, 1000)

  } catch (err) {
    console.error('Upload error:', err)
    error.value = 'Failed to upload image. Please try again.'
  } finally {
    uploadingImage.value = false
  }
}

const uploadVideo = async (file) => {
  if (!file) return
  
  // Validate file
  if (!file.type.startsWith('video/')) {
    error.value = 'Please select a video file'
    return
  }
  
  if (file.size > 50 * 1024 * 1024) {
    error.value = 'Video must be less than 50MB'
    return
  }

  uploadingVideo.value = true
  videoProgress.value = 0
  error.value = ''

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${props.technologyId}/background-video-${Date.now()}.${fileExt}`
    const filePath = `technologies/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('site')
      .upload(filePath, file, { 
        cacheControl: '3600',
        upsert: false 
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('site')
      .getPublicUrl(filePath)
    
    videoUrl.value = publicUrl
    videoProgress.value = 100
    
    // Clear image if video is selected
    imageUrl.value = ''
    
    setTimeout(() => {
      videoProgress.value = 0
    }, 1000)

  } catch (err) {
    console.error('Upload error:', err)
    error.value = 'Failed to upload video. Please try again.'
  } finally {
    uploadingVideo.value = false
  }
}

const handleImageError = () => {
  error.value = 'Failed to load image. Please check the URL.'
}

const handleVideoError = () => {
  error.value = 'Failed to load video. Please check the URL.'
}

const applyChanges = () => {
  loading.value = true
  error.value = ''
  
  let result = {
    image_url: '',
    video_url: ''
  }
  
  if (activeTab.value === 'image') {
    result.image_url = imageUrl.value
  } else if (activeTab.value === 'video') {
    result.video_url = videoUrl.value
  }
  
  // Simulate a brief loading state
  setTimeout(() => {
    loading.value = false
    emit('update', result)
    emit('close')
  }, 500)
}

// Clear error when switching tabs
watch(activeTab, () => {
  error.value = ''
})
</script>