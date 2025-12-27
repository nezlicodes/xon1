<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <TechnologyHero
      v-if="heroSection"
      :section="heroSection"
      :technology="technology"
    />

    <!-- About Section -->
    <TechnologyAbout
      v-if="aboutSection && technology"
      :section="aboutSection"
      :technology-id="technology.id"
    />

    <!-- Features Section -->
    <TechnologyFeatures
      v-if="featuresSection"
      :section="featuresSection"
    />

    <!-- Products Section -->
    <TechnologyProducts
      v-if="productsSection"
      :section="productsSection"
      :products="products"
    />

    <!-- Stats Section -->
    <TechnologyStats
      v-if="statsSection"
      :section="statsSection"
    />

    <!-- CTA Section -->
    <TechnologyCallToAction
      v-if="ctaSection"
      :section="ctaSection"
    />
  </div>
</template>

<script setup>
const route = useRoute()
const { fetchTechnologyBySlug, fetchTechnologySections, getTranslation } = useTechnologies()

const technology = ref(null)
const sections = ref([])
const products = ref([])
const loading = ref(true)

const heroSection = computed(() => sections.value.find(s => s.section_key === 'tech_hero'))
const aboutSection = computed(() => sections.value.find(s => s.section_key === 'tech_about'))
const featuresSection = computed(() => sections.value.find(s => s.section_key === 'tech_features'))
const productsSection = computed(() => sections.value.find(s => s.section_key === 'tech_products'))
const statsSection = computed(() => sections.value.find(s => s.section_key === 'tech_stats'))
const ctaSection = computed(() => sections.value.find(s => s.section_key === 'tech_cta'))

const loadData = async () => {
  loading.value = true
  // Handle array slug from [...slug].vue
  const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
  console.log('Loading technology data for slug:', slug, 'from params:', route.params.slug)
  
  try {
    // Load technology
    const { data: techData, error: techError } = await fetchTechnologyBySlug(slug)
    console.log('Technology fetch result:', { techData, techError })
    
    if (techError) throw techError
    if (!techData) {
      console.error('No technology found for slug:', route.params.slug)
      return
    }
    
    technology.value = techData
    console.log('Technology loaded:', techData)

    // Load sections
    const { data: sectionsData, error: sectionsError } = await fetchTechnologySections(techData.id)
    console.log('Sections fetch result:', { sectionsData, sectionsError })
    
    if (sectionsError) throw sectionsError
    sections.value = sectionsData || []
    console.log('Sections loaded:', sections.value)

    // Load featured products for this technology from the technology_featured_products table ONLY
    try {
      const { getSelectedFeaturedProducts } = useTechnologyProducts()
      const productsData = await getSelectedFeaturedProducts(techData.id)
      products.value = productsData || []
      console.log('Loaded selected featured products:', products.value.length, 'products')
    } catch (error) {
      console.error('Error loading products for technology:', error)
      products.value = []
    }
  } catch (error) {
    console.error('Error loading technology:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
console.log('hihi')
// SEO
useHead(() => ({
  title: technology.value ? getTranslation(technology.value.name_translations) + ' - Xone Algeria' : 'Technology',
  meta: [
    {
      name: 'description',
      content: technology.value
        ? getTranslation(technology.value.short_description_translations)
        : 'Discover our technologies'
    },
    {
      property: 'og:title',
      content: technology.value ? getTranslation(technology.value.name_translations) : 'Technology'
    },
    {
      property: 'og:description',
      content: technology.value
        ? getTranslation(technology.value.short_description_translations)
        : 'Discover our technologies'
    }
  ]
}))
</script>