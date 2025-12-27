<template>
  <div class="min-h-screen pt-20" :dir="(useI18n().locale.value === 'ar') ? 'rtl' : 'ltr'">
    <!-- Hero Section -->
    <AboutHero v-if="heroSection" :section="heroSection" :loading="loading" />

    <!-- Features Section -->
    <AboutFeatures v-if="featuresSection" :section="featuresSection" :loading="loading" />

    <!-- Story Section with Stats -->
    <AboutStory v-if="storySection" :section="storySection" :loading="loading" />

    <!-- Mission & Vision -->
    <AboutMissionVision
      v-if="missionSection && visionSection"
      :mission="missionSection"
      :vision="visionSection"
      :loading="loading"
    />

    <!-- Values Section -->
    <AboutValues v-if="valuesSection" :section="valuesSection" :loading="loading" />

    <!-- Certifications Section -->
    <AboutCertifications
      v-if="certificationsSection"
      :section="certificationsSection"
      :loading="loading"
    />

    <!-- CTA Section -->
    <AboutCTA v-if="ctaSection" :section="ctaSection" :loading="loading" />
  </div>
</template>

<script setup>
const { fetchAboutSections } = useAboutUs()

const sections = ref([])
const loading = ref(true)

// Computed sections
const heroSection = computed(() =>
  sections.value.find((s) => s.section_key === 'about_hero')
)

const storySection = computed(() =>
  sections.value.find((s) => s.section_key === 'our_story')
)

const featuresSection = computed(() =>
  sections.value.find((s) => s.section_key === 'about_features')
)

const missionSection = computed(() =>
  sections.value.find((s) => s.section_key === 'our_mission')
)

const visionSection = computed(() =>
  sections.value.find((s) => s.section_key === 'our_vision')
)

const valuesSection = computed(() =>
  sections.value.find((s) => s.section_key === 'our_values')
)

const certificationsSection = computed(() =>
  sections.value.find((s) => s.section_key === 'about_certifications')
)

const teamSection = computed(() =>
  sections.value.find((s) => s.section_key === 'our_team')
)

const ctaSection = computed(() =>
  sections.value.find((s) => s.section_key === 'about_cta')
)

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await fetchAboutSections()
    if (data) {
      sections.value = data
    }
  } catch (error) {
    console.error('Error loading about sections:', error)
  } finally {
    loading.value = false
  }
})

// SEO
useHead({
  title: 'About Us - Xone Algeria',
  meta: [
    {
      name: 'description',
      content: 'Learn about Xone Algeria - Our story, mission, values, and the team behind Algeria\'s leading e-commerce platform.'
    }
  ]
})
</script>
