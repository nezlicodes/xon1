/**
 * Optimized composable for fetching homepage data in parallel
 * This reduces initial load time by fetching all data simultaneously
 */
export const useHomepageData = () => {
  const supabase = useSupabaseClient()
  
  // Shared state for homepage data
  const featuredCategories = useState('homepage_featured_categories', () => [])
  const featuredProducts = useState('homepage_featured_products', () => [])
  const featureConfig = useState('homepage_feature_config', () => ({
    categoriesEnabled: true,
    testimonialsEnabled: true,
    faqEnabled: true
  }))
  
  const loading = useState('homepage_loading', () => false)
  const loaded = useState('homepage_loaded', () => false)

  /**
   * Fetch all homepage data in parallel
   */
  const fetchHomepageData = async () => {
    // Don't fetch if already loaded
    if (loaded.value) return
    
    loading.value = true
    
    try {
      // Fetch everything in parallel for maximum speed
      const [categoriesResult, productsResult, configResult] = await Promise.allSettled([
        // Featured categories
        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .eq('is_featured', true)
          .order('name_translations->fr', { ascending: true })
          .limit(6),
        
        // Featured products
        supabase
          .from('products')
          .select('*, categories(id, name_translations, slug)')
          .eq('is_active', true)
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(8),
        
        // Feature config
        supabase
          .from('features_config')
          .select('*')
          .single()
      ])

      // Process results
      if (categoriesResult.status === 'fulfilled' && categoriesResult.value.data) {
        featuredCategories.value = categoriesResult.value.data
      }

      if (productsResult.status === 'fulfilled' && productsResult.value.data) {
        featuredProducts.value = productsResult.value.data
      }

      if (configResult.status === 'fulfilled' && configResult.value.data) {
        const data = configResult.value.data
        featureConfig.value = {
          categoriesEnabled: data.categories_enabled ?? true,
          testimonialsEnabled: data.testimonials_enabled ?? true,
          faqEnabled: data.faq_enabled ?? true
        }
      }

      loaded.value = true
    } catch (error) {
      console.error('Error fetching homepage data:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * Reset homepage data (useful for refetching)
   */
  const resetHomepageData = () => {
    loaded.value = false
    featuredCategories.value = []
    featuredProducts.value = []
    featureConfig.value = {
      categoriesEnabled: true,
      testimonialsEnabled: true,
      faqEnabled: true
    }
  }

  return {
    featuredCategories,
    featuredProducts,
    featureConfig,
    loading,
    loaded,
    fetchHomepageData,
    resetHomepageData
  }
}
