<template>
  <section v-if="heroData.is_active" class="relative min-h-screen w-full overflow-hidden flex items-center">
    <!-- Background Image with Parallax Effect -->
    <div class="absolute inset-0 w-full h-full">
      <div
        v-if="currentContent.background_image"
        ref="parallaxBg"
        class="absolute inset-0 w-full h-[120%] bg-cover bg-center will-change-transform"
        :style="{
          backgroundImage: `url(${currentContent.background_image})`,
          transform: `translateY(${parallaxOffset}px) scale(${imageScale})`,
          transition: 'transform 0.1s linear',
        }"
      ></div>
      <div
        v-else
        ref="parallaxBg"
        class="absolute inset-0 w-full h-[120%] bg-gradient-to-br from-gray-900 via-gray-800 to-black bg-cover bg-center will-change-transform"
        :style="{
          transform: `translateY(${parallaxOffset}px) scale(${imageScale})`,
          transition: 'transform 0.1s linear',
        }"
      ></div>

      <!-- Dark overlay for better text readability -->
      <div class="absolute inset-0 bg-black/50"></div>
    </div>

    <!-- Content -->
    <div class="relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
      <div 
        class="flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out transform"
        :class="contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        <!-- Title -->
        <h1
          class="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-1000 ease-out transform"
          :class="contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
          v-text="currentContent.title || defaultHeroData.title"
        ></h1>

        <!-- Subtitle -->
        <p
          class="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl leading-relaxed transition-all duration-1000 ease-out transform delay-200"
          :class="contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
          v-html="currentContent.subtitle || defaultHeroData.subtitle"
        ></p>

        <!-- CTA Button -->
        <div
          class="transition-all duration-1000 ease-out transform delay-400"
          :class="contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        >
          <NuxtLink
            to="/products"
            class="inline-flex items-center px-10 py-4 text-lg font-semibold text-white bg-primary rounded-full hover:bg-primary/90 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 active:scale-95 relative overflow-hidden group"
            @mouseenter="buttonHovered = true"
            @mouseleave="buttonHovered = false"
            @mousedown="createRipple"
          >
            <span class="relative z-10">
              {{ currentContent.button_text || defaultHeroData.button_text }}
            </span>

            <!-- Button shine effect -->
            <span
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
            ></span>

            <!-- Ripple effect -->
            <span
              v-if="showRipple"
              class="absolute rounded-full bg-white/30 pointer-events-none"
              :style="{
                left: `${rippleX}px`,
                top: `${rippleY}px`,
                width: `${rippleSize}px`,
                height: `${rippleSize}px`,
                transform: 'translate(-50%, -50%) scale(0)',
                animation: 'ripple-effect 800ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
              }"
              @animationend="showRipple = false"
            ></span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Scroll indicator (optional) -->
    <div
      v-if="!scrolled"
      class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
    >
      <div class="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
        <div class="w-1 h-3 bg-white/50 rounded-full animate-scroll"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { fetchSection } = useContentSections()
const supabase = useSupabaseClient()

// Get current locale safely
const getCurrentLocale = () => {
  try {
    const { locale } = useI18n()
    return locale.value
  } catch {
    return 'fr' // Fallback
  }
}

// Default hero data
const defaultHeroData = {
  title: "Bienvenue dans notre magasin",
  subtitle: "Découvrez des produits incroyables à des prix avantageux",
  button_text: "Voir les produits",
  background_image: "",
}

// State
const contentReady = ref(false)
const parallaxOffset = ref(0)
const parallaxBg = ref(null)
const scrolled = ref(false)
const imageScale = ref(1.1)
const buttonHovered = ref(false)
const showRipple = ref(false)
const rippleX = ref(0)
const rippleY = ref(0)
const rippleSize = ref(0)
let ticking = false

const heroData = ref({
  is_active: true,
  content_translations: {
    en: { ...defaultHeroData },
    fr: { ...defaultHeroData },
    ar: { ...defaultHeroData }
  }
})

// Get current language content
const currentContent = computed(() => {
  const locale = getCurrentLocale()
  return heroData.value.content_translations?.[locale] || defaultHeroData
})

// Load hero section data
const loadHeroData = async () => {
  try {
    const { data, error } = await fetchSection('hero')
    
    if (error) throw error
    
    if (data) {
      heroData.value = data
    } else {
      // Try to get directly if fetchSection fails
      const { data: directData } = await supabase
        .from('content_sections')
        .select('*')
        .eq('section_key', 'hero')
        .single()
      
      if (directData) {
        heroData.value = directData
      }
    }
  } catch (error) {
    console.error('Error loading hero data:', error)
    // Use defaults if loading fails
  }
}

// Handle parallax scrolling effect
const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      if (!parallaxBg.value) {
        ticking = false
        return
      }

      parallaxOffset.value = window.scrollY / 4

      const scrollPercent = Math.min(window.scrollY / window.innerHeight, 1)
      const easedProgress = 1 - Math.pow(1 - scrollPercent, 3)
      imageScale.value = 1.1 - easedProgress * 0.05

      scrolled.value = window.scrollY > 100

      ticking = false
    })

    ticking = true
  }
}

// Create ripple effect on button
const createRipple = (event) => {
  const button = event.currentTarget
  const rect = button.getBoundingClientRect()

  rippleX.value = event.clientX - rect.left
  rippleY.value = event.clientY - rect.top

  const buttonSize = Math.max(rect.width, rect.height)
  rippleSize.value = buttonSize * 2.5

  showRipple.value = true
}

onMounted(async () => {
  await loadHeroData()

  window.addEventListener("scroll", handleScroll, { passive: true })

  setTimeout(() => {
    contentReady.value = true
  }, 100)
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<style scoped>
@keyframes ripple-effect {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

@keyframes scroll {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(12px);
    opacity: 0;
  }
}

.animate-scroll {
  animation: scroll 2s ease-in-out infinite;
}

.delay-200 {
  transition-delay: 200ms;
}

.delay-400 {
  transition-delay: 400ms;
}

.will-change-transform {
  will-change: transform;
}
</style>
