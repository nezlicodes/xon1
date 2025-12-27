<template>
  <section
    v-if="isLoaded && isEnabled"
    class="relative py-24 bg-gradient-to-br from-backgroundColor via-backgroundColor to-backgroundColor/80 overflow-hidden"
  >
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        <!-- Left Column - Header Info -->
        <div class="lg:sticky lg:top-24 lg:self-start space-y-8" data-aos="fade-right">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
            <Icon name="ph:question-fill" class="w-4 h-4 text-primary" />
            <span class="text-sm font-semibold text-primary">{{ headerContent.badge_text }}</span>
          </div>

          <!-- Title -->
          <div>
            <h2
              class="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            >
              {{ headerContent.title }}
            </h2>
            <p class="text-xl text-foreground/70 leading-relaxed">
              {{ headerContent.subtitle }}
            </p>
          </div>

          <!-- Additional Info Card -->
          <div class="bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-sm rounded-2xl p-6 border border-foreground/10">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Icon name="ph:lightbulb-fill" class="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 class="font-bold text-foreground mb-2">{{ headerContent.help_card_title }}</h3>
                <p class="text-sm text-foreground/60 leading-relaxed">
                  {{ headerContent.help_card_description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - FAQ Accordion -->
        <div data-aos="fade-left">
          <!-- Loading State -->
          <div v-if="loading" class="space-y-4">
            <div v-for="i in 5" :key="i" class="animate-pulse">
              <div class="h-20 bg-background/30 rounded-2xl"></div>
            </div>
          </div>

          <!-- No results message -->
          <div
            v-else-if="filteredItems.length === 0"
            class="text-center py-20 bg-gradient-to-br from-background/30 to-background/10 rounded-3xl border border-foreground/10"
          >
            <div
              class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mb-6"
            >
              <Icon name="ph:question" class="w-10 h-10 text-primary" />
            </div>
            <h3 class="text-2xl font-bold text-foreground mb-3">
              {{ headerContent.no_questions_title }}
            </h3>
            <p class="text-foreground/60 text-lg">
              {{ headerContent.no_questions_description }}
            </p>
          </div>

          <!-- FAQ Accordion -->
          <div v-else class="space-y-4">
            <div
              v-for="(item, index) in filteredItems"
              :key="item.id"
              class="faq-item group"
              :data-aos="'fade-up'"
              :data-aos-delay="index * 50"
            >
              <details
                class="faq-accordion bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-foreground/10 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                :open="index === 0"
              >
                <summary
                  class="flex items-center justify-between cursor-pointer py-6 px-7 font-bold text-lg text-foreground select-none transition-all duration-300 hover:bg-background/30"
                >
                  <span class="flex items-start gap-4 flex-1 pr-4">
                    <span class="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mt-0.5">
                      <Icon name="ph:chat-circle-text-fill" class="w-4 h-4 text-primary" />
                    </span>
                    <span class="flex-1">{{ getQuestion(item) }}</span>
                  </span>
                  <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/10">
                    <Icon
                      name="ph:caret-down-bold"
                      class="w-5 h-5 text-foreground/60 transition-transform duration-300 group-open:rotate-180 group-hover:text-primary"
                    />
                  </div>
                </summary>

                <div class="px-7 pb-7">
                  <div class="pl-12">
                    <div class="h-px bg-gradient-to-r from-foreground/10 to-transparent mb-6"></div>
                    
                    <div
                      v-html="getAnswer(item)"
                      class="prose prose-base max-w-none text-foreground/70 leading-relaxed prose-p:mb-4 prose-strong:text-foreground prose-strong:font-semibold"
                    ></div>
                  </div>
                </div>
              </details>
            </div>
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

// State
const isLoaded = ref(false);
const loading = ref(true);
const error = ref(null);
const items = ref([]);
const isEnabled = ref(true);
const headerData = ref(null);

// Default header content (fallback)
const defaultHeaderContent = {
  badge_text: "FAQ",
  title: "Questions Fréquentes",
  subtitle: "Trouvez des réponses aux questions les plus courantes",
  help_card_title: "Besoin d'aide supplémentaire ?",
  help_card_description: "Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à nous contacter directement.",
  no_questions_title: "Aucune question disponible",
  no_questions_description: "Les questions fréquentes seront bientôt disponibles."
};

// Get header content based on current locale
const headerContent = computed(() => {
  if (!headerData.value?.content_translations) {
    return defaultHeaderContent;
  }
  return headerData.value.content_translations[currentLocale.value] || defaultHeaderContent;
});

// Translation helpers for FAQ items
const getTranslation = (translations) => {
  if (!translations || typeof translations !== 'object') return '';
  return translations[currentLocale.value] || translations.fr || translations.en || translations.ar || '';
};

const getQuestion = (item) => {
  return getTranslation(item.question_translations);
};

const getAnswer = (item) => {
  return getTranslation(item.answer_translations);
};

// Computed properties for filtering and organizing items
const filteredItems = computed(() => {
  let result = [...items.value];

  // Sort: active items only
  result = result.filter(item => item.is_active);

  // Sort by display_order
  result.sort((a, b) => {
    if (a.display_order !== null && b.display_order !== null) {
      return a.display_order - b.display_order;
    } else if (a.display_order !== null) {
      return -1;
    } else if (b.display_order !== null) {
      return 1;
    }
    return 0;
  });

  return result;
});

// Fetch FAQ data
const fetchFaqData = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Fetch FAQ header configuration from content_sections
    const { data: headerConfigData, error: headerError } = await fetchSection('faq');
    
    if (headerError) {
      console.warn('Error fetching FAQ header:', headerError);
    } else {
      headerData.value = headerConfigData;
      isEnabled.value = headerConfigData?.is_active ?? true;
    }

    // If FAQ section is disabled, stop here
    if (!isEnabled.value) {
      isLoaded.value = true;
      loading.value = false;
      return;
    }

    // Fetch FAQ items
    const { data: itemsData, error: itemsError } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (itemsError) throw itemsError;

    items.value = itemsData || [];
    isLoaded.value = true;
  } catch (err) {
    console.error("Error fetching FAQ data:", err);
    error.value = err.message;
    items.value = [];
    isLoaded.value = true;
  } finally {
    loading.value = false;
  }
};


// Initialize component
onMounted(fetchFaqData);
</script>

<style scoped>
/* Remove default details styling */
details summary::-webkit-details-marker,
details summary::marker {
  display: none;
}

details summary {
  list-style: none;
}

/* Accordion animation */
.faq-accordion[open] {
  @apply shadow-xl shadow-primary/10;
}

.faq-accordion[open] summary {
  @apply bg-background/20;
}

/* Smooth content reveal with scale effect */
details[open] > summary ~ * {
  animation: expandContent 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes expandContent {
  from {
    opacity: 0;
    transform: translateY(-12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Hover effects */
.faq-item:hover .faq-accordion {
  @apply transform scale-[1.01];
}

/* Prose styling */
:deep(.prose p) {
  @apply mb-4 leading-relaxed;
}

:deep(.prose p:last-child) {
  @apply mb-0;
}

:deep(.prose strong) {
  @apply font-semibold;
  color: rgb(var(--color-foreground));
}

:deep(.prose a) {
  @apply transition-colors underline;
  color: rgb(var(--color-primary));
}

:deep(.prose a:hover) {
  opacity: 0.8;
}

:deep(.prose ul) {
  @apply my-4 space-y-2;
}

:deep(.prose li) {
  color: rgb(var(--color-foreground) / 0.7);
}

/* Smooth transitions */
* {
  @apply transition-colors duration-300;
}
</style>