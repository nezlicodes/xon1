<template>
  <div class="space-y-2">
    <label 
      v-if="label" 
      class="block text-sm font-medium text-gray-700"
      :class="{ 'text-red-600': error }"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
      <span v-if="languageCode" class="text-gray-500 text-xs">({{ languageName }})</span>
    </label>
    
    <div class="relative">
      <!-- Text Input -->
      <input
        v-if="type === 'text'"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-opacity-20"
        :class="inputClass"
      />
      
      <!-- Email Input -->
      <input
        v-else-if="type === 'email'"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="email"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-opacity-20"
        :class="inputClass"
      />
      
      <!-- URL Input -->
      <input
        v-else-if="type === 'url'"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="url"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-opacity-20"
        :class="inputClass"
      />
      
      <!-- Number Input -->
      <input
        v-else-if="type === 'number'"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="number"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-opacity-20"
        :class="inputClass"
      />
      
      <!-- Textarea -->
      <textarea
        v-else-if="type === 'textarea'"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-opacity-20 resize-vertical"
        :class="inputClass"
      />
      
      <!-- Select -->
      <select
        v-else-if="type === 'select'"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled"
        class="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-opacity-20 bg-white"
        :class="inputClass"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option 
          v-for="option in options" 
          :key="option.value" 
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- File Input -->
      <div v-else-if="type === 'file'" class="space-y-3">
        <label class="cursor-pointer block">
          <div 
            class="px-4 py-6 border-2 border-dashed rounded-lg text-center transition-all duration-200 hover:border-primary hover:bg-primary hover:bg-opacity-5"
            :class="error ? 'border-red-300' : 'border-gray-300'"
          >
            <Icon name="heroicons-outline:cloud-upload" class="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p class="text-sm font-medium text-gray-700">{{ placeholder || 'Click to upload' }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ accept || 'All file types' }}</p>
          </div>
          <input 
            type="file" 
            class="hidden" 
            :accept="accept"
            :disabled="disabled"
            @change="$emit('file-selected', $event.target.files[0])"
          />
        </label>
        
        <!-- Upload Progress -->
        <div v-if="uploading" class="space-y-2">
          <div class="flex items-center gap-2 text-sm text-primary">
            <Icon name="heroicons-outline:refresh" class="h-4 w-4 animate-spin" />
            <span>Uploading... {{ uploadProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-primary h-2 rounded-full transition-all duration-300" 
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
        </div>
        
        <!-- File Preview -->
        <div v-if="filePreview" class="relative">
          <img 
            v-if="fileType === 'image'"
            :src="filePreview" 
            alt="Preview" 
            class="w-full h-48 object-cover rounded-lg border"
          />
          <video 
            v-else-if="fileType === 'video'"
            :src="filePreview" 
            controls 
            class="w-full h-48 rounded-lg border"
          />
          <div 
            v-else
            class="w-full h-24 bg-gray-100 rounded-lg border flex items-center justify-center"
          >
            <Icon name="heroicons-outline:document" class="h-8 w-8 text-gray-400" />
          </div>
          
          <button 
            @click="$emit('remove-file')" 
            class="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Icon name="heroicons-outline:trash" class="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <!-- Loading indicator -->
      <div 
        v-if="loading && type !== 'file'" 
        class="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <Icon name="heroicons-outline:refresh" class="h-4 w-4 animate-spin text-gray-400" />
      </div>
    </div>
    
    <!-- Help Text -->
    <p v-if="help && !error" class="text-xs text-gray-500">{{ help }}</p>
    
    <!-- Error Message -->
    <p v-if="error" class="text-xs text-red-600 flex items-center gap-1">
      <Icon name="heroicons-outline:exclamation-circle" class="h-3 w-3" />
      {{ error }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  help: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  rows: { type: Number, default: 3 },
  options: { type: Array, default: () => [] },
  languageCode: { type: String, default: '' },
  languageName: { type: String, default: '' },
  // File specific props
  accept: { type: String, default: '' },
  uploading: { type: Boolean, default: false },
  uploadProgress: { type: Number, default: 0 },
  filePreview: { type: String, default: '' },
  fileType: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'file-selected', 'remove-file'])

const inputClass = computed(() => {
  const baseClass = props.error 
    ? 'border-red-300 focus:border-red-500' 
    : 'border-gray-200 focus:border-primary'
  
  const disabledClass = props.disabled 
    ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
    : 'bg-white'
    
  return `${baseClass} ${disabledClass}`
})
</script>