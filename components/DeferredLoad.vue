<template>
  <div ref="wrapper">
    <slot v-if="isVisible"></slot>
    <div v-else :style="{ minHeight: minHeight }">
      <!-- Placeholder while loading -->
      <slot name="placeholder">
        <div class="animate-pulse bg-gray-200 rounded" :style="{ minHeight: minHeight }"></div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  minHeight?: string
  rootMargin?: string
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  minHeight: '200px',
  rootMargin: '100px',
  threshold: 0.01
})

const wrapper = ref<HTMLElement>()
const isVisible = ref(false)

onMounted(() => {
  if (!wrapper.value) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.disconnect()
        }
      })
    },
    {
      rootMargin: props.rootMargin,
      threshold: props.threshold
    }
  )

  observer.observe(wrapper.value)

  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>
