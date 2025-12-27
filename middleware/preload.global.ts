/**
 * Global middleware to preload critical data
 * Disabled temporarily to avoid composable context issues
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Preloading is now handled in app.vue and individual pages
  // to avoid composable context issues with useI18n
})