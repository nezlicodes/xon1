<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-500"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="show" 
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-gray-950"
    >
      <div class="flex flex-col items-center gap-6">
        <!-- Simple Animated Logo -->
        <div class="relative w-20 h-20">
          <!-- Single rotating ring -->
          <svg class="w-20 h-20 animate-spin" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-dasharray="80 50"
              stroke-linecap="round"
              class="text-primary"
            />
          </svg>
        </div>
        
        <!-- Optional Loading Text -->
        <p v-if="loadingText" class="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {{ loadingText }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  show?: boolean
  loadingText?: string
}>(), {
  show: false,
  loadingText: ''
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
  animation: spin 1s linear infinite;
}
</style>
