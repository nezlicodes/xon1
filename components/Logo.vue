<template>
  <div>
    <NuxtImg v-if="props.src" :src="props.src" :alt="props.alt || 'Logo'" class="w-12 h-auto" />

    <NuxtImg
      v-else
      src="/images/placeholders/placeholder-logo.svg"
      class="w-12 h-auto"
      alt="logo-placeholder"
    ></NuxtImg>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string;
  alt: string;
}>();
</script>

<style scoped>
</style>