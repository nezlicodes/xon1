export default defineNuxtPlugin(async (nuxtApp) => {
    // Only run on client side
    if (process.client) {
        const { settings, fetchSettings } = useSettings()

        // Fetch settings on app load
        await fetchSettings()

        // Watch for settings changes and update CSS variables
        watch(() => settings.value, (newSettings) => {
            if (newSettings) {
                document.documentElement.style.setProperty('--primary-color', newSettings.primary_color || 'ffffff')
                document.documentElement.style.setProperty('--secondary-color', newSettings.secondary_color)
                document.documentElement.style.setProperty('--primary-contrast-color', newSettings.primary_contrast_color || '000000')
                document.documentElement.style.setProperty('--secondary-contrast-color', newSettings.secondary_contrast_color)
            }
        }, { immediate: true })
    }
})