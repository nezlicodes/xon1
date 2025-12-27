<template>
  <section v-if="section && section.is_active !== false" class="py-20 bg-gray-50" :dir="(useI18n().locale.value === 'ar') ? 'rtl' : 'ltr'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {{ currentTitle }}
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          {{ currentContent }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid md:grid-cols-3 gap-8 animate-pulse">
        <div v-for="i in 3" :key="i" class="bg-white rounded-2xl h-96"></div>
      </div>

      <!-- Certifications Grid -->
      <div v-else-if="certifications.length > 0" class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="(cert, index) in certifications" 
          :key="index"
          class="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200"
        >
          <!-- Logo -->
          <div class="flex justify-center mb-6">
            <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
              <NuxtImg 
                v-if="cert.logo_url"
                :src="cert.logo_url" 
                :alt="getCertTitle(cert)"
                class="w-16 h-16 object-contain"
              />
              <Icon v-else name="heroicons-outline:shield-check" class="w-16 h-16 text-gray-300" />
            </div>
          </div>

          <!-- Title -->
          <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">
            {{ getCertTitle(cert) }}
          </h3>

          <!-- Description with HTML rendering -->
          <div 
            class="text-gray-600 text-sm leading-relaxed text-justify prose prose-sm"
            v-html="getCertDescription(cert)"
          ></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <Icon name="heroicons-outline:shield-check" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">Aucune certification disponible</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  section: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const { locale } = useI18n()

const currentTitle = computed(() => {
  if (!props.section?.title_translations) return 'Nos Certifications'
  return props.section.title_translations[locale.value] || 
         props.section.title_translations.fr || 
         'Nos Certifications'
})

const currentContent = computed(() => {
  if (!props.section?.content_translations) return ''
  return props.section.content_translations[locale.value] || 
         props.section.content_translations.fr || 
         ''
})

const certifications = computed(() => {
  return props.section?.additional_data?.certifications || []
})

const getCertTitle = (cert) => {
  return cert[`title_${locale.value}`] || cert.title_fr || cert.title_en || ''
}

const getCertDescription = (cert) => {
  return cert[`description_${locale.value}`] || cert.description_fr || cert.description_en || ''
}
</script>

<style scoped>
.prose p {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

.prose strong {
  font-weight: 600;
}

.prose em {
  font-style: italic;
}
</style>
