<template>
  <div>
    <!-- App Loader - Without text for cleaner look -->
    <AppLoader :show="appLoading" />
    
    <!-- Main App -->
    <Transition name="fade" mode="out-in">
      <NuxtLayout v-if="!appLoading">
        <NuxtPage />
      </NuxtLayout>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { siteSettings, loading, fetchSettings } = useSiteSettings()
const { locale } = useI18n()
const appLoading = ref(true)

// Initialize app with performance optimization
onMounted(async () => {
  // Load settings immediately without artificial delay
  try {
    await fetchSettings()
  } catch (error) {
    console.error('Error loading settings:', error)
  } finally {
    // Remove loading screen after settings are loaded or failed
    appLoading.value = false
  }
})

// Optimized color application with debounce
const applyColors = () => {
  if (process.client && siteSettings.value.primaryColor) {
    const root = document.documentElement.style
    root.setProperty("--primary-color", siteSettings.value.primaryColor)
    root.setProperty("--primary-contrast-color", siteSettings.value.primaryContrastColor)
    root.setProperty("--secondary-color", siteSettings.value.secondaryColor)
    root.setProperty("--secondary-contrast-color", siteSettings.value.secondaryContrastColor)
    root.setProperty("--body-bg", siteSettings.value.bodyBg)
    root.setProperty("--text-color", siteSettings.value.textColor)
  }
}

watchEffect(() => applyColors())

// Handle RTL/LTR direction based on locale
watchEffect(() => {
  if (process.client) {
    const isRtl = locale.value === 'ar'
    const html = document.documentElement
    html.setAttribute('dir', isRtl ? 'rtl' : 'ltr')
    html.setAttribute('lang', locale.value)
  }
})

useHead(() => ({
  title: siteSettings.value.siteName || "Xone Algeria",
  meta: [
    { name: "description", content: siteSettings.value.siteDescription || "" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: siteSettings.value.primaryColor || "#3B82F6" },
  ],
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: siteSettings.value.siteFavicon || "/favicon.ico",
    },
    {
      rel: "preconnect",
      href: process.env.SUPABASE_URL || "",
      crossorigin: "anonymous"
    },
    {
      rel: "dns-prefetch",
      href: process.env.SUPABASE_URL || ""
    },
    // Preload critical fonts
    {
      rel: "preload",
      as: "style",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      onload: "this.onload=null;this.rel='stylesheet'"
    }
  ],
  htmlAttrs: {
    dir: locale.value === 'ar' ? 'rtl' : 'ltr',
    lang: locale.value
  }
}))
</script>

<style>
/* Fade Transition - Optimized */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Page Transitions - Optimized */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Apply colors from settings */
:root {
  --primary-color: 59, 130, 246;
  --primary-contrast-color: 255, 255, 255;
  --body-bg: 255, 255, 255;
  --text-color: 17, 24, 39;
  --secondary-color: 59, 130, 246;
  --secondary-contrast-color: 255, 255, 255;
}

body {
  background-color: rgb(var(--body-bg));
  color: rgb(var(--text-color));
  transition: background-color 0.3s ease, color 0.3s ease;
  /* Performance optimization */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* RTL Support */
html[dir="rtl"] {
  direction: rtl;
}

html[dir="ltr"] {
  direction: ltr;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Reduce motion for accessibility and performance */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Custom scrollbar - Optimized */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: rgb(var(--body-bg));
}

::-webkit-scrollbar-thumb {
  background: rgb(var(--primary-color) / 0.3);
  border-radius: 5px;
  will-change: background;
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(var(--primary-color) / 0.5);
}

/* Performance optimization for animations */
.will-change {
  will-change: transform, opacity;
}

/* Contain paint for better performance */
.contain-paint {
  contain: paint;
}
</style>