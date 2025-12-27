<template>
  <div class="space-y-4">
    <!-- Image Preview -->
    <div v-if="modelValue" class="relative group">
      <NuxtImg
        :src="modelValue"
        :alt="alt"
        class="w-full h-48 object-cover rounded-lg shadow-md"
        @error="imageError = true"
      />
      <button
        v-if="!readonly"
        @click="removeImage"
        class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all"
        type="button"
      >
        <Icon name="heroicons-outline:trash" class="w-4 h-4" />
      </button>
      <p v-if="imageError" class="text-red-500 text-sm mt-2">Impossible de charger l'image</p>
    </div>

    <!-- Upload Options -->
    <div v-if="!modelValue || showUrlInput" class="space-y-4">
      <!-- Tab Selector -->
      <div class="flex gap-2 border-b border-gray-200">
        <button
          @click="uploadMethod = 'file'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            uploadMethod === 'file'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
          type="button"
        >
          <Icon name="heroicons-outline:upload" class="w-4 h-4 inline mr-1" />
          Upload Fichier
        </button>
        <button
          @click="uploadMethod = 'url'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            uploadMethod === 'url'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
          type="button"
        >
          <Icon name="heroicons-outline:link" class="w-4 h-4 inline mr-1" />
          URL
        </button>
      </div>

      <!-- File Upload -->
      <div v-if="uploadMethod === 'file'">
        <label
          class="flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
          :class="{ 'opacity-50 cursor-not-allowed': uploading || readonly }"
        >
          <Icon name="heroicons-outline:cloud-upload" class="w-12 h-12 text-gray-400" />
          <span class="mt-2 text-sm text-gray-600">
            {{ uploading ? 'Upload en cours...' : 'Cliquez pour sélectionner une image' }}
          </span>
          <span class="mt-1 text-xs text-gray-500">PNG, JPG, GIF jusqu'à 5MB</span>
          <input
            type="file"
            class="hidden"
            accept="image/*"
            @change="handleFileUpload"
            :disabled="uploading || readonly"
          />
        </label>
        <p v-if="uploadError" class="text-red-500 text-sm mt-2">{{ uploadError }}</p>
      </div>

      <!-- URL Input -->
      <div v-if="uploadMethod === 'url'">
        <label class="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
        <input
          v-model="tempUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          @keyup.enter="saveUrl"
          :disabled="readonly"
        />
        <button
          @click="saveUrl"
          class="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          :disabled="!tempUrl || readonly"
          type="button"
        >
          <Icon name="heroicons-outline:check" class="w-4 h-4 mr-1" />
          Utiliser cette URL
        </button>
      </div>
    </div>

    <!-- Change Image Button -->
    <button
      v-if="modelValue && !showUrlInput"
      @click="showUrlInput = true"
      class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
      type="button"
    >
      <Icon name="heroicons-outline:refresh" class="w-4 h-4" />
      Changer l'image
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: 'Image'
  },
  bucket: {
    type: String,
    default: 'site'
  },
  folder: {
    type: String,
    default: 'uploads'
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
const supabase = useSupabaseClient()

const uploadMethod = ref('file')
const uploading = ref(false)
const uploadError = ref('')
const imageError = ref(false)
const tempUrl = ref('')
const showUrlInput = ref(false)

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validate file
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Le fichier doit être une image'
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = 'L\'image ne doit pas dépasser 5MB'
    return
  }

  uploading.value = true
  uploadError.value = ''

  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${props.folder}/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(props.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(props.bucket)
      .getPublicUrl(filePath)

    emit('update:modelValue', publicUrl)
    showUrlInput.value = false
  } catch (error) {
    console.error('Upload error:', error)
    uploadError.value = error.message || 'Erreur lors de l\'upload'
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}

const saveUrl = () => {
  if (tempUrl.value) {
    emit('update:modelValue', tempUrl.value)
    tempUrl.value = ''
    showUrlInput.value = false
    imageError.value = false
  }
}

const removeImage = () => {
  emit('update:modelValue', '')
  showUrlInput.value = false
  imageError.value = false
}

watch(() => props.modelValue, () => {
  imageError.value = false
  showUrlInput.value = false
})
</script>