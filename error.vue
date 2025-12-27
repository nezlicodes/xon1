<script setup lang="ts">
import type { NuxtError } from "#app";

const localePath = useLocalePath();
const props = defineProps({
  error: Object as () => NuxtError,
});
</script>
<template>
  <div
    class="min-h-screen bg-mgray-100 flex flex-col items-center justify-center"
  >
    <div class="text-center space-y-6">
      <h1 class="text-9xl font-bold text-mgray-800">{{ error.statusCode }}</h1>
      <p class="text-xl text-mgray-600">{{ error.message }}</p>
      <NuxtLink
        :to="localePath('/')"
        class="inline-block px-6 py-3 text-base font-medium text-contrast1 bg-primary rounded-md hover:opacity-80 transition-colors duration-200"
      >
        Go back home
      </NuxtLink>
    </div>
  </div>
</template>
