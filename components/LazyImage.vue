<template>
  <div class="relative overflow-hidden" :style="{ paddingBottom: aspectRatio }">
    <!-- Placeholder/Blur -->
    <div
      v-if="!loaded"
      class="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
    >
      <div v-if="placeholder" class="w-full h-full">
        <NuxtImg :src="placeholder" alt="" class="w-full h-full object-cover blur-sm" />
      </div>
    </div>

    <!-- Actual Image -->
    <NuxtImg
      ref="imgRef"
      :data-src="src"
      :alt="alt"
      :class="[
        'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
        loaded ? 'opacity-100' : 'opacity-0'
      ]"
      @load="onLoad"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string
  alt?: string
  placeholder?: string
  aspectRatio?: string
}>()

const imgRef = ref<HTMLImageElement | null>(null)
const loaded = ref(false)

const onLoad = () => {
  loaded.value = true
}

onMounted(() => {
  if (!imgRef.value) return

  // Use IntersectionObserver for lazy loading
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && imgRef.value) {
          const src = imgRef.value.dataset.src
          if (src) {
            imgRef.value.src = src
            imgRef.value.removeAttribute('data-src')
            observer.unobserve(imgRef.value)
          }
        }
      })
    },
    {
      rootMargin: '50px' // Start loading 50px before entering viewport
    }
  )

  observer.observe(imgRef.value)

  // Cleanup
  onUnmounted(() => {
    if (imgRef.value) {
      observer.unobserve(imgRef.value)
    }
  })
})
</script>