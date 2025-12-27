<template>
  <section class="py-20 bg-white" :dir="(useI18n().locale.value === 'ar') ? 'rtl' : 'ltr'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="grid lg:grid-cols-2 gap-12 items-center animate-pulse">
        <div class="bg-gray-200 rounded-2xl h-[600px]"></div>
        <div class="grid grid-cols-2 gap-8">
          <div v-for="i in 4" :key="i" class="bg-gray-100 rounded-xl h-48"></div>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="features.length > 0" class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Image Section (Left) -->
        <div class="relative">
          <div class="relative rounded-2xl overflow-hidden shadow-2xl">
            <NuxtImg
              :src="featureImage || 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80'"
              alt="Xone Algeria Features"
              class="w-full h-auto object-cover"
            />
          </div>
        </div>

        <!-- Features Grid (Right) - 2x2 Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="flex flex-col"
          >
            <!-- Number -->
            <div class="text-5xl font-bold text-gray-900 mb-4">
              {{ feature.number }}
            </div>

            <!-- Title -->
            <h3 class="text-xl font-bold text-primary-600 mb-3">
              {{ getFeatureTitle(feature) }}
            </h3>

            <!-- Description with HTML rendering -->
            <div 
              class="text-gray-500 text-sm leading-relaxed prose prose-sm"
              v-html="getFeatureDescription(feature)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  section: Object,
  loading: Boolean
})

const getCurrentLocale = () => {
  try {
    const { locale } = useI18n()
    return locale.value
  } catch {
    return 'fr'
  }
}

const features = computed(() => {
  return props.section?.additionalData?.features || []
})

// Get image_url from section root, not from additionalData
const featureImage = computed(() => {
  return props.section?.imageUrl || props.section?.image_url || ''
})

const getFeatureTitle = (feature) => {
  const locale = getCurrentLocale()
  return feature[`title_${locale}`] || feature.title_fr || feature.title_en || ''
}

const getFeatureDescription = (feature) => {
  const locale = getCurrentLocale()
  return feature[`description_${locale}`] || feature.description_fr || feature.description_en || ''
}
</script>

<style>
.prose p {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose strong {
  font-weight: 600;
}

.prose em {
  font-style: italic;
}

.prose ul,
.prose ol {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding-left: 1.5em;
}

.prose li {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}
</style>
