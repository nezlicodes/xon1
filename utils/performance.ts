/**
 * Performance utilities for optimizing load times
 */

/**
 * Debounce function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function calls
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Lazy load images
 */
export const lazyLoadImage = (img: HTMLImageElement) => {
  const src = img.dataset.src
  if (!src) return

  img.src = src
  img.removeAttribute('data-src')
}

/**
 * Observe elements for lazy loading
 */
/* export const observeLazyImages = () => {
  if (process.client && 'IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          lazyLoadImage(img)
          imageObserver.unobserve(img)
        }
      })
    })

    const images = document.querySelectorAll('img[data-src]')
    images.forEach((img) => imageObserver.observe(img))

    return imageObserver
  }
} */

/**
 * Preconnect to external domains
 */
export const preconnect = (url: string) => {
  if (process.client) {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = url
    document.head.appendChild(link)
  }
}

/**
 * Prefetch resource
 */
export const prefetch = (url: string) => {
  if (process.client) {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
  }
}

/**
 * Measure page load time
 */
export const measurePageLoad = () => {
  if (process.client && 'performance' in window) {
    const perfData = window.performance.timing
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
    return pageLoadTime
  }
  return 0
}