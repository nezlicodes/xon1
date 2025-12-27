<template>
  <section v-if="sectionData.is_active" class="testimonials-section bg-primary py-12 text-contrast1">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-16">
        <div class="text-center space-y-4">
          <div class="h-12 bg-foreground/5 rounded w-64 mx-auto animate-pulse"></div>
          <div class="h-4 bg-foreground/5 rounded w-96 mx-auto animate-pulse"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <div v-for="n in 5" :key="n" class="h-64 bg-foreground/5 rounded animate-pulse"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-xl mx-auto text-center">
        <p class="text-foreground/60">Impossible de charger les témoignages</p>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Header -->
        <div class="text-center mb-12 md:mb-16 lg:mb-20 space-y-4">
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {{ currentContent.title || defaultContent.title }}
          </h2>
          <p class="text-base md:text-lg text-foreground/60 max-w-2xl mx-auto">
            {{ currentContent.subtitle || defaultContent.subtitle }}
          </p>
        </div>

        <!-- Empty State -->
        <div v-if="displayedTestimonials.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-foreground/5 mb-6">
            <Icon name="ph:chat-circle-text" class="w-10 h-10 text-foreground/40" />
          </div>
          <h3 class="text-2xl font-bold mb-3">Aucun témoignage disponible</h3>
          <p class="text-foreground/60 text-lg">Les témoignages seront bientôt disponibles.</p>
        </div>

        <!-- Testimonials Grid -->
        <div v-else class="relative">
          <!-- Mobile Carousel -->
          <div class="md:hidden overflow-hidden">
            <div 
              class="flex transition-transform duration-500 ease-out"
              :style="{ transform: `translateX(-${currentMobileIndex * 100}%)` }"
            >
              <div
                v-for="testimonial in displayedTestimonials"
                :key="`mobile-${testimonial.id}`"
                class="w-full flex-shrink-0 px-4"
              >
                <div class="border bg-contrast1 text-mgray border-foreground/10 rounded-xl p-8">
                  <!-- Rating -->
                  <div class="flex space-x-0.5 mb-6">
                    <Icon
                      v-for="i in 5"
                      :key="i"
                      name="ph:star-fill"
                      class="w-4 h-4"
                      :class="i <= testimonial.rating ? 'text-foreground' : 'text-foreground/20'"
                    />
                  </div>

                  <!-- Content -->
                  <p class="text-base leading-relaxed mb-8">
                    "{{ getContent(testimonial) }}"
                  </p>

                  <!-- Author -->
                  <div class="flex items-center space-x-3 pt-6 border-t border-foreground/10">
                    <div v-if="testimonial.image_url" class="w-10 h-10 rounded-full overflow-hidden bg-foreground/5">
                      <NuxtImg :src="testimonial.image_url" :alt="testimonial.customer_name" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
                      <Icon name="ph:user" class="w-5 h-5 text-foreground/40" />
                    </div>
                    <div>
                      <p class="font-semibold text-sm">{{ testimonial.customer_name }}</p>
                      <p v-if="getTitle(testimonial)" class="text-sm text-foreground/60">
                        {{ getTitle(testimonial) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop/Tablet Grid -->
          <div class="hidden md:block overflow-hidden" :key="`desktop-grid-${currentBreakpoint}`">
            <div 
              class="flex transition-transform duration-500 ease-out"
              :style="{ transform: `translateX(-${currentSlideIndex * 100}%)` }"
            >
              <div
                v-for="(slide, slideIdx) in slides"
                :key="`slide-${slideIdx}`"
                class="w-full flex-shrink-0"
              >
                <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 px-4">
                  <div
                    v-for="testimonial in slide"
                    :key="testimonial.id"
                    class="border border-foreground/10 rounded-xl p-6 lg:p-8 bg-contrast1 text-primary hover:border-foreground/20 transition-colors duration-300"
                  >
                    <!-- Rating -->
                    <div class="flex space-x-0.5 mb-4 lg:mb-6">
                      <Icon
                        v-for="i in 5"
                        :key="i"
                        name="ph:star-fill"
                        class="w-4 h-4"
                        :class="i <= testimonial.rating ? 'text-foreground' : 'text-foreground/20'"
                      />
                    </div>

                    <!-- Content -->
                    <p class="text-sm leading-relaxed mb-6 lg:mb-8">
                      "{{ getContent(testimonial) }}"
                    </p>

                    <!-- Author -->
                    <div class="flex items-center space-x-3 pt-4 lg:pt-6 border-t border-foreground/10">
                      <div v-if="testimonial.image_url" class="w-10 h-10 rounded-full overflow-hidden bg-foreground/5 flex-shrink-0">
                        <NuxtImg :src="testimonial.image_url" :alt="testimonial.customer_name" class="w-full h-full object-cover" />
                      </div>
                      <div v-else class="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0">
                        <Icon name="ph:user" class="w-5 h-5 text-foreground/40" />
                      </div>
                      <div class="min-w-0">
                        <p class="font-semibold text-sm truncate">{{ testimonial.customer_name }}</p>
                        <p v-if="getTitle(testimonial)" class="text-sm text-foreground/60 truncate">
                          {{ getTitle(testimonial) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div v-if="(displayedTestimonials.length > 1 && !isDesktop) || (slides.length > 1 && isDesktop)" class="flex items-center justify-center mt-8 md:mt-12 space-x-4">
            <button
              @click="isDesktop ? previousSlide() : previousMobileSlide()"
              :disabled="isDesktop ? currentSlideIndex === 0 : currentMobileIndex === 0"
              class="w-10 h-10 rounded-full border border-foreground/20 hover:border-foreground/40 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Icon name="ph:caret-left" class="w-5 h-5" />
            </button>

            <div class="flex space-x-2">
              <button
                v-for="(_, index) in (isDesktop ? slides : displayedTestimonials)"
                :key="`dot-${index}`"
                @click="isDesktop ? goToSlide(index) : goToMobileSlide(index)"
                class="transition-all duration-300"
                :class="
                  (isDesktop ? currentSlideIndex : currentMobileIndex) === index
                    ? 'w-6 h-1.5 bg-foreground rounded-full'
                    : 'w-1.5 h-1.5 bg-foreground/20 rounded-full hover:bg-foreground/40'
                "
              ></button>
            </div>

            <button
              @click="isDesktop ? nextSlide() : nextMobileSlide()"
              :disabled="isDesktop ? currentSlideIndex === slides.length - 1 : currentMobileIndex === displayedTestimonials.length - 1"
              class="w-10 h-10 rounded-full border border-foreground/20 hover:border-foreground/40 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Icon name="ph:caret-right" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const supabase = useSupabaseClient();
const { locale } = useI18n();
const { fetchSection } = useContentSections();

// Reactive locale
const currentLocale = computed(() => locale.value);

// Default content
const defaultContent = {
  title: "Ce Que Disent Nos Clients",
  subtitle: "Découvrez les expériences de nos clients satisfaits"
};

// State
const loading = ref(true);
const error = ref(null);
const testimonials = ref([]);
const sectionData = ref({
  is_active: true,
  content_translations: {
    fr: { ...defaultContent },
    ar: { ...defaultContent },
    en: { ...defaultContent }
  }
});
const currentSlideIndex = ref(0);
const currentMobileIndex = ref(0);
const isDesktop = ref(true);
const currentBreakpoint = ref(null);
let resizeTimeout = null;

// Get current language content
const currentContent = computed(() => {
  return sectionData.value.content_translations?.[currentLocale.value] || defaultContent;
});

// Translation helpers for testimonials
const getTranslation = (translations) => {
  if (!translations || typeof translations !== 'object') return '';
  return translations[currentLocale.value] || translations.fr || translations.en || translations.ar || '';
};

const getContent = (testimonial) => {
  return getTranslation(testimonial.content_translations);
};

const getTitle = (testimonial) => {
  return getTranslation(testimonial.customer_title_translations);
};

// Filtered and sorted testimonials
const displayedTestimonials = computed(() => {
  const activeTestimonials = testimonials.value.filter((t) => t.is_active);

  const sortedTestimonials = [...activeTestimonials].sort((a, b) => {
    if (a.display_order !== null && b.display_order !== null) {
      return a.display_order - b.display_order;
    }
    if (a.display_order !== null) return -1;
    if (b.display_order !== null) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return sortedTestimonials;
});

// Responsive testimonials per slide
const testimonialsPerSlide = computed(() => {
  if (!process.client) return 5;
  
  const width = window.innerWidth;
  if (width >= 1280) return 5; // xl: 5 columns
  if (width >= 1024) return 3; // lg: 3 columns
  return 2; // md: 2 columns
});

const slides = computed(() => {
  const perSlide = testimonialsPerSlide.value;
  const result = [];
  for (let i = 0; i < displayedTestimonials.value.length; i += perSlide) {
    result.push(displayedTestimonials.value.slice(i, i + perSlide));
  }
  return result;
});

// Navigation functions
const nextSlide = () => {
  if (currentSlideIndex.value < slides.value.length - 1) {
    currentSlideIndex.value++;
  }
};

const previousSlide = () => {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--;
  }
};

const goToSlide = (index) => {
  currentSlideIndex.value = index;
};

const nextMobileSlide = () => {
  if (currentMobileIndex.value < displayedTestimonials.value.length - 1) {
    currentMobileIndex.value++;
  }
};

const previousMobileSlide = () => {
  if (currentMobileIndex.value > 0) {
    currentMobileIndex.value--;
  }
};

const goToMobileSlide = (index) => {
  currentMobileIndex.value = index;
};

const updateIsDesktop = () => {
  if (process.client) {
    const width = window.innerWidth;
    const previousBreakpoint = currentBreakpoint.value;
    
    isDesktop.value = width >= 768;
    
    let newBreakpoint;
    if (width >= 1280) {
      newBreakpoint = 'xl';
    } else if (width >= 1024) {
      newBreakpoint = 'lg';
    } else if (width >= 768) {
      newBreakpoint = 'md';
    } else {
      newBreakpoint = 'sm';
    }
    
    if (previousBreakpoint !== newBreakpoint && currentBreakpoint.value !== null) {
      currentSlideIndex.value = 0;
    }
    
    currentBreakpoint.value = newBreakpoint;
    
    nextTick(() => {
      if (currentSlideIndex.value >= slides.value.length && slides.value.length > 0) {
        currentSlideIndex.value = slides.value.length - 1;
      }
    });
  }
};

// Fetch section data
const loadSectionData = async () => {
  try {
    const { data, error: err } = await fetchSection('testimonials');
    
    if (err) throw err;
    
    if (data) {
      sectionData.value = data;
    }
  } catch (err) {
    console.error('Error loading testimonials section:', err);
  }
};

// Fetch testimonials
const fetchTestimonials = async () => {
  try {
    const { data, error: err } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (err) throw err;
    testimonials.value = data || [];
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Watch slides
watch(slides, (newSlides) => {
  if (newSlides.length > 0 && currentSlideIndex.value >= newSlides.length) {
    currentSlideIndex.value = newSlides.length - 1;
  }
}, { immediate: true });

// Debounced resize handler
const handleResize = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(() => {
    updateIsDesktop();
  }, 150);
};

onMounted(async () => {
  updateIsDesktop();
  if (process.client) {
    window.addEventListener('resize', handleResize);
  }
  await loadSectionData();
  await fetchTestimonials();
});

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('resize', handleResize);
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
  }
});
</script>

<style scoped>
/* Clean design */
</style>