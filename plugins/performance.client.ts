/**
 * Client-side performance monitoring plugin
 */
export default defineNuxtPlugin(() => {
  const { logPerformance } = usePerformance()
  
  // Only log in development
  if (process.dev) {
    logPerformance()
  }
})