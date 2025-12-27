<template>
  <section class="py-20 bg-white" :dir="(useI18n().locale.value === 'ar') ? 'rtl' : 'ltr'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {{ section?.title }}
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          {{ section?.content }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid md:grid-cols-2 gap-12 animate-pulse">
        <div v-for="i in 4" :key="i" class="h-48"></div>
      </div>

      <!-- Values Grid -->
      <div v-else-if="values.length > 0" class="grid md:grid-cols-2 gap-12">
        <div 
          v-for="(value, index) in values" 
          :key="index"
          class="group"
        >
          <div class="flex items-start gap-6">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform duration-300">
                <component 
                  :is="getIconComponent(value.icon)" 
                  class="w-8 h-8 text-contrast2" 
                />
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 pt-2">
              <!-- Title -->
              <h3 class="text-2xl font-bold text-gray-900 mb-3">
                {{ getValueTitle(value) }}
              </h3>

              <!-- Description with HTML rendering -->
              <div 
                class="text-gray-600 text-base leading-relaxed prose prose-base" 
                v-html="getValueDescription(value)"
              ></div>
            </div>
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

const values = computed(() => {
  return props.section?.additionalData?.values || []
})

const getValueTitle = (value) => {
  const locale = getCurrentLocale()
  return value[`title_${locale}`] || value.title_fr || value.title_en || ''
}

const getValueDescription = (value) => {
  const locale = getCurrentLocale()
  return value[`description_${locale}`] || value.description_fr || value.description_en || ''
}

const getIconComponent = (iconName) => {
  const iconMap = {
    trust: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      `
    },
    innovation: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      `
    },
    quality: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
        </svg>
      `
    },
    customer: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      `
    }
  }
  
  return iconMap[iconName] || iconMap.trust
}
</script>

<style>
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

.prose ul,
.prose ol {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  padding-left: 1.5em;
}

.prose li {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}
</style>
