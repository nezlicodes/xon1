<template>
  <section
    v-if="section"
    class="relative min-h-[80vh] pt-32 flex items-center justify-center overflow-hidden"
    :style="{
      backgroundColor: section.background_color || 'rgb(var(--primary-color))',
      color: section.text_color || 'rgb(var(--primary-contrast-color))',
    }"
  >
    <!-- Background Media -->
    <div
      v-if="section.video_url || section.image_url"
      class="absolute inset-0 z-0"
    >
      <!-- Background Video -->
      <video
        v-if="section.video_url"
        :src="section.video_url"
        autoplay
        loop
        muted
        playsinline
        class="w-full h-full object-cover"
      />

      <!-- Background Image (fallback or when no video) -->
      <NuxtImg
        v-else-if="section.image_url"
        :src="section.image_url"
        alt="Technology background"
        class="w-full h-full object-cover"
        loading="lazy"
      />

      <!-- Dark overlay for better text readability -->
      <div class="absolute inset-0 bg-black bg-opacity-40"></div>
    </div>

    <!-- Content -->
    <div
      class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
    >
   

      <!-- Title -->
      <h1 class="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
        {{ currentTitle }}
      </h1>

      <!-- Subtitle -->
      <p
        class="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-200"
      >
        {{ currentContent }}
      </p>

      <!-- CTA Buttons -->
      <div
        v-if="section.additional_data?.buttons"
        class="flex flex-wrap gap-4 justify-center animate-fade-in-up animation-delay-400"
      >
        <NuxtLink
          v-for="(button, index) in section.additional_data.buttons"
          :key="index"
          :to="button.link || '#'"
          class="inline-flex items-center px-8 py-3 border-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
        >
          {{ getTranslation(button.text_translations) }}
          <Icon name="heroicons-outline:arrow-right" class="ml-2 h-5 w-5" />
        </NuxtLink>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div
      class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
    >
      <Icon name="heroicons-outline:chevron-down" class="h-8 w-8" />
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  section: Object,
  technology: Object,
});

const { getTranslation } = useTechnologies();
const currentTitle = computed(() =>
  getTranslation(props.section?.title_translations)
);
const currentContent = computed(() =>
  getTranslation(props.section?.content_translations)
);
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

.animation-delay-400 {
  animation-delay: 0.4s;
  opacity: 0;
}
</style>