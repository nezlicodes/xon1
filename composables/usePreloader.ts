/**
 * Composable for preloading critical data
 */
export const usePreloader = () => {
  const preloaded = useState<Set<string>>('preloadedData', () => new Set())

  /**
   * Preload site settings
   */
  const preloadSettings = async () => {
    if (preloaded.value.has('settings')) return
    
    const { fetchSettings } = useSiteSettings()
    await fetchSettings()
    preloaded.value.add('settings')
  }

  /**
   * Preload featured categories
   */
  const preloadFeaturedCategories = async () => {
    if (preloaded.value.has('featuredCategories')) return
    
    const { fetchCategories } = useCategories()
    await fetchCategories({ featured: true })
    preloaded.value.add('featuredCategories')
  }

  /**
   * Preload featured products
   */
  const preloadFeaturedProducts = async () => {
    if (preloaded.value.has('featuredProducts')) return
    
    const { fetchProducts } = useProducts()
    await fetchProducts({ featured: true, limit: 8 })
    preloaded.value.add('featuredProducts')
  }

  /**
   * Preload homepage data
   */
  const preloadHomepage = async () => {
    await Promise.all([
      preloadSettings(),
      preloadFeaturedCategories(),
      preloadFeaturedProducts()
    ])
  }

  /**
   * Check if data is preloaded
   */
  const isPreloaded = (key: string) => {
    return preloaded.value.has(key)
  }

  return {
    preloadSettings,
    preloadFeaturedCategories,
    preloadFeaturedProducts,
    preloadHomepage,
    isPreloaded
  }
}