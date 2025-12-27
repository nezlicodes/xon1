<template>
  <section
    v-if="section && section.is_active"
    class="relative min-h-[80vh] pt-32 flex items-center justify-center overflow-hidden"
    :style="{
      backgroundColor: section.background_color || 'rgb(249, 250, 251)',
      color: section.text_color || 'rgb(17, 24, 39)'
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
        :key="section.video_url"
        :src="section.video_url"
        autoplay
        loop
        muted
        playsinline
        class="w-full h-full object-cover"
        @loadeddata="onVideoLoaded"
        @error="onVideoError"
      />

      <!-- Background Image (fallback or when no video) -->
      <img
        v-else-if="section.image_url"
        :key="section.image_url"
        :src="section.image_url"
        alt="About us background"
        class="w-full h-full object-cover"
        @load="onImageLoaded"
        @error="onImageError"
      />

      <!-- Dark overlay for better text readability -->
      <div class="absolute inset-0 bg-black opacity-40"></div>
    </div>

    <!-- Decorative elements (only if no background media) -->
    <div v-else class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 opacity-5 rounded-full blur-3xl" :style="{ backgroundColor: section.text_color || 'currentColor' }"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 opacity-5 rounded-full blur-3xl" :style="{ backgroundColor: section.text_color || 'currentColor' }"></div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div class="animate-pulse space-y-4">
        <div class="h-16 bg-current bg-opacity-20 rounded-lg w-3/4 mx-auto"></div>
        <div class="h-8 bg-current bg-opacity-20 rounded-lg w-2/3 mx-auto"></div>
      </div>
    </div>

    <!-- Content -->
    <div
      v-else
      class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
    >
      <!-- Title -->
      <h1 class="text-5xl text-white md:text-6xl font-bold mb-6 animate-fade-in-up">
        {{ currentTitle || 'About Us' }}
      </h1>

      <!-- Subtitle -->
      <p
        class="text-xl text-white md:text-2xl opacity-90 max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-200"
      >
        {{ currentContent || 'Learn more about our company' }}
      </p>

      <!-- CTA Button -->
      <div
        v-if="currentCtaText && section.additional_data?.cta_link"
        class="animate-fade-in-up animation-delay-400"
      >
        <NuxtLink
          :to="section.additional_data.cta_link"
          class="inline-flex items-center px-8 py-3 border-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 border-current bg-primary text-contrast1 bg-opacity-20 hover:bg-opacity-30"
        >
          {{ currentCtaText }}
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
const { locale } = useI18n()
const supabase = useSupabaseClient()

const loading = ref(true)
const section = ref(null)

const currentTitle = computed(() => {
  if (!section.value?.title_translations) return ''
  return section.value.title_translations[locale.value] || 
         section.value.title_translations.en || 
         section.value.title_translations.fr || ''
})

const currentContent = computed(() => {
  if (!section.value?.content_translations) return ''
  return section.value.content_translations[locale.value] || 
         section.value.content_translations.en || 
         section.value.content_translations.fr || ''
})

const currentCtaText = computed(() => {
  if (!section.value?.additional_data?.cta_text) return ''
  const ctaText = section.value.additional_data.cta_text
  return ctaText[locale.value] || ctaText.en || ctaText.fr || ''
})

const onVideoLoaded = () => {
  console.log('✅ Video loaded successfully')
  console.log('Video URL:', section.value?.video_url)
}

const onImageLoaded = () => {
  console.log('✅ Image loaded successfully')
  console.log('Image URL:', section.value?.image_url)
}

const onVideoError = (e) => {
  console.error('❌ Video failed to load:', e)
  console.error('Video URL:', section.value?.video_url)
  console.error('Video element:', e.target)
}

const onImageError = (e) => {
  console.error('❌ Image failed to load:', e)
  console.error('Image URL:', section.value?.image_url)
  console.error('Image element:', e.target)
}

const loadData = async () => {
  loading.value = true
  console.log('🔍 Loading AboutHero data...')
  
  try {
    const { data, error } = await supabase
      .from('about_us_sections')
      .select('*')
      .eq('section_key', 'about_hero')
      .single()

    if (error) {
      console.error('❌ Error loading about hero:', error)
      return
    }

    if (data) {
      section.value = data
      console.log('✅ AboutHero data loaded:', data)
      console.log('📹 Video URL:', data.video_url)
      console.log('🖼️ Image URL:', data.image_url)
      console.log('👁️ Is Active:', data.is_active)
      console.log('🎨 Background Color:', data.background_color)
      console.log('📝 Title (current locale):', data.title_translations?.[locale.value])
      console.log('🔗 CTA Text:', data.additional_data?.cta_text)
      console.log('🔗 CTA Link:', data.additional_data?.cta_link)
    } else {
      console.warn('⚠️ No AboutHero data found in database')
    }
  } catch (error) {
    console.error('❌ Error fetching about hero:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('🚀 AboutHero component mounted')
  loadData()
})

// Reload when locale changes
watch(locale, () => {
  console.log('🌐 Locale changed to:', locale.value)
})
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