<template>
  <div class="relative">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all flex items-center justify-between bg-white"
    >
      <div class="flex items-center gap-3">
        <Icon v-if="modelValue" :name="modelValue" class="h-5 w-5 text-gray-700" />
        <span class="text-gray-700">{{ getIconLabel(modelValue) || 'Select an icon' }}</span>
      </div>
      <Icon name="heroicons-outline:chevron-down" class="h-5 w-5 text-gray-400" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      v-click-outside="() => isOpen = false"
      class="absolute z-50 mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto"
    >
      <!-- Search -->
      <div class="sticky top-0 bg-white p-3 border-b">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search icons..."
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @click.stop
        />
      </div>

      <!-- Icon List -->
      <div class="p-2">
        <button
          v-for="icon in filteredIcons"
          :key="icon.value"
          type="button"
          @click="selectIcon(icon.value)"
          class="w-full px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-3 transition-colors"
          :class="{ 'bg-blue-50': modelValue === icon.value }"
        >
          <Icon :name="icon.value" class="h-5 w-5 text-gray-700" />
          <span class="text-sm text-gray-700">{{ icon.label }}</span>
        </button>
        <div v-if="filteredIcons.length === 0" class="px-3 py-4 text-center text-gray-500 text-sm">
          No icons found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  label: String
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')

const icons = [
  { value: 'heroicons-outline:sparkles', label: 'Sparkles' },
  { value: 'heroicons-outline:lightning-bolt', label: 'Lightning Bolt' },
  { value: 'heroicons-outline:fire', label: 'Fire' },
  { value: 'heroicons-outline:star', label: 'Star' },
  { value: 'heroicons-outline:heart', label: 'Heart' },
  { value: 'heroicons-outline:shield-check', label: 'Shield Check' },
  { value: 'heroicons-outline:badge-check', label: 'Badge Check' },
  { value: 'heroicons-outline:check-circle', label: 'Check Circle' },
  { value: 'heroicons-outline:globe-alt', label: 'Globe' },
  { value: 'heroicons-outline:trending-up', label: 'Trending Up' },
  { value: 'heroicons-outline:chart-bar', label: 'Chart Bar' },
  { value: 'heroicons-outline:chart-pie', label: 'Chart Pie' },
  { value: 'heroicons-outline:currency-dollar', label: 'Dollar' },
  { value: 'heroicons-outline:clock', label: 'Clock' },
  { value: 'heroicons-outline:users', label: 'Users' },
  { value: 'heroicons-outline:user-group', label: 'User Group' },
  { value: 'heroicons-outline:truck', label: 'Truck' },
  { value: 'heroicons-outline:cube', label: 'Cube' },
  { value: 'heroicons-outline:cog', label: 'Cog/Settings' },
  { value: 'heroicons-outline:chip', label: 'Chip' },
  { value: 'heroicons-outline:desktop-computer', label: 'Desktop' },
  { value: 'heroicons-outline:device-mobile', label: 'Mobile' },
  { value: 'heroicons-outline:light-bulb', label: 'Light Bulb' },
  { value: 'heroicons-outline:eye', label: 'Eye' },
  { value: 'heroicons-outline:photograph', label: 'Photo' },
  { value: 'heroicons-outline:video-camera', label: 'Video' },
  { value: 'heroicons-outline:microphone', label: 'Microphone' },
  { value: 'heroicons-outline:speaker-phone', label: 'Speaker' },
  { value: 'heroicons-outline:bell', label: 'Bell' },
  { value: 'heroicons-outline:mail', label: 'Mail' },
  { value: 'heroicons-outline:inbox', label: 'Inbox' },
  { value: 'heroicons-outline:paper-airplane', label: 'Send' },
  { value: 'heroicons-outline:download', label: 'Download' },
  { value: 'heroicons-outline:upload', label: 'Upload' },
  { value: 'heroicons-outline:cloud', label: 'Cloud' },
  { value: 'heroicons-outline:server', label: 'Server' },
  { value: 'heroicons-outline:database', label: 'Database' },
  { value: 'heroicons-outline:code', label: 'Code' },
  { value: 'heroicons-outline:terminal', label: 'Terminal' },
  { value: 'heroicons-outline:beaker', label: 'Beaker' },
  { value: 'heroicons-outline:puzzle', label: 'Puzzle' },
  { value: 'heroicons-outline:lock-closed', label: 'Lock' },
  { value: 'heroicons-outline:key', label: 'Key' },
  { value: 'heroicons-outline:adjustments', label: 'Adjustments' },
  { value: 'heroicons-outline:refresh', label: 'Refresh' },
  { value: 'heroicons-outline:arrow-right', label: 'Arrow Right' },
  { value: 'heroicons-outline:arrow-left', label: 'Arrow Left' },
  { value: 'heroicons-outline:arrow-up', label: 'Arrow Up' },
  { value: 'heroicons-outline:arrow-down', label: 'Arrow Down' },
  { value: 'heroicons-outline:shopping-bag', label: 'Shopping Bag' },
  { value: 'heroicons-outline:shopping-cart', label: 'Shopping Cart' },
  { value: 'heroicons-outline:credit-card', label: 'Credit Card' },
  { value: 'heroicons-outline:gift', label: 'Gift' },
  { value: 'heroicons-outline:office-building', label: 'Building' },
  { value: 'heroicons-outline:home', label: 'Home' },
  { value: 'heroicons-outline:location-marker', label: 'Location' },
  { value: 'heroicons-outline:map', label: 'Map' },
  { value: 'heroicons-outline:flag', label: 'Flag' },
  { value: 'heroicons-outline:bookmark', label: 'Bookmark' },
  { value: 'heroicons-outline:collection', label: 'Collection' },
  { value: 'heroicons-outline:filter', label: 'Filter' },
  { value: 'heroicons-outline:search', label: 'Search' },
  { value: 'heroicons-outline:zoom-in', label: 'Zoom In' },
  { value: 'heroicons-outline:zoom-out', label: 'Zoom Out' },
  { value: 'heroicons-outline:calendar', label: 'Calendar' },
  { value: 'heroicons-outline:document', label: 'Document' },
  { value: 'heroicons-outline:folder', label: 'Folder' },
  { value: 'heroicons-outline:archive', label: 'Archive' },
  { value: 'heroicons-outline:clipboard', label: 'Clipboard' },
  { value: 'heroicons-outline:scale', label: 'Scale' },
  { value: 'heroicons-outline:thumb-up', label: 'Thumb Up' },
  { value: 'heroicons-outline:thumb-down', label: 'Thumb Down' },
  { value: 'heroicons-outline:emoji-happy', label: 'Happy' },
  { value: 'heroicons-outline:emoji-sad', label: 'Sad' },
]

const filteredIcons = computed(() => {
  if (!searchQuery.value) return icons
  const query = searchQuery.value.toLowerCase()
  return icons.filter(icon => icon.label.toLowerCase().includes(query))
})

const getIconLabel = (value) => {
  return icons.find(i => i.value === value)?.label
}

const selectIcon = (value) => {
  emit('update:modelValue', value)
  isOpen.value = false
  searchQuery.value = ''
}

// Click outside directive
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>