/**
 * Performance monitoring composable
 * Tracks Core Web Vitals and provides performance insights
 */
export const usePerformance = () => {
  const logPerformance = () => {
    if (process.client && 'performance' in window) {
      // Wait for page to be fully loaded
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = window.performance.timing
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
          const connectTime = perfData.responseEnd - perfData.requestStart
          const renderTime = perfData.domComplete - perfData.domLoading

          console.log('📊 Performance Metrics:', {
            'Page Load Time': `${pageLoadTime}ms`,
            'Server Response Time': `${connectTime}ms`,
            'Render Time': `${renderTime}ms`
          })

          // Log Core Web Vitals if available
          if ('PerformanceObserver' in window) {
            try {
              // Largest Contentful Paint (LCP)
              const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries()
                const lastEntry = entries[entries.length - 1]
                console.log('🎨 LCP:', `${lastEntry.renderTime || lastEntry.loadTime}ms`)
              })
              lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

              // First Input Delay (FID)
              const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries()
                entries.forEach((entry: any) => {
                  console.log('⚡ FID:', `${entry.processingStart - entry.startTime}ms`)
                })
              })
              fidObserver.observe({ entryTypes: ['first-input'] })

              // Cumulative Layout Shift (CLS)
              let clsValue = 0
              const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries() as any[]) {
                  if (!entry.hadRecentInput) {
                    clsValue += entry.value
                  }
                }
                console.log('📏 CLS:', clsValue.toFixed(3))
              })
              clsObserver.observe({ entryTypes: ['layout-shift'] })
            } catch (e) {
              // PerformanceObserver not fully supported
            }
          }
        }, 0)
      })
    }
  }

  const measureAsync = async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start
      console.log(`⏱️  ${name}: ${duration.toFixed(2)}ms`)
      return result
    } catch (error) {
      const duration = performance.now() - start
      console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error)
      throw error
    }
  }

  return {
    logPerformance,
    measureAsync
  }
}