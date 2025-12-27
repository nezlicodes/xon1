<template>
  <div class="media-uploader">
    <!-- Current Image Preview -->
    <div v-if="modelValue && !uploading" class="mb-4">
      <div class="relative group">
        <img
          :src="modelValue"
          :alt="alt"
          :class="previewClass || 'w-full h-48 object-cover rounded-lg'"
        />
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
          <button
            @click="removeImage"
            type="button"
            class="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Icon name="heroicons-outline:trash" class="h-4 w-4" />
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Area -->
    <div
      v-if="!modelValue || uploading"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer',
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
      ]"
      @click="triggerFileInput"
    >
      <!-- Uploading State -->
      <div v-if="uploading" class="py-4">
        <Icon name="heroicons-outline:refresh" class="h-12 w-12 mx-auto text-blue-600 animate-spin mb-3" />
        <p class="text-sm font-medium text-gray-700">Téléchargement en cours...</p>
        <p class="text-xs text-gray-500 mt-1">{{ uploadProgress }}%</p>
      </div>

      <!-- Upload Prompt -->
      <div v-else>
        <Icon name="heroicons-outline:cloud-upload" class="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <p class="text-sm font-medium text-gray-700 mb-1">
          Glissez une image ici ou cliquez pour sélectionner
        </p>
        <p class="text-xs text-gray-500">
          PNG, JPG, GIF, WebP jusqu'à 10MB
        </p>
        
        <!-- Compress Option -->
        <label v-if="enableCompression" class="inline-flex items-center mt-3 text-xs text-gray-600 cursor-pointer">
          <input
            v-model="shouldCompress"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
          />
          Compresser l'image automatiquement
        </label>
      </div>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      class="hidden"
    />

    <!-- Error Message -->
    <p v-if="error" class="mt-2 text-sm text-red-600 flex items-center gap-1">
      <Icon name="heroicons-outline:exclamation-circle" class="h-4 w-4" />
      {{ error }}
    </p>

    <!-- URL Input (Fallback) -->
    <div v-if="showUrlInput" class="mt-4">
      <div class="flex gap-2">
        <input
          v-model="urlInput"
          type="url"
          placeholder="Ou collez une URL d'image..."
          class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @keyup.enter="useUrl"
        />
        <button
          @click="useUrl"
          type="button"
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          Utiliser
        </button>
      </div>
    </div>

    <!-- Toggle URL Input -->
    <button
      v-if="!uploading && !modelValue"
      @click="showUrlInput = !showUrlInput"
      type="button"
      class="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
    >
      {{ showUrlInput ? '− Masquer' : '+ Utiliser une URL' }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  folder: {
    type: String,
    default: 'site'
  },
  alt: {
    type: String,
    default: 'Image'
  },
  previewClass: {
    type: String,
    default: ''
  },
  enableCompression: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'uploaded', 'removed']);

const { uploadFile, compressImage } = useMediaUpload();
const { showError: showErrorModal } = useErrorModal();

const fileInput = ref(null);
const isDragging = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);
const error = ref('');
const showUrlInput = ref(false);
const urlInput = ref('');
const shouldCompress = ref(true);

// Trigger file input
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Handle file selection
const handleFileSelect = async (event) => {
  const file = event.target.files?.[0];
  if (file) {
    await handleFile(file);
  }
  // Reset input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Handle drag and drop
const handleDrop = async (event) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    await handleFile(file);
  }
};

// Handle file upload
const handleFile = async (file) => {
  error.value = '';
  uploading.value = true;
  uploadProgress.value = 0;

  try {
    // Simulate progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10;
      }
    }, 200);

    let fileToUpload = file;

    // Compress if enabled and it's an image
    if (shouldCompress.value && props.enableCompression && file.type.startsWith('image/')) {
      try {
        fileToUpload = await compressImage(file, 1920, 0.85);
        console.log('Image compressed:', file.size, '→', fileToUpload.size);
      } catch (compressError) {
        console.warn('Compression failed, using original:', compressError);
        fileToUpload = file;
      }
    }

    // Upload
    const result = await uploadFile(fileToUpload, props.folder);

    clearInterval(progressInterval);
    uploadProgress.value = 100;

    if (result.success && result.url) {
      emit('update:modelValue', result.url);
      emit('uploaded', { url: result.url, path: result.path });
      
      // Reset after a short delay
      setTimeout(() => {
        uploading.value = false;
        uploadProgress.value = 0;
      }, 500);
    } else {
      throw new Error(result.error || 'Upload failed');
    }
  } catch (err) {
    error.value = err.message || 'Failed to upload image';
    showErrorModal(error.value);
    uploading.value = false;
    uploadProgress.value = 0;
  }
};

// Remove image
const removeImage = () => {
  emit('update:modelValue', '');
  emit('removed');
  error.value = '';
};

// Use URL
const useUrl = () => {
  if (urlInput.value) {
    emit('update:modelValue', urlInput.value);
    emit('uploaded', { url: urlInput.value, path: null });
    urlInput.value = '';
    showUrlInput.value = false;
  }
};
</script>
