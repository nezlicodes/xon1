<template>
  <section
    v-if="section"
    class="py-16 md:py-24 relative overflow-hidden"
    :style="{
      backgroundColor: section.background_color || 'rgb(17, 24, 39)',
      color: section.text_color || 'rgb(255, 255, 255)'
    }"
  >
    <!-- Background Image -->
    <div v-if="section.image_url" class="absolute inset-0 z-0">
      <NuxtImg
        :src="section.image_url"
        alt="CTA background"
        class="w-full h-full object-cover opacity-20"
        loading="lazy"
      />
    </div>

    <!-- Content -->
    <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl md:text-5xl font-bold mb-6">
        {{ currentTitle }}
      </h2>
      <p class="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
        {{ currentContent }}
      </p>

      <!-- CTA Buttons -->
      <div v-if="section.additional_data?.buttons" class="flex flex-wrap gap-4 justify-center">
        <NuxtLink
          v-for="(button, index) in section.additional_data.buttons"
          :key="index"
          :to="button.link || '#'"
          class="inline-flex items-center px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg bg-white text-gray-900 hover:bg-gray-100"
        >
          {{ getTranslation(button.text_translations) }}
          <Icon
            :name="button.icon || 'heroicons-outline:arrow-right'"
            class="ml-2 h-5 w-5"
          />
        </NuxtLink>
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