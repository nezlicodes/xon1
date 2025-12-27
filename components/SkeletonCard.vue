<template>
  <div 
    class="bg-gray-200 dark:bg-gray-700 animate-pulse"
    :class="[
      roundedClass,
      heightClass,
      widthClass,
      customClass
    ]"
  ></div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  height?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | string
  width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  customClass?: string
}>(), {
  height: 'md',
  width: 'full',
  rounded: 'md',
  customClass: ''
})

const heightClass = computed(() => {
  const heightMap: Record<string, string> = {
    'xs': 'h-3',
    'sm': 'h-4',
    'md': 'h-5',
    'lg': 'h-6',
    'xl': 'h-8',
    '2xl': 'h-12',
    'full': 'h-full'
  }
  return heightMap[props.height] || props.height
})

const widthClass = computed(() => {
  const widthMap: Record<string, string> = {
    'xs': 'w-16',
    'sm': 'w-24',
    'md': 'w-32',
    'lg': 'w-48',
    'xl': 'w-64',
    'full': 'w-full'
  }
  return widthMap[props.width] || props.width
})

const roundedClass = computed(() => {
  const roundedMap: Record<string, string> = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    'full': 'rounded-full'
  }
  return roundedMap[props.rounded]
})
</script>
