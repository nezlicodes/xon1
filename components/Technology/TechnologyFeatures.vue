<template>
  <section
    v-if="section"
    class="py-20 md:py-28 relative overflow-hidden"
    :style="{
      backgroundColor: section.background_color || 'rgb(249, 250, 251)',
      color: section.text_color || 'rgb(17, 24, 39)'
    }"
  >
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Header -->
      <div class="text-center mb-16 md:mb-20">
        <h2 class="text-4xl md:text-5xl font-bold mb-6 ">
          {{ currentTitle }}
        </h2>
        <p class="text-lg md:text-xl opacity-80 max-w-3xl mx-auto leading-relaxed">
          {{ currentContent }}
        </p>

        <!-- Section Media (Image or Video) -->
        <div v-if="section.additional_data?.section_media_url" class="mt-10 max-w-4xl mx-auto">
          <div class="rounded-2xl overflow-hidden shadow-2xl border border-primary/10">
            <img
              v-if="section.additional_data.section_media_type === 'image'"
              :src="section.additional_data.section_media_url"
              :alt="currentTitle"
              class="w-full h-auto object-cover"
            />
            <video
              v-else-if="section.additional_data.section_media_type === 'video'"
              :src="section.additional_data.section_media_url"
              class="w-full h-auto"
              controls
              autoplay
              loop
              muted
              playsinline
            />
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div
        v-if="section.additional_data?.features"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <div
          v-for="(feature, index) in section.additional_data.features"
          :key="index"
          class="group relative"
        >
          <!-- Feature Card -->
          <div
            class="h-full rounded-2xl border p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/30"
            
          >
            <!-- Media (Image or Video) -->
            <div v-if="feature.media_url" class="mb-6 -mx-8 -mt-8 rounded-t-2xl overflow-hidden">
              <img
                v-if="feature.media_type === 'image'"
                :src="feature.media_url"
                :alt="getTranslation(feature.title_translations)"
                class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <video
                v-else-if="feature.media_type === 'video'"
                :src="feature.media_url"
                class="w-full h-48 object-cover"
                autoplay
                loop
                muted
                playsinline
              />
            </div>

            <!-- Icon (if no media) -->
            <div
              v-if="!feature.media_url"
              class="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg"
            >
              <Icon
                v-if="feature.icon"
                :name="feature.icon"
                class="h-8 w-8 text-white"
              />
              <Icon v-else name="heroicons-outline:sparkles" class="h-8 w-8 text-white" />
            </div>

            <!-- Content -->
            <div class="space-y-4">
              <!-- Title -->
              <h3 class="text-xl md:text-2xl font-bold leading-tight group-hover transition-colors duration-300">
                {{ getTranslation(feature.title_translations) }}
              </h3>

              <!-- Description -->
              <p class="text-sm md:text-base opacity-75 leading-relaxed">
                {{ getTranslation(feature.description_translations) }}
              </p>
            </div>

            <!-- Hover decoration -->
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/70 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-2xl"></div>
          </div>
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