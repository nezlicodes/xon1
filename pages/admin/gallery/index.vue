<template>
  <div class="p-3 sm:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->     <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Gallery</h1>
        <button
          @click="openUploadModal"
          :disabled="loading || uploading"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload Images
        </button>
      </div>

      <!-- Search and Filter -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by filename..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          v-model="sortBy"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="name">Sort by Name</option>
          <option value="size">Sort by Size</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Gallery Grid -->
      <div v-else-if="filteredImages.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="image in filteredImages"
          :key="image.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Image Preview -->
          <div class="aspect-square bg-gray-100 relative overflow-hidden">
            <img
              :src="image.url"
              :alt="image.filename"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <!-- Overlay Actions -->
            <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
              <div class="flex gap-2">
                <button
                  @click="previewImage(image)"
                  class="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Preview"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button
                  @click="deleteImage(image)"
                  :disabled="deleting"
                  class="p-2 bg-white rounded-full hover:bg-red-50 transition-colors text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Image Info -->
          <div class="p-4">
            <h3 class="text-sm font-medium text-gray-900 truncate mb-2" :title="image.filename">
              {{ image.filename }}
            </h3>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                </svg>
                {{ formatFileSize(image.filesize) }}
              </span>
              <button
                @click="copyUrl(image.url)"
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                Copy URL
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No images found</h3>
        <p class="text-gray-500 mb-4">Upload some images to get started</p>
        <button
          @click="openUploadModal"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Upload Images
        </button>
      </div>

      <!-- Upload Modal -->
      <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-2xl w-full p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Upload Images</h2>
            <button @click="closeUploadModal" :disabled="uploading" class="text-gray-400 hover:text-gray-600 disabled:opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Drop Zone -->
          <div
            @dragover.prevent="dragOver = true"
            @dragleave.prevent="dragOver = false"
            @drop.prevent="handleDrop"
            :class="[
              'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
              uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            ]"
          >
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              @change="handleFileSelect"
              :disabled="uploading"
              class="hidden"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="text-gray-700 mb-2">Drag and drop images here, or</p>
            <button
              @click="$refs.fileInput.click()"
              :disabled="uploading"
              class="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
            >
              browse files
            </button>
          </div>

          <!-- Selected Files -->
          <div v-if="selectedFiles.length > 0" class="mt-4">
            <h3 class="text-sm font-medium text-gray-900 mb-2">Selected Files ({{ selectedFiles.length }})</h3>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div
                v-for="(file, index) in selectedFiles"
                :key="index"
                class="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div class="flex items-center gap-2 flex-1 min-w-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-gray-700 truncate">{{ file.name }}</span>
                  <span class="text-xs text-gray-500 flex-shrink-0">{{ formatFileSize(file.size) }}</span>
                </div>
                <button
                  @click="removeFile(index)"
                  :disabled="uploading"
                  class="text-red-600 hover:text-red-700 ml-2 flex-shrink-0 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Upload Progress -->
          <div v-if="uploading && uploadProgress > 0" class="mt-4">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>Uploading...</span>
              <span>{{ uploadProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
            </div>
          </div>

          <!-- Upload Button -->
          <div class="mt-6 flex justify-end gap-3">
            <button
              @click="closeUploadModal"
              :disabled="uploading"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              @click="uploadImages"
              :disabled="selectedFiles.length === 0 || uploading"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="uploading" class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
              <span v-else>Upload {{ selectedFiles.length }} file{{ selectedFiles.length !== 1 ? 's' : '' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Preview Modal -->
      <div v-if="previewImageData" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" @click="closePreview">
        <button @click="closePreview" class="absolute top-4 right-4 text-white hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          :src="previewImageData.url"
          :alt="previewImageData.filename"
          class="max-w-full max-h-full object-contain"
          @click.stop
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'


const supabase = useSupabaseClient()
const { showSuccess } = useSuccessSnackbar()
const { showError } = useErrorModal()

// State
const images = ref([])
const loading = ref(true)
const uploading = ref(false)
const deleting = ref(false)
const uploadProgress = ref(0)
const searchQuery = ref('')
const sortBy = ref('name')
const showUploadModal = ref(false)
const selectedFiles = ref([])
const dragOver = ref(false)
const previewImageData = ref(null)
const fileInput = ref(null)

// Storage configuration
const STORAGE_BUCKET = 'site'
const GALLERY_FOLDER = 'product-images'

// Computed
const filteredImages = computed(() => {
  let filtered = images.value

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(img =>
      img.filename.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.filename.localeCompare(b.filename)
      case 'size':
        return b.filesize - a.filesize
      case 'date':
        return new Date(b.created_at) - new Date(a.created_at)
      default:
        return 0
    }
  })

  return filtered
})

// Methods
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const openUploadModal = () => {
  showUploadModal.value = true
}

const closeUploadModal = () => {
  if (!uploading.value) {
    showUploadModal.value = false
    selectedFiles.value = []
    dragOver.value = false
    uploadProgress.value = 0
  }
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = [...selectedFiles.value, ...files]
}

const handleDrop = (event) => {
  if (uploading.value) return
  dragOver.value = false
  const files = Array.from(event.dataTransfer.files).filter(file =>
    file.type.startsWith('image/')
  )
  selectedFiles.value = [...selectedFiles.value, ...files]
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const uploadImages = async () => {
  if (selectedFiles.value.length === 0) return

  uploading.value = true
  uploadProgress.value = 0

  try {
    const totalFiles = selectedFiles.value.length
    let uploadedCount = 0

    for (const file of selectedFiles.value) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showError(`File ${file.name} exceeds 5MB limit`)
        continue
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${GALLERY_FOLDER}/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        showError(`Failed to upload ${file.name}`)
        continue
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath)

      // Get file metadata for size
      const { data: fileData, error: fileError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(GALLERY_FOLDER, {
          search: fileName
        })

      let filesize = file.size
      if (fileData && fileData.length > 0) {
        filesize = fileData[0].metadata?.size || file.size
      }

      // Add to images array
      images.value.unshift({
        id: filePath,
        filename: file.name,
        filesize: filesize,
        url: publicUrl,
        path: filePath,
        created_at: new Date().toISOString()
      })

      uploadedCount++
      uploadProgress.value = Math.round((uploadedCount / totalFiles) * 100)
    }

    showSuccess(`Successfully uploaded ${uploadedCount} image${uploadedCount !== 1 ? 's' : ''}`)
    closeUploadModal()
  } catch (error) {
    console.error('Upload error:', error)
    showError('Failed to upload images')
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const deleteImage = async (image) => {
  if (!confirm(`Are you sure you want to delete ${image.filename}?`)) return

  deleting.value = true

  try {
    // Delete from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([image.path])

    if (deleteError) {
      throw deleteError
    }

    // Remove from local array
    images.value = images.value.filter(img => img.id !== image.id)
    showSuccess('Image deleted successfully')
  } catch (error) {
    console.error('Delete error:', error)
    showError('Failed to delete image')
  } finally {
    deleting.value = false
  }
}

const previewImage = (image) => {
  previewImageData.value = image
}

const closePreview = () => {
  previewImageData.value = null
}

const copyUrl = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    showSuccess('URL copied to clipboard!')
  } catch (error) {
    console.error('Copy error:', error)
    showError('Failed to copy URL')
  }
}

const handleImageError = (event) => {
  event.target.src = '/images/placeholder.png'
}

const fetchImages = async () => {
  loading.value = true
  try {
    // List all files in the gallery folder
    const { data: files, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(GALLERY_FOLDER, {
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) {
      throw error
    }

    if (files && files.length > 0) {
      // Transform files to image objects
      images.value = files
        .filter(file => file.name !== '.emptyFolderPlaceholder')
        .map(file => {
          const { data: { publicUrl } } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(`${GALLERY_FOLDER}/${file.name}`)

          return {
            id: `${GALLERY_FOLDER}/${file.name}`,
            filename: file.name,
            filesize: file.metadata?.size || 0,
            url: publicUrl,
            path: `${GALLERY_FOLDER}/${file.name}`,
            created_at: file.created_at
          }
        })
    }
  } catch (error) {
    console.error('Fetch error:', error)
    showError('Failed to load images')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchImages()
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
