<template>
  <section v-if="sectionData.is_active" class="py-8 bg-primary text-contrast1 border-y border-primary/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="n in 4" :key="n" class="flex flex-col items-center text-center space-y-3">
          <div class="w-12 h-12 rounded-full bg-contrast1/10 animate-pulse"></div>
          <div class="space-y-2 w-full">
            <div class="h-5 bg-contrast1/10 rounded w-20 mx-auto animate-pulse"></div>
            <div class="h-4 bg-contrast1/10 rounded w-24 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <div
          v-for="(feature, index) in currentFeatures"
          :key="`feature-${index}`"
          class="group relative flex flex-col items-center text-center"
        >
          <!-- Divider (except for last item on desktop) -->
          <div
            v-if="index < currentFeatures.length - 1"
            class="hidden lg:block absolute top-1/2 -right-6 -translate-y-1/2 w-px h-12 bg-contrast1/20"
          ></div>

          <!-- Icon -->
          <div class="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 text-secondary group-hover:bg-contrast1/20 transition-all duration-300">
            <Icon
              :name="feature.icon"
              class="w-6 h-6"
            />
          </div>

          <!-- Content -->
          <div class="space-y-1">
            <h3 class="text-base sm:text-lg font-bold text-contrast1">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-contrast1/80">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { fetchSection } = useContentSections();
const { locale } = useI18n();

// Reactive locale
const currentLocale = computed(() => locale.value);

// Default features
const defaultFeatures = [
  {
    icon: "ph:users-three-fill",
    title: "100M+",
    description: "produits vendus"
  },
  {
    icon: "ph:globe-hemisphere-west-fill",
    title: "60+ pays",
    description: "couverts"
  },
  {
    icon: "ph:package-fill",
    title: "Livraison DZ",
    description: "rapide & sécurisée"
  },
  {
    icon: "ph:headset-fill",
    title: "Support 24/7",
    description: "toujours disponible"
  }
];

// State
const loading = ref(true);
const sectionData = ref({
  is_active: true,
  content_translations: {
    fr: { features: defaultFeatures },
    ar: { features: defaultFeatures },
    en: { features: defaultFeatures }
  }
});

// Get current language features
const currentFeatures = computed(() => {
  const content = sectionData.value.content_translations?.[currentLocale.value];
  return content?.features || defaultFeatures;
});

// Load section data
const loadSectionData = async () => {
  loading.value = true;
  try {
    const { data, error } = await fetchSection('features');
    
    if (error) throw error;
    
    if (data) {
      sectionData.value = data;
    }
  } catch (error) {
    console.error('Error loading features section:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadSectionData();
});
</script>