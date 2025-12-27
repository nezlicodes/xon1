<template>
  <div 
    class="inline-flex items-center justify-center"
    :class="containerClass"
  >
    <!-- Simple Ring Spinner -->
    <div class="relative" :class="sizeClass">
      <svg class="animate-spin" :class="sizeClass" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-dasharray="80 50"
          stroke-linecap="round"
          class="text-primary"
        />
      </svg>
    </div>

    <!-- Optional Loading Text -->
    <span 
      v-if="showText" 
      class="ml-3 text-gray-600 dark:text-gray-400"
      :class="textSizeClass"
    >
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  text?: string
}>(), {
  size: 'md',
  showText: false,
  text: 'Loading...'
})

const sizeClass = computed(() => {
  const sizeMap: Record<string, string> = {
    'xs': 'w-4 h-4',
    'sm': 'w-6 h-6',
    'md': 'w-8 h-8',
    'lg': 'w-10 h-10',
    'xl': 'w-12 h-12'
  }
  return sizeMap[props.size]
})

const containerClass = computed(() => {
  return props.showText ? 'flex-row' : ''
})

const textSizeClass = computed(() => {
  const sizeMap: Record<string, string> = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'md': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl'
  }
  return sizeMap[props.size]
})
</script>

<style scoped>
.text-primary {
  color: rgb(var(--primary-color));
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>
