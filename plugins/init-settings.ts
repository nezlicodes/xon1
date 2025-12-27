export default defineNuxtPlugin(async (nuxtApp) => {
    const { fetchSettings, siteSettings } = useSiteSettings()
    
    // Fetch settings on app initialization
    await fetchSettings()
    
    // Make settings available globally via provide/inject
    nuxtApp.provide('siteSettings', siteSettings)
    
    // Optional: Access settings in your app.vue via useNuxtApp().$siteSettings
  })