/**
 * Font loading optimization plugin
 * Uses font-display: swap for better performance
 */
export default defineNuxtPlugin(() => {
  if (process.client) {
    // Preload critical fonts
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    
    // Add font-display: swap for all fonts
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
    `
    document.head.appendChild(style)
  }
})
