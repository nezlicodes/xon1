<template>
  <div
    v-if="section.is_active && section.content_translations[currentLocale]?.text"
    class="bg-primary text-contrast1 text-center py-3  font-medium relative overflow-hidden group"
    aria-live="polite"
  >
    <!-- Animated gradient overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"
    ></div>

    <!-- Scrolling Banner text -->
    <div class="relative z-10">
      <div class="marquee" :class="isRtl ? 'rtl' : 'ltr'">
        <div class="marquee__inner" :style="{ '--marquee-duration': duration + 's' }">
          <div class="marquee__track">
            <span v-for="(it, idx) in trackItems" :key="'a-' + idx" class="marquee__item">{{ it }}</span>
          </div>
          <div class="marquee__track" aria-hidden="true">
            <span v-for="(it, idx) in trackItems" :key="'b-' + idx" class="marquee__item">{{ it }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const { locale } = useI18n()

const SECTION_KEY = 'top_banner'

// Current locale
const currentLocale = computed(() => locale.value || 'fr')

// RTL helper
const isRtl = computed(() => currentLocale.value === 'ar')

// Animation duration (seconds)
const duration = ref(18)

// Section data
const section = ref({
  is_active: false,
  content_translations: {
    fr: { text: '' },
    ar: { text: '' },
    en: { text: '' }
  }
})

// Derived items/text: prefer array of items; fallback to single text
const bannerItems = computed(() => {
  const t = section.value.content_translations[currentLocale.value] || {}
  const items = Array.isArray(t.items) ? t.items : []
  const cleaned = items.map((s) => (s || '').trim()).filter((s) => s.length)
  if (cleaned.length) return cleaned
  return t.text ? [t.text] : []
})

// Items used per track – ensure at least 2 to allow space-between to fill width
const trackItems = computed(() => {
  const base = bannerItems.value
  if (base.length >= 2) return base
  if (base.length === 1) return [base[0], base[0]]
  return []
})

// Load section
const loadSection = async () => {
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .select('is_active, content_translations')
      .eq('section_key', SECTION_KEY)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (data) {
      section.value = {
        is_active: data.is_active ?? false,
        content_translations: data.content_translations || {
          fr: { text: '' },
          ar: { text: '' },
          en: { text: '' }
        }
      }
    }
  } catch (error) {
    console.error('Error loading banner:', error)
  }
}

onMounted(async () => {
  await loadSection()
})
</script>

<style scoped>
/* Smooth animations */
.group:hover {
  @apply cursor-default;
}

/* Marquee styles */
.marquee {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.marquee__inner {
  display: flex;
  align-items: center;
  gap: 0; /* gaps handled inside track */
  width: max-content; /* shrink to content so translate percentages are consistent */
  padding-inline: 1rem;
  will-change: transform;
  animation-duration: var(--marquee-duration, 18s);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.marquee__track {
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between; /* fill full width with even spacing */
  align-items: center;
  gap: 0; /* spacing handled by space-between */
  padding-inline: var(--track-gap, 2.5rem); /* add spacing at track edges to avoid sticking */
  min-width: 100%; /* ensure each track spans at least container width */
}

/* Scroll direction */
.ltr .marquee__inner {
  animation-name: marquee-ltr;
}

.rtl .marquee__inner {
  animation-name: marquee-rtl;
}

.marquee__item {
  display: inline-block;
  flex: 0 0 auto;
}

@keyframes marquee-ltr {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}

@keyframes marquee-rtl {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(50%, 0, 0); }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .marquee__inner {
    animation: none !important;
  }
}
</style>
