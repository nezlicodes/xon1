/**
 * Composable for optimized image loading
 * Provides utilities for lazy loading and responsive images
 */
export const useOptimizedImage = () => {
  const getImageProps = (src: string, alt: string, preset?: 'avatar' | 'thumbnail' | 'hero') => {
    const props: any = {
      src,
      alt,
      loading: 'lazy',
      decoding: 'async',
      format: 'webp'
    }

    // Add preset if provided
    if (preset) {
      props.preset = preset
    }

    return props
  }

  const getResponsiveProps = (src: string, alt: string, sizes?: string) => {
    return {
      ...getImageProps(src, alt),
      sizes: sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
      densities: [1, 2]
    }
  }

  const preloadImage = (src: string) => {
    if (process.client) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    }
  }

  return {
    getImageProps,
    getResponsiveProps,
    preloadImage
  }
}