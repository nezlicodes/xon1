export default defineNuxtPlugin(() => {
  if (process.client) {
    // Disable all Nuxt loading indicators
    const nuxtApp = useNuxtApp()
    
    // Override loading indicator
    nuxtApp.hook('page:start', () => {
      // Don't show default loader
    })
    
    nuxtApp.hook('page:finish', () => {
      // Don't show default loader
    })
    
    // Remove any existing loading bars from DOM
    const removeLoadingBars = () => {
      const loadingBars = document.querySelectorAll('[class*="nuxt-loading"], [class*="nuxt-progress"]')
      loadingBars.forEach(el => el.remove())
    }
    
    // Run on mount
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', removeLoadingBars)
    } else {
      removeLoadingBars()
    }
    
    // Also watch for any new loading bars being added
    const observer = new MutationObserver(removeLoadingBars)
    observer.observe(document.body, { childList: true, subtree: true })
  }
})
