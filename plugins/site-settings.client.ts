export default defineNuxtPlugin(async () => {
  const { fetchSettings } = useSiteSettings()
  
  // Load site settings on app initialization (client-side only)
  await fetchSettings()
})