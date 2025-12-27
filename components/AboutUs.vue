<template>
  <section v-if="section.is_active" id="about" class="py-24 bg-primary text-contrast1" :dir="(useI18n().locale.value === 'ar') ? 'rtl' : 'ltr'">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Title -->
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">
          {{ section.content_translations[currentLocale]?.title || 'Notre Histoire' }}
        </h2>
        <div class="w-24 h-1.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60 mx-auto rounded-full"></div>
      </div>

      <!-- Content -->
      <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <!-- Image -->
        <div v-if="section.image_url" class="w-full lg:w-1/2">
          <div class="relative overflow-hidden rounded-2xl shadow-xl">
            <NuxtImg
              :src="section.image_url"
              :alt="section.content_translations[currentLocale]?.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Text Content -->
        <div class="w-full" :class="section.image_url ? 'lg:w-1/2' : ''">
          <div
            v-if="section.content_translations[currentLocale]?.content"
            class="prose prose-lg max-w-none"
            v-html="section.content_translations[currentLocale].content"
          ></div>
          <div v-else class="text-center py-12">
            <Icon name="heroicons-outline:information-circle" class="w-12 h-12 mx-auto mb-4" />
            <p>Aucun contenu disponible</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const supabase = useSupabaseClient()
const { locale } = useI18n()

const SECTION_KEY = 'about_section'

// Current locale
const currentLocale = computed(() => locale.value || 'fr')

// Section data
const section = ref({
  is_active: false,
  content_translations: {
    fr: { title: '', content: '' },
    ar: { title: '', content: '' },
    en: { title: '', content: '' }
  },
  image_url: ''
})

// Load section
const loadSection = async () => {
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .select('is_active, content_translations, image_url')
      .eq('section_key', SECTION_KEY)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (data) {
      section.value = {
        is_active: data.is_active ?? false,
        content_translations: data.content_translations || {
          fr: { title: '', content: '' },
          ar: { title: '', content: '' },
          en: { title: '', content: '' }
        },
        image_url: data.image_url || ''
      }
    }
  } catch (error) {
    console.error('Error loading about section:', error)
  }
}

onMounted(async () => {
  await loadSection()
})
</script>

<style scoped>


.prose p {
  @apply mb-4;
}

.prose h3 {
  @apply text-xl font-semibold mb-3 ;
}

.prose ul,
.prose ol {
  @apply ml-6 mb-4;
}

.prose ul {
  @apply list-disc;
}

.prose ol {
  @apply list-decimal;
}

.prose li {
  @apply mb-2;
}

.prose strong {
  @apply font-semibold;
}

.prose a {
  @apply text-primary hover:underline;
}
</style>