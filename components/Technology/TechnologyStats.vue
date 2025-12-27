<template>
  <section
    v-if="section"
    class="py-16 md:py-24 relative overflow-hidden"
    :style="{
      backgroundColor: section.background_color || 'rgb(59, 130, 246)',
      color: section.text_color || 'rgb(255, 255, 255)'
    }"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          {{ currentTitle }}
        </h2>
        <p class="text-lg opacity-90 max-w-3xl mx-auto">
          {{ currentContent }}
        </p>
      </div>

      <!-- Stats Grid -->
      <div
        v-if="section.additional_data?.stats"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        <div
          v-for="(stat, index) in section.additional_data.stats"
          :key="index"
          class="text-center group"
        >
          <!-- Icon -->
          <div
            v-if="stat.icon"
            class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white bg-opacity-20 group-hover:bg-opacity-30 transition-all group-hover:scale-110"
          >
            <Icon :name="stat.icon" class="h-8 w-8" />
          </div>

          <!-- Value -->
          <div class="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-105 transition-transform">
            {{ stat.value }}
          </div>

          <!-- Label -->
          <div class="text-lg opacity-90">
            {{ getTranslation(stat.label_translations) }}
          </div>

          <!-- Description -->
          <p v-if="stat.description_translations" class="mt-2 text-sm opacity-75">
            {{ getTranslation(stat.description_translations) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  section: Object
})

const { getTranslation } = useTechnologies()
const currentTitle = computed(() => getTranslation(props.section?.title_translations))
const currentContent = computed(() => getTranslation(props.section?.content_translations))
</script>