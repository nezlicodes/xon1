<template>
  <div v-if="heroData.is_active" class="relative w-full overflow-hidden">
    <!-- Hero Section -->
    <section
      class="relative min-h-screen lg:min-h-[110vh] flex items-center bg-gray-50 overflow-hidden"
    >
      <!-- Background Media Container with Parallax -->
      <div
        class="absolute inset-0 w-full h-full parallax-bg"
        ref="parallaxElement"
      >
        <!-- Video Background (Priority) -->
        <div
          v-if="currentContent.background_video"
          class="absolute inset-0 w-full h-full"
        >
          <video
            ref="videoElement"
            :key="currentContent.background_video"
            :src="currentContent.background_video"
            autoplay
            loop
            muted
            playsinline
            preload="auto"
            class="w-full h-[120%] object-cover transform transition-transform duration-100 ease-out"
            @loadeddata="onVideoLoaded"
            @error="onVideoError"
          />
          <div
            class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"
          ></div>
        </div>

        <!-- Image Background (Fallback) -->
        <div
          v-else-if="currentContent.background_image || videoError"
          class="absolute inset-0 w-full h-full"
        >
          <img
            :src="
              currentContent.background_image ||
              defaultHeroData.background_image
            "
            alt="Hero background"
            class="w-full h-[120%] object-cover transform transition-transform duration-100 ease-out"
            ref="imageElement"
          />
          <div
            class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"
          ></div>
        </div>

        <!-- Default Gradient Background -->
        <div
          v-else
          class="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        ></div>
      </div>

      <!-- Content Container -->
      <div class="relative w-full">
        <div
          class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
        >
          <!-- Loading state -->
          <div v-if="loading" class="max-w-3xl mx-auto text-center space-y-4">
            <div
              class="h-12 sm:h-14 bg-white/20 rounded-lg w-3/4 mx-auto animate-pulse"
            ></div>
            <div
              class="h-4 sm:h-6 bg-white/20 rounded-lg w-2/3 mx-auto animate-pulse"
            ></div>
            <div
              class="h-10 sm:h-12 bg-white/20 rounded-lg w-40 mx-auto animate-pulse"
            ></div>
          </div>

          <!-- Hero Content -->
          <div
            v-else
            class="max-w-4xl mx-auto text-center"
            ref="contentElement"
          >
            <!-- Title -->
            <h1
              class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4 leading-tight"
            >
              {{ currentContent.title || defaultHeroData.title }}
            </h1>

            <!-- Subtitle -->
            <p
              v-html="currentContent.subtitle || defaultHeroData.subtitle"
              class="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-8 leading-relaxed max-w-2xl mx-auto"
            ></p>

            <!-- CTA Button -->
            <div class="flex justify-center mb-8">
              <NuxtLink
                to="/products"
                class="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white bg-primary rounded-full hover:bg-primary/90 transition-all duration-300 shadow-xl"
              >
                {{ currentContent.button_text || defaultHeroData.button_text }}
                <Icon
                  name="ph:arrow-right-bold"
                  class="ml-2 w-4 h-4 sm:w-5 sm:h-5"
                />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section
      v-if="featuresData.is_active"
      class="relative -mt-8 sm:-mt-12 z-10"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <!-- Loading State -->
          <div
            v-if="featuresLoading"
            class="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100"
          >
            <div v-for="n in 4" :key="n" class="bg-white p-4 sm:p-6 lg:p-8">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 animate-pulse mx-auto mb-3"
              ></div>
              <div
                class="h-4 bg-gray-200 rounded w-16 mx-auto mb-2 animate-pulse"
              ></div>
              <div
                class="h-3 bg-gray-200 rounded w-20 mx-auto animate-pulse"
              ></div>
            </div>
          </div>

          <!-- Features Grid -->
          <div
            v-else
            class="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100"
          >
            <div
              v-for="(feature, index) in currentFeatures"
              :key="index"
              class="bg-white p-4 sm:p-6 lg:p-8 text-center hover:bg-gray-50 transition-colors group"
            >
              <!-- Icon -->
              <div
                class="mb-3 sm:mb-4 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 text-primary mx-auto group-hover:bg-primary group-hover:text-white transition-all duration-300"
              >
                <Icon :name="feature.icon" class="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <!-- Content -->
              <h3
                class="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1"
              >
                {{ feature.title }}
              </h3>
              <p class="text-xs sm:text-sm text-gray-600">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { fetchSection } = useContentSections();
const supabase = useSupabaseClient();
const { locale } = useI18n();

const getCurrentLocale = () => {
  try {
    return locale.value;
  } catch {
    return "fr";
  }
};

const currentLocale = computed(() => getCurrentLocale());

const defaultHeroData = {
  title: "Bienvenue dans notre magasin",
  subtitle: "Découvrez des produits incroyables à des prix avantageux",
  button_text: "Voir les produits",
  background_image: "",
  background_video: "",
};

const defaultFeatures = [
  {
    icon: "ph:users-three-fill",
    title: "100M+",
    description: "produits vendus",
  },
  {
    icon: "ph:globe-hemisphere-west-fill",
    title: "60+ pays",
    description: "couverts",
  },
  {
    icon: "ph:package-fill",
    title: "Livraison DZ",
    description: "rapide & sécurisée",
  },
  {
    icon: "ph:headset-fill",
    title: "Support 24/7",
    description: "toujours disponible",
  },
];

const loading = ref(true);
const featuresLoading = ref(true);
const videoError = ref(false);
const videoElement = ref(null);
const imageElement = ref(null);
const contentElement = ref(null);
const parallaxElement = ref(null);
const scrollY = ref(0);

const heroData = ref({
  is_active: true,
  content_translations: {
    en: { ...defaultHeroData },
    fr: { ...defaultHeroData },
    ar: { ...defaultHeroData },
  },
});

const featuresData = ref({
  is_active: true,
  content_translations: {
    fr: { features: defaultFeatures },
    ar: { features: defaultFeatures },
    en: { features: defaultFeatures },
  },
});

const currentContent = computed(() => {
  const content = heroData.value.content_translations?.[currentLocale.value];
  return content || defaultHeroData;
});

const currentFeatures = computed(() => {
  const content =
    featuresData.value.content_translations?.[currentLocale.value];
  return content?.features || defaultFeatures;
});

// Video event handlers
const onVideoLoaded = () => {
  console.log("Video loaded successfully");
  videoError.value = false;

  // Ensure video plays (browser autoplay restrictions workaround)
  if (videoElement.value) {
    videoElement.value.play().catch((err) => {
      console.warn("Video autoplay failed:", err);
      // Try again with user interaction
      document.addEventListener(
        "click",
        () => {
          if (videoElement.value) {
            videoElement.value
              .play()
              .catch((e) => console.error("Video play failed:", e));
          }
        },
        { once: true }
      );
    });
  }
};

const onVideoError = (event) => {
  console.error("Video failed to load:", event);
  console.error("Video source:", currentContent.value.background_video);
  videoError.value = true;
};

const loadHeroData = async () => {
  loading.value = true;
  try {
    const { data, error } = await fetchSection("hero");
    if (error) throw error;
    if (data) {
      heroData.value = data;
      console.log("Hero data loaded:", data);
      console.log("Current locale:", currentLocale.value);
      console.log("Current content:", currentContent.value);
    } else {
      const { data: directData } = await supabase
        .from("content_sections")
        .select("*")
        .eq("section_key", "hero")
        .single();
      if (directData) {
        heroData.value = directData;
        console.log("Hero data loaded (direct):", directData);
      }
    }
  } catch (error) {
    console.error("Error loading hero data:", error);
  } finally {
    loading.value = false;
  }
};

const loadFeaturesData = async () => {
  featuresLoading.value = true;
  try {
    const { data, error } = await fetchSection("features");
    if (error) throw error;
    if (data) {
      featuresData.value = data;
    }
  } catch (error) {
    console.error("Error loading features section:", error);
  } finally {
    featuresLoading.value = false;
  }
};

// Parallax scroll handler
const handleScroll = () => {
  if (!process.client) return;

  scrollY.value = window.pageYOffset;

  const scrolled = scrollY.value;
  const parallaxSpeed = 0.5;
  const contentSpeed = 0.2;

  // Apply parallax to background
  if (imageElement.value) {
    imageElement.value.style.transform = `translateY(${
      scrolled * parallaxSpeed
    }px) scale(1.1)`;
  }
  if (videoElement.value) {
    videoElement.value.style.transform = `translateY(${
      scrolled * parallaxSpeed
    }px) scale(1.05)`;
  }

  // Apply subtle parallax to content
  if (contentElement.value) {
    contentElement.value.style.transform = `translateY(${
      scrolled * contentSpeed
    }px)`;
  }
};

onMounted(async () => {
  await Promise.all([loadHeroData(), loadFeaturesData()]);

  if (process.client) {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener("scroll", handleScroll);
  }
});

// Watch for video URL changes and reset error state
watch(
  () => currentContent.value.background_video,
  (newVideo) => {
    if (newVideo) {
      console.log("Video URL changed:", newVideo);
      videoError.value = false;
    }
  }
);
</script>

<style scoped>
/* Ensure video renders properly */
video {
  pointer-events: none;
}

/* Parallax container */
.parallax-bg {
  will-change: transform;
}

/* Performance optimizations */
.parallax-bg * {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

/* Smooth transitions for parallax */
.transform {
  transition: transform 0.1s ease-out;
}

/* Enhanced gradients */
.bg-gradient-to-br {
  background: linear-gradient(
    to bottom right,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

/* Mobile optimizations - disable parallax on mobile */
@media (max-width: 768px) {
  .parallax-bg {
    transform: none !important;
  }

  .parallax-bg * {
    transform: none !important;
  }
}

/* Enhanced animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 1.2s ease-out;
}

/* Button hover effects */
.hover\:bg-primary\/90:hover {
  background-color: rgba(var(--color-primary) / 0.9);
  transform: translateY(-2px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
