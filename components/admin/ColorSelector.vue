<template>
  <div class="space-y-4">
    <h4 class="text-sm font-medium text-gray-700 mb-3">Color Scheme</h4>
    
    <!-- App Color Schemes Only -->
    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="scheme in colorSchemes"
        :key="scheme.name"
        @click="selectScheme(scheme)"
        class="relative p-4 rounded-lg border-2 transition-all duration-200 hover:border-gray-300 group"
        :class="isSelected(scheme) ? 'border-primary ring-2 ring-primary ring-opacity-20' : 'border-gray-200'"
      >
        <div class="flex items-center justify-center gap-2 mb-3">
          <div 
            class="w-6 h-6 rounded-full shadow-sm border-2 border-white"
            :style="{ backgroundColor: scheme.background }"
          ></div>
          <div 
            class="w-6 h-6 rounded-full shadow-sm border-2 border-white"
            :style="{ backgroundColor: scheme.text }"
          ></div>
        </div>
        <p class="text-sm font-medium text-gray-700">{{ scheme.name }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ scheme.description }}</p>
        <Icon 
          v-if="isSelected(scheme)"
          name="heroicons-outline:check" 
          class="absolute top-2 right-2 w-5 h-5 text-primary"
        />
      </button>
    </div>

    <!-- Preview -->
    <div 
      class="mt-4 p-4 rounded-lg border-2 border-dashed border-gray-200"
      :style="{ backgroundColor: background, color: text }"
    >
      <p class="text-sm font-medium">Preview</p>
      <p class="text-xs opacity-80">This is how your colors will look</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  background: { type: String, default: '#ffffff' },
  text: { type: String, default: '#1f2937' }
})

const emit = defineEmits(['update:background', 'update:text'])

const colorSchemes = [
  { 
    name: 'Primary', 
    background: 'rgb(var(--primary-color))', 
    text: 'rgb(var(--primary-contrast-color))',
    description: 'Main brand colors'
  },
  { 
    name: 'Secondary', 
    background: 'rgb(var(--secondary-color))', 
    text: 'rgb(var(--secondary-contrast-color))',
    description: 'Alternative brand colors'
  },
  { 
    name: 'Body', 
    background: 'rgb(var(--background-color))', 
    text: 'rgb(var(--text-color))',
    description: 'Body background & text'
  }
]

const selectScheme = (scheme) => {
  emit('update:background', scheme.background)
  emit('update:text', scheme.text)
}

const isSelected = (scheme) => {
  return props.background === scheme.background && props.text === scheme.text
}
</script>